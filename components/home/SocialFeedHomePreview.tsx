"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SocialFeedItem } from "@/types/social-feed";
import { SocialFeedCard } from "@/components/home/SocialFeedCard";
import { getSocialFeedColumnCount } from "@/lib/social-feed-layout";

/** Stagger iframe loads so multiple X embeds do not hit the network at once. */
const EMBED_STAGGER_MS = 120;
const IDLE_PRELOAD_TIMEOUT_MS = 2000;

export function SocialFeedHomePreview({ items }: { items: SocialFeedItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState(1);
  const [preloadEmbeds, setPreloadEmbeds] = useState(false);

  const updateLayout = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    setColumnCount(getSocialFeedColumnCount(el.clientWidth));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    updateLayout();

    const observer = new ResizeObserver(updateLayout);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateLayout]);

  useEffect(() => {
    const enablePreload = () => setPreloadEmbeds(true);

    if (typeof requestIdleCallback !== "undefined") {
      const idleId = requestIdleCallback(enablePreload, {
        timeout: IDLE_PRELOAD_TIMEOUT_MS,
      });
      return () => cancelIdleCallback(idleId);
    }

    const timerId = window.setTimeout(enablePreload, 50);
    return () => window.clearTimeout(timerId);
  }, []);

  const visibleCount = Math.min(columnCount, items.length);
  const visibleItems = items.slice(0, visibleCount);

  if (items.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="grid w-full items-stretch gap-3"
      style={{
        gridTemplateColumns: `repeat(${Math.max(visibleCount, 1)}, minmax(0, 1fr))`,
      }}
    >
      {visibleItems.map((item, index) => (
        <SocialFeedCard
          key={item.id}
          item={item}
          embedLoadStrategy="idle"
          preloadEmbed={preloadEmbeds}
          embedStaggerMs={index * EMBED_STAGGER_MS}
        />
      ))}
    </div>
  );
}

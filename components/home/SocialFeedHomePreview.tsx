"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SocialFeedItem } from "@/types/social-feed";
import { SocialFeedCard } from "@/components/home/SocialFeedCard";

/** Matches SocialFeedCard carousel width + gap-3 spacing. */
const CARD_WIDTH = 400;
const GAP = 12;
/** Stagger iframe loads so multiple X embeds do not hit the network at once. */
const EMBED_STAGGER_MS = 120;
const IDLE_PRELOAD_TIMEOUT_MS = 2000;

function countCardsThatFit(containerWidth: number): number {
  return Math.max(1, Math.floor((containerWidth + GAP) / (CARD_WIDTH + GAP)));
}

export function SocialFeedHomePreview({ items }: { items: SocialFeedItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(1);
  const [preloadEmbeds, setPreloadEmbeds] = useState(false);

  const updateVisibleCount = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    setVisibleCount(countCardsThatFit(el.clientWidth));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    updateVisibleCount();

    const observer = new ResizeObserver(updateVisibleCount);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateVisibleCount]);

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

  const visibleItems = items.slice(0, visibleCount);

  if (visibleItems.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="grid items-stretch gap-3"
      style={{
        gridTemplateColumns: `repeat(${visibleItems.length}, minmax(0, 1fr))`,
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

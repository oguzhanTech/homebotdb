"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SocialFeedItem } from "@/types/social-feed";
import { SocialFeedCard } from "@/components/home/SocialFeedCard";

/** Matches SocialFeedCard carousel width + gap-3 spacing. */
const CARD_WIDTH = 400;
const GAP = 12;

function countCardsThatFit(containerWidth: number): number {
  return Math.max(1, Math.floor((containerWidth + GAP) / (CARD_WIDTH + GAP)));
}

export function SocialFeedHomePreview({ items }: { items: SocialFeedItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(1);

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
      {visibleItems.map((item) => (
        <SocialFeedCard key={item.id} item={item} />
      ))}
    </div>
  );
}

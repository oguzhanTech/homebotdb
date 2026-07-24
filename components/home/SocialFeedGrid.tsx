"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SocialFeedItem } from "@/types/social-feed";
import { SocialFeedCard } from "@/components/home/SocialFeedCard";
import { getSocialFeedColumnCount } from "@/lib/social-feed-layout";

/** Responsive columns that fill the row (no empty band on the right). */
export function SocialFeedGrid({ items }: { items: SocialFeedItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState(1);

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

  return (
    <div
      ref={containerRef}
      className="grid w-full items-stretch gap-3"
      style={{
        gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
      }}
    >
      {items.map((item) => (
        <SocialFeedCard key={item.id} item={item} />
      ))}
    </div>
  );
}

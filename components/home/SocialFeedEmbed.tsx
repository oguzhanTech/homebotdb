"use client";

import { useEffect, useRef, useState } from "react";
import { getTwitterEmbedUrl } from "@/lib/video";
import {
  readTwitterEmbedHeight,
  TWITTER_EMBED_ORIGIN,
} from "@/lib/twitter-embed";
import { uiCopy } from "@/config/ui-copy";

const FEED_EMBED_WIDTH = 380;
const INITIAL_EMBED_HEIGHT = 280;

export function SocialFeedEmbed({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const embedUrl = getTwitterEmbedUrl(url, { width: FEED_EMBED_WIDTH });
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [height, setHeight] = useState(INITIAL_EMBED_HEIGHT);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "120px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    function onMessage(event: MessageEvent) {
      if (event.origin !== TWITTER_EMBED_ORIGIN) return;

      const nextHeight = readTwitterEmbedHeight(event.data);
      if (nextHeight && nextHeight > 0) {
        setHeight(Math.ceil(nextHeight));
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [isVisible]);

  if (!embedUrl) return null;

  return (
    <div ref={containerRef} className="w-full border-b border-line/80 bg-panel-strong">
      {isVisible ? (
        <iframe
          src={embedUrl}
          title={title}
          className="block w-full border-0"
          style={{ height }}
          scrolling="no"
          loading="lazy"
        />
      ) : (
        <div className="flex min-h-[200px] items-center justify-center px-4 text-center text-xs text-muted">
          {uiCopy.homepage.socialFeed.loadingPost}
        </div>
      )}
    </div>
  );
}

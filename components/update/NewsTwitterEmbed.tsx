"use client";

import { useEffect, useState } from "react";
import { getTwitterEmbedUrl } from "@/lib/video";
import {
  readTwitterEmbedHeight,
  TWITTER_EMBED_ORIGIN,
} from "@/lib/twitter-embed";

export function NewsTwitterEmbed({
  url,
  caption,
}: {
  url: string;
  caption?: string;
}) {
  const embedUrl = getTwitterEmbedUrl(url);
  const [height, setHeight] = useState(420);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== TWITTER_EMBED_ORIGIN) return;

      const nextHeight = readTwitterEmbedHeight(event.data);
      if (nextHeight && nextHeight > 0) {
        setHeight(Math.ceil(nextHeight));
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!embedUrl) return null;

  return (
    <figure className="mt-6">
      <div className="mx-auto w-full max-w-[550px] overflow-hidden rounded-[14px] border border-line bg-panel-strong shadow-card">
        <iframe
          src={embedUrl}
          title={caption ?? "Post on X"}
          className="block w-full border-0"
          style={{ height }}
          scrolling="no"
          loading="lazy"
        />
      </div>
      {caption ? (
        <figcaption className="news-image-caption">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

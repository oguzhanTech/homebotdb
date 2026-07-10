"use client";

import { useEffect, useState } from "react";
import { getTwitterEmbedUrl } from "@/lib/video";

function readTwitterEmbedHeight(data: unknown): number | null {
  if (!data || typeof data !== "object") return null;

  const payload = data as Record<string, unknown>;

  if (payload.event === "resize" && typeof payload.height === "number") {
    return payload.height;
  }

  const twttr = payload.twttr;
  if (
    twttr &&
    typeof twttr === "object" &&
    (twttr as { event?: string }).event === "resize" &&
    typeof (twttr as { height?: number }).height === "number"
  ) {
    return (twttr as { height: number }).height;
  }

  const embed = payload["twttr.embed"];
  if (
    embed &&
    typeof embed === "object" &&
    (embed as { method?: string }).method === "twttr.private.resize"
  ) {
    const params = (embed as { params?: Array<{ height?: number }> }).params;
    const height = params?.[0]?.height;
    if (typeof height === "number") return height;
  }

  return null;
}

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
      if (event.origin !== "https://platform.twitter.com") return;

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

"use client";

import { useState } from "react";
import {
  getYouTubeThumbnail,
  isEmbeddableVideo,
} from "@/lib/video";
import { YouTubeEmbed } from "@/components/ui/YouTubeEmbed";

export function RobotFeaturedVideo({
  videoUrls,
  robotName,
}: {
  videoUrls: string[];
  robotName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const activeUrl = videoUrls[activeIndex];
  const hasVideos = videoUrls.length > 0;
  const embeddable = activeUrl ? isEmbeddableVideo(activeUrl) : false;
  const thumbnail = activeUrl ? getYouTubeThumbnail(activeUrl) : null;

  if (!hasVideos) {
    return (
      <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#20242b] to-[#737b86] text-xs font-bold uppercase tracking-wider text-white/70">
        No video yet
      </div>
    );
  }

  if (playing && embeddable && activeUrl) {
    return (
      <div>
        <YouTubeEmbed
          url={activeUrl}
          title={`${robotName} video`}
          autoplay
          className="rounded-xl"
        />
        <div className="mt-2 flex h-[42px] items-center justify-between rounded-xl border border-line px-3.5 text-xs font-bold uppercase tracking-[0.12em] text-muted">
          <button
            type="button"
            onClick={() => setPlaying(false)}
            className="text-blue transition-colors hover:text-ink"
          >
            Close player
          </button>
          {videoUrls.length > 1 ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous video"
                disabled={activeIndex === 0}
                onClick={() => setActiveIndex((index) => Math.max(index - 1, 0))}
                className="disabled:opacity-40"
              >
                ‹
              </button>
              <span>
                {activeIndex + 1}/{videoUrls.length}
              </span>
              <button
                type="button"
                aria-label="Next video"
                disabled={activeIndex === videoUrls.length - 1}
                onClick={() =>
                  setActiveIndex((index) =>
                    Math.min(index + 1, videoUrls.length - 1),
                  )
                }
                className="disabled:opacity-40"
              >
                ›
              </button>
            </div>
          ) : (
            <span>1 video</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          if (embeddable) {
            setPlaying(true);
            return;
          }
          if (activeUrl) {
            window.open(activeUrl, "_blank", "noopener,noreferrer");
          }
        }}
        className="group relative block aspect-video w-full overflow-hidden rounded-xl bg-ink"
        aria-label={`Play ${robotName} video`}
      >
        {thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#20242b] to-[#737b86]" />
        )}
        <div className="absolute inset-0 bg-ink/20 transition-colors group-hover:bg-ink/30" />
        <div className="absolute left-1/2 top-1/2 flex h-[58px] w-[58px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-white bg-white/20 text-xl text-white transition-transform group-hover:scale-105">
          ▶
        </div>
      </button>

      {videoUrls.length > 1 ? (
        <div className="mt-2 flex h-[42px] items-center justify-between rounded-xl border border-line px-3.5 text-xs font-bold uppercase tracking-[0.12em] text-muted">
          <span>All videos</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous video"
              disabled={activeIndex === 0}
              onClick={() => setActiveIndex((index) => Math.max(index - 1, 0))}
              className="disabled:opacity-40"
            >
              ‹
            </button>
            <span>
              {activeIndex + 1}/{videoUrls.length}
            </span>
            <button
              type="button"
              aria-label="Next video"
              disabled={activeIndex === videoUrls.length - 1}
              onClick={() =>
                setActiveIndex((index) =>
                  Math.min(index + 1, videoUrls.length - 1),
                )
              }
              className="disabled:opacity-40"
            >
              ›
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-2 flex h-[42px] items-center justify-between rounded-xl border border-line px-3.5 text-xs font-bold uppercase tracking-[0.12em] text-muted">
          <span>Featured video</span>
          <span>1</span>
        </div>
      )}
    </div>
  );
}

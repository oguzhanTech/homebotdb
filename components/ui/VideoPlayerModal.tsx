"use client";

import { useEffect } from "react";
import { YouTubeEmbed } from "@/components/ui/YouTubeEmbed";
import { isEmbeddableVideo } from "@/lib/video";
import { cn } from "@/lib/utils";

export function VideoPlayerModal({
  open,
  onClose,
  url,
  title = "Robot video",
}: {
  open: boolean;
  onClose: () => void;
  url: string;
  title?: string;
}) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open || !isEmbeddableVideo(url)) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-ink/45 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={cn(
          "w-full max-w-3xl overflow-hidden rounded-[18px] border border-line bg-panel-strong shadow-card",
        )}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <div className="text-xs font-bold uppercase tracking-[0.14em]">
            {title}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close video"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line bg-panel text-sm transition-colors hover:border-blue/35 hover:bg-blue-soft"
          >
            ✕
          </button>
        </div>
        <div className="p-3 sm:p-4">
          <YouTubeEmbed url={url} title={title} autoplay />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { VideoPlayerModal } from "@/components/ui/VideoPlayerModal";
import { isEmbeddableVideo } from "@/lib/video";
import { cn } from "@/lib/utils";

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn(className, "ml-0.5 fill-current")}
      aria-hidden
    >
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11.04-6.86a1 1 0 0 0 0-1.72L9.5 4.28a1 1 0 0 0-1.5.86Z" />
    </svg>
  );
}

const buttonClass =
  "inline-flex shrink-0 items-center justify-center rounded-full border border-line bg-panel-strong text-ink shadow-card transition-colors hover:border-blue/35 hover:bg-blue-soft hover:text-blue";

export function VideoPlayLink({
  href,
  className,
  size = "md",
  title = "Robot video",
}: {
  href: string;
  className?: string;
  size?: "sm" | "md";
  title?: string;
}) {
  const [open, setOpen] = useState(false);
  const sizeClass = size === "sm" ? "h-7 w-7" : "h-8 w-8";
  const iconClass = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";
  const embeddable = isEmbeddableVideo(href);

  if (!embeddable) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Watch video"
        className={cn(buttonClass, sizeClass, className)}
      >
        <PlayIcon className={iconClass} />
      </a>
    );
  }

  return (
    <>
      <button
        type="button"
        aria-label="Play video"
        onClick={() => setOpen(true)}
        className={cn(buttonClass, sizeClass, className)}
      >
        <PlayIcon className={iconClass} />
      </button>
      <VideoPlayerModal
        open={open}
        onClose={() => setOpen(false)}
        url={href}
        title={title}
      />
    </>
  );
}

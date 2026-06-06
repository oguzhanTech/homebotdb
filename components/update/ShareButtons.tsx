"use client";

import { useState, type ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type ShareChannel = "facebook" | "reddit" | "x" | "whatsapp" | "copy";

const channels: {
  id: ShareChannel;
  label: string;
  iconHoverClass: string;
  icon: ReactNode;
}[] = [
  {
    id: "facebook",
    label: "Share on Facebook",
    iconHoverClass: "group-hover:text-[#1877F2]",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.492 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    ),
  },
  {
    id: "reddit",
    label: "Share on Reddit",
    iconHoverClass: "group-hover:text-[#FF4500]",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.688-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
      </svg>
    ),
  },
  {
    id: "x",
    label: "Share on X",
    iconHoverClass: "group-hover:text-ink",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
      </svg>
    ),
  },
  {
    id: "whatsapp",
    label: "Share on WhatsApp",
    iconHoverClass: "group-hover:text-[#25D366]",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
      </svg>
    ),
  },
  {
    id: "copy",
    label: "Copy link",
    iconHoverClass: "group-hover:text-blue",
    icon: (
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="h-4 w-4 stroke-current fill-none"
        strokeWidth="2"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
];

function buildShareUrl(channel: ShareChannel, pageUrl: string, title: string): string | null {
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(title);

  switch (channel) {
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "reddit":
      return `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`;
    case "x":
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    case "whatsapp":
      return `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
    default:
      return null;
  }
}

export function ShareButtons({
  title,
  path,
  className,
  variant = "default",
  showLabel = true,
}: {
  title: string;
  path: string;
  className?: string;
  variant?: "default" | "subtle";
  showLabel?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const pageUrl = `${siteConfig.url}${path}`;
  const isSubtle = variant === "subtle";

  const handleShare = async (channel: ShareChannel) => {
    if (channel === "copy") {
      try {
        await navigator.clipboard.writeText(pageUrl);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      } catch {
        window.prompt("Copy this link:", pageUrl);
      }
      return;
    }

    const shareUrl = buildShareUrl(channel, pageUrl, title);
    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=520");
    }
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center",
        isSubtle ? "gap-2.5" : "gap-3",
        className,
      )}
    >
      {showLabel ? (
        <span
          className={
            isSubtle
              ? "text-[11px] font-bold uppercase tracking-wider text-muted"
              : "text-sm font-medium text-[#4d5662]"
          }
        >
          Share
        </span>
      ) : null}
      <div className={cn("flex flex-wrap", isSubtle ? "gap-1.5" : "gap-2")}>
        {channels.map((channel) => (
          <button
            key={channel.id}
            type="button"
            aria-label={channel.label}
            onClick={() => handleShare(channel.id)}
            className={cn(
              "group inline-flex cursor-pointer items-center justify-center rounded-xl border transition-colors",
              isSubtle
                ? "h-9 w-9 border-line/60 bg-transparent hover:border-blue/25"
                : "h-10 w-10 border-line bg-white",
            )}
          >
            <span
              className={cn(
                "transition-colors",
                isSubtle ? "text-muted" : "text-[#4d5662]",
                channel.iconHoverClass,
              )}
            >
              {channel.icon}
            </span>
          </button>
        ))}
      </div>
      {copied ? (
        <span className="text-xs font-semibold text-blue">Link copied</span>
      ) : null}
    </div>
  );
}

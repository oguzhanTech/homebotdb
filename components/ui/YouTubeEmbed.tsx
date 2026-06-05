import { getYouTubeEmbedUrl } from "@/lib/video";
import { cn } from "@/lib/utils";

export function YouTubeEmbed({
  url,
  title = "Video",
  autoplay = false,
  className,
}: {
  url: string;
  title?: string;
  autoplay?: boolean;
  className?: string;
}) {
  const embedUrl = getYouTubeEmbedUrl(url, { autoplay });
  if (!embedUrl) return null;

  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-xl bg-ink",
        className,
      )}
    >
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}

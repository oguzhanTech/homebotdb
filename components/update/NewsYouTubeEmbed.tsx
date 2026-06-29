import { YouTubeEmbed } from "@/components/ui/YouTubeEmbed";

export function NewsYouTubeEmbed({
  url,
  caption,
}: {
  url: string;
  caption?: string;
}) {
  return (
    <figure className="mt-6">
      <div className="overflow-hidden rounded-[14px] border border-line bg-panel-strong shadow-card">
        <YouTubeEmbed
          url={url}
          title={caption ?? "Video"}
          className="rounded-none"
        />
      </div>
      {caption ? (
        <figcaption className="news-image-caption">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

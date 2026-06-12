import { siteConfig } from "@/config/site";
import type { Comment } from "@/types/comment";
import { cn } from "@/lib/utils";

export function formatCommentDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function CommentAuthor({
  comment,
  className,
}: {
  comment: Pick<Comment, "authorName" | "isAdmin" | "adminId">;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="font-bold text-ink">{comment.authorName}</span>
      {comment.isAdmin ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/icon.svg"
            alt=""
            width={14}
            height={14}
            className="h-3.5 w-3.5 shrink-0 rounded-[3px]"
            title={`${siteConfig.name} team`}
          />
          <span className="sr-only">{siteConfig.name} team member</span>
        </>
      ) : null}
      </div>
    </div>
  );
}

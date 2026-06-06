import { siteConfig } from "@/config/site";
import { getEditorById, getEditorInitials } from "@/lib/editors";
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
  comment: Pick<
    Comment,
    "authorName" | "authorUsername" | "isAdmin" | "adminId"
  >;
  className?: string;
}) {
  const avatarUrl =
    comment.isAdmin && comment.adminId
      ? getEditorById(comment.adminId).avatar
      : null;
  const initials = getEditorInitials(comment.authorName);

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-panel-strong text-[11px] font-bold uppercase text-muted",
          comment.isAdmin && "border-blue/25 bg-blue-soft text-blue",
        )}
        aria-hidden={avatarUrl ? true : undefined}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          initials
        )}
      </div>
      <div className="min-w-0">
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
        {!comment.isAdmin ? (
          <div className="text-[11px] text-muted">@{comment.authorUsername}</div>
        ) : null}
      </div>
    </div>
  );
}

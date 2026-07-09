import Link from "next/link";
import type { Comment } from "@/types/comment";
import {
  CommentAuthor,
  formatCommentDate,
} from "@/components/comments/CommentAuthor";
import { getCommentPublicPath } from "@/lib/data/comments";
import { getRobotBySlug, getUpdateBySlug } from "@/lib/data/repository";
import { uiCopy } from "@/config/ui-copy";
import { dashboardPanelClassName } from "@/components/home/PopularTodaySection";
import { cn } from "@/lib/utils";

function truncateBody(body: string, max = 88): string {
  const trimmed = body.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1).trimEnd()}…`;
}

function getCommentTargetTitle(comment: Comment): string {
  if (comment.targetType === "robot") {
    return getRobotBySlug(comment.targetSlug)?.name ?? comment.targetSlug;
  }

  return getUpdateBySlug(comment.targetSlug)?.title ?? comment.targetSlug;
}

function getCommentHref(comment: Comment): string {
  const base = getCommentPublicPath(comment.targetType, comment.targetSlug);
  return `${base}#comment-${comment.id}`;
}

export function LatestCommentsPanel({
  comments,
  className,
}: {
  comments: Comment[];
  className?: string;
}) {
  return (
    <section
      className={cn(
        "flex h-full flex-col",
        dashboardPanelClassName,
        className,
      )}
    >
      <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
        {uiCopy.homepage.dashboard.latestComments}
      </div>

      {comments.length === 0 ? (
        <div className="mt-2.5 rounded-lg border border-dashed border-line bg-panel-strong/60 px-3.5 py-4 text-center">
          <p className="text-[13px] leading-relaxed text-[#565f6b]">
            {uiCopy.homepage.dashboard.noCommentsYet}
          </p>
          <Link
            href="/robots"
            className="mt-2 inline-block text-[13px] font-medium text-blue hover:underline"
          >
            {uiCopy.homepage.dashboard.browseRobots} →
          </Link>
        </div>
      ) : (
        <ul className="mt-2.5 flex-1 space-y-0.5 lg:space-y-1">
          {comments.map((comment, index) => {
            const targetTitle = getCommentTargetTitle(comment);

            return (
              <li key={comment.id} className={cn(index >= 3 && "hidden lg:block")}>
                <Link
                  href={getCommentHref(comment)}
                  className="group block rounded-lg border border-transparent px-1.5 py-1.5 transition-colors hover:border-line hover:bg-panel-strong lg:px-2 lg:py-2"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <CommentAuthor comment={comment} />
                    <time
                      dateTime={comment.createdAt}
                      className="shrink-0 text-[11px] text-muted"
                    >
                      {formatCommentDate(comment.createdAt)}
                    </time>
                  </div>
                  <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-[#565f6b]">
                    {truncateBody(comment.body)}
                  </p>
                  <p className="mt-1 truncate text-[11px] text-muted">
                    <span className="font-medium text-ink group-hover:text-blue">
                      {targetTitle}
                    </span>
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

"use client";

import { useMemo, useState } from "react";
import type { Comment, CommentTarget } from "@/types/comment";
import { groupCommentsByThread } from "@/lib/data/comments";
import { CommentForm } from "@/components/comments/CommentForm";
import { CommentArticle } from "@/components/comments/CommentItem";
import { uiCopy } from "@/config/ui-copy";

export function CommentThread({
  initialComments,
  target,
  pagePath,
  heading,
}: {
  initialComments: Comment[];
  target: CommentTarget;
  pagePath: string;
  heading?: string;
}) {
  const isNews = target.type === "news";
  const resolvedHeading =
    heading ?? (isNews ? uiCopy.comments.heading : uiCopy.comments.fieldReports);
  const [comments, setComments] = useState(initialComments);

  const { topLevel, repliesByParent } = useMemo(
    () => groupCommentsByThread(comments),
    [comments],
  );

  function handleCommentPosted(comment: Comment) {
    setComments((prev) => [...prev, comment]);
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="comments-heading" className="text-lg font-bold tracking-tight">
          {resolvedHeading}
        </h2>
        <p className="text-sm text-muted">
          {comments.length === 0
            ? isNews
              ? uiCopy.comments.noCommentsYet
              : uiCopy.comments.noFieldReportsYet
            : isNews
              ? uiCopy.comments.commentCount(comments.length)
              : uiCopy.comments.reportCount(comments.length)}
        </p>
      </div>

      {topLevel.length > 0 ? (
        <ol className="mt-6 grid gap-4" aria-label="Comment thread">
          {topLevel.map((comment) => (
            <li key={comment.id} className="min-w-0">
              <CommentArticle
                comment={comment}
                replies={repliesByParent.get(comment.id) ?? []}
                target={target}
                pagePath={pagePath}
                onCommentPosted={handleCommentPosted}
              />
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-6 rounded-[18px] border border-dashed border-line px-4 py-8 text-center text-sm text-muted">
          {uiCopy.comments.emptyPrompt}
        </p>
      )}

      <div className="mt-6 border-t border-line pt-6">
        <CommentForm
          target={target}
          onSuccess={handleCommentPosted}
          submitLabel={
            isNews ? uiCopy.comments.submitLabel : uiCopy.comments.submitFieldReport
          }
        />
      </div>
    </>
  );
}

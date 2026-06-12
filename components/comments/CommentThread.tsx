"use client";

import { useMemo, useState } from "react";
import type { Comment, CommentTarget } from "@/types/comment";
import { groupCommentsByThread } from "@/lib/data/comments";
import { CommentForm } from "@/components/comments/CommentForm";
import { CommentArticle } from "@/components/comments/CommentItem";

export function CommentThread({
  initialComments,
  target,
  pagePath,
  heading = "Comments",
}: {
  initialComments: Comment[];
  target: CommentTarget;
  pagePath: string;
  heading?: string;
}) {
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
          {heading}
        </h2>
        <p className="text-sm text-muted">
          {comments.length === 0
            ? "No comments yet"
            : `${comments.length} comment${comments.length === 1 ? "" : "s"}`}
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
          Be the first to share a question or hands-on note.
        </p>
      )}

      <div className="mt-6 border-t border-line pt-6">
        <CommentForm target={target} onSuccess={handleCommentPosted} />
      </div>
    </>
  );
}

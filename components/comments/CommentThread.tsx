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
}: {
  initialComments: Comment[];
  target: CommentTarget;
  pagePath: string;
}) {
  const isNews = target.type === "news";
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
      {topLevel.length > 0 ? (
        <ol className="grid gap-4" aria-label="Comment thread">
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
        <p className="rounded-[18px] border border-dashed border-line px-4 py-8 text-center text-sm text-muted">
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

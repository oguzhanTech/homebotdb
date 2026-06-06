"use client";

import { useState } from "react";
import type { Comment, CommentTarget } from "@/types/comment";
import {
  CommentAuthor,
  formatCommentDate,
} from "@/components/comments/CommentAuthor";
import { CommentForm } from "@/components/comments/CommentForm";
import { cn } from "@/lib/utils";

export function CommentReplyToggle({
  target,
  parentId,
}: {
  target: CommentTarget;
  parentId: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-w-0">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="cursor-pointer text-xs font-bold uppercase tracking-wider text-blue hover:underline"
        >
          Reply
        </button>
      ) : (
        <CommentForm
          target={target}
          parentId={parentId}
          compact
          submitLabel="Post reply"
          onCancel={() => setOpen(false)}
        />
      )}
    </div>
  );
}

export function CommentArticle({
  comment,
  replies,
  target,
  isReply = false,
}: {
  comment: Comment;
  replies?: Comment[];
  target: CommentTarget;
  isReply?: boolean;
}) {
  return (
    <article
      id={`comment-${comment.id}`}
      className={cn(
        "min-w-0 scroll-mt-24",
        isReply
          ? "ml-4 border-l-2 border-line pl-4 sm:ml-8 sm:pl-5"
          : "rounded-[18px] border border-line bg-white p-4 shadow-card",
      )}
      itemScope
      itemType="https://schema.org/Comment"
    >
      <meta itemProp="datePublished" content={comment.createdAt} />
      <div itemProp="author" itemScope itemType="https://schema.org/Person">
        <meta itemProp="name" content={comment.authorName} />
        <CommentAuthor comment={comment} />
      </div>
      <p className="comment-body mt-3 text-sm leading-relaxed text-[#4d5662]" itemProp="text">
        {comment.body}
      </p>
      <time
        dateTime={comment.createdAt}
        className="mt-3 block text-[11px] text-muted"
        itemProp="dateCreated"
      >
        {formatCommentDate(comment.createdAt)}
      </time>

      {!isReply && replies && replies.length > 0 ? (
        <ol className="mt-4 grid gap-3" aria-label="Replies">
          {replies.map((reply) => (
            <li key={reply.id} className="min-w-0">
              <CommentArticle comment={reply} target={target} isReply />
            </li>
          ))}
        </ol>
      ) : null}

      {!isReply ? (
        <div className="mt-4 border-t border-line/80 pt-4">
          <CommentReplyToggle target={target} parentId={comment.id} />
        </div>
      ) : null}
    </article>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Comment } from "@/types/comment";
import { getCommentPublicPath } from "@/lib/data/comments";
import { formatDate } from "@/lib/utils";

export function CommentModerationList({ comments }: { comments: Comment[] }) {
  const router = useRouter();
  const [items, setItems] = useState(comments);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(comment: Comment) {
    const label = comment.parentId ? "reply" : "comment";
    if (!window.confirm(`Delete this ${label} by ${comment.authorName}?`)) return;

    setDeletingId(comment.id);
    setError(null);

    try {
      const response = await fetch(`/api/admin/comments/${encodeURIComponent(comment.id)}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { ok: boolean; message?: string };

      if (!response.ok || !data.ok) {
        setError(data.message ?? "Could not delete comment.");
        return;
      }

      setItems((prev) =>
        prev.filter(
          (entry) => entry.id !== comment.id && entry.parentId !== comment.id,
        ),
      );
      router.refresh();
    } catch {
      setError("Could not delete comment.");
    } finally {
      setDeletingId(null);
    }
  }

  if (items.length === 0) {
    return <p className="text-sm text-muted">No comments in Supabase yet.</p>;
  }

  return (
    <div className="grid gap-3">
      {error ? (
        <p className="rounded-[14px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </p>
      ) : null}

      {items.map((comment) => {
        const targetPath = getCommentPublicPath(comment.targetType, comment.targetSlug);

        return (
          <article
            key={comment.id}
            className="rounded-[18px] border border-line bg-panel-strong p-5 shadow-card"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted">
                  <span className="font-bold uppercase tracking-wider text-blue">
                    {comment.targetType}
                  </span>
                  <span>{formatDate(comment.createdAt)}</span>
                  {comment.parentId ? (
                    <span className="rounded-full bg-soft px-2 py-0.5 font-bold uppercase tracking-wider">
                      Reply
                    </span>
                  ) : null}
                  {comment.isAdmin ? (
                    <span className="rounded-full bg-blue-soft px-2 py-0.5 font-bold uppercase tracking-wider text-blue">
                      Admin
                    </span>
                  ) : null}
                </div>

                <div className="mt-1 font-semibold tracking-tight">
                  {comment.authorName}
                  <span className="ml-2 text-sm font-normal text-muted">
                    @{comment.authorUsername}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-relaxed text-[#565f6b]">{comment.body}</p>

                <div className="mt-3 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-wider">
                  <Link
                    href={targetPath}
                    className="cursor-pointer text-blue hover:underline"
                  >
                    {comment.targetSlug}
                  </Link>
                  <span className="font-mono text-[10px] font-normal normal-case text-muted">
                    {comment.id}
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled={deletingId === comment.id}
                onClick={() => handleDelete(comment)}
                className="shrink-0 cursor-pointer rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-rose-700 transition-colors hover:border-rose-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deletingId === comment.id ? "Deleting…" : "Delete"}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

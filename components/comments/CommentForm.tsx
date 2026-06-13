"use client";

import { useEffect, useState } from "react";
import type { Comment, CommentTarget } from "@/types/comment";
import {
  COMMENT_MAX_LENGTH,
  COMMENT_MIN_LENGTH,
} from "@/lib/comments-constants";
import { Button } from "@/components/ui/Button";
import { uiCopy } from "@/config/ui-copy";
import { cn } from "@/lib/utils";

const USERNAME_STORAGE_KEY = "hbr-comment-username";

interface CommentFormProps {
  target: CommentTarget;
  parentId?: string | null;
  onCancel?: () => void;
  onSuccess?: (comment: Comment) => void;
  submitLabel?: string;
  compact?: boolean;
}

export function CommentForm({
  target,
  parentId = null,
  onCancel,
  onSuccess,
  submitLabel = uiCopy.comments.submitFieldReport,
  compact = false,
}: CommentFormProps) {
  const [username, setUsername] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const atLimit = body.length >= COMMENT_MAX_LENGTH;

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(USERNAME_STORAGE_KEY);
      if (saved) setUsername(saved);
    } catch {
      /* ignore */
    }
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType: target.type,
          targetSlug: target.slug,
          parentId,
          username,
          body,
        }),
      });

      const result = (await response.json()) as {
        ok: boolean;
        message?: string;
        comment?: Comment;
      };

      if (!response.ok || !result.ok || !result.comment) {
        setError(result.message ?? "Could not post comment.");
        return;
      }

      setBody("");
      try {
        sessionStorage.setItem(USERNAME_STORAGE_KEY, username.trim());
      } catch {
        /* ignore */
      }
      onSuccess?.(result.comment);
      onCancel?.();
    } catch {
      setError("Could not post comment. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "min-w-0 overflow-hidden",
        "rounded-[18px] border border-line bg-panel-strong p-4 shadow-card",
        compact && "rounded-xl p-3 shadow-none",
      )}
    >
      <div className="grid gap-3">
        <label className="grid gap-1.5 text-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Username
          </span>
          <input
            type="text"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="your_name"
            required
            minLength={3}
            maxLength={40}
            className="box-border h-10 w-full min-w-0 rounded-xl border border-line bg-white px-3 text-sm outline-none transition-colors focus:border-blue/35"
          />
          {!parentId ? (
            <span className="text-[11px] text-muted">
              Letters, numbers, hyphens, and underscores. No sign-up required.
            </span>
          ) : null}
        </label>

        <label className="grid min-w-0 gap-1.5 text-sm">
          <div className="flex min-w-0 items-center justify-between gap-2">
            <span className="shrink-0 text-[11px] font-bold uppercase tracking-wider text-muted">
              {parentId ? "Reply" : "Comment"}
            </span>
            <span
              className={cn(
                "shrink-0 text-[11px] tabular-nums text-muted",
                atLimit && "font-semibold text-red-600",
              )}
              aria-live="polite"
            >
              {body.length}/{COMMENT_MAX_LENGTH}
            </span>
          </div>
          <div className="comment-textarea-wrap">
            <textarea
              name="body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder={parentId ? "Write a reply…" : "Share your take on this robot…"}
              required
              minLength={COMMENT_MIN_LENGTH}
              maxLength={COMMENT_MAX_LENGTH}
              rows={compact ? 3 : 4}
              className="comment-textarea rounded-xl border border-line bg-white px-3 py-2.5 text-sm leading-relaxed outline-none transition-colors focus:border-blue/35"
            />
          </div>
        </label>
      </div>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Posting…" : submitLabel}
        </Button>
        {onCancel ? (
          <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}

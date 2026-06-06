"use client";

import { useState } from "react";
import { getEditorById, getEditorInitials } from "@/lib/editors";
import type { EditorId } from "@/types/editor";
import type { UpdateType } from "@/types/update";
import { getEditorAttributionLabel } from "@/types/update";
import { cn } from "@/lib/utils";

export function AuthorAvatar({
  authorId,
  className,
}: {
  authorId: EditorId;
  className?: string;
}) {
  const editor = getEditorById(authorId);
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={editor.avatar}
        alt={editor.name}
        onError={() => setFailed(true)}
        className={cn(
          "h-16 w-16 shrink-0 rounded-full border border-line object-cover",
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-line bg-panel-strong font-mono text-sm font-bold uppercase tracking-wider text-muted",
        className,
      )}
    >
      {getEditorInitials(editor.name)}
    </div>
  );
}

export function AuthorCard({
  authorId,
  updateType,
}: {
  authorId: EditorId;
  updateType: UpdateType;
}) {
  const editor = getEditorById(authorId);
  const attributionLabel = getEditorAttributionLabel(updateType);

  return (
    <div className="rounded-[18px] border border-line bg-panel-strong p-5 shadow-card">
      <div className="flex items-start gap-4">
        <AuthorAvatar authorId={authorId} />
        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
            {attributionLabel}
          </div>
          <div className="mt-1 text-lg font-bold tracking-tight">{editor.name}</div>
          <div className="mt-0.5 text-sm font-semibold text-blue">{editor.role}</div>
          <p className="mt-2 text-sm leading-relaxed text-[#565f6b]">
            {editor.bio}
          </p>
        </div>
      </div>
    </div>
  );
}

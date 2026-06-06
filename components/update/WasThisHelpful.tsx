"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function WasThisHelpful({ updateSlug }: { updateSlug: string }) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-line bg-panel-strong px-5 py-4 shadow-card">
      <span className="text-sm font-medium text-[#4d5662]">Was this helpful?</span>
      <div className="flex gap-2">
        <button
          type="button"
          aria-label="Yes, helpful"
          aria-pressed={vote === "up"}
          onClick={() => setVote("up")}
          className={cn(
            "inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-line bg-white text-lg transition-colors hover:border-blue/30 hover:bg-blue-soft",
            vote === "up" && "border-blue/35 bg-blue-soft",
          )}
        >
          👍
        </button>
        <button
          type="button"
          aria-label="No, not helpful"
          aria-pressed={vote === "down"}
          onClick={() => setVote("down")}
          className={cn(
            "inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-line bg-white text-lg transition-colors hover:border-blue/30 hover:bg-blue-soft",
            vote === "down" && "border-blue/35 bg-blue-soft",
          )}
        >
          👎
        </button>
      </div>
      {vote && (
        <p className="w-full text-xs text-muted">
          Thanks. Your feedback for {updateSlug} is saved on this device only.
        </p>
      )}
    </div>
  );
}

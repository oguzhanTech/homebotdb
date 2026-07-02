"use client";

import { cn } from "@/lib/utils";

const SEGMENT_COUNT = 10;

export function parseScoreValue(value: string): number | null {
  if (!value || value === "Unknown" || value === "Not specified") return null;
  const match = value.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  if (!match) return null;
  const num = parseFloat(match[1]!);
  return Number.isFinite(num) ? Math.min(Math.max(num, 0), 100) : null;
}

export function CompareSegmentScoreBar({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const filledSegments = Math.floor(value / 10);
  const partialSegment =
    value % 10 > 0 && filledSegments < SEGMENT_COUNT ? filledSegments : -1;
  const partialPct = value % 10 === 0 ? 0 : (value % 10) * 10;

  return (
    <div
      className={cn("compare-segment-bar mt-1.5 flex gap-[3px]", className)}
      role="img"
      aria-label={`Score ${value} out of 100`}
    >
      {Array.from({ length: SEGMENT_COUNT }, (_, index) => {
        const isFull = index < filledSegments;
        const isPartial = index === partialSegment;

        return (
          <span
            key={index}
            className={cn(
              "compare-segment-bar__segment relative h-[6px] flex-1 overflow-hidden rounded-[2px] bg-[#edf0f3]",
            )}
            style={{ "--segment-index": index } as React.CSSProperties}
          >
            <span
              className={cn(
                "compare-segment-bar__fill absolute inset-y-0 left-0 rounded-[2px] bg-blue",
                isFull && "w-full",
                isPartial && "compare-segment-bar__fill--partial",
                !isFull && !isPartial && "w-0",
              )}
              style={
                isPartial
                  ? ({ "--partial-pct": `${partialPct}%` } as React.CSSProperties)
                  : undefined
              }
            />
          </span>
        );
      })}
    </div>
  );
}

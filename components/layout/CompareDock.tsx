"use client";

import Link from "next/link";
import { useCompare } from "@/contexts/CompareContext";
import { getRobotsBySlugs } from "@/lib/data/repository";
import { Button } from "@/components/ui/Button";

export function CompareDock() {
  const { slugs, remove, clear, comparePath, count } = useCompare();
  const robots = getRobotsBySlugs(slugs);

  if (count === 0) return null;

  return (
    <div
      className="fixed inset-x-3.5 z-50 rounded-[20px] border border-line bg-panel/95 p-3 shadow-[0_18px_50px_rgba(8,11,18,0.18)] backdrop-blur-[18px]"
      style={{
        bottom: "calc(78px + env(safe-area-inset-bottom))",
      }}
    >
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="text-[11px] font-bold uppercase tracking-widest text-muted">
          Compare ({count}/3)
        </span>
        <button
          type="button"
          onClick={clear}
          className="text-[11px] font-bold uppercase tracking-wider text-muted hover:text-ink"
        >
          Clear
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {robots.map((robot) => (
          <div
            key={robot.slug}
            className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-xs font-bold uppercase tracking-wide"
          >
            <span>{robot.name}</span>
            <button
              type="button"
              onClick={() => remove(robot.slug)}
              className="text-muted hover:text-ink"
              aria-label={`Remove ${robot.name}`}
            >
              ×
            </button>
          </div>
        ))}
        {comparePath && (
          <Link href={comparePath} className="ml-auto">
            <Button size="sm">Compare now</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

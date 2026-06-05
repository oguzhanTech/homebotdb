"use client";

import { cn } from "@/lib/utils";

export function Tabs({
  tabs,
  active,
  onChange,
  className,
}: {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex overflow-x-auto border-b border-line lg:grid lg:grid-cols-7",
        className,
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={cn(
            "relative min-w-[140px] px-2 py-4 text-center text-xs font-bold uppercase tracking-widest transition-colors lg:min-w-0",
            active === tab ? "text-ink" : "text-muted hover:text-ink",
          )}
        >
          {tab}
          {active === tab && (
            <span className="absolute bottom-0 left-[28%] right-[28%] h-[3px] rounded-t-full bg-blue" />
          )}
        </button>
      ))}
    </div>
  );
}

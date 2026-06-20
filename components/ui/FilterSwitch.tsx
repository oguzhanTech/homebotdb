"use client";

import { TruncatedTooltip } from "@/components/ui/TruncatedTooltip";
import { cn } from "@/lib/utils";

export function FilterSwitch({
  checked,
  onChange,
  label,
  className,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "group flex h-[42px] cursor-pointer items-center gap-2.5 rounded-[14px] border px-3 transition-all",
        checked
          ? "border-blue/35 bg-blue-soft/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]"
          : "border-line bg-white hover:bg-[#fafbfc]",
        className,
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />

      <span className="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center">
        {checked ? (
          <span
            aria-hidden
            className="absolute inset-0 animate-ping rounded-full bg-blue/35"
          />
        ) : null}
        <span
          aria-hidden
          className={cn(
            "relative h-2 w-2 rounded-full transition-all duration-200",
            checked
              ? "bg-blue shadow-[0_0_10px_rgba(18,100,255,0.5)]"
              : "bg-[#c5cad1] group-hover:bg-[#aeb5bf]",
          )}
        />
      </span>

      <TruncatedTooltip
        label={label}
        containerClassName="min-w-0 flex-1"
        className={cn(
          "text-[10px] font-bold uppercase tracking-[0.1em] transition-colors",
          checked ? "text-ink" : "text-[#5d6570] group-hover:text-[#3f4854]",
        )}
      />

      <span
        aria-hidden
        className={cn(
          "shrink-0 rounded-[6px] border px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] transition-colors",
          checked
            ? "border-blue/30 bg-white text-blue"
            : "border-line bg-[#f2f4f7] text-muted",
        )}
      >
        {checked ? "ON" : "OFF"}
      </span>
    </label>
  );
}

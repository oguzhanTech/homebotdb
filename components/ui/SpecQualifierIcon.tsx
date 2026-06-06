import { cn } from "@/lib/utils";
import { SPEC_EMPTY_DISPLAY, SPEC_EMPTY_TOOLTIP } from "@/lib/spec-display";

export function SpecEmptyHint({
  label = SPEC_EMPTY_DISPLAY,
  tooltip = SPEC_EMPTY_TOOLTIP,
  className,
  showIcon = true,
}: {
  label?: string;
  tooltip?: string;
  className?: string;
  showIcon?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span>{label}</span>
      {showIcon ? <SpecQualifierIcon label={tooltip} sentenceCase /> : null}
    </span>
  );
}

export function SpecQualifierIcon({
  label,
  className,
  sentenceCase = false,
}: {
  label: string;
  className?: string;
  sentenceCase?: boolean;
}) {
  return (
    <span
      className={cn("group/spec-qual relative inline-flex shrink-0", className)}
    >
      <span
        title={label}
        tabIndex={0}
        aria-label={label}
        className="inline-flex h-3.5 w-3.5 cursor-help items-center justify-center rounded-full border border-line bg-panel-strong text-[9px] font-bold leading-none text-muted transition-colors hover:border-blue/35 hover:text-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/30"
      >
        i
      </span>
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-lg border border-line bg-ink px-2 py-1 text-[10px] text-white opacity-0 shadow-card transition-opacity group-hover/spec-qual:opacity-100 group-focus-within/spec-qual:opacity-100",
          sentenceCase
            ? "font-normal normal-case tracking-normal"
            : "font-bold uppercase tracking-[0.08em]",
        )}
      >
        {label}
      </span>
    </span>
  );
}

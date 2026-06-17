"use client";

import { cn } from "@/lib/utils";
import { SPEC_EMPTY_DISPLAY, SPEC_EMPTY_TOOLTIP } from "@/lib/spec-display";
import { PortalTooltip } from "@/components/ui/PortalTooltip";

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
    <PortalTooltip label={label} sentenceCase={sentenceCase}>
      <span
        aria-label={label}
        className={cn("inline-flex shrink-0", className)}
      >
        <span className="inline-flex h-3.5 w-3.5 cursor-help items-center justify-center rounded-full border border-line bg-panel-strong text-[9px] font-bold leading-none text-muted transition-colors hover:border-blue/35 hover:text-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/30">
          i
        </span>
      </span>
    </PortalTooltip>
  );
}

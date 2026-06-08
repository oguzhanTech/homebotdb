import type { DataStatus, PriceStatus } from "@/types/robot";
import type { SpecFallback } from "@/lib/spec-display";
import { resolveSpecDisplay, SPEC_EMPTY_DISPLAY } from "@/lib/spec-display";
import { cn } from "@/lib/utils";
import { SpecEmptyHint } from "@/components/ui/SpecQualifierIcon";
import { SpecQualifierIcon } from "@/components/ui/SpecQualifierIcon";

export function DataValue({
  value,
  fallback = SPEC_EMPTY_DISPLAY,
  className,
  mono = false,
  dataStatus,
  priceStatus,
  showQualifier = true,
  specNote,
}: {
  value: string | number | null | undefined;
  fallback?: SpecFallback;
  className?: string;
  mono?: boolean;
  dataStatus?: DataStatus;
  priceStatus?: PriceStatus;
  showQualifier?: boolean;
  specNote?: string;
}) {
  const resolved = resolveSpecDisplay(value, {
    dataStatus,
    priceStatus,
    fallback,
    specNote,
  });

  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1",
        mono && "font-mono",
        resolved.isFallback && "text-muted italic normal-case",
        className,
      )}
    >
      {resolved.emptyTooltip ? (
        <SpecEmptyHint
          tooltip={resolved.emptyTooltip}
          label={resolved.display}
          showIcon={showQualifier}
        />
      ) : (
        <span>{resolved.display}</span>
      )}
      {showQualifier && resolved.tooltip ? (
        <SpecQualifierIcon label={resolved.tooltip} />
      ) : null}
    </span>
  );
}

export function MonoValue({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("font-mono tracking-wide", className)}>{children}</span>
  );
}

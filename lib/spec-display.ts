import type { DataStatus, PriceStatus } from "@/types/robot";

export type SpecFallback = "NA" | "Unknown" | "Coming soon" | "TBA";

export const SPEC_EMPTY_DISPLAY = "NA";
export const SPEC_EMPTY_TOOLTIP = "Not specified yet";

const EMPTY_SENTINELS = new Set([
  "",
  "not specified",
  "unknown",
  "na",
  "coming soon",
  "tba",
]);

export type SpecQualifier = DataStatus | "estimate";

const QUALIFIER_LABELS: Record<SpecQualifier, string> = {
  confirmed: "Confirmed",
  unconfirmed: "Unconfirmed",
  coming_soon: "Coming soon",
  estimate: "Estimate",
};

export function getQualifierLabel(qualifier: SpecQualifier): string {
  return QUALIFIER_LABELS[qualifier];
}

export function stripInlineQualifiers(value: string): {
  display: string;
  inlineQualifier: SpecQualifier | null;
} {
  let display = value.trim();
  let inlineQualifier: SpecQualifier | null = null;

  if (/\(estimated\)/i.test(display)) {
    inlineQualifier = "estimate";
    display = display.replace(/\s*\(estimated\)/gi, "").trim();
  }

  if (/\(unconfirmed\)/i.test(display)) {
    inlineQualifier = inlineQualifier ?? "unconfirmed";
    display = display.replace(/\s*\(unconfirmed\)/gi, "").trim();
  }

  display = display.replace(/^~\s*/, "");

  return { display, inlineQualifier };
}

export function resolveSpecDisplay(
  value: string | number | null | undefined,
  options?: {
    dataStatus?: DataStatus;
    priceStatus?: PriceStatus;
    fallback?: SpecFallback;
    specNote?: string;
  },
): {
  display: string;
  qualifier: SpecQualifier | null;
  tooltip: string | null;
  emptyTooltip: string | null;
  isFallback: boolean;
} {
  const fallback = options?.fallback ?? SPEC_EMPTY_DISPLAY;

  if (value === null || value === undefined || String(value).trim() === "") {
    return emptyFallbackResult(fallback);
  }

  const { display, inlineQualifier } = stripInlineQualifiers(String(value));

  if (EMPTY_SENTINELS.has(display.toLowerCase())) {
    return emptyFallbackResult(fallback);
  }

  let qualifier: SpecQualifier | null = inlineQualifier;

  if (!qualifier && options?.priceStatus === "estimate") {
    qualifier = "estimate";
  }

  if (!qualifier && options?.priceStatus === "coming_soon") {
    qualifier = "coming_soon";
  }

  if (
    !qualifier &&
    options?.dataStatus &&
    options.dataStatus !== "confirmed"
  ) {
    qualifier = options.dataStatus;
  }

  const tooltipParts: string[] = [];
  if (qualifier) tooltipParts.push(getQualifierLabel(qualifier));
  if (options?.specNote?.trim()) tooltipParts.push(options.specNote.trim());

  return {
    display,
    qualifier,
    tooltip: tooltipParts.length > 0 ? tooltipParts.join(" · ") : null,
    emptyTooltip: null,
    isFallback: false,
  };
}

function emptyFallbackResult(fallback: SpecFallback) {
  const useEmptyTooltip = fallback === SPEC_EMPTY_DISPLAY;

  return {
    display: fallback,
    qualifier: null,
    tooltip: null,
    emptyTooltip: useEmptyTooltip ? SPEC_EMPTY_TOOLTIP : null,
    isFallback: true,
  };
}

export type CompareDirection = "higher" | "lower" | "none";

export const COMPARE_ROW_DIRECTION: Record<string, CompareDirection> = {
  "Readiness Score": "higher",
  "Reality Score": "higher",
  "Data Freshness": "higher",
  Price: "lower",
  Battery: "higher",
  Speed: "higher",
  Payload: "higher",
  "Social Interaction": "higher",
  "Home Navigation": "higher",
  Mobility: "higher",
  Manipulation: "higher",
  Perception: "higher",
  Autonomy: "higher",
  Countries: "higher",
  Height: "none",
  Weight: "none",
  "Market Status": "none",
  Availability: "none",
  Form: "none",
  Sensors: "none",
  Connectivity: "none",
  Ecosystem: "none",
};

export function parseCompareNumber(value: string): number | null {
  if (!value || value === "Unknown" || value === "Not specified" || value === "NA" || value === "TBA") return null;
  const match = value.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : null;
}

/** Normalize battery strings to minutes for apples-to-apples compare (higher = longer). */
export function parseBatteryMinutes(value: string): number | null {
  if (!value || value === "Unknown" || value === "Not specified" || value === "NA" || value === "TBA") {
    return null;
  }

  const normalized = value.toLowerCase().replace(/~/g, "").trim();
  if (
    normalized.includes("plug-in") ||
    normalized.includes("plug in") ||
    normalized.includes("not applicable")
  ) {
    return null;
  }

  const toMinutes = (amount: number, unit: string | undefined, context: string): number => {
    const u = unit ?? (context.includes("min") ? "min" : "h");
    if (u.startsWith("min")) return amount;
    return amount * 60;
  };

  const rangeMatch = normalized.match(
    /(\d+(?:\.\d+)?)\s*[–-]\s*(\d+(?:\.\d+)?)\s*(min(?:ute)?s?|h(?:ou)?rs?)?/,
  );
  if (rangeMatch) {
    const low = parseFloat(rangeMatch[1]!);
    const high = parseFloat(rangeMatch[2]!);
    const unit = rangeMatch[3];
    const max = Math.max(low, high);
    return toMinutes(max, unit, normalized);
  }

  const singleMatch = normalized.match(
    /(\d+(?:\.\d+)?)\s*(min(?:ute)?s?|h(?:ou)?rs?)?/,
  );
  if (!singleMatch) return null;

  const amount = parseFloat(singleMatch[1]!);
  return toMinutes(amount, singleMatch[2], normalized);
}

function parseNumber(value: string): number | null {
  return parseCompareNumber(value);
}

function parseCountriesCount(value: string): number | null {
  if (!value || value === "Unknown") return null;
  return value.split(",").filter((part) => part.trim()).length;
}

function metricValue(label: string, value: string): number | null {
  if (label === "Countries") return parseCountriesCount(value);
  if (label === "Battery") return parseBatteryMinutes(value);
  return parseNumber(value);
}

export function getWinningIndices(
  label: string,
  values: string[],
): number[] {
  const direction = COMPARE_ROW_DIRECTION[label] ?? "none";
  if (direction === "none") return [];

  const numbers = values.map((value) => metricValue(label, value));
  const validIndices = numbers
    .map((num, index) => (num !== null ? index : -1))
    .filter((index) => index >= 0);

  if (validIndices.length < 2) return [];

  const validNumbers = validIndices.map((index) => numbers[index]!);
  const target =
    direction === "higher"
      ? Math.max(...validNumbers)
      : Math.min(...validNumbers);

  const winners = validIndices.filter((index) => numbers[index] === target);

  if (winners.length === 0 || winners.length === validIndices.length) {
    return [];
  }

  return winners;
}

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
  Countries: "higher",
  Height: "none",
  Weight: "none",
  "Commercial Status": "none",
  Form: "none",
  Sensors: "none",
  Connectivity: "none",
  Ecosystem: "none",
};

function parseNumber(value: string): number | null {
  if (!value || value === "Unknown" || value === "Not specified" || value === "NA") return null;
  const match = value.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : null;
}

function parseCountriesCount(value: string): number | null {
  if (!value || value === "Unknown") return null;
  return value.split(",").filter((part) => part.trim()).length;
}

function metricValue(label: string, value: string): number | null {
  if (label === "Countries") return parseCountriesCount(value);
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

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function displayValue(
  value: string | number | null | undefined,
  fallback: "Not specified" | "Unknown" | "Coming soon" | "TBA" = "Not specified",
): string {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string" && value.trim() === "") return fallback;
  return String(value);
}

export function formatPrice(price: string | null | undefined): string {
  return displayValue(price, "Unknown");
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return "Unknown";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Unknown";
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Extract runtime hours from labels like "2.5 h", "2–4 h", "~8 h", or "Unknown". */
export function parseBatteryHours(value: string | null | undefined): number | null {
  const text = displayValue(value, "Unknown");
  if (text === "Unknown" || text === "Not specified" || text === "NA" || text === "TBA" || text === "Coming soon") {
    return null;
  }

  const rangeMatch = text.match(/(\d+(?:\.\d+)?)\s*[–-]\s*(\d+(?:\.\d+)?)/);
  if (rangeMatch) {
    return Math.max(parseFloat(rangeMatch[1]), parseFloat(rangeMatch[2]));
  }

  const match = text.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : null;
}

/** Scale battery bar fill against the longest runtime in the current robot set. */
export function getMaxBatteryHours(values: (number | null)[]): number {
  const hours = values.filter((value): value is number => value !== null);
  if (hours.length === 0) return 8;
  return Math.max(...hours);
}

export function getBatteryBarPercent(
  hours: number | null,
  maxHours: number,
): number {
  if (hours === null || maxHours <= 0) return 0;
  return Math.min(Math.max((hours / maxHours) * 100, 8), 100);
}

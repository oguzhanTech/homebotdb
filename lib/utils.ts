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

/** Extract runtime hours from labels like "2.5 h", "~8 h (estimated)", or "Unknown". */
export function parseBatteryHours(value: string | null | undefined): number | null {
  const text = displayValue(value, "Unknown");
  if (text === "Unknown" || text === "Not specified" || text === "NA" || text === "Coming soon") {
    return null;
  }

  const match = text.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : null;
}

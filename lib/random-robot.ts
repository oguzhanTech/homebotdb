import type { Robot } from "@/types/robot";

const SPOTLIGHT_WINDOW_HOURS = 3;

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** UTC slot key — rotates every 3 hours (00, 03, 06, …, 21). */
export function getSpotlightWindowKey(now = new Date()): string {
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  const slot = Math.floor(now.getUTCHours() / SPOTLIGHT_WINDOW_HOURS);
  return `${year}-${month}-${day}@${slot}`;
}

/** Stable per UTC 3-hour window — same robot on SSR and client. */
export function getSpotlightRobot(robots: Robot[]): Robot {
  if (robots.length === 0) {
    throw new Error("No robots available");
  }
  if (robots.length === 1) return robots[0];

  const sorted = [...robots].sort((left, right) =>
    left.slug.localeCompare(right.slug),
  );
  const index = hashString(getSpotlightWindowKey()) % sorted.length;
  return sorted[index];
}

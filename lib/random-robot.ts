import type { Robot } from "@/types/robot";

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Stable per UTC day — safe for SSR and client hydration. */
export function getSpotlightRobot(robots: Robot[]): Robot {
  if (robots.length === 0) {
    throw new Error("No robots available");
  }
  if (robots.length === 1) return robots[0];

  const dayKey = new Date().toISOString().slice(0, 10);
  const index = hashString(dayKey) % robots.length;
  return robots[index];
}

/** @deprecated Use getSpotlightRobot — Math.random breaks hydration. */
export function getRandomRobot(robots: Robot[]): Robot {
  return getSpotlightRobot(robots);
}

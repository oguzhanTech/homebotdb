import type { Robot } from "@/types/robot";

const SESSION_KEY = "homebotradar-spotlight";

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Stable per UTC day — safe for SSR when a deterministic fallback is needed. */
export function getSpotlightRobot(robots: Robot[]): Robot {
  if (robots.length === 0) {
    throw new Error("No robots available");
  }
  if (robots.length === 1) return robots[0];

  const dayKey = new Date().toISOString().slice(0, 10);
  const index = hashString(dayKey) % robots.length;
  return robots[index];
}

export function pickRandomSpotlightRobot(robots: Robot[]): Robot {
  if (robots.length === 0) {
    throw new Error("No robots available");
  }
  if (robots.length === 1) return robots[0];
  return robots[Math.floor(Math.random() * robots.length)];
}

/** Random spotlight for the current browser session (client only). */
export function getSessionSpotlightRobot(robots: Robot[]): Robot {
  if (typeof window === "undefined") {
    return getSpotlightRobot(robots);
  }

  try {
    const storedSlug = sessionStorage.getItem(SESSION_KEY);
    if (storedSlug) {
      const stored = robots.find((robot) => robot.slug === storedSlug);
      if (stored) return stored;
    }

    const picked = pickRandomSpotlightRobot(robots);
    sessionStorage.setItem(SESSION_KEY, picked.slug);
    return picked;
  } catch {
    return pickRandomSpotlightRobot(robots);
  }
}

/** @deprecated Use getSessionSpotlightRobot on the client. */
export function getRandomRobot(robots: Robot[]): Robot {
  return getSpotlightRobot(robots);
}

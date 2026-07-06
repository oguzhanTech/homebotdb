import type { Robot } from "@/types/robot";

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** UTC day key — same picks all day for SSR stability. */
export function getPopularDayKey(now = new Date()): string {
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Stable daily selection of N distinct robots from the full catalog. */
export function getPopularRobotsToday(
  robots: Robot[],
  count = 3,
  now = new Date(),
): Robot[] {
  if (robots.length === 0) return [];
  if (robots.length <= count) return [...robots];

  const pool = [...robots].sort((left, right) =>
    left.slug.localeCompare(right.slug),
  );
  const dayKey = getPopularDayKey(now);
  const indices = new Set<number>();
  let seed = hashString(dayKey);

  while (indices.size < count && indices.size < pool.length) {
    indices.add(seed % pool.length);
    seed = hashString(`${dayKey}:${seed}`);
  }

  return [...indices]
    .sort((left, right) => left - right)
    .map((index) => pool[index]);
}

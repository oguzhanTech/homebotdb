import { buildCompareSlug } from "@/lib/compare";
import { getPopularDayKey, hashString } from "@/lib/popular-robots";
import type { Robot } from "@/types/robot";

export interface FeaturedComparePair {
  label: string;
  slugs: string[];
  segment: string;
}

function pairKey(slugs: string[]): string {
  return buildCompareSlug(slugs);
}

function isRelevantPair(left: Robot, right: Robot): boolean {
  return left.type === right.type || left.primaryTask === right.primaryTask;
}

function segmentKey(left: Robot, right: Robot): string {
  if (left.type === right.type && left.primaryTask === right.primaryTask) {
    return `${left.type}:${left.primaryTask}`;
  }
  if (left.type === right.type) return left.type;
  return left.primaryTask;
}

function makePair(left: Robot, right: Robot): FeaturedComparePair {
  const [a, b] = left.slug.localeCompare(right.slug) <= 0
    ? [left, right]
    : [right, left];

  return {
    label: `${a.name} vs ${b.name}`,
    slugs: [a.slug, b.slug],
    segment: segmentKey(a, b),
  };
}

function addPair(
  pool: Map<string, FeaturedComparePair>,
  left: Robot,
  right: Robot,
): void {
  if (left.slug === right.slug || !isRelevantPair(left, right)) return;

  const pair = makePair(left, right);
  pool.set(pairKey(pair.slugs), pair);
}

/** All same-segment pairs we might rotate through on /compare */
export function buildFeaturedComparePool(robots: Robot[]): FeaturedComparePair[] {
  const bySlug = new Map(robots.map((robot) => [robot.slug, robot]));
  const pool = new Map<string, FeaturedComparePair>();

  for (const robot of robots) {
    for (const peerSlug of robot.similarRobotSlugs ?? []) {
      const peer = bySlug.get(peerSlug);
      if (peer) addPair(pool, robot, peer);
    }
  }

  const groups = new Map<string, Robot[]>();
  for (const robot of robots) {
    const key = `${robot.type}:${robot.primaryTask}`;
    const list = groups.get(key) ?? [];
    list.push(robot);
    groups.set(key, list);
  }

  for (const group of groups.values()) {
    if (group.length < 2) continue;

    const top = [...group]
      .sort((left, right) => {
        const scoreDiff = right.readinessScore - left.readinessScore;
        if (scoreDiff !== 0) return scoreDiff;
        return left.slug.localeCompare(right.slug);
      })
      .slice(0, 6);

    for (let i = 0; i < top.length; i++) {
      for (let j = i + 1; j < top.length; j++) {
        addPair(pool, top[i], top[j]);
      }
    }
  }

  return [...pool.values()].sort((left, right) =>
    left.label.localeCompare(right.label),
  );
}

function rotateSegments(segments: string[], dayKey: string): string[] {
  if (segments.length <= 1) return segments;

  const offset = hashString(`${dayKey}:segments`) % segments.length;
  return [...segments.slice(offset), ...segments.slice(0, offset)];
}

function pickPairFromSegment(
  candidates: FeaturedComparePair[],
  dayKey: string,
  slot: number,
): FeaturedComparePair {
  const index =
    hashString(`${dayKey}:pair:${slot}:${candidates[0]?.segment ?? ""}`) %
    candidates.length;
  return candidates[index];
}

/** Stable UTC-day selection of N relevant pairs across different segments when possible. */
export function getFeaturedComparisonsToday(
  robots: Robot[],
  count = 3,
  now = new Date(),
): FeaturedComparePair[] {
  const pool = buildFeaturedComparePool(robots);
  if (pool.length === 0) return [];
  if (pool.length <= count) return pool.slice(0, count);

  const dayKey = getPopularDayKey(now);
  const bySegment = new Map<string, FeaturedComparePair[]>();

  for (const pair of pool) {
    const list = bySegment.get(pair.segment) ?? [];
    list.push(pair);
    bySegment.set(pair.segment, list);
  }

  for (const list of bySegment.values()) {
    list.sort((left, right) => left.label.localeCompare(right.label));
  }

  const segments = rotateSegments([...bySegment.keys()].sort(), dayKey);
  const selected: FeaturedComparePair[] = [];
  const usedKeys = new Set<string>();

  for (const segment of segments) {
    if (selected.length >= count) break;

    const candidates = bySegment.get(segment)!;
    const pair = pickPairFromSegment(candidates, dayKey, selected.length);
    const key = pairKey(pair.slugs);

    if (usedKeys.has(key)) continue;

    usedKeys.add(key);
    selected.push(pair);
  }

  if (selected.length >= count) return selected.slice(0, count);

  const fallbackPool = [...pool].sort((left, right) =>
    left.label.localeCompare(right.label),
  );
  let seed = hashString(`${dayKey}:fallback`);

  while (selected.length < count && usedKeys.size < fallbackPool.length) {
    const pair = fallbackPool[seed % fallbackPool.length];
    seed = hashString(`${dayKey}:${seed}`);
    const key = pairKey(pair.slugs);
    if (usedKeys.has(key)) continue;
    usedKeys.add(key);
    selected.push(pair);
  }

  return selected;
}

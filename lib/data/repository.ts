import { robots as mockRobots } from "@/data/robots";
import { updates as mockUpdates } from "@/data/updates";
import { enrichRobotScores } from "@/lib/score";
import type { Robot, RobotType, CommercialStatus, PrimaryTask } from "@/types/robot";
import type { Update, UpdateType } from "@/types/update";

const enrichedRobots = mockRobots.map(enrichRobotScores);

export function getRobots(): Robot[] {
  return enrichedRobots;
}

export function getRobotBySlug(slug: string): Robot | undefined {
  return enrichedRobots.find((robot) => robot.slug === slug);
}

export function getRobotsBySlugs(slugs: string[]): Robot[] {
  return slugs
    .map((slug) => getRobotBySlug(slug))
    .filter((robot): robot is Robot => Boolean(robot));
}

export function getSimilarRobots(robot: Robot): Robot[] {
  return robot.similarRobotSlugs
    .map((slug) => getRobotBySlug(slug))
    .filter((r): r is Robot => Boolean(r));
}

export function getAllRobotSlugs(): string[] {
  return enrichedRobots.map((robot) => robot.slug);
}

export function getUpdates(): Update[] {
  return [...mockUpdates].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function getUpdateBySlug(slug: string): Update | undefined {
  return getUpdates().find((update) => update.slug === slug);
}

export function getUpdatesByRobotSlug(robotSlug: string, limit = 5): Update[] {
  return getUpdates()
    .filter((update) => update.robotSlug === robotSlug)
    .slice(0, limit);
}

export function getLatestUpdates(limit = 6): Update[] {
  return getUpdates().slice(0, limit);
}

export function getNewsUpdates(limit = 4): Update[] {
  return getUpdates()
    .filter((update) => update.type === "news")
    .slice(0, limit);
}

export function getRecentNews(days = 5, limit = 1): Update[] {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return getUpdates()
    .filter(
      (update) =>
        update.type === "news" &&
        new Date(update.createdAt).getTime() >= cutoff,
    )
    .slice(0, limit);
}

export function getFeaturedNews(days = 5): Update | undefined {
  const recent = getRecentNews(days, 1);
  if (recent.length > 0) return recent[0];
  return getNewsUpdates(1)[0];
}

export function getAllUpdateSlugs(): string[] {
  return getUpdates().map((update) => update.slug);
}

export function getAllCountries(): string[] {
  const countries = new Set<string>();
  enrichedRobots.forEach((robot) =>
    robot.countriesAvailable.forEach((c) => countries.add(c)),
  );
  return [...countries].sort();
}

export interface RobotFilters {
  type?: RobotType | "all";
  status?: CommercialStatus | "all";
  primaryTask?: PrimaryTask | "all";
  minPrice?: number;
  maxPrice?: number;
  query?: string;
}

function parsePrice(price: string): number | null {
  const match = price.replace(/,/g, "").match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

export function filterRobots(filters: RobotFilters): Robot[] {
  return enrichedRobots.filter((robot) => {
    if (filters.type && filters.type !== "all" && robot.type !== filters.type) {
      return false;
    }
    if (
      filters.status &&
      filters.status !== "all" &&
      robot.commercialStatus !== filters.status
    ) {
      return false;
    }
    if (
      filters.primaryTask &&
      filters.primaryTask !== "all" &&
      robot.primaryTask !== filters.primaryTask
    ) {
      return false;
    }
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const haystack =
        `${robot.name} ${robot.brand} ${robot.shortDescription} ${robot.tags.join(" ")} ${robot.primaryTask}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    const price = parsePrice(robot.price);
    if (filters.minPrice != null && price != null && price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice != null && price != null && price > filters.maxPrice) {
      return false;
    }
    return true;
  });
}

export type SortField =
  | "readiness"
  | "price"
  | "battery"
  | "lastUpdated";

export function sortRobots(robots: Robot[], sort: SortField): Robot[] {
  const sorted = [...robots];
  switch (sort) {
    case "readiness":
      return sorted.sort((a, b) => b.readinessScore - a.readinessScore);
    case "price":
      return sorted.sort(
        (a, b) => (parsePrice(a.price) ?? 999999) - (parsePrice(b.price) ?? 999999),
      );
    case "battery":
      return sorted.sort((a, b) => {
        const getHours = (s: string) => parseFloat(s) || 0;
        return getHours(b.batteryLife) - getHours(a.batteryLife);
      });
    case "lastUpdated":
      return sorted.sort(
        (a, b) =>
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime(),
      );
    default:
      return sorted;
  }
}

export function getUpdatesByType(type: UpdateType): Update[] {
  return getUpdates().filter((update) => update.type === type);
}

export function getComparePairs(): string[] {
  const slugs = getAllRobotSlugs();
  const pairs: string[] = [];
  for (let i = 0; i < slugs.length; i++) {
    for (let j = i + 1; j < slugs.length; j++) {
      pairs.push([slugs[i], slugs[j]].sort().join("-vs-"));
    }
  }
  return pairs;
}

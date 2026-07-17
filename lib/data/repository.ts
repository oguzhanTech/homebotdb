import { robots as mockRobots } from "@/data/robots";
import newsArticles from "@/data/news.generated.json";
import { updates as dataUpdates } from "@/data/updates";
import { buildCompareSlug } from "@/lib/compare";
import { buildFeaturedComparePool } from "@/lib/featured-comparisons";
import { enrichRobotScores } from "@/lib/score";
import { isPurchasable } from "@/lib/purchase";
import { assertRobotCatalogConsistency } from "@/lib/validate-robot-catalog";
import { parseBatteryHours } from "@/lib/utils";
import type {
  AvailabilityStatus,
  PrimaryTask,
  Robot,
  RobotType,
} from "@/types/robot";
import type { Update, UpdateType } from "@/types/update";

const enrichedRobots = mockRobots.map(enrichRobotScores);
assertRobotCatalogConsistency(enrichedRobots);

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

const allUpdates: Update[] = [
  ...dataUpdates,
  ...(newsArticles as Update[]),
];

export function getUpdates(): Update[] {
  return [...allUpdates].sort(
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

export interface CatalogAddition {
  robot: Robot;
  addedAt: string;
  updateSlug: string;
}

export function getLatestCatalogAdditions(limit = 5): CatalogAddition[] {
  const results: CatalogAddition[] = [];

  for (const update of getUpdates()) {
    if (!update.robotSlug || !update.slug.endsWith("-added-to-catalog")) {
      continue;
    }

    const robot = getRobotBySlug(update.robotSlug);
    if (!robot) continue;

    results.push({
      robot,
      addedAt: update.createdAt,
      updateSlug: update.slug,
    });

    if (results.length >= limit) break;
  }

  return results;
}

export function getLatestUpdates(limit = 6): Update[] {
  return getDataUpdates(limit);
}

export function getDataUpdates(limit?: number): Update[] {
  const items = getUpdates().filter((update) => update.type !== "news");
  return limit ? items.slice(0, limit) : items;
}

export function getNewsUpdates(limit?: number): Update[] {
  const items = getUpdates().filter((update) => update.type === "news");
  return limit ? items.slice(0, limit) : items;
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

export function getAllDataUpdateSlugs(): string[] {
  return getDataUpdates().map((update) => update.slug);
}

export function getAllNewsSlugs(): string[] {
  return getNewsUpdates().map((update) => update.slug);
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
  availability?: AvailabilityStatus | "all";
  primaryTask?: PrimaryTask | "all";
  minPrice?: number;
  maxPrice?: number;
  query?: string;
  includeDiscontinued?: boolean;
  buyNowOnly?: boolean;
}

function parsePrice(price: string): number | null {
  const match = price.replace(/,/g, "").match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

function tokenizeSearchText(text: string): string[] {
  return text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

function buildRobotSearchIndex(robot: Robot) {
  const slugWords = robot.slug.replace(/-/g, " ");
  const primaryText = `${robot.name} ${robot.brand} ${slugWords}`;
  const capabilityNames = robot.capabilities.map((cap) => cap.name).join(" ");
  const secondaryText = `${robot.shortDescription} ${robot.tags.join(" ")} ${robot.primaryTask} ${capabilityNames}`;

  return {
    primaryWords: tokenizeSearchText(primaryText),
    secondaryWords: tokenizeSearchText(secondaryText),
    priceValue: parsePrice(robot.price),
  };
}

function matchSearchTerm(
  term: string,
  primaryWords: string[],
  secondaryWords: string[],
): boolean {
  if (term.length >= 2) {
    const primaryHit = primaryWords.some(
      (word) => word === term || word.startsWith(term),
    );
    if (primaryHit) return true;
  } else if (primaryWords.some((word) => word === term)) {
    return true;
  }

  if (term.length <= 3) {
    return secondaryWords.some((word) => word === term);
  }

  return secondaryWords.some(
    (word) => word === term || word.startsWith(term),
  );
}

export function matchesRobotSearchQuery(
  primaryWords: string[],
  secondaryWords: string[],
  query: string,
): boolean {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;

  return terms.every((term) =>
    matchSearchTerm(term, primaryWords, secondaryWords),
  );
}

const robotFilterIndex = new Map(
  enrichedRobots.map((robot) => [
    robot.slug,
    buildRobotSearchIndex(robot),
  ]),
);

export function filterRobots(filters: RobotFilters): Robot[] {
  const query = filters.query?.trim().toLowerCase() ?? "";
  const hasPriceFilter =
    filters.minPrice != null || filters.maxPrice != null;

  return enrichedRobots.filter((robot) => {
    const hideDiscontinued =
      !filters.includeDiscontinued &&
      robot.availabilityStatus === "discontinued" &&
      filters.availability !== "discontinued";

    if (hideDiscontinued) {
      return false;
    }

    if (filters.buyNowOnly && !isPurchasable(robot)) {
      return false;
    }

    if (filters.type && filters.type !== "all" && robot.type !== filters.type) {
      return false;
    }
    if (
      filters.availability &&
      filters.availability !== "all" &&
      robot.availabilityStatus !== filters.availability
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

    const index = robotFilterIndex.get(robot.slug);
    if (!index) return false;

    if (
      query &&
      !matchesRobotSearchQuery(
        index.primaryWords,
        index.secondaryWords,
        query,
      )
    ) {
      return false;
    }

    if (hasPriceFilter) {
      const price = index.priceValue;
      if (price == null) {
        return false;
      }
      if (filters.minPrice != null && price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice != null && price > filters.maxPrice) {
        return false;
      }
    }
    return true;
  });
}

export type SortField =
  | "readiness"
  | "price"
  | "battery"
  | "lastUpdated";

export const SORT_FIELDS: SortField[] = [
  "readiness",
  "price",
  "battery",
  "lastUpdated",
];

export function isSortField(value: string | null | undefined): value is SortField {
  return value != null && SORT_FIELDS.includes(value as SortField);
}

export function pickRandomSortField(): SortField {
  return SORT_FIELDS[Math.floor(Math.random() * SORT_FIELDS.length)];
}

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
        const aHours = parseBatteryHours(a.batteryLife) ?? -1;
        const bHours = parseBatteryHours(b.batteryLife) ?? -1;
        return bHours - aHours;
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

/** Every unordered 2-robot pair. Prefer getIndexableComparePairs for SEO surfaces. */
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

/**
 * Compare URLs worth indexing: similarRobotSlugs peers plus same type/task
 * top pairs from the featured compare pool. Used by sitemap and SSG.
 */
export function getIndexableComparePairs(): string[] {
  return buildFeaturedComparePool(getRobots()).map((pair) =>
    buildCompareSlug(pair.slugs),
  );
}

const indexableComparePairSet = new Set(getIndexableComparePairs());

export function isIndexableCompareSlug(slug: string): boolean {
  return indexableComparePairSet.has(slug);
}

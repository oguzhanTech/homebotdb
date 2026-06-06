import { brands } from "@/data/brands";
import { getRobots, getUpdates, getRobotBySlug } from "@/lib/data/repository";
import { getUpdatePublicPath } from "@/lib/update-paths";
import { formatDate, slugify } from "@/lib/utils";
import {
  PRIMARY_TASK_LABELS,
  type PrimaryTask,
} from "@/types/robot";
import { UPDATE_TYPE_LABELS, isNewsUpdate } from "@/types/update";

export type SiteSearchKind = "robot" | "news" | "update" | "task" | "capability";

export interface SiteSearchResult {
  id: string;
  kind: SiteSearchKind;
  title: string;
  subtitle: string;
  href: string;
  score: number;
  date?: string;
}

function robotsCatalogHref(params: Record<string, string>) {
  const search = new URLSearchParams({ ...params, sort: "readiness" });
  return `/robots?${search.toString()}`;
}

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function scoreText(text: string, query: string): number {
  const haystack = normalize(text);
  const needle = normalize(query);
  if (!needle || !haystack) return 0;
  if (haystack === needle) return 100;
  if (haystack.startsWith(needle)) return 85;
  if (haystack.split(/\s+/).some((word) => word.startsWith(needle))) return 75;
  if (haystack.includes(needle)) return 60;
  return 0;
}

function getBrandNeedles(query: string): string[] {
  const needles = new Set<string>([normalize(query)]);

  for (const brand of brands) {
    const candidates = [brand.name, brand.id.replace(/-/g, " "), ...brand.aliases];
    const matched = candidates.some(
      (candidate) =>
        scoreText(candidate, query) > 0 || scoreText(query, candidate) > 0,
    );

    if (matched) {
      needles.add(normalize(brand.name));
      brand.aliases.forEach((alias) => needles.add(normalize(alias)));
    }
  }

  return [...needles];
}

function robotMatchesQuery(
  robot: ReturnType<typeof getRobots>[number],
  query: string,
  brandNeedles: string[],
): number {
  const fields = [
    { value: robot.name, weight: 1.2 },
    { value: robot.brand, weight: 1.1 },
    { value: robot.slug.replace(/-/g, " "), weight: 1 },
    { value: robot.shortDescription, weight: 0.7 },
    ...robot.tags.map((tag) => ({ value: tag, weight: 0.8 })),
    ...robot.capabilities.map((cap) => ({ value: cap.name, weight: 0.75 })),
  ];

  let score = Math.max(...fields.map(({ value, weight }) => scoreText(value, query) * weight));

  if (brandNeedles.some((needle) => normalize(robot.brand).includes(needle))) {
    score = Math.max(score, 70);
  }

  return score;
}

function updateMatchesQuery(
  update: ReturnType<typeof getUpdates>[number],
  query: string,
  brandNeedles: string[],
  matchedRobotSlugs: Set<string>,
): number {
  let score = Math.max(
    scoreText(update.title, query) * 1.1,
    scoreText(update.summary, query) * 0.85,
  );

  if (update.robotSlug && matchedRobotSlugs.has(update.robotSlug)) {
    score = Math.max(score, 68);
  }

  const linkedRobot = update.robotSlug ? getRobotBySlug(update.robotSlug) : undefined;
  if (
    linkedRobot &&
    brandNeedles.some((needle) => normalize(linkedRobot.brand).includes(needle))
  ) {
    score = Math.max(score, 65);
  }

  if (brandNeedles.some((needle) => normalize(update.title).includes(needle))) {
    score = Math.max(score, 62);
  }

  return score;
}

function getPrimaryTaskResults(query: string): SiteSearchResult[] {
  const results: SiteSearchResult[] = [];

  for (const [value, label] of Object.entries(PRIMARY_TASK_LABELS) as [
    PrimaryTask,
    string,
  ][]) {
    const score = Math.max(
      scoreText(label, query),
      scoreText(value.replace(/_/g, " "), query),
    );
    if (score < 55) continue;

    results.push({
      id: `task-${value}`,
      kind: "task",
      title: label,
      subtitle: "Primary task",
      href: robotsCatalogHref({ task: value }),
      score: score + 8,
    });
  }

  return results;
}

function getCapabilityResults(query: string): SiteSearchResult[] {
  const capabilityNames = new Set<string>();
  for (const robot of getRobots()) {
    for (const capability of robot.capabilities) {
      capabilityNames.add(capability.name);
    }
  }

  const results: SiteSearchResult[] = [];

  for (const name of capabilityNames) {
    const score = scoreText(name, query);
    if (score < 55) continue;

    results.push({
      id: `capability-${slugify(name)}`,
      kind: "capability",
      title: name,
      subtitle: "Capability",
      href: robotsCatalogHref({ q: name }),
      score,
    });
  }

  return results;
}

export function searchSite(query: string, limit = 12): SiteSearchResult[] {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const brandNeedles = getBrandNeedles(trimmed);
  const robots = getRobots();
  const updates = getUpdates();
  const results: SiteSearchResult[] = [
    ...getPrimaryTaskResults(trimmed),
    ...getCapabilityResults(trimmed),
  ];
  const matchedRobotSlugs = new Set<string>();

  for (const robot of robots) {
    const score = robotMatchesQuery(robot, trimmed, brandNeedles);
    if (score < 55) continue;

    matchedRobotSlugs.add(robot.slug);
    results.push({
      id: `robot-${robot.slug}`,
      kind: "robot",
      title: robot.name,
      subtitle: robot.brand,
      href: `/robots/${robot.slug}`,
      score,
    });
  }

  for (const update of updates) {
    const score = updateMatchesQuery(update, trimmed, brandNeedles, matchedRobotSlugs);
    if (score < 55) continue;

    results.push({
      id: `update-${update.slug}`,
      kind: isNewsUpdate(update.type) ? "news" : "update",
      title: update.title,
      subtitle: UPDATE_TYPE_LABELS[update.type],
      href: getUpdatePublicPath(update),
      score,
      date: formatDate(update.createdAt),
    });
  }

  return results
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit);
}

export function groupSiteSearchResults(results: SiteSearchResult[]) {
  return {
    filters: results.filter(
      (result) => result.kind === "task" || result.kind === "capability",
    ),
    robots: results.filter((result) => result.kind === "robot"),
    articles: results.filter((result) => result.kind === "news" || result.kind === "update"),
  };
}

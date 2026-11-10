import rankingArticles from "@/data/rankings.generated.json";
import {
  getRobots,
  isIndexableCompareSlug,
} from "@/lib/data/repository";
import type { Robot } from "@/types/robot";

export type RankingListKey =
  | "buyable"
  | "humanoid"
  | "pets"
  | "cheapest"
  | "elder"
  | "desktop500"
  | "coming"
  | "apartment";

export interface RankingFaq {
  q: string;
  a: string;
}

export interface RankingArticle {
  title: string;
  slug: string;
  description: string;
  summary: string;
  publishedAt: string;
  updatedAt: string;
  list: RankingListKey;
  order: number;
  compareSlugs: string[];
  faqs: RankingFaq[];
  content: string;
}

const articles = rankingArticles as RankingArticle[];

export function getRankings(): RankingArticle[] {
  return [...articles].sort((a, b) => a.order - b.order);
}

export function getRankingBySlug(slug: string): RankingArticle | undefined {
  return articles.find((article) => article.slug === slug);
}

export function parseUsdPrice(price: string): number | null {
  const match = price.replace(/,/g, "").match(/\d+(?:\.\d+)?/);
  if (!match) return null;
  const value = Number(match[0]);
  return Number.isFinite(value) ? value : null;
}

function byScore(a: Robot, b: Robot): number {
  const total = (robot: Robot) => robot.readinessScore + robot.realityScore;
  return (
    total(b) - total(a) ||
    b.readinessScore - a.readinessScore ||
    a.name.localeCompare(b.name)
  );
}

function isBuyable(robot: Robot): boolean {
  return (
    robot.commercialStatus === "buy_now" ||
    robot.commercialStatus === "pre_order"
  );
}

const APARTMENT_EXCLUDED = new Set(["stretch-4", "isaac-1"]);

function isDesktopUnder500(robot: Robot): boolean {
  if (robot.type !== "desktop" || !isBuyable(robot)) return false;
  if (robot.priceStatus !== "confirmed") return false;
  const price = parseUsdPrice(robot.price);
  return price !== null && price < 500;
}

export function rankingUsesScore(list: RankingListKey): boolean {
  return list !== "cheapest";
}

export function robotsForRanking(list: RankingListKey): Robot[] {
  const robots = getRobots();

  if (list === "humanoid") {
    return robots.filter((robot) => robot.type === "humanoid").sort(byScore);
  }

  if (list === "pets") {
    return robots
      .filter((robot) => robot.type === "zoomorphic" || robot.slug === "vector-2")
      .sort(byScore);
  }

  if (list === "cheapest") {
    return robots
      .filter(
        (robot) =>
          isBuyable(robot) &&
          robot.priceStatus === "confirmed" &&
          parseUsdPrice(robot.price) !== null,
      )
      .sort((a, b) => {
        const priceDelta =
          (parseUsdPrice(a.price) ?? 0) - (parseUsdPrice(b.price) ?? 0);
        return priceDelta || a.name.localeCompare(b.name);
      });
  }

  if (list === "elder") {
    return robots
      .filter((robot) => robot.primaryTask === "elder_care")
      .sort(byScore);
  }

  if (list === "desktop500") {
    return robots.filter(isDesktopUnder500).sort(byScore);
  }

  if (list === "coming") {
    return robots
      .filter((robot) => robot.commercialStatus === "coming_soon")
      .sort(byScore);
  }

  if (list === "apartment") {
    return robots
      .filter(
        (robot) =>
          isBuyable(robot) &&
          robot.type !== "humanoid" &&
          !APARTMENT_EXCLUDED.has(robot.slug),
      )
      .sort(byScore);
  }

  return robots.filter(isBuyable).sort(byScore);
}

export function indexableCompareSlugs(slugs: string[]): string[] {
  return slugs.filter((slug) => isIndexableCompareSlug(slug));
}

export function rankingCategoryPath(list: RankingListKey): string | null {
  if (list === "humanoid") return "/robots/humanoid";
  if (list === "pets") return "/robots/zoomorphic";
  if (list === "elder") return "/robots/elder-care";
  if (list === "desktop500") return "/robots/desktop";
  if (list === "coming") return null;
  return "/robots";
}

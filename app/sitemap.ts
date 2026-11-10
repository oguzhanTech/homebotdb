import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { parseCompareSlug } from "@/lib/compare";
import { getAllCategorySlugs } from "@/lib/robot-categories";
import {
  getDataUpdates,
  getIndexableComparePairs,
  getNewsUpdates,
  getRobots,
} from "@/lib/data/repository";
import { getRankings } from "@/lib/rankings";
import {
  getKnowledgeAnswers,
  getKnowledgeCategoriesWithAnswers,
} from "@/lib/knowledge";

/** Stable date for pages that do not have their own editorial timestamp. */
const STATIC_LAST_MODIFIED = new Date("2026-10-06T00:00:00.000Z");

function dayStamp(day: string): Date {
  const parsed = new Date(`${day}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? STATIC_LAST_MODIFIED : parsed;
}

function isoStamp(iso: string): Date {
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? STATIC_LAST_MODIFIED : parsed;
}

/** Absolute URL matching `trailingSlash: true` and live canonicals. */
function sitemapUrl(path: string = "/"): string {
  const base = siteConfig.url.replace(/\/$/, "");
  if (!path || path === "/") return `${base}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized.endsWith("/") ? normalized : `${normalized}/`}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const robots = getRobots();
  const robotsBySlug = new Map(robots.map((robot) => [robot.slug, robot]));
  const rankings = getRankings();
  const rankingsHubModified = rankings.reduce((latest, article) => {
    const stamp = isoStamp(article.updatedAt);
    return stamp > latest ? stamp : latest;
  }, STATIC_LAST_MODIFIED);
  const knowledgeAnswers = getKnowledgeAnswers();
  const knowledgeHubModified = knowledgeAnswers.reduce((latest, answer) => {
    const stamp = isoStamp(answer.updatedAt);
    return stamp > latest ? stamp : latest;
  }, STATIC_LAST_MODIFIED);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: sitemapUrl("/"), lastModified: STATIC_LAST_MODIFIED, changeFrequency: "daily", priority: 1 },
    { url: sitemapUrl("/robots"), lastModified: STATIC_LAST_MODIFIED, changeFrequency: "daily", priority: 0.95 },
    { url: sitemapUrl("/rankings"), lastModified: rankingsHubModified, changeFrequency: "weekly", priority: 0.9 },
    { url: sitemapUrl("/knowledge"), lastModified: knowledgeHubModified, changeFrequency: "weekly", priority: 0.85 },
    { url: sitemapUrl("/compare"), lastModified: STATIC_LAST_MODIFIED, changeFrequency: "weekly", priority: 0.8 },
    { url: sitemapUrl("/updates"), lastModified: STATIC_LAST_MODIFIED, changeFrequency: "daily", priority: 0.9 },
    { url: sitemapUrl("/news"), lastModified: STATIC_LAST_MODIFIED, changeFrequency: "daily", priority: 0.85 },
    { url: sitemapUrl("/feeds"), lastModified: STATIC_LAST_MODIFIED, changeFrequency: "daily", priority: 0.75 },
    { url: sitemapUrl("/wizard"), lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.5 },
    { url: sitemapUrl("/privacy"), lastModified: STATIC_LAST_MODIFIED, changeFrequency: "yearly", priority: 0.3 },
    { url: sitemapUrl("/cookies"), lastModified: STATIC_LAST_MODIFIED, changeFrequency: "yearly", priority: 0.3 },
    { url: sitemapUrl("/terms"), lastModified: STATIC_LAST_MODIFIED, changeFrequency: "yearly", priority: 0.3 },
  ];

  const robotRoutes = robots.map((robot) => ({
    url: sitemapUrl(`/robots/${robot.slug}`),
    lastModified: dayStamp(robot.lastUpdated),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const categoryRoutes = getAllCategorySlugs().map((slug) => ({
    url: sitemapUrl(`/robots/${slug}`),
    lastModified: STATIC_LAST_MODIFIED,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const updateRoutes = getDataUpdates().map((update) => ({
    url: sitemapUrl(`/updates/${update.slug}`),
    lastModified: isoStamp(update.updatedAt || update.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const newsRoutes = getNewsUpdates().map((update) => ({
    url: sitemapUrl(`/news/${update.slug}`),
    lastModified: isoStamp(update.updatedAt || update.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  const compareRoutes = getIndexableComparePairs().map((slug) => {
    const stamps = parseCompareSlug(slug)
      .map((part) => robotsBySlug.get(part)?.lastUpdated)
      .filter((day): day is string => Boolean(day))
      .map((day) => dayStamp(day).getTime());
    return {
      url: sitemapUrl(`/compare/${slug}`),
      lastModified:
        stamps.length > 0
          ? new Date(Math.max(...stamps))
          : STATIC_LAST_MODIFIED,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    };
  });

  const rankingRoutes = rankings.map((article) => ({
    url: sitemapUrl(`/rankings/${article.slug}`),
    lastModified: isoStamp(article.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const knowledgeCategoryRoutes = getKnowledgeCategoriesWithAnswers().map((category) => {
    const stamps = getKnowledgeAnswers()
      .filter((answer) => answer.category === category.slug)
      .map((answer) => isoStamp(answer.updatedAt).getTime());
    return {
      url: sitemapUrl(`/knowledge/${category.slug}`),
      lastModified: new Date(Math.max(...stamps)),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    };
  });

  const knowledgeRoutes = knowledgeAnswers.map((answer) => ({
    url: sitemapUrl(`/knowledge/${answer.slug}`),
    lastModified: isoStamp(answer.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...robotRoutes,
    ...categoryRoutes,
    ...rankingRoutes,
    ...knowledgeCategoryRoutes,
    ...knowledgeRoutes,
    ...updateRoutes,
    ...newsRoutes,
    ...compareRoutes,
  ];
}

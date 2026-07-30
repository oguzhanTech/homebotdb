import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllCategorySlugs } from "@/lib/robot-categories";
import {
  getAllDataUpdateSlugs,
  getAllNewsSlugs,
  getAllRobotSlugs,
  getIndexableComparePairs,
} from "@/lib/data/repository";

/** Absolute URL matching `trailingSlash: true` and live canonicals. */
function sitemapUrl(path: string = "/"): string {
  const base = siteConfig.url.replace(/\/$/, "");
  if (!path || path === "/") return `${base}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized.endsWith("/") ? normalized : `${normalized}/`}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: sitemapUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: sitemapUrl("/robots"), lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: sitemapUrl("/compare"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: sitemapUrl("/updates"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: sitemapUrl("/news"), lastModified: now, changeFrequency: "daily", priority: 0.85 },
    { url: sitemapUrl("/feeds"), lastModified: now, changeFrequency: "daily", priority: 0.75 },
    { url: sitemapUrl("/wizard"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: sitemapUrl("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: sitemapUrl("/cookies"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: sitemapUrl("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const robotRoutes = getAllRobotSlugs().map((slug) => ({
    url: sitemapUrl(`/robots/${slug}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const categoryRoutes = getAllCategorySlugs().map((slug) => ({
    url: sitemapUrl(`/robots/${slug}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const updateRoutes = getAllDataUpdateSlugs().map((slug) => ({
    url: sitemapUrl(`/updates/${slug}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const newsRoutes = getAllNewsSlugs().map((slug) => ({
    url: sitemapUrl(`/news/${slug}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  const compareRoutes = getIndexableComparePairs().map((slug) => ({
    url: sitemapUrl(`/compare/${slug}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  return [
    ...staticRoutes,
    ...robotRoutes,
    ...categoryRoutes,
    ...updateRoutes,
    ...newsRoutes,
    ...compareRoutes,
  ];
}

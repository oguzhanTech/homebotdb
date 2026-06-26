import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import {
  getAllDataUpdateSlugs,
  getAllNewsSlugs,
  getAllRobotSlugs,
  getComparePairs,
} from "@/lib/data/repository";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/robots`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${base}/compare`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/tracked`, lastModified: now, changeFrequency: "weekly", priority: 0.45 },
    { url: `${base}/updates`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/news`, lastModified: now, changeFrequency: "daily", priority: 0.85 },
    { url: `${base}/wizard`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const robotRoutes = getAllRobotSlugs().map((slug) => ({
    url: `${base}/robots/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const updateRoutes = getAllDataUpdateSlugs().map((slug) => ({
    url: `${base}/updates/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const newsRoutes = getAllNewsSlugs().map((slug) => ({
    url: `${base}/news/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  const compareRoutes = getComparePairs().map((slug) => ({
    url: `${base}/compare/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  return [...staticRoutes, ...robotRoutes, ...updateRoutes, ...newsRoutes, ...compareRoutes];
}

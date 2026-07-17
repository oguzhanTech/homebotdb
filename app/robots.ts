import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.url.replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin"],
    },
    // XML sitemap for pages + RSS feeds as Google-accepted sitemap types
    // (do not list feed.xml as ordinary <url> entries in sitemap.xml).
    sitemap: [
      `${base}/sitemap.xml`,
      `${base}/news/feed.xml`,
      `${base}/updates/feed.xml`,
    ],
  };
}

export const siteConfig = {
  name: "HomeBotDB",
  shortName: "HB",
  tagline: "Home & companion robot database",
  description:
    "Compare, score, and track home robots, humanoids, companions, and elder-care assistants. Industrial robots excluded.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://homebotdb.com",
  version: "v2.0",
  locale: "en",
  defaultOgImage: "/og-default.png",
} as const;

export type SiteConfig = typeof siteConfig;

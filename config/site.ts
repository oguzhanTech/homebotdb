export const siteConfig = {
  name: "HomeBotRadar",
  shortName: "HR",
  logoLines: ["HOMEBOT", "RADAR"] as const,
  tagline: "Home & companion robot radar",
  description:
    "Compare, score, and track home robots, humanoids, companions, and elder-care assistants. Industrial robots excluded.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://homebotradar.com",
  version: "v0.1",
  locale: "en",
  defaultOgImage: "/og-default.png",
} as const;

export type SiteConfig = typeof siteConfig;

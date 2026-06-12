export const siteConfig = {
  name: "HomeBotRadar",
  shortName: "HR",
  logoLines: ["HOMEBOT", "RADAR"] as const,
  tagline: "Home & Companion Robot Database",
  description:
    "Track every home robot on the market. HomeBotRadar lets you compare humanoid and companion robots side by side — specs, prices, readiness scores, and real availability data.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://homebotradar.com",
  locale: "en",
  defaultOgImage: "/og-default.png",
  features: {
    /** Email alert signup on the homepage. Enable when the list is live. */
    emailSubscription: false,
  },
} as const;

export type SiteConfig = typeof siteConfig;

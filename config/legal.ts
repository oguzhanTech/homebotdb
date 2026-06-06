export const legalConfig = {
  contactEmail: "eternalegendsinfo@gmail.com",
  /** Shown at the top of legal pages */
  lastUpdated: "June 6, 2026",
  operatorName: "HomeBotRadar",
} as const;

export const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/cookies", label: "Cookies" },
  { href: "/terms", label: "Terms" },
] as const;

export type LegalSection = {
  title: string;
  paragraphs: string[];
  list?: string[];
};

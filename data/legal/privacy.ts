import { legalConfig, type LegalSection } from "@/config/legal";

const { contactEmail } = legalConfig;

export const privacyIntro =
  "This Privacy Policy explains how HomeBotRadar collects, uses, and shares information when you use homebotradar.com and related pages.";

export const privacySections: LegalSection[] = [
  {
    title: "Who we are",
    paragraphs: [
      "HomeBotRadar operates a public reference site for home and companion robots. We publish specs, scores, news, updates, and community comments.",
      `Questions about this policy: ${contactEmail}.`,
    ],
  },
  {
    title: "Information we collect",
    paragraphs: ["We may collect the following:"],
    list: [
      "Usage data: pages viewed, approximate location from IP, browser type, device type, referral URL, and timestamps in server logs.",
      "Cookies and similar technologies: see our Cookie Policy.",
      "Comments you post: username, comment text, and timestamp. We do not require account registration.",
      "Local storage on your device: for example, a saved comment username in your browser session.",
      "Email addresses: only if you voluntarily submit them when an email alert feature is offered.",
    ],
  },
  {
    title: "How we use information",
    paragraphs: ["We use information to:"],
    list: [
      "Run, secure, and improve the site.",
      "Display public comments and fight spam or abuse.",
      "Measure traffic and site performance.",
      "Show advertising through partners such as Google AdSense, where enabled.",
      "Respond to legal requests and enforce our Terms of Service.",
    ],
  },
  {
    title: "Advertising and analytics",
    paragraphs: [
      "We may use Google AdSense and other ad partners. Those partners may use cookies or similar tools to serve ads, including personalized ads where allowed by law and your settings.",
      "Google's use of advertising cookies enables it and its partners to serve ads based on your visits to this site and other sites on the Internet.",
      "You may opt out of personalized advertising by visiting Google Ads Settings or www.aboutads.info.",
      "We may use analytics services (for example Google Analytics) to understand how visitors use the site. Analytics providers process data under their own policies.",
    ],
  },
  {
    title: "Legal bases (EEA and UK)",
    paragraphs: [
      "Where GDPR or UK GDPR applies, we rely on legitimate interests to operate and improve the site, display advertising, and keep the service secure. We rely on consent where required for non-essential cookies. Contract or consent may apply if you sign up for optional features.",
    ],
  },
  {
    title: "Sharing",
    paragraphs: ["We may share information with:"],
    list: [
      "Hosting, analytics, advertising, and security vendors who process data on our behalf.",
      "Authorities when required by law or to protect rights and safety.",
      "Successors if the site or business is transferred.",
    ],
  },
  {
    title: "Retention",
    paragraphs: [
      `Server logs are kept for a limited period needed for security and operations. Comments remain visible until removed by moderators or deleted as part of site maintenance. You can request deletion of a comment you posted by emailing ${contactEmail} with enough detail to identify it.`,
    ],
  },
  {
    title: "Your choices and rights",
    paragraphs: ["Depending on where you live, you may have rights to:"],
    list: [
      "Access, correct, or delete personal data we hold about you.",
      "Object to or restrict certain processing.",
      "Withdraw consent for cookies where consent is the legal basis.",
      "Lodge a complaint with a supervisory authority.",
    ],
  },
  {
    title: "Children",
    paragraphs: [
      "The site is not directed at children under 16. We do not knowingly collect personal data from children. Contact us if you believe a child has submitted personal data.",
    ],
  },
  {
    title: "International transfers",
    paragraphs: [
      "We may process data in countries other than your own. We use appropriate safeguards where required by law.",
    ],
  },
  {
    title: "Changes",
    paragraphs: [
      "We may update this policy. The \"Last updated\" date at the top will change when we do. Continued use after changes means you accept the updated policy.",
    ],
  },
];

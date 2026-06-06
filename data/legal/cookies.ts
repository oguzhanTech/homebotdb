import type { LegalSection } from "@/config/legal";

export const cookiesIntro =
  "This Cookie Policy explains how HomeBotRadar uses cookies and similar technologies on homebotradar.com.";

export const cookiesSections: LegalSection[] = [
  {
    title: "What cookies are",
    paragraphs: [
      "Cookies are small text files stored on your device. Similar technologies include local storage, pixels, and SDK identifiers.",
    ],
  },
  {
    title: "How we use cookies",
    paragraphs: ["We use cookies and similar tools for:"],
    list: [
      "Essential operation: security, load balancing, and basic preferences needed to use the site.",
      "Functionality: remembering items such as your comment username in local storage during a session.",
      "Analytics: understanding traffic and how pages perform.",
      "Advertising: serving and measuring ads, including through Google AdSense and its partners.",
    ],
  },
  {
    title: "Third-party cookies",
    paragraphs: [
      "Advertising and analytics partners may set their own cookies when you visit our site. Google AdSense may use the DoubleClick cookie to serve interest-based ads. See Google's Advertising Policies and partner program policies for more detail.",
      "We do not control third-party cookies. Check each provider's policy for opt-out options.",
    ],
  },
  {
    title: "Managing cookies",
    paragraphs: [
      "You can block or delete cookies in your browser settings. Blocking essential cookies may limit site features.",
      "For personalized Google ads, visit https://adssettings.google.com.",
      "For industry opt-outs in the US, visit https://www.aboutads.info/choices.",
      "Where required by law, we will ask for consent before non-essential cookies are placed.",
    ],
  },
  {
    title: "Updates",
    paragraphs: [
      "We may change this Cookie Policy. Check the \"Last updated\" date at the top of this page.",
      "See our Privacy Policy for how we handle personal data.",
    ],
  },
];

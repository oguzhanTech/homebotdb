import { legalConfig, type LegalSection } from "@/config/legal";

const { contactEmail } = legalConfig;

export const termsIntro =
  "These Terms of Service govern your use of HomeBotRadar. By using the site, you agree to these terms.";

export const termsSections: LegalSection[] = [
  {
    title: "The service",
    paragraphs: [
      "HomeBotRadar provides robot specs, scores, news, updates, comparisons, and community comments for informational purposes. We focus on home, companion, and related consumer robots.",
      "We may change, suspend, or remove features at any time.",
    ],
  },
  {
    title: "Not professional advice",
    paragraphs: [
      "Content on the site is not buying, legal, medical, or safety advice. Prices, availability, specs, and scores may be estimates or outdated. Confirm details with manufacturers and sellers before you purchase.",
    ],
  },
  {
    title: "Accounts and comments",
    paragraphs: [
      "You may post comments without creating an account. You choose a public username. Do not impersonate others or use staff usernames unless authorized.",
      "You are responsible for what you post. Do not post unlawful, harassing, spam, or misleading content.",
      "We may remove comments, block usernames, or restrict access at our discretion.",
      "You grant us a non-exclusive license to display, store, and reproduce your comments in connection with the site.",
    ],
  },
  {
    title: "Acceptable use",
    paragraphs: ["You agree not to:"],
    list: [
      "Scrape or overload the site without permission.",
      "Attempt to bypass security or access non-public areas such as admin tools.",
      "Use the site to distribute malware or collect data about other users without consent.",
      "Misrepresent your affiliation with HomeBotRadar or any robot brand.",
    ],
  },
  {
    title: "Intellectual property",
    paragraphs: [
      "HomeBotRadar branding, layout, and original editorial content are protected by applicable law. Robot names, logos, and images belong to their respective owners and are used for identification and commentary.",
      "You may link to our pages. Do not frame the site or imply endorsement without permission.",
    ],
  },
  {
    title: "Third-party links and ads",
    paragraphs: [
      "The site links to manufacturers, retailers, and news sources. We are not responsible for third-party sites or products.",
      "Ads, including Google AdSense units, are provided by third parties. Your dealings with advertisers are between you and them.",
    ],
  },
  {
    title: "Disclaimer of warranties",
    paragraphs: [
      "The site is provided \"as is\" and \"as available\" without warranties of any kind, express or implied, including accuracy, fitness for a particular purpose, or non-infringement.",
    ],
  },
  {
    title: "Limitation of liability",
    paragraphs: [
      "To the fullest extent permitted by law, HomeBotRadar and its operators will not be liable for indirect, incidental, special, consequential, or punitive damages, or any loss of profits, data, or goodwill arising from your use of the site.",
    ],
  },
  {
    title: "Indemnity",
    paragraphs: [
      "You agree to indemnify and hold harmless HomeBotRadar from claims arising out of your use of the site or violation of these terms.",
    ],
  },
  {
    title: "Governing law",
    paragraphs: [
      "These terms are governed by the laws applicable to the operator of HomeBotRadar, without regard to conflict-of-law rules. Courts in that jurisdiction will have exclusive venue for disputes, unless mandatory consumer law in your country requires otherwise.",
    ],
  },
  {
    title: "Contact",
    paragraphs: [`Questions about these terms: ${contactEmail}.`],
  },
  {
    title: "Changes",
    paragraphs: [
      "We may update these terms. The \"Last updated\" date will change when we do. Continued use after changes means you accept the updated terms.",
    ],
  },
];

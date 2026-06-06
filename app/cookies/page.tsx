import { buildPageMetadata } from "@/lib/seo";
import { TopBar } from "@/components/layout/TopBar";
import {
  LegalDocument,
  LegalPageShell,
  legalPageTitle,
} from "@/components/legal/LegalDocument";
import {
  cookiesIntro,
  cookiesSections,
} from "@/data/legal/cookies";

export const metadata = buildPageMetadata({
  title: legalPageTitle("Cookie Policy"),
  description:
    "How HomeBotRadar uses cookies, local storage, and third-party tools such as Google AdSense.",
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <LegalPageShell>
      <TopBar />
      <LegalDocument
        title="Cookie Policy"
        intro={cookiesIntro}
        sections={cookiesSections}
        className="mt-2"
      />
    </LegalPageShell>
  );
}

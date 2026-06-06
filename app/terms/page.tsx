import { buildPageMetadata } from "@/lib/seo";
import { TopBar } from "@/components/layout/TopBar";
import {
  LegalDocument,
  LegalPageShell,
  legalPageTitle,
} from "@/components/legal/LegalDocument";
import { termsIntro, termsSections } from "@/data/legal/terms";

export const metadata = buildPageMetadata({
  title: legalPageTitle("Terms of Service"),
  description:
    "Terms for using HomeBotRadar, including comments, disclaimers, and acceptable use.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPageShell>
      <TopBar />
      <LegalDocument
        title="Terms of Service"
        intro={termsIntro}
        sections={termsSections}
        className="mt-2"
      />
    </LegalPageShell>
  );
}

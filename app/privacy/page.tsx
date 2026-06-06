import { buildPageMetadata } from "@/lib/seo";
import { TopBar } from "@/components/layout/TopBar";
import {
  LegalDocument,
  LegalPageShell,
  legalPageTitle,
} from "@/components/legal/LegalDocument";
import {
  privacyIntro,
  privacySections,
} from "@/data/legal/privacy";

export const metadata = buildPageMetadata({
  title: legalPageTitle("Privacy Policy"),
  description:
    "How HomeBotRadar collects, uses, and shares information, including cookies and advertising.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPageShell>
      <TopBar />
      <LegalDocument
        title="Privacy Policy"
        intro={privacyIntro}
        sections={privacySections}
        className="mt-2"
      />
    </LegalPageShell>
  );
}

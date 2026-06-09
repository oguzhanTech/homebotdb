import { Suspense } from "react";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo";
import {
  getLatestUpdates,
  getNewsUpdates,
  getRobots,
  pickRandomSortField,
} from "@/lib/data/repository";
import { TopBar } from "@/components/layout/TopBar";
import { RobotMatrix } from "@/components/robot/RobotMatrix";
import { DashboardSpotlight } from "@/components/robot/DashboardSpotlight";
import { UpdatesSection, NewsSection } from "@/components/robot/UpdatesSection";
import { EmailAlertPlaceholder } from "@/components/marketing/EmailAlertPlaceholder";

export const metadata = buildPageMetadata({
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  path: "/",
});

function HomeContent() {
  const robots = getRobots();
  const latestUpdates = getLatestUpdates(6);
  const newsUpdates = getNewsUpdates(4);
  const initialSort = pickRandomSortField();

  return (
    <main className="px-3.5 py-5 sm:px-7 sm:py-7">
      <TopBar />

      <DashboardSpotlight robots={robots} />

      <RobotMatrix initialSort={initialSort} />

      <NewsSection updates={newsUpdates} />

      <UpdatesSection title="Latest Robot Updates" updates={latestUpdates} />

      {siteConfig.features.emailSubscription ? (
        <div className="mt-10">
          <EmailAlertPlaceholder />
        </div>
      ) : null}
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<main className="p-7">Loading...</main>}>
      <HomeContent />
    </Suspense>
  );
}

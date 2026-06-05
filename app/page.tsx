import { Suspense } from "react";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo";
import {
  getLatestUpdates,
  getNewsUpdates,
  getRobots,
} from "@/lib/data/repository";
import { TopBar } from "@/components/layout/TopBar";
import { RobotMatrix } from "@/components/robot/RobotMatrix";
import { DashboardSpotlight } from "@/components/robot/DashboardSpotlight";
import { UpdatesSection } from "@/components/robot/UpdatesSection";
import { EmailAlertPlaceholder } from "@/components/marketing/EmailAlertPlaceholder";

export const metadata = buildPageMetadata({
  title: `${siteConfig.name} — Home Robot Matrix`,
  description: siteConfig.description,
  path: "/",
});

function HomeContent() {
  const robots = getRobots();
  const latestUpdates = getLatestUpdates(6);
  const newsUpdates = getNewsUpdates(4);

  return (
    <main className="px-3.5 py-5 sm:px-7 sm:py-7">
      <TopBar />

      <DashboardSpotlight robots={robots} />

      <RobotMatrix />

      <UpdatesSection title="Latest Robot Updates" updates={latestUpdates} />

      <UpdatesSection
        title="Robot News"
        updates={newsUpdates}
        viewAllHref="/updates?type=news"
      />

      <div className="mt-10">
        <EmailAlertPlaceholder />
      </div>
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

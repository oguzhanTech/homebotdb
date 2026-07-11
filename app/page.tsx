import { siteConfig } from "@/config/site";
import { uiCopy } from "@/config/ui-copy";
import { buildPageMetadata } from "@/lib/seo";
import {
  getLatestUpdates,
  getNewsUpdates,
  getRobots,
} from "@/lib/data/repository";
import { getSocialFeedItems } from "@/lib/data/social-feed";
import { TopBar } from "@/components/layout/TopBar";
import { DashboardSpotlight } from "@/components/robot/DashboardSpotlight";
import { HomeDashboard } from "@/components/home/HomeDashboard";
import { SocialSignalSection } from "@/components/home/SocialSignalSection";
import { UpdatesSection, NewsSection } from "@/components/robot/UpdatesSection";
import { EmailAlertPlaceholder } from "@/components/marketing/EmailAlertPlaceholder";

export const metadata = buildPageMetadata({
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  path: "/",
});

export default async function HomePage() {
  const robots = getRobots();
  const latestUpdates = getLatestUpdates(6);
  const newsUpdates = getNewsUpdates(4);
  const socialFeed = getSocialFeedItems();

  return (
    <main className="min-w-0 px-3.5 py-5 sm:px-7 sm:py-7">
      <TopBar />

      <DashboardSpotlight robots={robots} />

      <HomeDashboard robots={robots} />

      <NewsSection updates={newsUpdates} />

      <SocialSignalSection items={socialFeed} />

      <UpdatesSection
        title={uiCopy.homepage.radarFeedEyebrow}
        heading={uiCopy.homepage.latestRobotUpdates}
        updates={latestUpdates}
      />

      {siteConfig.features.emailSubscription ? (
        <div className="mt-10">
          <EmailAlertPlaceholder />
        </div>
      ) : null}
    </main>
  );
}

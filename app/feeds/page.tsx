import { uiCopy } from "@/config/ui-copy";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo";
import { getSocialFeedItems } from "@/lib/data/social-feed";
import { TopBar } from "@/components/layout/TopBar";
import { SocialFeedGrid } from "@/components/home/SocialFeedGrid";

export const metadata = buildPageMetadata({
  title: `${uiCopy.homepage.socialFeed.pageTitle} — ${siteConfig.name}`,
  description: uiCopy.homepage.socialFeed.pageLead,
  path: "/feeds",
});

export default function FeedsPage() {
  const items = getSocialFeedItems();

  return (
    <main className="min-w-0 px-3.5 py-5 sm:px-7 sm:py-7">
      <TopBar />

      <header className="mb-6">
        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
          {uiCopy.homepage.socialFeed.eyebrow}
        </div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          {uiCopy.homepage.socialFeed.pageTitle}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#565f6b]">
          {uiCopy.homepage.socialFeed.pageLead}
        </p>
      </header>

      <SocialFeedGrid items={items} />

      <p className="mt-3 text-[11px] text-muted">
        {uiCopy.homepage.socialFeed.footerNote}
      </p>
    </main>
  );
}

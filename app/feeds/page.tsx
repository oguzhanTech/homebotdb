import Link from "next/link";
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
  const copy = uiCopy.homepage.socialFeed;

  return (
    <main className="min-w-0 px-3.5 py-5 sm:px-7 sm:py-7">
      <TopBar />

      <header className="mb-6">
        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
          {copy.eyebrow}
        </div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          {copy.pageTitle}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#565f6b]">
          {copy.pageLead}
        </p>
      </header>

      <SocialFeedGrid items={items} />

      <p className="mt-3 text-[11px] text-muted">{copy.footerNote}</p>

      <section className="mt-8 border-t border-line/80 pt-6">
        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
          {copy.subscribeEyebrow}
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#565f6b]">
          {copy.subscribeLead}
        </p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-bold uppercase tracking-wider text-blue">
          <Link href="/news" className="cursor-pointer hover:text-ink">
            {copy.browseNews}
          </Link>
          <Link href="/news/feed.xml" className="cursor-pointer hover:text-ink">
            {copy.newsRss}
          </Link>
          <Link href="/updates" className="cursor-pointer hover:text-ink">
            {copy.browseUpdates}
          </Link>
          <Link
            href="/updates/feed.xml"
            className="cursor-pointer hover:text-ink"
          >
            {copy.updatesRss}
          </Link>
        </div>
      </section>
    </main>
  );
}

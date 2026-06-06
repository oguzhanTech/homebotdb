import Link from "next/link";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo";
import { getNewsUpdates } from "@/lib/data/repository";
import { TopBar } from "@/components/layout/TopBar";
import { NewsCard } from "@/components/robot/UpdatesSection";

export const metadata = buildPageMetadata({
  title: `Robot News — ${siteConfig.name}`,
  description:
    "Home robot industry news, product launches, weekly digests, and market moves.",
  path: "/news",
});

export default function NewsPage() {
  const news = getNewsUpdates();

  return (
    <main className="px-3.5 py-5 sm:px-7 sm:py-7">
      <TopBar />
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            News
          </div>
          <h1 className="mt-1 text-3xl font-medium tracking-tight">Robot news</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#565f6b]">
            Stories and roundups from the home robot market. Database changes are on{" "}
            <Link href="/updates" className="font-semibold text-blue hover:underline">
              Updates
            </Link>
            .
          </p>
        </div>
        <Link
          href="/news/feed.xml"
          className="text-xs font-bold uppercase tracking-wider text-blue"
        >
          RSS Feed
        </Link>
      </div>
      {news.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {news.map((update) => (
            <NewsCard key={update.id} update={update} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">No news yet.</p>
      )}
    </main>
  );
}

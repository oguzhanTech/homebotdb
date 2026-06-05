import Link from "next/link";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo";
import { getUpdates } from "@/lib/data/repository";
import { TopBar } from "@/components/layout/TopBar";
import { UpdateCard } from "@/components/robot/UpdatesSection";

export const metadata = buildPageMetadata({
  title: `Robot Updates & News — ${siteConfig.name}`,
  description:
    "Latest home robot data updates, price revisions, availability checks, and industry news.",
  path: "/updates",
});

export default function UpdatesPage() {
  const updates = getUpdates();

  return (
    <main className="px-3.5 py-5 sm:px-7 sm:py-7">
      <TopBar />
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Updates
          </div>
          <h1 className="mt-1 text-3xl font-medium tracking-tight">
            Robot updates & news
          </h1>
        </div>
        <Link
          href="/updates/feed.xml"
          className="text-xs font-bold uppercase tracking-wider text-blue"
        >
          RSS Feed
        </Link>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {updates.map((update) => (
          <UpdateCard key={update.id} update={update} />
        ))}
      </div>
    </main>
  );
}

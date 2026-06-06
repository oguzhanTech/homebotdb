import Link from "next/link";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo";
import { getDataUpdates } from "@/lib/data/repository";
import { TopBar } from "@/components/layout/TopBar";
import { UpdateCard } from "@/components/robot/UpdatesSection";

export const metadata = buildPageMetadata({
  title: `Robot Data Updates — ${siteConfig.name}`,
  description:
    "Spec changes, score revisions, price updates, and availability checks for home robots.",
  path: "/updates",
});

export default function UpdatesPage() {
  const updates = getDataUpdates();

  return (
    <main className="px-3.5 py-5 sm:px-7 sm:py-7">
      <TopBar />
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Updates
          </div>
          <h1 className="mt-1 text-3xl font-medium tracking-tight">Robot data updates</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#565f6b]">
            Spec, score, price, and availability changes from the {siteConfig.name} team.
            News lives on a{" "}
            <Link href="/news" className="font-semibold text-blue hover:underline">
              separate page
            </Link>
            .
          </p>
        </div>
        <Link
          href="/updates/feed.xml"
          className="text-xs font-bold uppercase tracking-wider text-blue"
        >
          RSS Feed
        </Link>
      </div>
      {updates.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {updates.map((update) => (
            <UpdateCard key={update.id} update={update} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">No data updates yet.</p>
      )}
    </main>
  );
}

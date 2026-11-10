import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { uiCopy } from "@/config/ui-copy";
import { buildPageMetadata } from "@/lib/seo";
import { getRankings } from "@/lib/rankings";
import { TopBar } from "@/components/layout/TopBar";
import { RankingCard } from "@/components/rankings/RankingTable";

export const metadata: Metadata = buildPageMetadata({
  title: `Robot rankings | ${siteConfig.name}`,
  description:
    "Home-robot rankings from the HomeBotRadar catalog. Best lists add readiness and reality. The cheap list is confirmed price only.",
  path: "/rankings",
});

export default function RankingsPage() {
  const rankings = getRankings();

  return (
    <main className="px-3.5 py-5 sm:px-7 sm:py-7">
      <TopBar />
      <div className="mb-6 max-w-3xl">
        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
          {uiCopy.nav.rankings}
        </div>
        <h1 className="mt-1 text-3xl font-medium tracking-tight">Robot rankings</h1>
        <p className="mt-2 text-sm leading-relaxed text-[#565f6b]">
          These lists are cuts of the catalog. On a best list, the order is readiness plus reality. The cheap list is confirmed price only. Status stays on the row, so a high score is not a cart.
        </p>
      </div>
      <div className="grid items-stretch gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {rankings.map((article) => (
          <RankingCard key={article.slug} article={article} />
        ))}
      </div>
    </main>
  );
}

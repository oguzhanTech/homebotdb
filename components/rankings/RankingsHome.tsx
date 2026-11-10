import Link from "next/link";
import { uiCopy } from "@/config/ui-copy";
import type { RankingArticle } from "@/lib/rankings";
import { RankingCard } from "@/components/rankings/RankingTable";

export function RankingsHome({ articles }: { articles: RankingArticle[] }) {
  if (articles.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            {uiCopy.homepage.rankingsEyebrow}
          </div>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">
            {uiCopy.homepage.rankingsHeading}
          </h2>
        </div>
        <Link
          href="/rankings"
          className="cursor-pointer text-xs font-bold uppercase tracking-wider text-blue"
        >
          {uiCopy.updates.viewAll}
        </Link>
      </div>
      <div className="grid items-stretch gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {articles.map((article) => (
          <RankingCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  );
}

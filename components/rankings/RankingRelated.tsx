import Link from "next/link";
import { uiCopy } from "@/config/ui-copy";
import {
  indexableCompareSlugs,
  rankingCategoryPath,
  type RankingArticle,
} from "@/lib/rankings";
import { getRobotBySlug } from "@/lib/data/repository";
import { parseCompareSlug } from "@/lib/compare";

function compareLabel(slug: string): string {
  const parts = parseCompareSlug(slug);
  if (parts.length !== 2) return slug;
  const left = getRobotBySlug(parts[0])?.name ?? parts[0];
  const right = getRobotBySlug(parts[1])?.name ?? parts[1];
  return `${left} vs ${right}`;
}

const pillClass =
  "inline-flex cursor-pointer items-center rounded-full border border-line bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#4d5662] transition-colors hover:border-blue/30 hover:text-blue";

export function RankingRelated({
  article,
  rankings,
}: {
  article: RankingArticle;
  rankings: RankingArticle[];
}) {
  const others = rankings.filter((item) => item.slug !== article.slug);
  const compares = indexableCompareSlugs(article.compareSlugs);
  const categoryPath = rankingCategoryPath(article.list);

  return (
    <div className="mt-10 rounded-[18px] border border-line bg-panel-strong p-5 shadow-card">
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
        Keep going
      </div>
      <div className="mt-4 grid gap-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
            Other rankings
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link href="/rankings" className={pillClass}>
              All rankings
            </Link>
            {others.map((item) => (
              <Link key={item.slug} href={`/rankings/${item.slug}`} className={pillClass}>
                {item.title}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
            Compare
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {compares.map((slug) => (
              <Link key={slug} href={`/compare/${slug}`} className={pillClass}>
                {compareLabel(slug)}
              </Link>
            ))}
            <Link href="/compare" className={pillClass}>
              {uiCopy.nav.compare}
            </Link>
          </div>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
            Catalog
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link href="/robots" className={pillClass}>
              {uiCopy.nav.robots}
            </Link>
            {categoryPath && categoryPath !== "/robots" ? (
              <Link href={categoryPath} className={pillClass}>
                {article.list === "humanoid"
                  ? "Humanoid robots"
                  : article.list === "elder"
                    ? "Elder care"
                    : article.list === "desktop500"
                      ? "Desktop robots"
                      : "Animal-like robots"}
              </Link>
            ) : null}
            <Link href="/wizard" className={pillClass}>
              {uiCopy.nav.robotMatchmaker}
            </Link>
            <Link href="/updates" className={pillClass}>
              {uiCopy.nav.radarFeed}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

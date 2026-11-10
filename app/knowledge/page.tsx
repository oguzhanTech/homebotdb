import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { uiCopy } from "@/config/ui-copy";
import { buildPageMetadata } from "@/lib/seo";
import {
  getAnswersByCategory,
  getKnowledgeCategoriesWithAnswers,
} from "@/lib/knowledge";
import { TopBar } from "@/components/layout/TopBar";
import { KnowledgeCard } from "@/components/knowledge/KnowledgeCard";

export const metadata: Metadata = buildPageMetadata({
  title: `${uiCopy.nav.answers} | ${siteConfig.name}`,
  description:
    "Short answers on buying and pricing home robots, each tied to a catalog robot and one compare.",
  path: "/knowledge",
});

export default function KnowledgePage() {
  const categories = getKnowledgeCategoriesWithAnswers();

  return (
    <main className="px-3.5 py-5 sm:px-7 sm:py-7">
      <TopBar />
      <div className="mb-6 max-w-3xl">
        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
          {uiCopy.nav.answers}
        </div>
        <h1 className="mt-1 text-3xl font-medium tracking-tight">{uiCopy.nav.answers}</h1>
        <p className="mt-2 text-sm leading-relaxed text-[#565f6b]">
          One question per page. The short answer is first. Each page names the
          catalog robots it depends on, one official source, and one compare.
        </p>
      </div>
      <div className="grid gap-8">
        {categories.map((category) => (
          <section key={category.slug}>
            <div className="mb-3">
              <Link
                href={`/knowledge/${category.slug}`}
                className="cursor-pointer text-[11px] font-bold uppercase tracking-[0.14em] text-blue"
              >
                {category.label}
              </Link>
              <p className="mt-1 text-sm text-[#565f6b]">{category.description}</p>
            </div>
            <div className="grid items-stretch gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {getAnswersByCategory(category.slug).map((answer) => (
                <KnowledgeCard key={answer.slug} answer={answer} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { uiCopy } from "@/config/ui-copy";
import { buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { getRobotBySlug } from "@/lib/data/repository";
import { parseCompareSlug } from "@/lib/compare";
import {
  getAnswersByCategory,
  getKnowledgeAnswers,
  getKnowledgeBySlug,
  getKnowledgeCategoriesWithAnswers,
  getKnowledgeCategory,
  isKnowledgeCategorySlug,
  type KnowledgeAnswer,
  type KnowledgeCategorySlug,
} from "@/lib/knowledge";
import { getRankingBySlug } from "@/lib/rankings";
import { TopBar } from "@/components/layout/TopBar";
import { KnowledgeCard } from "@/components/knowledge/KnowledgeCard";
import { KnowledgeRobots } from "@/components/knowledge/KnowledgeRobots";
import { KnowledgeSections } from "@/components/knowledge/KnowledgeSections";
import { KnowledgeSources } from "@/components/knowledge/KnowledgeSources";
import { KnowledgeTypedSummary } from "@/components/knowledge/KnowledgeTypedSummary";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return [
    ...getKnowledgeCategoriesWithAnswers().map((category) => ({
      slug: category.slug,
    })),
    ...getKnowledgeAnswers().map((answer) => ({ slug: answer.slug })),
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = liveCategory(slug);
  if (category) {
    return buildPageMetadata({
      title: `${category.label} | ${uiCopy.nav.answers} | ${siteConfig.name}`,
      description: category.description,
      path: `/knowledge/${category.slug}`,
    });
  }

  const answer = getKnowledgeBySlug(slug);
  if (!answer) return {};
  return buildPageMetadata({
    title: `${answer.title} | ${siteConfig.name}`,
    description: answer.description,
    path: `/knowledge/${answer.slug}`,
  });
}

function liveCategory(slug: string) {
  if (!isKnowledgeCategorySlug(slug)) return undefined;
  if (getAnswersByCategory(slug).length === 0) return undefined;
  return getKnowledgeCategory(slug);
}

function compareLabel(slug: string): string {
  const parts = parseCompareSlug(slug);
  if (parts.length !== 2) return slug;
  const left = getRobotBySlug(parts[0])?.name ?? parts[0];
  const right = getRobotBySlug(parts[1])?.name ?? parts[1];
  return `${left} vs ${right}`;
}

export default async function KnowledgeSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const category = liveCategory(slug);
  if (category && isKnowledgeCategorySlug(slug)) {
    return <KnowledgeCategoryPage categorySlug={slug} />;
  }

  const answer = getKnowledgeBySlug(slug);
  if (!answer) notFound();
  return <KnowledgeAnswerPage answer={answer} />;
}

function KnowledgeCategoryPage({
  categorySlug,
}: {
  categorySlug: KnowledgeCategorySlug;
}) {
  const category = getKnowledgeCategory(categorySlug);
  if (!category) notFound();
  const answers = getAnswersByCategory(categorySlug);
  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: siteConfig.name, path: "/" },
    { name: uiCopy.nav.answers, path: "/knowledge" },
    { name: category.label, path: `/knowledge/${category.slug}` },
  ]);

  return (
    <main className="px-3.5 py-5 sm:px-7 sm:py-7">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <TopBar />
      <article className="mx-auto max-w-3xl">
        <Link
          href="/knowledge"
          className="cursor-pointer text-xs font-bold uppercase tracking-wider text-blue"
        >
          ← {uiCopy.nav.answers}
        </Link>
        <h1 className="mt-4 text-3xl font-medium tracking-tight">{category.label}</h1>
        <p className="mt-3 text-sm leading-relaxed text-[#565f6b]">
          {category.description}
        </p>
        <div className="mt-6 grid items-stretch gap-3">
          {answers.map((answer) => (
            <KnowledgeCard key={answer.slug} answer={answer} />
          ))}
        </div>
      </article>
    </main>
  );
}

function KnowledgeAnswerPage({ answer }: { answer: KnowledgeAnswer }) {
  const category = getKnowledgeCategory(answer.category);
  const pagePath = `/knowledge/${answer.slug}`;
  const sameCategory = getAnswersByCategory(answer.category).filter(
    (item) => item.slug !== answer.slug,
  );
  const otherCategories = getKnowledgeCategoriesWithAnswers().filter(
    (item) => item.slug !== answer.category,
  );
  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: siteConfig.name, path: "/" },
    { name: uiCopy.nav.answers, path: "/knowledge" },
    {
      name: category?.label ?? uiCopy.nav.answers,
      path: `/knowledge/${answer.category}`,
    },
    { name: answer.title, path: pagePath },
  ]);
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: answer.title,
        acceptedAnswer: {
          "@type": "Answer",
          text: answer.shortAnswer,
        },
      },
    ],
  };

  return (
    <main className="px-3.5 py-5 sm:px-7 sm:py-7">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <TopBar />
      <article className="mx-auto max-w-3xl">
        <Link
          href={`/knowledge/${answer.category}`}
          className="cursor-pointer text-xs font-bold uppercase tracking-wider text-blue"
        >
          ← {category?.label ?? uiCopy.nav.answers}
        </Link>
        <h1 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
          {answer.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {category ? (
            <Link
              href={`/knowledge/${category.slug}`}
              className="cursor-pointer rounded-full bg-blue-soft px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue"
            >
              {category.label}
            </Link>
          ) : null}
          <p className="text-sm text-muted">
            Updated{" "}
            <time dateTime={answer.updatedAt}>{formatDate(answer.updatedAt)}</time>
          </p>
        </div>
        <KnowledgeTypedSummary key={answer.slug} text={answer.summary} />
        <KnowledgeSections content={answer.content} />
        <div className="mt-8 rounded-r-[18px] border-y border-r border-line border-l-4 border-l-blue bg-blue-soft px-4 py-4 shadow-card sm:px-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue">
            {uiCopy.knowledge.conclusion}
          </div>
          <p className="mt-2 text-base font-medium leading-[1.65] text-ink">
            {answer.shortAnswer}
          </p>
        </div>
        <KnowledgeRobots slugs={answer.robotSlugs} />
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/compare/${answer.compareSlug}`}
            className="inline-flex cursor-pointer items-center rounded-full border border-line bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#4d5662] hover:border-blue/30 hover:text-blue"
          >
            {compareLabel(answer.compareSlug)}
          </Link>
          <Link
            href={`/rankings/${answer.rankingSlug}`}
            className="inline-flex cursor-pointer items-center rounded-full border border-line bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#4d5662] hover:border-blue/30 hover:text-blue"
          >
            {getRankingBySlug(answer.rankingSlug)?.title ?? "Rankings"}
          </Link>
        </div>
        {sameCategory.length > 0 ? (
          <section className="mt-10">
            <h2 className="text-xl font-semibold tracking-tight">
              More in {category?.label}
            </h2>
            <div className="mt-4 grid gap-3">
              {sameCategory.map((item) => (
                <KnowledgeCard key={item.slug} answer={item} />
              ))}
            </div>
          </section>
        ) : null}
        {otherCategories.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-2">
            {otherCategories.map((item) => (
              <Link
                key={item.slug}
                href={`/knowledge/${item.slug}`}
                className="inline-flex cursor-pointer items-center rounded-full border border-line bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#4d5662] hover:border-blue/30 hover:text-blue"
              >
                {item.label}
              </Link>
            ))}
          </div>
        ) : null}
        <KnowledgeSources sources={answer.sources} />
      </article>
    </main>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { uiCopy } from "@/config/ui-copy";
import { buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import {
  getRankingBySlug,
  getRankings,
  robotsForRanking,
} from "@/lib/rankings";
import { TopBar } from "@/components/layout/TopBar";
import { MarkdownContent } from "@/components/update/MarkdownContent";
import { RankingTable } from "@/components/rankings/RankingTable";
import { RankingRelated } from "@/components/rankings/RankingRelated";

function splitRankingBody(content: string): { lead: string; notes: string } {
  const index = content.search(/\n## /);
  if (index === -1) return { lead: content.trim(), notes: "" };
  return {
    lead: content.slice(0, index).trim(),
    notes: content.slice(index).trim(),
  };
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getRankings().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getRankingBySlug(slug);
  if (!article) return {};

  return buildPageMetadata({
    title: `${article.title} | ${siteConfig.name}`,
    description: article.description,
    path: `/rankings/${article.slug}`,
  });
}

export default async function RankingDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = getRankingBySlug(slug);
  if (!article) notFound();

  const rankings = getRankings();
  const robots = robotsForRanking(article.list);
  const { lead, notes } = splitRankingBody(article.content);
  const pagePath = `/rankings/${article.slug}`;
  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: siteConfig.name, path: "/" },
    { name: uiCopy.nav.rankings, path: "/rankings" },
    { name: article.title, path: pagePath },
  ]);
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: article.title,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: robots.length,
    itemListElement: robots.map((robot, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: robot.name,
      url: `${siteConfig.url.replace(/\/$/, "")}/robots/${robot.slug}/`,
    })),
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <main className="px-3.5 py-5 sm:px-7 sm:py-7">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <TopBar />
      <article className="mx-auto max-w-3xl">
        <Link
          href="/rankings"
          className="cursor-pointer text-xs font-bold uppercase tracking-wider text-blue"
        >
          ← {uiCopy.nav.rankings}
        </Link>
        <h1 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
          {article.title}
        </h1>
        <p className="mt-3 text-sm text-muted">
          Updated{" "}
          <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time>
        </p>
        <MarkdownContent content={lead} />
        <RankingTable article={article} />
        {notes ? <MarkdownContent content={notes} /> : null}
        <section className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight">FAQ</h2>
          <div className="mt-4 grid gap-4">
            {article.faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-[18px] border border-line bg-panel/82 p-4 shadow-card"
              >
                <h3 className="text-base font-semibold tracking-tight">{faq.q}</h3>
                <p className="mt-2 text-[15px] leading-[1.7] text-[#4d5662]">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
        <RankingRelated article={article} rankings={rankings} />
      </article>
    </main>
  );
}

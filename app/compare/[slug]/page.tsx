import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getIndexableComparePairs,
  getRobotsBySlugs,
  isIndexableCompareSlug,
} from "@/lib/data/repository";
import {
  buildCompareMetadata,
  buildBreadcrumbJsonLd,
  buildCompareFaqJsonLd,
} from "@/lib/seo";
import {
  isValidCompareSlug,
  parseCompareSlug,
} from "@/lib/compare";
import {
  buildChooseGuidance,
  buildCompareSections,
  buildCompareFaqAnswer,
  buildCompareVerdict,
} from "@/lib/compare-summary";
import { TopBar } from "@/components/layout/TopBar";
import { CompareTable } from "@/components/robot/CompareTable";
import { CompareVerdict } from "@/components/compare/CompareVerdict";
import { CompareChooseGuide } from "@/components/compare/CompareChooseGuide";
import { uiCopy } from "@/config/ui-copy";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Prebuild relevant pairs only; other valid URLs still render on demand. */
export async function generateStaticParams() {
  return getIndexableComparePairs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  if (!isValidCompareSlug(slug)) return {};
  const robots = getRobotsBySlugs(parseCompareSlug(slug));
  if (robots.length < 2) return {};
  const sections = buildCompareSections(robots);
  const verdict = buildCompareVerdict(robots, sections);
  return buildCompareMetadata(robots, verdict.summaryForMeta, {
    indexable: isIndexableCompareSlug(slug),
  });
}

export default async function ComparePage({ params }: PageProps) {
  const { slug } = await params;
  if (!isValidCompareSlug(slug)) notFound();

  const slugs = parseCompareSlug(slug);
  const robots = getRobotsBySlugs(slugs);
  if (robots.length < 2) notFound();

  const indexable = isIndexableCompareSlug(slug);
  const sections = buildCompareSections(robots);
  const verdict = buildCompareVerdict(robots, sections);
  const guidance = buildChooseGuidance(robots);
  const winCounts = verdict.winsByRobot.map((entry) => entry.winCount);
  const faqAnswer = buildCompareFaqAnswer(robots, verdict, guidance);

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Compare", path: "/compare" },
    {
      name: robots.map((r) => r.name).join(" vs "),
      path: `/compare/${slug}`,
    },
  ]);

  const faqLd = indexable
    ? buildCompareFaqJsonLd(robots, faqAnswer)
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {faqLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      ) : null}
      <main className="px-3.5 py-5 sm:px-7 sm:py-7">
        <TopBar />
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
              {uiCopy.compare.eyebrow}
            </div>
            <h1 className="mt-1 text-2xl font-medium tracking-tight sm:text-3xl">
              {robots.map((r) => r.name).join(" vs ")}
            </h1>
          </div>
          <Link
            href="/robots"
            className="text-xs font-bold uppercase tracking-wider text-blue"
          >
            ← Back to robots
          </Link>
        </div>
        <CompareVerdict verdict={verdict} />
        <CompareChooseGuide
          robots={robots}
          guidance={guidance}
          winsByRobot={verdict.winsByRobot}
        />
        <CompareTable
          robots={robots}
          sections={sections}
          winCounts={winCounts}
        />
        <div className="mt-6 flex flex-wrap gap-3">
          {robots.map((robot) => (
            <Link
              key={robot.slug}
              href={`/robots/${robot.slug}`}
              className="text-sm font-bold uppercase tracking-wider text-blue"
            >
              View {robot.name} →
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

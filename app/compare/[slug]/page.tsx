import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getComparePairs,
  getRobotsBySlugs,
} from "@/lib/data/repository";
import {
  buildCompareMetadata,
  buildBreadcrumbJsonLd,
} from "@/lib/seo";
import {
  isValidCompareSlug,
  parseCompareSlug,
} from "@/lib/compare";
import { TopBar } from "@/components/layout/TopBar";
import { CompareTable } from "@/components/robot/CompareTable";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getComparePairs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  if (!isValidCompareSlug(slug)) return {};
  const robots = getRobotsBySlugs(parseCompareSlug(slug));
  if (robots.length < 2) return {};
  return buildCompareMetadata(robots);
}

export default async function ComparePage({ params }: PageProps) {
  const { slug } = await params;
  if (!isValidCompareSlug(slug)) notFound();

  const slugs = parseCompareSlug(slug);
  const robots = getRobotsBySlugs(slugs);
  if (robots.length < 2) notFound();

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Compare", path: "/compare" },
    {
      name: robots.map((r) => r.name).join(" vs "),
      path: `/compare/${slug}`,
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <main className="px-3.5 py-5 sm:px-7 sm:py-7">
        <TopBar />
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
              Compare
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
        <CompareTable robots={robots} />
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

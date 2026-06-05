import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllUpdateSlugs,
  getRobotBySlug,
  getUpdateBySlug,
} from "@/lib/data/repository";
import { buildUpdateMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { UPDATE_TYPE_LABELS } from "@/types/update";
import { TopBar } from "@/components/layout/TopBar";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllUpdateSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const update = getUpdateBySlug(slug);
  if (!update) return {};
  return buildUpdateMetadata(update);
}

export default async function UpdateDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const update = getUpdateBySlug(slug);
  if (!update) notFound();

  const robot = update.robotSlug ? getRobotBySlug(update.robotSlug) : null;
  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Updates", path: "/updates" },
    { name: update.title, path: `/updates/${update.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <main className="px-3.5 py-5 sm:px-7 sm:py-7">
        <TopBar />
        <article className="mx-auto max-w-3xl">
          <Link
            href="/updates"
            className="text-xs font-bold uppercase tracking-wider text-blue"
          >
            ← All updates
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="rounded-lg bg-blue-soft px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-blue">
              {UPDATE_TYPE_LABELS[update.type]}
            </span>
            <span className="text-sm text-muted">
              {formatDate(update.createdAt)}
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
            {update.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-[#565f6b]">
            {update.summary}
          </p>
          <div className="prose prose-sm mt-8 max-w-none">
            <p className="text-[15px] leading-[1.7] text-[#4d5662]">
              {update.content}
            </p>
          </div>
          {robot && (
            <Link
              href={`/robots/${robot.slug}`}
              className="mt-8 inline-flex rounded-xl border border-line bg-panel-strong px-5 py-3 text-sm font-bold uppercase tracking-wider shadow-card hover:border-blue/30"
            >
              View {robot.name} →
            </Link>
          )}
          {update.sourceUrl && (
            <p className="mt-6 text-sm">
              Source:{" "}
              <a
                href={update.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue hover:underline"
              >
                {update.sourceUrl}
              </a>
            </p>
          )}
        </article>
      </main>
    </>
  );
}

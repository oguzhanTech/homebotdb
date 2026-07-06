import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo";
import {
  getCategoryLockedFilters,
  getCategoryRobotCount,
  getCategorySearchParams,
  type RobotCategoryHub,
} from "@/lib/robot-categories";
import { TopBar } from "@/components/layout/TopBar";
import { RobotMatrixSection } from "@/components/robot/RobotMatrixSection";
import { buildBreadcrumbJsonLd } from "@/lib/seo";

interface PageProps {
  category: RobotCategoryHub;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export function buildCategoryPageMetadata(
  category: RobotCategoryHub,
): ReturnType<typeof buildPageMetadata> {
  const count = getCategoryRobotCount(category);

  return buildPageMetadata({
    title: `${category.title} Robots — ${siteConfig.name}`,
    description: `${category.description} Browse ${count} tracked ${category.title.toLowerCase()} robots with specs, readiness scores, and availability.`,
    path: `/robots/${category.slug}`,
  });
}

export async function RobotCategoryLanding({
  category,
  searchParams,
}: PageProps) {
  const count = getCategoryRobotCount(category);
  const lockedFilters = getCategoryLockedFilters(category);
  const defaultParams = getCategorySearchParams(category);

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Robots", path: "/robots" },
    { name: category.title, path: `/robots/${category.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <main className="min-w-0 px-3.5 py-5 sm:px-7 sm:py-7">
        <TopBar />

        <section className="mb-6">
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Robot category
          </div>
          <h1 className="mt-1 text-3xl font-medium tracking-tight sm:text-4xl">
            {category.title}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#565f6b]">
            {category.description} Compare specs, readiness scores, and
            availability across {count} tracked units in this segment.
          </p>
        </section>

        <RobotMatrixSection
          listingPath={`/robots/${category.slug}`}
          searchParams={searchParams}
          lockedFilters={lockedFilters}
          defaultSearchParams={defaultParams}
          showBrandInTable
        />
      </main>
    </>
  );
}

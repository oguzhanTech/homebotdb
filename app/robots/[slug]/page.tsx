import { notFound } from "next/navigation";
import {
  getAllRobotSlugs,
  getRobotBySlug,
  getSimilarRobots,
  getUpdatesByRobotSlug,
} from "@/lib/data/repository";
import {
  buildBreadcrumbJsonLd,
  buildRobotJsonLd,
  buildRobotMetadata,
} from "@/lib/seo";
import {
  getAllCategorySlugs,
  getRobotCategoryBySlug,
} from "@/lib/robot-categories";
import { TopBar } from "@/components/layout/TopBar";
import { CommentSection } from "@/components/comments/CommentSection";
import { RobotDetailView } from "@/components/robot/RobotDetailView";
import {
  buildCategoryPageMetadata,
  RobotCategoryLanding,
} from "@/components/robot/RobotCategoryLanding";
import { listComments } from "@/lib/data/comments";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateStaticParams() {
  return [
    ...getAllRobotSlugs().map((slug) => ({ slug })),
    ...getAllCategorySlugs().map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const category = getRobotCategoryBySlug(slug);
  if (category) return buildCategoryPageMetadata(category);

  const robot = getRobotBySlug(slug);
  if (!robot) return {};
  return buildRobotMetadata(robot);
}

export default async function RobotSlugPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const category = getRobotCategoryBySlug(slug);

  if (category) {
    return (
      <RobotCategoryLanding category={category} searchParams={searchParams} />
    );
  }

  const robot = getRobotBySlug(slug);
  if (!robot) notFound();

  const similarRobots = getSimilarRobots(robot);
  const updates = getUpdatesByRobotSlug(slug, 5);
  const comments = await listComments("robot", slug);
  const jsonLd = buildRobotJsonLd(robot);
  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: robot.name, path: `/robots/${robot.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <main className="px-3.5 py-5 sm:px-7 sm:py-7">
        <TopBar />
        <RobotDetailView
          robot={robot}
          similarRobots={similarRobots}
          updates={updates}
          reviewCount={comments.length}
          reviewsSection={
            <CommentSection
              target={{ type: "robot", slug: robot.slug }}
              pageTitle={robot.name}
              pageDescription={robot.shortDescription}
              pagePath={`/robots/${robot.slug}`}
              comments={comments}
            />
          }
        />
      </main>
    </>
  );
}

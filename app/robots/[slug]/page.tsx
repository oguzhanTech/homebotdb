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
import { TopBar } from "@/components/layout/TopBar";
import { RobotDetailView } from "@/components/robot/RobotDetailView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllRobotSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const robot = getRobotBySlug(slug);
  if (!robot) return {};
  return buildRobotMetadata(robot);
}

export default async function RobotDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const robot = getRobotBySlug(slug);
  if (!robot) notFound();

  const similarRobots = getSimilarRobots(robot);
  const updates = getUpdatesByRobotSlug(slug, 5);
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
        />
      </main>
    </>
  );
}

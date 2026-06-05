import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo";
import { getAllRobotSlugs, getRobotBySlug } from "@/lib/data/repository";
import { RobotForm } from "@/components/admin/RobotForm";

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
  return buildPageMetadata({
    title: `Edit ${robot.name} — Admin — ${siteConfig.name}`,
    description: `Edit robot data for ${robot.name}.`,
    path: `/admin/robots/${slug}/edit`,
  });
}

export default async function AdminEditRobotPage({ params }: PageProps) {
  const { slug } = await params;
  const robot = getRobotBySlug(slug);
  if (!robot) notFound();

  return (
    <main className="px-3.5 py-5 sm:px-7 sm:py-7">
      <Link href="/admin/robots" className="text-xs font-bold uppercase tracking-wider text-blue">
        ← Robots
      </Link>
      <div className="mx-auto mt-6 max-w-3xl">
        <RobotForm initial={robot} title={`Edit ${robot.name}`} />
      </div>
    </main>
  );
}

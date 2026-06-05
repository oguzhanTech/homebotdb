import Link from "next/link";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo";
import { getAllRobotSlugs, getRobotBySlug } from "@/lib/data/repository";
import { PriceHistoryForm } from "@/components/admin/PriceHistoryForm";

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
    title: `Price History — ${robot.name} — Admin`,
    description: `Manage price history for ${robot.name}.`,
    path: `/admin/robots/${slug}/price-history`,
  });
}

export default async function AdminPriceHistoryPage({ params }: PageProps) {
  const { slug } = await params;
  const robot = getRobotBySlug(slug);
  if (!robot) notFound();

  return (
    <main className="px-3.5 py-5 sm:px-7 sm:py-7">
      <Link
        href={`/admin/robots/${slug}/edit`}
        className="text-xs font-bold uppercase tracking-wider text-blue"
      >
        ← Edit robot
      </Link>
      <div className="mx-auto mt-6 max-w-2xl">
        <PriceHistoryForm robot={robot} />
      </div>
    </main>
  );
}

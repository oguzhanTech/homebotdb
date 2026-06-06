import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo";
import { getUpdateBySlug } from "@/lib/data/repository";
import { UpdateForm } from "@/components/admin/UpdateForm";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const update = getUpdateBySlug(slug);
  if (!update) return {};
  return buildPageMetadata({
    title: `Edit update — ${update.title} — Admin — ${siteConfig.name}`,
    description: "Edit a robot update or news entry.",
    path: `/admin/updates/${slug}/edit`,
  });
}

export default async function AdminEditUpdatePage({ params }: PageProps) {
  const { slug } = await params;
  const update = getUpdateBySlug(slug);
  if (!update) notFound();

  return (
    <main className="px-3.5 py-5 sm:px-7 sm:py-7">
      <Link href="/admin/updates" className="text-xs font-bold uppercase tracking-wider text-blue">
        ← Updates
      </Link>
      <div className="mx-auto mt-6 max-w-2xl">
        <UpdateForm initial={update} title={`Edit: ${update.title}`} />
      </div>
    </main>
  );
}

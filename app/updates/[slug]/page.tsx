import { notFound, redirect } from "next/navigation";
import {
  getAllDataUpdateSlugs,
  getUpdateBySlug,
} from "@/lib/data/repository";
import { buildUpdateMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";
import { getUpdatePublicPath } from "@/lib/update-paths";
import { isNewsUpdate } from "@/types/update";
import { TopBar } from "@/components/layout/TopBar";
import { UpdateDetailArticle } from "@/components/update/UpdateDetailArticle";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllDataUpdateSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const update = getUpdateBySlug(slug);
  if (!update || isNewsUpdate(update.type)) return {};
  return buildUpdateMetadata(update);
}

export default async function UpdateDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const update = getUpdateBySlug(slug);
  if (!update) notFound();

  if (isNewsUpdate(update.type)) {
    redirect(getUpdatePublicPath(update));
  }

  const publicPath = getUpdatePublicPath(update);
  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Updates", path: "/updates" },
    { name: update.title, path: publicPath },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <main className="px-3.5 py-5 sm:px-7 sm:py-7">
        <TopBar />
        <UpdateDetailArticle update={update} />
      </main>
    </>
  );
}

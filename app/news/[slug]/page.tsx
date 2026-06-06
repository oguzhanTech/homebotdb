import { notFound } from "next/navigation";
import {
  getAllNewsSlugs,
  getUpdateBySlug,
} from "@/lib/data/repository";
import { buildUpdateMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";
import { getUpdatePublicPath } from "@/lib/update-paths";
import { isNewsUpdate } from "@/types/update";
import { TopBar } from "@/components/layout/TopBar";
import { UpdateDetailArticle } from "@/components/update/UpdateDetailArticle";
import { listComments } from "@/lib/data/comments";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllNewsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const update = getUpdateBySlug(slug);
  if (!update || !isNewsUpdate(update.type)) return {};
  return buildUpdateMetadata(update);
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const update = getUpdateBySlug(slug);
  if (!update || !isNewsUpdate(update.type)) notFound();

  const publicPath = getUpdatePublicPath(update);
  const comments = await listComments("news", slug);
  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "News", path: "/news" },
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
        <UpdateDetailArticle update={update} comments={comments} />
      </main>
    </>
  );
}

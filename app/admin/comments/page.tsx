import Link from "next/link";
import { siteConfig } from "@/config/site";
import { CommentModerationList } from "@/components/admin/CommentModerationList";
import { listAllComments } from "@/lib/data/comments";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: `Comments — Admin — ${siteConfig.name}`,
  description: "Moderate community comments on robots and news.",
  path: "/admin/comments",
});

export default async function AdminCommentsPage() {
  const comments = await listAllComments();

  return (
    <main className="px-3.5 py-5 sm:px-7 sm:py-7">
      <Link href="/admin" className="text-xs font-bold uppercase tracking-wider text-blue">
        ← Admin
      </Link>
      <div className="mb-6 mt-4">
        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
          Admin
        </div>
        <h1 className="mt-1 text-3xl font-medium tracking-tight">Comments</h1>
        <p className="mt-2 text-sm text-[#565f6b]">
          Delete spam or test posts here. Replies are removed when you delete a parent
          comment. Public pages refresh after each delete.
        </p>
      </div>

      <CommentModerationList comments={comments} />
    </main>
  );
}

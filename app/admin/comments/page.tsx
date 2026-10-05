import Link from "next/link";
import { siteConfig } from "@/config/site";
import { CommentModerationList } from "@/components/admin/CommentModerationList";
import { listAllComments } from "@/lib/data/comments";
import { buildPageMetadata } from "@/lib/seo";
import type { Comment } from "@/types/comment";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: `Comments — Admin — ${siteConfig.name}`,
  description: "Moderate community comments on robots and news.",
  path: "/admin/comments",
});

export default async function AdminCommentsPage() {
  let comments: Comment[] = [];
  let unavailable = false;

  try {
    comments = await listAllComments();
  } catch (error) {
    unavailable = true;
    console.error(error instanceof Error ? error.message : "Failed to load comments");
  }

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

      {unavailable ? (
        <p className="text-sm text-muted">
          Comments could not be loaded. Supabase did not respond. Try again in a moment.
        </p>
      ) : (
        <CommentModerationList comments={comments} />
      )}
    </main>
  );
}

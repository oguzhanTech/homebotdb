import type { Comment, CommentTarget } from "@/types/comment";
import { groupCommentsByThread } from "@/lib/data/comments";
import { buildDiscussionJsonLd } from "@/lib/seo";
import { CommentForm } from "@/components/comments/CommentForm";
import { CommentArticle } from "@/components/comments/CommentItem";

export function CommentSection({
  target,
  pageTitle,
  pageDescription,
  pagePath,
  comments,
  heading = "Comments",
}: {
  target: CommentTarget;
  pageTitle: string;
  pageDescription: string;
  pagePath: string;
  comments: Comment[];
  heading?: string;
}) {
  const { topLevel, repliesByParent } = groupCommentsByThread(comments);
  const jsonLd = buildDiscussionJsonLd({
    target,
    pagePath,
    pageTitle,
    pageDescription,
    comments,
  });

  return (
    <section id="comments" aria-labelledby="comments-heading" className="min-w-0 scroll-mt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="comments-heading" className="text-lg font-bold tracking-tight">
          {heading}
        </h2>
        <p className="text-sm text-muted">
          {comments.length === 0
            ? "No comments yet"
            : `${comments.length} comment${comments.length === 1 ? "" : "s"}`}
        </p>
      </div>

      {topLevel.length > 0 ? (
        <ol className="mt-6 grid gap-4" aria-label="Comment thread">
          {topLevel.map((comment) => (
            <li key={comment.id} className="min-w-0">
              <CommentArticle
                comment={comment}
                replies={repliesByParent.get(comment.id) ?? []}
                target={target}
              />
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-6 rounded-[18px] border border-dashed border-line px-4 py-8 text-center text-sm text-muted">
          Be the first to share a question or hands-on note.
        </p>
      )}

      <div className="mt-6 border-t border-line pt-6">
        <CommentForm target={target} />
      </div>
    </section>
  );
}

import type { Comment, CommentTarget } from "@/types/comment";
import { buildDiscussionJsonLd } from "@/lib/seo";
import { uiCopy } from "@/config/ui-copy";
import { CommentThread } from "@/components/comments/CommentThread";

export function CommentSection({
  target,
  pageTitle,
  pageDescription,
  pagePath,
  comments,
  heading = uiCopy.comments.fieldReports,
}: {
  target: CommentTarget;
  pageTitle: string;
  pageDescription: string;
  pagePath: string;
  comments: Comment[];
  heading?: string;
}) {
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

      <CommentThread
        initialComments={comments}
        target={target}
        pagePath={pagePath}
        heading={heading}
      />
    </section>
  );
}

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
}: {
  target: CommentTarget;
  pageTitle: string;
  pageDescription: string;
  pagePath: string;
  comments: Comment[];
}) {
  const sectionLabel =
    target.type === "news" ? "Comments" : uiCopy.robot.tabs.fieldReports;
  const jsonLd = buildDiscussionJsonLd({
    target,
    pagePath,
    pageTitle,
    pageDescription,
    comments,
  });

  return (
    <section
      id="comments"
      aria-label={sectionLabel}
      className="min-w-0 scroll-mt-24"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <CommentThread
        initialComments={comments}
        target={target}
        pagePath={pagePath}
      />
    </section>
  );
}

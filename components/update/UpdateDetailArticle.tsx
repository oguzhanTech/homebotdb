import Link from "next/link";
import type { Update } from "@/types/update";
import { UPDATE_TYPE_LABELS, isNewsUpdate } from "@/types/update";
import { getRobotBySlug } from "@/lib/data/repository";
import { getEditorById } from "@/lib/editors";
import { getUpdateCoverImage } from "@/lib/update-images";
import { getUpdatePublicPath } from "@/lib/update-paths";
import { formatUpdateReadingTime } from "@/lib/reading-time";
import { formatDate } from "@/lib/utils";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { AuthorCard } from "@/components/update/AuthorCard";
import { MarkdownContent } from "@/components/update/MarkdownContent";
import { UpdateContent } from "@/components/update/UpdateContent";
import { ShareButtons } from "@/components/update/ShareButtons";
import { SourceLink } from "@/components/update/SourceLink";
import { UpdateExploreMore } from "@/components/update/UpdateExploreMore";
import { WasThisHelpful } from "@/components/update/WasThisHelpful";
import { CommentSection } from "@/components/comments/CommentSection";
import { uiCopy } from "@/config/ui-copy";
import type { Comment } from "@/types/comment";

export function UpdateDetailArticle({
  update,
  comments = [],
}: {
  update: Update;
  comments?: Comment[];
}) {
  const editor = getEditorById(update.authorId);
  const robot = update.robotSlug ? getRobotBySlug(update.robotSlug) : null;
  const isNews = isNewsUpdate(update.type);
  const listHref = isNews ? "/news" : "/updates";
  const listLabel = isNews ? uiCopy.nav.news : uiCopy.nav.radarFeed;
  const publicPath = getUpdatePublicPath(update);
  const coverImage = getUpdateCoverImage(update);

  return (
    <article className="mx-auto max-w-3xl">
      <Link
        href={listHref}
        className="text-xs font-bold uppercase tracking-wider text-blue"
      >
        ← {listLabel}
      </Link>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="rounded-lg bg-blue-soft px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-blue">
          {UPDATE_TYPE_LABELS[update.type]}
        </span>
        <span className="text-sm text-muted">{formatDate(update.createdAt)}</span>
        {isNews ? (
          <span className="text-sm text-muted">
            · {formatUpdateReadingTime(update)}
          </span>
        ) : null}
        <span className="text-sm text-muted">· {editor.name}</span>
        {robot ? (
          <BrandLogo
            brand={robot.brand}
            size="sm"
            showName
            nameClassName="text-sm font-bold uppercase tracking-wider text-muted"
          />
        ) : null}
      </div>
      <h1 className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl">
        {update.title}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-[#565f6b]">
        {update.summary}
      </p>

      {coverImage ? (
        <figure className="mt-6">
          <div className="overflow-hidden rounded-[18px] border border-line bg-panel-strong shadow-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverImage}
              alt=""
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
          {update.coverImageCaption ? (
            <figcaption className="news-image-caption">{update.coverImageCaption}</figcaption>
          ) : null}
        </figure>
      ) : null}

      {isNews ? (
        <ShareButtons title={update.title} path={publicPath} className="mt-6" />
      ) : null}

      {isNews ? (
        <MarkdownContent content={update.content} />
      ) : (
        <UpdateContent content={update.content} />
      )}

      {robot && (
        <Link
          href={`/robots/${robot.slug}`}
          className="mt-8 inline-flex items-center gap-3 rounded-xl border border-line bg-panel-strong px-5 py-3 text-sm font-bold uppercase tracking-wider shadow-card hover:border-blue/30"
        >
          <BrandLogo brand={robot.brand} size="md" />
          View {robot.name}
        </Link>
      )}

      {update.sourceUrl ? <SourceLink url={update.sourceUrl} /> : null}

      <div className="mt-8 grid gap-4">
        <WasThisHelpful updateSlug={update.slug} />
        <UpdateExploreMore update={update} />
        <AuthorCard authorId={update.authorId} updateType={update.type} />
      </div>

      {isNews ? (
        <div className="mt-10 border-t border-line pt-10">
          <CommentSection
            target={{ type: "news", slug: update.slug }}
            pageTitle={update.title}
            pageDescription={update.summary}
            pagePath={publicPath}
            comments={comments}
          />
        </div>
      ) : null}
    </article>
  );
}

import Link from "next/link";
import type { Update } from "@/types/update";
import { UPDATE_TYPE_LABELS, isNewsUpdate } from "@/types/update";
import { siteConfig } from "@/config/site";
import { getRobotBySlug } from "@/lib/data/repository";
import { getEditorById } from "@/lib/editors";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { formatDate } from "@/lib/utils";

export function UpdateCard({
  update,
  readLabel = "Read update",
  showAuthor = true,
}: {
  update: Update;
  readLabel?: string;
  showAuthor?: boolean;
}) {
  const robot = update.robotSlug ? getRobotBySlug(update.robotSlug) : null;
  const editor = showAuthor ? getEditorById(update.authorId) : null;

  return (
    <Link
      href={`/updates/${update.slug}`}
      className="group block cursor-pointer rounded-[18px] border border-line bg-panel/82 p-5 shadow-card transition-colors hover:border-blue/30"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue">
          {UPDATE_TYPE_LABELS[update.type]}
        </span>
        <span className="shrink-0 text-[11px] text-muted">
          {formatDate(update.createdAt)}
        </span>
      </div>

      <div className="flex items-start gap-4">
        {robot ? (
          <BrandLogo brand={robot.brand} size="md" className="shrink-0" />
        ) : (
          <div
            aria-hidden
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-panel-strong font-mono text-[10px] font-bold uppercase tracking-wider text-muted"
          >
            {siteConfig.shortName}
          </div>
        )}

        <div className="min-w-0 flex-1">
          {showAuthor && editor ? (
            <div className="mb-2 text-[11px] text-muted">{editor.name}</div>
          ) : null}

          <h3 className="font-semibold tracking-tight">{update.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#565f6b]">
            {update.summary}
          </p>

          {robot ? (
            <div className="mt-3 text-xs font-bold uppercase tracking-wider text-muted">
              {robot.name}
            </div>
          ) : null}

          <span className="mt-3 inline-block text-xs font-bold uppercase tracking-wider text-muted">
            {readLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function NewsCard({
  update,
  showAuthor = true,
}: {
  update: Update;
  showAuthor?: boolean;
}) {
  const editor = showAuthor ? getEditorById(update.authorId) : null;

  return (
    <Link
      href={`/updates/${update.slug}`}
      className="group block cursor-pointer rounded-[18px] border border-line bg-panel/82 p-5 shadow-card transition-colors hover:border-blue/30"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue">
          {UPDATE_TYPE_LABELS[update.type]}
        </span>
        <span className="shrink-0 text-[11px] text-muted">
          {formatDate(update.createdAt)}
        </span>
      </div>

      {showAuthor && editor ? (
        <div className="mt-2 text-[11px] text-muted">{editor.name}</div>
      ) : null}

      <h3 className="mt-2 font-semibold tracking-tight">{update.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#565f6b]">
        {update.summary}
      </p>

      <span className="mt-3 inline-block text-xs font-bold uppercase tracking-wider text-muted">
        Read news
      </span>
    </Link>
  );
}

export function UpdatesSection({
  title,
  updates,
  viewAllHref = "/updates",
  heading = "Stay current",
  emptyMessage = "No updates yet.",
}: {
  title: string;
  updates: Update[];
  viewAllHref?: string;
  heading?: string;
  emptyMessage?: string;
}) {
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            {title}
          </div>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">{heading}</h2>
        </div>
        <Link
          href={viewAllHref}
          className="text-xs font-bold uppercase tracking-wider text-blue"
        >
          View all
        </Link>
      </div>
      {updates.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {updates.map((update) => (
            <UpdateCard key={update.id} update={update} showAuthor={false} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">{emptyMessage}</p>
      )}
    </section>
  );
}

export function NewsSection({
  title = "Robot news",
  updates,
  viewAllHref = "/news",
  heading = "Latest headlines",
}: {
  title?: string;
  updates: Update[];
  viewAllHref?: string;
  heading?: string;
}) {
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            {title}
          </div>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">{heading}</h2>
        </div>
        <Link
          href={viewAllHref}
          className="text-xs font-bold uppercase tracking-wider text-blue"
        >
          View all
        </Link>
      </div>
      {updates.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {updates.map((update) => (
            <NewsCard key={update.id} update={update} showAuthor={false} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">No news yet.</p>
      )}
    </section>
  );
}

export function splitUpdatesByKind(updates: Update[]): {
  dataUpdates: Update[];
  news: Update[];
} {
  return {
    dataUpdates: updates.filter((update) => !isNewsUpdate(update.type)),
    news: updates.filter((update) => isNewsUpdate(update.type)),
  };
}

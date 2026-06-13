import Link from "next/link";
import type { Update } from "@/types/update";
import { uiCopy } from "@/config/ui-copy";
import { UPDATE_TYPE_LABELS, isNewsUpdate } from "@/types/update";
import { getRobotBySlug } from "@/lib/data/repository";
import { getEditorById } from "@/lib/editors";
import { getUpdatePublicPath } from "@/lib/update-paths";
import { formatUpdateReadingTime } from "@/lib/reading-time";
import { getPrimaryRobotImage } from "@/lib/robot-images";
import { getUpdateCoverImage } from "@/lib/update-images";
import { SiteMark } from "@/components/brand/SiteMark";
import { RobotAvatar } from "@/components/robot/RobotAvatar";
import { NewsCoverThumb } from "@/components/update/NewsCoverThumb";
import { formatDate } from "@/lib/utils";

export function UpdateCard({
  update,
  readLabel = uiCopy.updates.readUpdate,
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
      href={getUpdatePublicPath(update)}
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
          <RobotAvatar
            name={robot.name}
            imageUrl={getPrimaryRobotImage(robot)}
            size="card"
            showRings={false}
            className="shrink-0"
          />
        ) : (
          <SiteMark size="card" />
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
  compact = false,
}: {
  update: Update;
  showAuthor?: boolean;
  /** Tighter copy for multi-column grids (e.g. 4-up on the homepage). */
  compact?: boolean;
}) {
  const editor = showAuthor ? getEditorById(update.authorId) : null;
  const coverImage = getUpdateCoverImage(update);

  return (
    <Link
      href={getUpdatePublicPath(update)}
      className="group block cursor-pointer rounded-[18px] border border-line bg-panel/82 p-4 shadow-card transition-colors hover:border-blue/30"
    >
      <NewsCoverThumb
        src={coverImage}
        alt={update.title}
        variant="banner"
        className="mb-3"
      />

      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue">
          {UPDATE_TYPE_LABELS[update.type]}
        </span>
        <span className="shrink-0 text-[10px] text-muted sm:text-[11px]">
          {formatDate(update.createdAt)}
        </span>
      </div>

      {showAuthor && editor ? (
        <div className="mt-1.5 text-[11px] text-muted">{editor.name}</div>
      ) : null}

      <h3
        className={
          compact
            ? "mt-2 line-clamp-2 text-sm font-semibold leading-snug tracking-tight"
            : "mt-2 font-semibold tracking-tight"
        }
      >
        {update.title}
      </h3>
      <p
        className={
          compact
            ? "mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#565f6b]"
            : "mt-2 line-clamp-2 text-sm leading-relaxed text-[#565f6b]"
        }
      >
        {update.summary}
      </p>

      <div className="mt-2.5 flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted sm:text-[11px]">
          {uiCopy.updates.readStory}
        </span>
        <span className="shrink-0 text-[10px] font-medium text-muted sm:text-[11px]">
          {formatUpdateReadingTime(update)}
        </span>
      </div>
    </Link>
  );
}

export function UpdatesSection({
  title,
  updates,
  viewAllHref = "/updates",
  heading = uiCopy.homepage.stayOnRadar,
  emptyMessage = uiCopy.updates.noUpdatesYet,
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
          {uiCopy.updates.viewAll}
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
  title = uiCopy.homepage.newsEyebrow,
  updates,
  viewAllHref = "/news",
  heading = uiCopy.homepage.latestRobotNews,
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
          {uiCopy.updates.viewAll}
        </Link>
      </div>
      {updates.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {updates.map((update) => (
            <NewsCard key={update.id} update={update} showAuthor={false} compact />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">{uiCopy.updates.noNewsYet}</p>
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

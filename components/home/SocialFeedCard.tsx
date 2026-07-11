import Link from "next/link";
import type { SocialFeedItem } from "@/types/social-feed";
import { uiCopy } from "@/config/ui-copy";
import { buildCompareSlug } from "@/lib/compare";
import { getRobotBySlug } from "@/lib/data/repository";
import { formatDate } from "@/lib/utils";
import { SocialFeedEmbed } from "@/components/home/SocialFeedEmbed";

export function SocialFeedCard({ item }: { item: SocialFeedItem }) {
  const robot = item.robotSlug ? getRobotBySlug(item.robotSlug) : null;
  const compareHref = item.compareSlugs
    ? `/compare/${buildCompareSlug(item.compareSlugs)}`
    : null;

  return (
    <article className="flex h-full w-full min-w-0 flex-col overflow-hidden rounded-[18px] border border-line bg-panel/82 shadow-card">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-line/80 px-4 py-3">
        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue">
            @{item.handle}
          </div>
          <div className="truncate text-[11px] text-muted">{item.brandLabel}</div>
        </div>
        <time
          dateTime={item.publishedAt}
          className="shrink-0 text-[10px] text-muted"
        >
          {formatDate(item.publishedAt)}
        </time>
      </div>

      <SocialFeedEmbed
        url={item.tweetUrl}
        title={`${item.brandLabel} on X`}
      />

      <div className="flex min-h-[7.5rem] flex-1 flex-col px-4 py-3.5">
        <p className="line-clamp-3 text-sm leading-relaxed text-[#565f6b]">
          {item.summary}
        </p>

        <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1.5 pt-3 text-[10px] font-bold uppercase tracking-wider">
          {robot ? (
            <Link
              href={`/robots/${robot.slug}`}
              className="cursor-pointer text-blue transition-colors hover:text-ink"
            >
              {uiCopy.homepage.socialFeed.viewRobot}
            </Link>
          ) : null}

          {item.newsSlug ? (
            <Link
              href={`/news/${item.newsSlug}`}
              className="cursor-pointer text-blue transition-colors hover:text-ink"
            >
              {uiCopy.homepage.socialFeed.readStory}
            </Link>
          ) : null}

          {compareHref ? (
            <Link
              href={compareHref}
              className="cursor-pointer text-muted transition-colors hover:text-blue"
            >
              {uiCopy.homepage.socialFeed.compare}
            </Link>
          ) : null}

          <a
            href={item.tweetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer text-muted transition-colors hover:text-blue"
          >
            {uiCopy.homepage.socialFeed.openPost}
          </a>
        </div>
      </div>
    </article>
  );
}

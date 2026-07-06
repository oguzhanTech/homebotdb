import Link from "next/link";
import type { CatalogAddition } from "@/lib/data/repository";
import { getPrimaryRobotImage } from "@/lib/robot-images";
import { uiCopy } from "@/config/ui-copy";
import { MonoValue } from "@/components/ui/DataValue";
import { dashboardPanelClassName } from "@/components/home/PopularTodaySection";
import { cn } from "@/lib/utils";

function formatAddedDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function LatestCatalogRobots({
  additions,
  className,
}: {
  additions: CatalogAddition[];
  className?: string;
}) {
  if (additions.length === 0) return null;

  return (
    <section
      className={cn(
        "flex h-full flex-col",
        dashboardPanelClassName,
        className,
      )}
    >
      <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
        {uiCopy.homepage.dashboard.latestAdded}
      </div>

      <ul className="mt-2.5 space-y-0.5 lg:space-y-1">
        {additions.map(({ robot, addedAt }, index) => {
          const imageUrl = getPrimaryRobotImage(robot);

          return (
            <li
              key={robot.slug}
              className={cn(index >= 3 && "hidden lg:block")}
            >
              <Link
                href={`/robots/${robot.slug}`}
                className="group flex items-center gap-2.5 rounded-lg border border-transparent px-1.5 py-1.5 transition-colors hover:border-line hover:bg-panel-strong lg:gap-3 lg:px-2 lg:py-2"
              >
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-line/60 bg-bg lg:h-11 lg:w-11">
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt=""
                      className="h-full w-full object-cover object-bottom"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-muted lg:text-[11px]">
                      {robot.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium text-ink group-hover:text-blue lg:text-[14px]">
                    {robot.name}
                  </div>
                  <div className="text-[11px] text-muted lg:text-[12px]">
                    {formatAddedDate(addedAt)}
                  </div>
                </div>
                <MonoValue className="shrink-0 text-[12px] lg:text-[13px]">
                  {robot.readinessScore}
                </MonoValue>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

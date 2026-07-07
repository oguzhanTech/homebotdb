import Link from "next/link";
import type { Robot } from "@/types/robot";
import {
  PRIMARY_TASK_LABELS,
  ROBOT_TYPE_LABELS,
} from "@/types/robot";
import { getPopularRobotsToday } from "@/lib/popular-robots";
import { getRobotHeroStatusLabel } from "@/lib/robot-status";
import { getPrimaryRobotImage } from "@/lib/robot-images";
import { uiCopy } from "@/config/ui-copy";
import { MonoValue } from "@/components/ui/DataValue";
import { cn } from "@/lib/utils";

const dashboardPanelClassName =
  "min-w-0 rounded-[16px] border border-line bg-panel/82 p-3.5 shadow-card backdrop-blur-[18px]";

function PopularProfileCard({ robot }: { robot: Robot }) {
  const imageUrl = getPrimaryRobotImage(robot);
  const status = getRobotHeroStatusLabel(robot);

  return (
    <Link
      href={`/robots/${robot.slug}`}
      className="group flex h-full min-h-[148px] flex-col overflow-hidden rounded-[14px] border border-line bg-panel-strong shadow-card transition-[border-color,box-shadow] hover:border-blue/25 hover:shadow-[0_12px_32px_rgba(18,100,255,0.08)]"
    >
      <div
        className="h-14 shrink-0 bg-gradient-to-r from-blue-soft via-panel-strong to-blue-soft/40"
        aria-hidden
      />
      <div className="flex flex-1 flex-col px-3.5 pb-3.5">
        <div className="-mt-8 flex flex-col items-center text-center">
          <div className="h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-full border-2 border-panel-strong bg-bg shadow-card">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt=""
                className="h-full w-full object-cover object-bottom"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-soft text-[11px] font-bold text-muted">
                {robot.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div className="mt-2 w-full">
            <div className="text-[14px] font-semibold leading-snug tracking-tight text-ink break-words group-hover:text-blue">
              {robot.name}
            </div>
            <div className="mt-0.5 text-[12px] text-muted">{robot.brand}</div>
          </div>
        </div>

        <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-line/80 pt-3 text-[11px]">
          <div>
            <dt className="text-muted">Readiness</dt>
            <dd className="mt-0.5">
              <MonoValue className="text-[11px] text-ink">
                {robot.readinessScore}/100
              </MonoValue>
            </dd>
          </div>
          <div>
            <dt className="text-muted">Reality</dt>
            <dd className="mt-0.5 font-mono text-ink">{robot.realityScore}/100</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-muted">Price</dt>
            <dd className="mt-0.5 truncate font-medium text-ink">{robot.price}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-muted">Status</dt>
            <dd className="mt-0.5 truncate text-ink">{status}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-muted">Form</dt>
            <dd className="mt-0.5 truncate text-ink">
              {ROBOT_TYPE_LABELS[robot.type]}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-muted">Task</dt>
            <dd className="mt-0.5 truncate text-ink">
              {PRIMARY_TASK_LABELS[robot.primaryTask]}
            </dd>
          </div>
        </dl>
      </div>
    </Link>
  );
}

export function PopularTodaySection({
  robots,
  className,
}: {
  robots: Robot[];
  className?: string;
}) {
  const popular = getPopularRobotsToday(robots, 3);
  if (popular.length === 0) return null;

  return (
    <section
      className={cn(
        "flex h-full flex-col",
        dashboardPanelClassName,
        className,
      )}
    >
      <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
        {uiCopy.homepage.dashboard.popularToday}
      </div>
      <div className="mt-2.5 grid flex-1 grid-cols-1 gap-2.5 sm:grid-cols-3">
        {popular.map((robot) => (
          <PopularProfileCard key={robot.slug} robot={robot} />
        ))}
      </div>
    </section>
  );
}

export { dashboardPanelClassName };

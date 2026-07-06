import Link from "next/link";
import {
  getCategoryRobotCount,
  ROBOT_CATEGORY_HUBS,
} from "@/lib/robot-categories";
import { uiCopy } from "@/config/ui-copy";

export function CategoryHubGrid() {
  return (
    <section className="min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
          {uiCopy.homepage.dashboard.browseByMission}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/robots"
            className="text-[13px] font-medium text-blue hover:underline"
          >
            {uiCopy.homepage.dashboard.openFullMatrix} →
          </Link>
          <Link
            href="/compare"
            className="rounded-full border border-line bg-panel-strong px-3 py-1.5 text-[12px] font-medium text-ink shadow-card transition-colors hover:border-blue/30 hover:text-blue"
          >
            {uiCopy.navIcons.compare} {uiCopy.nav.compare}
          </Link>
          <Link
            href="/wizard"
            className="rounded-full border border-line bg-panel-strong px-3 py-1.5 text-[12px] font-medium text-ink shadow-card transition-colors hover:border-blue/30 hover:text-blue"
          >
            {uiCopy.navIcons.robotMatchmaker} {uiCopy.nav.robotMatchmaker}
          </Link>
        </div>
      </div>

      <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        {ROBOT_CATEGORY_HUBS.map((category) => {
          const count = getCategoryRobotCount(category);

          return (
            <Link
              key={category.slug}
              href={`/robots/${category.slug}`}
              title={category.description}
              className="dashboard-hub-card group relative flex items-center gap-2.5 overflow-hidden rounded-[14px] border border-line bg-panel/82 px-3 py-2.5 shadow-card backdrop-blur-[18px] transition-[border-color,box-shadow] hover:border-blue/25"
            >
              <span
                className="shrink-0 font-mono text-base text-blue"
                aria-hidden
              >
                {category.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14px] font-semibold tracking-tight text-ink group-hover:text-blue">
                  {category.title}
                </div>
                <div className="font-mono text-[11px] text-muted">{count}</div>
              </div>
              <span
                className="dashboard-hub-target pointer-events-none h-1.5 w-1.5 shrink-0 rounded-full bg-blue opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

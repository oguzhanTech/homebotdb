import Link from "next/link";
import type {
  CompareChooseEntry,
  CompareRobotWins,
} from "@/lib/compare-summary";
import { COMPARE_SPEC_COL_WIDTH } from "@/lib/compare-layout";
import { uiCopy } from "@/config/ui-copy";
import { Card } from "@/components/ui/Card";
import {
  CompareRobotThumb,
  compareThumbSizes,
} from "@/components/robot/CompareRobotThumb";
import type { Robot } from "@/types/robot";
import { cn } from "@/lib/utils";

function ChooseCardBody({
  robot,
  entry,
}: {
  robot: Robot;
  entry: CompareChooseEntry;
}) {
  return (
    <>
      <Link
        href={`/robots/${robot.slug}`}
        className="mb-4 flex cursor-pointer items-center gap-3"
      >
        <CompareRobotThumb
          robot={robot}
          seed={`${robot.slug}-compare-choose`}
          className={compareThumbSizes.header}
        />
        <div className="min-w-0">
          <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
            {uiCopy.compare.chooseGuide.choosePrefix} {entry.robotName}{" "}
            {uiCopy.compare.chooseGuide.chooseSuffix}
          </div>
        </div>
      </Link>
      <ul className="grid gap-2.5 text-sm leading-relaxed text-ink">
        {entry.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2">
            <span
              className="mt-2 h-1 w-1 shrink-0 rounded-full bg-blue"
              aria-hidden
            />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

function ChooseScoreboard({ winsByRobot }: { winsByRobot: CompareRobotWins[] }) {
  const ranked = [...winsByRobot].sort((a, b) => {
    if (b.winCount !== a.winCount) return b.winCount - a.winCount;
    return a.robotName.localeCompare(b.robotName);
  });
  const topWins = ranked[0]?.winCount ?? 0;

  return (
    <div className="flex h-full flex-col gap-3 px-3 py-4">
      <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
        {uiCopy.compare.chooseGuide.scoreboardEyebrow}
      </div>
      <ul className="grid gap-2.5">
        {ranked.map((entry) => {
          const isLeader = topWins > 0 && entry.winCount === topWins;

          return (
            <li key={entry.robotSlug} className="min-w-0">
              <Link
                href={`/robots/${entry.robotSlug}`}
                className="inline-flex max-w-full cursor-pointer items-center gap-1 text-[11px] font-bold uppercase leading-snug tracking-wide text-ink transition-colors hover:text-blue"
              >
                <span className="truncate">{entry.robotName}</span>
                {isLeader ? (
                  <span
                    className="shrink-0 text-[11px] leading-none text-emerald-600"
                    aria-label="Leading"
                    title="Leading"
                  >
                    ★
                  </span>
                ) : null}
              </Link>
              <div
                className={cn(
                  "mt-0.5 font-mono text-[12px] leading-none",
                  entry.winCount > 0
                    ? "font-semibold text-emerald-700"
                    : "text-muted",
                )}
              >
                {uiCopy.compare.chooseGuide.winsLine(entry.winCount)}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function CompareChooseGuide({
  robots,
  guidance,
  winsByRobot,
}: {
  robots: Robot[];
  guidance: CompareChooseEntry[];
  winsByRobot: CompareRobotWins[];
}) {
  const mobileColumnClass =
    robots.length >= 3
      ? "md:grid-cols-3"
      : robots.length === 2
        ? "md:grid-cols-2"
        : "md:grid-cols-1";

  return (
    <section className="mb-5">
      <div className="xl:hidden">
        <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
          {uiCopy.compare.chooseGuide.title}
        </h2>
        <div className={cn("grid gap-4", mobileColumnClass)}>
          {guidance.map((entry) => {
            const robot = robots[entry.robotIndex];
            if (!robot) return null;

            return (
              <Card
                key={entry.robotSlug}
                className="bg-panel-strong p-4 sm:p-5"
              >
                <ChooseCardBody robot={robot} entry={entry} />
              </Card>
            );
          })}
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-[18px] border border-line bg-panel-strong shadow-card xl:block">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `${COMPARE_SPEC_COL_WIDTH} repeat(${robots.length}, minmax(0, 1fr))`,
          }}
        >
          <div className="border-r border-line/80">
            <ChooseScoreboard winsByRobot={winsByRobot} />
          </div>
          {guidance.map((entry, index) => {
            const robot = robots[entry.robotIndex];
            if (!robot) return null;

            return (
              <div
                key={entry.robotSlug}
                className={cn(
                  "min-w-0 px-4 py-4",
                  index < guidance.length - 1 && "border-r border-line/80",
                )}
              >
                <ChooseCardBody robot={robot} entry={entry} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

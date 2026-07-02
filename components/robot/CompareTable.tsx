"use client";

import { Fragment, useCallback, useLayoutEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import type { Robot } from "@/types/robot";
import type { CompareSection } from "@/lib/compare-summary";
import { uiCopy } from "@/config/ui-copy";
import { BrandLogo } from "@/components/brand/BrandLogo";
import {
  CompareRobotThumb,
  compareThumbSizes,
} from "@/components/robot/CompareRobotThumb";
import {
  CompareSegmentScoreBar,
  parseScoreValue,
} from "@/components/compare/CompareSegmentScoreBar";
import { DataValue } from "@/components/ui/DataValue";
import { cn } from "@/lib/utils";

function CompareRobotHeader({
  robot,
  winCount,
  compact = false,
}: {
  robot: Robot;
  winCount?: number;
  compact?: boolean;
}) {
  const badge =
    winCount !== undefined && winCount > 0 ? (
      <span className="inline-flex w-fit rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase leading-none tracking-wider text-emerald-700 ring-1 ring-inset ring-emerald-100">
        {uiCopy.compare.verdict.leadsBadge(winCount)}
      </span>
    ) : null;

  if (compact) {
    return (
      <Link
        href={`/robots/${robot.slug}`}
        className="flex min-w-0 cursor-pointer flex-col gap-1 text-left"
      >
        <div className="truncate text-xs font-bold uppercase leading-snug tracking-wide">
          {robot.name}
        </div>
        <div className="truncate text-[10px] font-normal normal-case leading-snug text-muted">
          {robot.brand}
        </div>
        {badge}
      </Link>
    );
  }

  return (
    <Link
      href={`/robots/${robot.slug}`}
      className="flex cursor-pointer items-start gap-3"
    >
      <CompareRobotThumb
        robot={robot}
        seed={`${robot.slug}-compare-header`}
        className={cn(compareThumbSizes.header, "shrink-0")}
      />
      <div className="flex min-w-0 flex-col gap-1.5 text-left">
        <div className="font-bold uppercase leading-snug tracking-wide">
          {robot.name}
        </div>
        <BrandLogo
          brand={robot.brand}
          size="xs"
          showName
          nameClassName="text-xs text-muted font-normal"
        />
        {badge}
      </div>
    </Link>
  );
}

function CompareScoreCell({
  value,
  isWinner,
}: {
  value: string;
  isWinner: boolean;
}) {
  const score = parseScoreValue(value);

  return (
    <td
      className={cn(
        "px-4 py-3 align-top",
        isWinner &&
          "bg-emerald-50/55 ring-1 ring-inset ring-emerald-100/70",
      )}
    >
      <div
        className={cn(
          "font-mono text-[13px]",
          isWinner && "font-semibold text-emerald-700/90",
        )}
      >
        <DataValue value={value} fallback="Unknown" />
      </div>
      {score !== null ? <CompareSegmentScoreBar value={score} /> : null}
    </td>
  );
}

const SPEC_COL_WIDTH = "120px";

function compareTableMinWidth(robotCount: number) {
  return `calc(${SPEC_COL_WIDTH} + ${robotCount} * var(--compare-robot-w))`;
}

const mobileStickyTop =
  "top-[calc(max(0.75rem,env(safe-area-inset-top))+4rem)]";

const robotColWidthClass =
  "w-[var(--compare-robot-w)] min-w-[var(--compare-robot-w)] max-w-[var(--compare-robot-w)] shrink-0 px-4 py-3";

export function CompareTable({
  robots,
  sections,
  winCounts,
}: {
  robots: Robot[];
  sections: CompareSection[];
  winCounts?: number[];
}) {
  const colCount = robots.length;
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const mobileHeaderTrackRef = useRef<HTMLDivElement>(null);

  const syncMobileHeaderScroll = useCallback(() => {
    const tableScroll = tableScrollRef.current;
    const headerTrack = mobileHeaderTrackRef.current;
    if (!tableScroll || !headerTrack) return;
    headerTrack.style.transform = `translateX(-${tableScroll.scrollLeft}px)`;
  }, []);

  useLayoutEffect(() => {
    syncMobileHeaderScroll();
  }, [syncMobileHeaderScroll, colCount]);

  const robotColWidth = colCount >= 3 ? "188px" : colCount === 2 ? "180px" : "160px";

  return (
    <div
      className="rounded-[18px] border border-line bg-panel-strong shadow-card [--compare-robot-w:160px] xl:[--compare-robot-w:180px]"
      style={
        {
          "--compare-spec-w": SPEC_COL_WIDTH,
          "--compare-robot-w": robotColWidth,
        } as CSSProperties
      }
    >
      <div
        className={cn(
          "sticky z-20 flex overflow-hidden border-b border-line bg-panel-strong/95 backdrop-blur-md xl:hidden",
          mobileStickyTop,
          "shadow-[0_10px_24px_rgba(8,11,18,0.06)]",
        )}
      >
        <div className="z-10 w-[var(--compare-spec-w)] shrink-0 bg-panel-strong px-4 py-3 text-[10px] uppercase tracking-[0.12em] text-muted">
          {uiCopy.compare.table.specColumn}
        </div>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div
            ref={mobileHeaderTrackRef}
            className="flex w-max will-change-transform"
          >
            {robots.map((robot, index) => (
              <div
                key={robot.slug}
                className={cn(robotColWidthClass, "bg-panel-strong")}
              >
                <CompareRobotHeader
                  robot={robot}
                  winCount={winCounts?.[index]}
                  compact
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        ref={tableScrollRef}
        className="max-xl:overflow-x-auto"
        onScroll={syncMobileHeaderScroll}
      >
        <table
          className={cn(
            "w-full text-left text-sm",
            "max-xl:table-fixed max-xl:w-[var(--compare-table-w)] max-xl:min-w-[var(--compare-table-w)]",
          )}
          style={
            {
              "--compare-table-w": compareTableMinWidth(colCount),
            } as CSSProperties
          }
        >
          <colgroup>
            <col style={{ width: SPEC_COL_WIDTH }} />
            {robots.map((robot) => (
              <col
                key={robot.slug}
                className="max-xl:w-[var(--compare-robot-w)]"
              />
            ))}
          </colgroup>
          <thead className="hidden xl:table-header-group">
            <tr className="border-b border-line">
              <th className="sticky left-0 z-30 w-[var(--compare-spec-w)] bg-panel-strong px-4 py-3 text-[10px] uppercase tracking-[0.12em] text-muted">
                {uiCopy.compare.table.specColumn}
              </th>
              {robots.map((robot, index) => (
                <th
                  key={robot.slug}
                  className="min-w-[var(--compare-robot-w)] bg-panel-strong px-4 py-4 align-top"
                >
                  <CompareRobotHeader
                    robot={robot}
                    winCount={winCounts?.[index]}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => (
              <Fragment key={section.id}>
                <tr
                  key={`section-${section.id}`}
                  className="border-b border-line bg-panel/60"
                >
                  <th
                    colSpan={colCount + 1}
                    scope="colgroup"
                    className="sticky left-0 px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-muted"
                  >
                    {section.title}
                  </th>
                </tr>
                {section.rows.map((row) => (
                  <tr key={row.label} className="border-b border-line/80">
                    <th
                      scope="row"
                      className={cn(
                        "sticky left-0 z-10 w-[var(--compare-spec-w)] bg-panel-strong px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-muted",
                        "max-xl:shadow-[4px_0_12px_rgba(8,11,18,0.04)]",
                      )}
                    >
                      {row.label}
                    </th>
                    {row.values.map((value, i) => {
                      const isWinner = row.winners.includes(i);

                      if (row.kind === "score") {
                        return (
                          <CompareScoreCell
                            key={`${row.label}-${i}`}
                            value={value}
                            isWinner={isWinner}
                          />
                        );
                      }

                      return (
                        <td
                          key={`${row.label}-${i}`}
                          className={cn(
                            "px-4 py-3 font-mono text-[13px]",
                            isWinner &&
                              "bg-emerald-50/55 font-semibold text-emerald-700/90 ring-1 ring-inset ring-emerald-100/70",
                          )}
                        >
                          <DataValue value={value} fallback="Unknown" />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 text-xs text-muted">
        {uiCopy.compare.table.footer(colCount)}
      </div>
    </div>
  );
}

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
import { COMPARE_SPEC_COL_WIDTH } from "@/lib/compare-layout";
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
        className="flex min-w-0 cursor-pointer items-start gap-2.5 text-left"
      >
        <CompareRobotThumb
          robot={robot}
          seed={`${robot.slug}-compare-header`}
          className={cn(compareThumbSizes.queue, "shrink-0")}
        />
        <div className="flex min-w-0 flex-col gap-1">
          <div className="truncate text-xs font-bold uppercase leading-snug tracking-wide">
            {robot.name}
          </div>
          <div className="truncate text-[10px] font-normal normal-case leading-snug text-muted">
            {robot.brand}
          </div>
          {badge}
        </div>
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
        "min-w-0 px-4 py-3 align-top",
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

const SPEC_COL_WIDTH = COMPARE_SPEC_COL_WIDTH;

function compareTableMinWidth(robotCount: number) {
  return `calc(${SPEC_COL_WIDTH} + ${robotCount} * var(--compare-robot-w))`;
}

/** Clears MobileHeader + safe-area on small screens; flush to viewport on xl. */
const stickyHeaderTop =
  "top-[calc(max(0.75rem,env(safe-area-inset-top))+4rem)] xl:top-0";

const stickyHeaderChrome =
  "bg-panel-strong/95 backdrop-blur-md shadow-[0_10px_24px_rgba(8,11,18,0.06)]";

const robotColWidthClass =
  "w-[var(--compare-robot-w)] min-w-[var(--compare-robot-w)] max-w-[var(--compare-robot-w)] shrink-0 px-4 py-3";

/** Long free-text specs wrap inside equal-width columns instead of stretching them. */
const compareTextCellClass =
  "min-w-0 break-words [overflow-wrap:anywhere] whitespace-normal leading-snug";

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

  const syncStickyHeaderScroll = useCallback(() => {
    const tableScroll = tableScrollRef.current;
    const headerTrack = mobileHeaderTrackRef.current;
    if (!tableScroll || !headerTrack) return;
    // Desktop equal-width columns don't scroll horizontally.
    if (tableScroll.scrollWidth <= tableScroll.clientWidth + 1) {
      headerTrack.style.transform = "";
      return;
    }
    headerTrack.style.transform = `translateX(-${tableScroll.scrollLeft}px)`;
  }, []);

  useLayoutEffect(() => {
    syncStickyHeaderScroll();
  }, [syncStickyHeaderScroll, colCount]);

  const robotColWidth = colCount >= 3 ? "188px" : colCount === 2 ? "180px" : "160px";

  return (
    <div
      className={cn(
        "rounded-[18px] border border-line bg-panel-strong shadow-card",
        "[--compare-robot-col:var(--compare-robot-w)]",
        "xl:[--compare-robot-col:calc((100%-var(--compare-spec-w))/var(--compare-robot-count))]",
      )}
      style={
        {
          "--compare-spec-w": SPEC_COL_WIDTH,
          "--compare-robot-w": robotColWidth,
          "--compare-robot-count": String(colCount),
        } as CSSProperties
      }
    >
      {/*
        Sticky robot labels live outside the horizontal scrollport so they can
        stick to the viewport. overflow-x:clip on AppShell/body is required —
        overflow-x:hidden creates a scroll container and breaks position:sticky.
      */}
      <div
        className={cn(
          "sticky z-20 flex border-b border-line",
          stickyHeaderTop,
          stickyHeaderChrome,
        )}
      >
        <div className="z-10 w-[var(--compare-spec-w)] shrink-0 bg-panel-strong px-4 py-3 text-[10px] uppercase tracking-[0.12em] text-muted">
          {uiCopy.compare.table.specColumn}
        </div>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div
            ref={mobileHeaderTrackRef}
            className="flex w-max will-change-transform xl:w-full xl:will-change-auto"
          >
            {robots.map((robot, index) => (
              <div
                key={robot.slug}
                className={cn(
                  robotColWidthClass,
                  "bg-panel-strong xl:w-auto xl:min-w-0 xl:max-w-none xl:flex-1",
                )}
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
        onScroll={syncStickyHeaderScroll}
      >
        <table
          className={cn(
            "w-full table-fixed text-left text-sm",
            "max-xl:w-[var(--compare-table-w)] max-xl:min-w-[var(--compare-table-w)]",
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
                style={{ width: "var(--compare-robot-col)" }}
              />
            ))}
          </colgroup>
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
                    className="sticky left-0 px-4 py-3 text-left text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink"
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
                            "px-4 py-3 align-top font-mono text-[13px]",
                            compareTextCellClass,
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

"use client";

import { useCallback, useLayoutEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import type { Robot } from "@/types/robot";
import {
  AVAILABILITY_STATUS_LABELS,
  COMMERCIAL_STATUS_LABELS,
  ROBOT_TYPE_LABELS,
} from "@/types/robot";
import { getWinningIndices } from "@/lib/compare-metrics";
import { uiCopy } from "@/config/ui-copy";
import { BrandLogo } from "@/components/brand/BrandLogo";
import {
  CompareRobotThumb,
  compareThumbSizes,
} from "@/components/robot/CompareRobotThumb";
import { DataValue } from "@/components/ui/DataValue";
import { cn } from "@/lib/utils";

interface CompareRow {
  label: string;
  values: string[];
  winners: number[];
}

function buildRows(robots: Robot[]): CompareRow[] {
  const rows: { label: string; values: string[] }[] = [
    {
      label: uiCopy.scores.readinessScore,
      values: robots.map((r) => String(r.readinessScore)),
    },
    {
      label: uiCopy.scores.realityScore,
      values: robots.map((r) => String(r.realityScore)),
    },
    {
      label: uiCopy.scores.freshnessScore,
      values: robots.map((r) => `${r.dataFreshnessScore}%`),
    },
    {
      label: "Price",
      values: robots.map((r) => r.price || "Unknown"),
    },
    {
      label: uiCopy.scores.marketStatus,
      values: robots.map((r) => COMMERCIAL_STATUS_LABELS[r.commercialStatus]),
    },
    {
      label: "Availability",
      values: robots.map(
        (r) => AVAILABILITY_STATUS_LABELS[r.availabilityStatus],
      ),
    },
    {
      label: "Form",
      values: robots.map((r) => ROBOT_TYPE_LABELS[r.type]),
    },
    {
      label: "Height",
      values: robots.map((r) => r.height || "Not specified"),
    },
    {
      label: "Weight",
      values: robots.map((r) => r.weight || "Not specified"),
    },
    {
      label: "Battery",
      values: robots.map((r) => r.batteryLife || "Not specified"),
    },
    {
      label: "Speed",
      values: robots.map((r) => r.speed || "Not specified"),
    },
    {
      label: "Payload",
      values: robots.map((r) => r.payload || "Not specified"),
    },
    {
      label: "Sensors",
      values: robots.map((r) => r.sensors || "Not specified"),
    },
    {
      label: "Connectivity",
      values: robots.map((r) => r.connectivity || "Not specified"),
    },
    {
      label: "Countries",
      values: robots.map((r) =>
        r.countriesAvailable.length > 0
          ? r.countriesAvailable.join(", ")
          : "Unknown",
      ),
    },
    {
      label: "Social Interaction",
      values: robots.map((r) => {
        const cap = r.capabilities.find((c) => c.name === "Social Interaction");
        return cap ? String(cap.score) : "Not specified";
      }),
    },
    {
      label: "Home Navigation",
      values: robots.map((r) => {
        const cap = r.capabilities.find((c) => c.name === "Home Navigation");
        return cap ? String(cap.score) : "Not specified";
      }),
    },
    {
      label: "Ecosystem",
      values: robots.map((r) =>
        r.ecosystem.length > 0 ? r.ecosystem.join("; ") : "Coming soon",
      ),
    },
  ];

  return rows.map((row) => ({
    ...row,
    winners: getWinningIndices(row.label, row.values),
  }));
}

function CompareRobotHeader({
  robot,
  compact = false,
}: {
  robot: Robot;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <Link
        href={`/robots/${robot.slug}`}
        className="block min-w-0 cursor-pointer text-left"
      >
        <div className="truncate text-xs font-bold uppercase tracking-wide">
          {robot.name}
        </div>
        <div className="mt-0.5 truncate text-[10px] font-normal normal-case text-muted">
          {robot.brand}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/robots/${robot.slug}`}
      className="flex cursor-pointer items-center gap-3"
    >
      <CompareRobotThumb
        robot={robot}
        seed={`${robot.slug}-compare-header`}
        className={compareThumbSizes.header}
      />
      <div className="min-w-0 text-left">
        <div className="font-bold uppercase tracking-wide">{robot.name}</div>
        <BrandLogo
          brand={robot.brand}
          size="xs"
          showName
          nameClassName="text-xs text-muted font-normal"
          className="mt-1"
        />
      </div>
    </Link>
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

export function CompareTable({ robots }: { robots: Robot[] }) {
  const rows = buildRows(robots);
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

  return (
    <div
      className="rounded-[18px] border border-line bg-panel-strong shadow-card [--compare-robot-w:160px] xl:[--compare-robot-w:180px]"
      style={
        {
          "--compare-spec-w": SPEC_COL_WIDTH,
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
          Spec
        </div>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div
            ref={mobileHeaderTrackRef}
            className="flex w-max will-change-transform"
          >
            {robots.map((robot) => (
              <div
                key={robot.slug}
                className={cn(robotColWidthClass, "bg-panel-strong")}
              >
                <CompareRobotHeader robot={robot} compact />
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
                Spec
              </th>
              {robots.map((robot) => (
                <th
                  key={robot.slug}
                  className="min-w-[180px] bg-panel-strong px-4 py-4 align-middle"
                >
                  <CompareRobotHeader robot={robot} />
                </th>
              ))}
            </tr>
          </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-line/80">
              <td
                className={cn(
                  "sticky left-0 z-10 w-[var(--compare-spec-w)] bg-panel-strong px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-muted",
                  "max-xl:shadow-[4px_0_12px_rgba(8,11,18,0.04)]",
                )}
              >
                {row.label}
              </td>
              {row.values.map((value, i) => {
                const isWinner = row.winners.includes(i);

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
        </tbody>
        </table>
      </div>
      <div className="px-4 py-3 text-xs text-muted">
        Green cells mark the stronger value in each row across {colCount} robots.
      </div>
    </div>
  );
}

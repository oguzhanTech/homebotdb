"use client";

import Link from "next/link";
import type { Robot } from "@/types/robot";
import {
  COMMERCIAL_STATUS_LABELS,
  ROBOT_TYPE_LABELS,
} from "@/types/robot";
import { getWinningIndices } from "@/lib/compare-metrics";
import { pickRobotImage } from "@/lib/robot-images";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { RobotImagePlaceholder } from "./RobotImagePlaceholder";
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
      label: "Readiness Score",
      values: robots.map((r) => String(r.readinessScore)),
    },
    {
      label: "Reality Score",
      values: robots.map((r) => String(r.realityScore)),
    },
    {
      label: "Data Freshness",
      values: robots.map((r) => `${r.dataFreshnessScore}%`),
    },
    {
      label: "Price",
      values: robots.map((r) => r.price || "Unknown"),
    },
    {
      label: "Commercial Status",
      values: robots.map((r) => COMMERCIAL_STATUS_LABELS[r.commercialStatus]),
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

function CompareRobotHeader({ robot }: { robot: Robot }) {
  const image = pickRobotImage(robot, `${robot.slug}-compare-header`);

  return (
    <Link
      href={`/robots/${robot.slug}`}
      className="flex cursor-pointer items-center gap-3"
    >
      <div className="h-20 w-[72px] shrink-0 overflow-hidden rounded-xl border border-line bg-gradient-to-b from-white to-[#eef1f4]">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={robot.name}
            className="h-full w-full object-contain object-bottom p-1.5"
          />
        ) : (
          <RobotImagePlaceholder name={robot.name} className="h-full w-full" compact />
        )}
      </div>
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

export function CompareTable({ robots }: { robots: Robot[] }) {
  const rows = buildRows(robots);
  const colCount = robots.length;

  return (
    <div className="overflow-x-auto rounded-[18px] border border-line bg-panel-strong shadow-card">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-line">
            <th className="sticky left-0 z-10 w-[120px] bg-panel-strong px-4 py-4 text-[10px] uppercase tracking-[0.12em] text-muted">
              Spec
            </th>
            {robots.map((robot) => (
              <th key={robot.slug} className="min-w-[180px] px-4 py-4 align-middle">
                <CompareRobotHeader robot={robot} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-line/80">
              <td className="sticky left-0 z-10 bg-panel-strong px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-muted">
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
      <div className="px-4 py-3 text-xs text-muted">
        Green cells mark the stronger value in each row across {colCount} robots.
      </div>
    </div>
  );
}

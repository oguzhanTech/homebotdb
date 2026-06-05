"use client";

import Link from "next/link";
import type { Robot } from "@/types/robot";
import {
  COMMERCIAL_STATUS_LABELS,
  ROBOT_TYPE_LABELS,
} from "@/types/robot";
import { RobotImagePlaceholder } from "./RobotImagePlaceholder";
import { DataValue } from "@/components/ui/DataValue";
import { cn } from "@/lib/utils";

interface CompareRow {
  label: string;
  values: string[];
  highlight?: boolean;
}

function buildRows(robots: Robot[]): CompareRow[] {
  const rows: CompareRow[] = [
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
      label: "Type",
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
    highlight: new Set(row.values).size > 1,
  }));
}

export function CompareTable({ robots }: { robots: Robot[] }) {
  const rows = buildRows(robots);
  const colCount = robots.length;

  return (
    <div className="overflow-x-auto rounded-[18px] border border-line bg-panel-strong shadow-card">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-line">
            <th className="sticky left-0 z-10 bg-panel-strong px-4 py-4 text-[10px] uppercase tracking-[0.12em] text-muted">
              Spec
            </th>
            {robots.map((robot) => (
              <th key={robot.slug} className="px-4 py-4 align-top">
                <Link href={`/robots/${robot.slug}`} className="block">
                  <div className="mx-auto mb-2 h-16 w-14 overflow-hidden rounded-xl border border-line">
                    <RobotImagePlaceholder name={robot.name} className="h-full w-full" />
                  </div>
                  <div className="font-bold uppercase tracking-wide">{robot.name}</div>
                  <div className="text-xs text-muted">{robot.brand}</div>
                </Link>
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
              {row.values.map((value, i) => (
                <td
                  key={`${row.label}-${i}`}
                  className={cn(
                    "px-4 py-3 font-mono text-[13px]",
                    row.highlight && "bg-blue-soft/50",
                  )}
                >
                  <DataValue value={value} fallback="Unknown" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-4 py-3 text-xs text-muted">
        Highlighted cells indicate differences across {colCount} robots.
      </div>
    </div>
  );
}

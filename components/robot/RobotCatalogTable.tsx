"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import type { Robot } from "@/types/robot";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { RobotAvatarHoverPreview } from "@/components/robot/RobotAvatarHoverPreview";
import { CompareToggleButton } from "@/components/robot/CompareToggleButton";
import { VideoPlayLink } from "@/components/ui/VideoPlayLink";
import { getPrimaryRobotImage } from "@/lib/robot-images";
import { DataValue } from "@/components/ui/DataValue";
import {
  AvailabilityStatusTag,
  BatteryBar,
  DataStatusTag,
  getRobotDataStatus,
  PrimaryTaskTag,
  RobotTypeTag,
} from "@/components/ui/MatrixTag";
import { cn, formatDate } from "@/lib/utils";

const sizingRowClass =
  "pointer-events-none h-0 overflow-hidden border-0 leading-[0] [&>td]:h-0 [&>td]:overflow-hidden [&>td]:border-0 [&>td]:p-0 [&>td]:align-top";
const sizingStackClass =
  "invisible block h-0 overflow-hidden whitespace-nowrap leading-none";

const columnWidthCache = new Map<string, number[]>();

function getLayoutKey(robots: Robot[]): string {
  return robots.map((robot) => robot.slug).join("|");
}

function TableColumnSizingRow({
  robots,
  maxBatteryHours,
  showBrandInTable,
}: {
  robots: Robot[];
  maxBatteryHours: number;
  showBrandInTable: boolean;
}) {
  if (robots.length === 0) return null;

  return (
    <tr aria-hidden="true" data-sizing-row className={sizingRowClass}>
      <td className="px-4">
        {robots.map((robot) => (
          <div
            key={robot.slug}
            className={`flex items-center gap-3 ${sizingStackClass}`}
          >
            <div className="h-10 w-10 shrink-0" />
            <div>
              <div className="font-bold uppercase tracking-wide">{robot.name}</div>
              {showBrandInTable ? (
                <BrandLogo
                  brand={robot.brand}
                  size="xs"
                  showName
                  nameClassName="text-xs text-muted font-normal"
                />
              ) : null}
            </div>
          </div>
        ))}
      </td>
      <td className="px-3">
        {robots.map((robot) => (
          <span key={robot.slug} className={sizingStackClass}>
            <RobotTypeTag type={robot.type} />
          </span>
        ))}
      </td>
      <td className="px-3">
        {robots.map((robot) => (
          <span key={robot.slug} className={sizingStackClass}>
            <BatteryBar
              value={robot.batteryLife}
              dataStatus={robot.fieldMeta.batteryLife?.status}
              specNote={robot.fieldMeta.batteryLife?.note}
              maxHours={maxBatteryHours}
            />
          </span>
        ))}
      </td>
      <td className="px-3">
        {robots.map((robot) => (
          <span key={robot.slug} className={`font-mono text-[13px] font-bold ${sizingStackClass}`}>
            <DataValue
              value={robot.price}
              fallback="TBA"
              mono
              priceStatus={robot.priceStatus}
              dataStatus={robot.fieldMeta.price?.status}
              specNote={robot.fieldMeta.price?.note}
            />
          </span>
        ))}
      </td>
      <td className="px-3">
        {robots.map((robot) => (
          <span key={robot.slug} className={sizingStackClass}>
            <DataStatusTag status={getRobotDataStatus(robot)} />
          </span>
        ))}
      </td>
      <td className="px-3">
        {robots.map((robot) => (
          <span key={robot.slug} className={sizingStackClass}>
            <AvailabilityStatusTag status={robot.availabilityStatus} />
          </span>
        ))}
      </td>
      <td className="px-3">
        {robots.map((robot) => (
          <span key={robot.slug} className={sizingStackClass}>
            <PrimaryTaskTag task={robot.primaryTask} />
          </span>
        ))}
      </td>
      <td className="px-3">
        {robots.map((robot) => (
          <span key={robot.slug} className={`font-mono text-[13px] ${sizingStackClass}`}>
            <DataValue
              value={robot.height}
              mono
              dataStatus={robot.fieldMeta.height?.status}
              specNote={robot.fieldMeta.height?.note}
            />
          </span>
        ))}
      </td>
      <td className="px-3">
        {robots.map((robot) => (
          <span key={robot.slug} className={`font-mono text-[13px] ${sizingStackClass}`}>
            <DataValue value={robot.weight} mono />
          </span>
        ))}
      </td>
      <td className="px-3">
        {robots.map((robot) =>
          robot.videoUrls[0] ? (
            <span key={robot.slug} className={sizingStackClass}>
              <VideoPlayLink
                href={robot.videoUrls[0]}
                title={`${robot.name} video`}
              />
            </span>
          ) : null,
        )}
        <span className={`text-xs text-muted ${sizingStackClass}`}>—</span>
      </td>
      <td className="w-[108px] px-4">
        <div className={`flex justify-center ${sizingStackClass}`}>
          <CompareToggleButton slug={robots[0].slug} />
        </div>
      </td>
    </tr>
  );
}

export function RobotCatalogTable({
  robots,
  layoutRobots,
  maxBatteryHours,
  showBrandInTable = true,
}: {
  robots: Robot[];
  layoutRobots: Robot[];
  maxBatteryHours: number;
  showBrandInTable?: boolean;
}) {
  const tableRef = useRef<HTMLTableElement>(null);
  const layoutKey = getLayoutKey(layoutRobots);
  const [columnWidths, setColumnWidths] = useState<number[] | null>(
    () => columnWidthCache.get(layoutKey) ?? null,
  );

  useLayoutEffect(() => {
    const cached = columnWidthCache.get(layoutKey);
    if (cached) {
      setColumnWidths(cached);
      return;
    }

    const table = tableRef.current;
    if (!table) return;

    const headerCells = table.querySelectorAll("thead th");
    if (headerCells.length === 0) return;

    const widths = Array.from(headerCells).map(
      (cell) => cell.getBoundingClientRect().width,
    );
    if (widths.some((width) => width <= 0)) return;

    columnWidthCache.set(layoutKey, widths);
    setColumnWidths(widths);
  }, [layoutKey, maxBatteryHours]);

  return (
    <>
      <div className="hidden overflow-hidden rounded-[18px] border border-line bg-panel-strong shadow-card lg:block">
        <table
          ref={tableRef}
          className={cn(
            "w-full text-left text-sm",
            columnWidths ? "table-fixed" : "table-auto",
          )}
        >
          {columnWidths ? (
            <colgroup>
              {columnWidths.map((width, index) => (
                <col key={index} style={{ width: `${width}px` }} />
              ))}
            </colgroup>
          ) : null}
          <thead>
            <tr className="border-b border-line bg-ink text-[10px] uppercase tracking-[0.12em] text-white">
              <th className="px-4 py-3 font-bold">Robot</th>
              <th className="px-3 py-3 font-bold">Form</th>
              <th className="px-3 py-3 font-bold">Battery</th>
              <th className="px-3 py-3 font-bold">Price</th>
              <th className="px-3 py-3 font-bold">Data Status</th>
              <th className="px-3 py-3 font-bold">Availability</th>
              <th className="px-3 py-3 font-bold">Primary Task</th>
              <th className="px-3 py-3 font-bold">Height</th>
              <th className="px-3 py-3 font-bold">Weight</th>
              <th className="px-3 py-3 font-bold">Video</th>
              <th className="w-[108px] px-4 py-3 text-center font-bold">Compare</th>
            </tr>
          </thead>
          <tbody>
            {!columnWidths ? (
              <TableColumnSizingRow
                robots={layoutRobots}
                maxBatteryHours={maxBatteryHours}
                showBrandInTable={showBrandInTable}
              />
            ) : null}
            {robots.map((robot) => (
              <tr
                key={robot.slug}
                className="border-b border-line/80 transition-colors hover:bg-blue-soft/20"
              >
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-line bg-white">
                      <RobotAvatarHoverPreview
                        name={robot.name}
                        imageUrl={getPrimaryRobotImage(robot)}
                        size="sm"
                        className="h-full w-full"
                      />
                    </div>
                    <Link
                      href={`/robots/${robot.slug}`}
                      className="min-w-0 cursor-pointer"
                    >
                      <div className="font-bold uppercase tracking-wide">
                        {robot.name}
                      </div>
                      {showBrandInTable ? (
                        <BrandLogo
                          brand={robot.brand}
                          size="xs"
                          showName
                          nameClassName="text-xs text-muted font-normal"
                        />
                      ) : null}
                    </Link>
                  </div>
                </td>
                <td className="px-3 py-3.5">
                  <RobotTypeTag type={robot.type} />
                </td>
                <td className="px-3 py-3.5">
                  <BatteryBar
                    value={robot.batteryLife}
                    dataStatus={robot.fieldMeta.batteryLife?.status}
                    specNote={robot.fieldMeta.batteryLife?.note}
                    maxHours={maxBatteryHours}
                  />
                </td>
                <td className="px-3 py-3.5 font-mono text-[13px] font-bold">
                  <DataValue
                    value={robot.price}
                    fallback="TBA"
                    mono
                    priceStatus={robot.priceStatus}
                    dataStatus={robot.fieldMeta.price?.status}
                    specNote={robot.fieldMeta.price?.note}
                  />
                </td>
                <td className="px-3 py-3.5">
                  <DataStatusTag status={getRobotDataStatus(robot)} />
                </td>
                <td className="px-3 py-3.5">
                  <AvailabilityStatusTag status={robot.availabilityStatus} />
                </td>
                <td className="px-3 py-3.5">
                  <PrimaryTaskTag task={robot.primaryTask} />
                </td>
                <td className="px-3 py-3.5 font-mono text-[13px]">
                  <DataValue
                    value={robot.height}
                    mono
                    dataStatus={robot.fieldMeta.height?.status}
                    specNote={robot.fieldMeta.height?.note}
                  />
                </td>
                <td className="px-3 py-3.5 font-mono text-[13px]">
                  <DataValue value={robot.weight} mono />
                </td>
                <td className="px-3 py-3.5">
                  {robot.videoUrls.length > 0 ? (
                    <VideoPlayLink
                      href={robot.videoUrls[0]}
                      title={`${robot.name} video`}
                    />
                  ) : (
                    <span className="text-xs text-muted">—</span>
                  )}
                </td>
                <td className="w-[108px] px-4 py-3.5">
                  <div className="flex justify-center">
                    <CompareToggleButton slug={robot.slug} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 lg:hidden">
        {robots.map((robot) => (
          <div
            key={robot.slug}
            className="rounded-[18px] border border-line bg-panel-strong p-4 shadow-card"
          >
            <div className="flex gap-3">
              <div className="h-16 w-14 shrink-0 overflow-hidden rounded-xl border border-line bg-white">
                <RobotAvatarHoverPreview
                  name={robot.name}
                  imageUrl={getPrimaryRobotImage(robot)}
                  size="sm"
                  className="h-full w-full"
                />
              </div>
              <Link
                href={`/robots/${robot.slug}`}
                className="min-w-0 flex-1 cursor-pointer"
              >
                <div className="font-bold uppercase tracking-wide">{robot.name}</div>
                {showBrandInTable ? (
                  <BrandLogo
                    brand={robot.brand}
                    size="xs"
                    showName
                    nameClassName="text-sm text-muted font-normal"
                    className="mt-0.5"
                  />
                ) : null}
              </Link>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <RobotTypeTag type={robot.type} />
              <AvailabilityStatusTag status={robot.availabilityStatus} />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <PrimaryTaskTag task={robot.primaryTask} />
              <DataStatusTag status={getRobotDataStatus(robot)} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-muted">Price</div>
                <DataValue
                  value={robot.price}
                  fallback="TBA"
                  mono
                  priceStatus={robot.priceStatus}
                  dataStatus={robot.fieldMeta.price?.status}
                  specNote={robot.fieldMeta.price?.note}
                />
              </div>
              <div>
                <div className="text-muted">Battery</div>
                <BatteryBar
                  value={robot.batteryLife}
                  dataStatus={robot.fieldMeta.batteryLife?.status}
                  specNote={robot.fieldMeta.batteryLife?.note}
                  maxHours={maxBatteryHours}
                />
              </div>
              <div>
                <div className="text-muted">Height</div>
                <DataValue
                  value={robot.height}
                  mono
                  dataStatus={robot.fieldMeta.height?.status}
                  specNote={robot.fieldMeta.height?.note}
                />
              </div>
              <div>
                <div className="text-muted">Updated</div>
                {formatDate(robot.lastUpdated)}
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <CompareToggleButton slug={robot.slug} compact />
              {robot.videoUrls[0] ? (
                <VideoPlayLink
                  href={robot.videoUrls[0]}
                  size="sm"
                  title={`${robot.name} video`}
                />
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {robots.length === 0 ? (
        <div className="rounded-[18px] border border-line bg-panel-strong p-8 text-center text-muted">
          No robots match your filters.
        </div>
      ) : null}
    </>
  );
}

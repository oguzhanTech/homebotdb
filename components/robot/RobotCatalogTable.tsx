"use client";

import Link from "next/link";
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
import {
  matrixRowDelayStyle,
  matrixRowEnterClass,
  type MatrixTransitionDirection,
} from "@/lib/matrix-row-transition";
import { cn, formatDate } from "@/lib/utils";

/** Secondary columns — visible from xl (1280px). */
const colXl = "hidden xl:table-cell";
const colXlGroup = "hidden xl:table-column";
/** Tertiary columns — visible from 2xl (1536px). */
const col2xl = "hidden 2xl:table-cell";
const col2xlGroup = "hidden 2xl:table-column";

/** Shared horizontal padding — keeps column rhythm even. */
const thCell = "px-2.5 py-2.5 font-bold xl:py-3";
const tdCell = "px-2.5 py-2.5 xl:py-3.5";

/** Percent widths for all 11 columns (sum 100%). Hidden cols drop out at breakpoints. */
const COL = {
  robot: "w-[17%]",
  form: "w-[9%]",
  battery: "w-[11%]",
  price: "w-[8%]",
  dataStatus: "w-[9%]",
  availability: "w-[10%]",
  /** 15" laptops (xl–2xl): nudge +1% from Compare so tags clear the right edge. */
  primaryTask: "w-[9%] max-2xl:w-[10%]",
  height: "w-[6%]",
  weight: "w-[6%]",
  video: "w-[5%]",
  compare: "w-[10%] max-2xl:w-[9%]",
} as const;

const tagCell = cn(tdCell, "overflow-hidden");

const primaryTaskCell = cn(
  tagCell,
  colXl,
  "max-2xl:pl-2 max-2xl:pr-1",
);

function RobotRow({
  robot,
  maxBatteryHours,
  showBrandInTable,
  rowIndex,
  transitionSignal,
  transitionDirection,
}: {
  robot: Robot;
  maxBatteryHours: number;
  showBrandInTable: boolean;
  rowIndex: number;
  transitionSignal: number;
  transitionDirection: MatrixTransitionDirection;
}) {
  const enterClass = matrixRowEnterClass(transitionSignal, transitionDirection);

  return (
    <tr
      className={cn(
        "border-b border-line/80 transition-colors hover:bg-blue-soft/20",
        enterClass,
      )}
      style={matrixRowDelayStyle(rowIndex, transitionSignal)}
    >
      <td className={tdCell}>
        <div className="flex min-w-0 items-center gap-2 xl:gap-3">
          <div className="h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-line bg-white xl:h-10 xl:w-10">
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
            title={robot.name}
          >
            <div className="truncate font-bold uppercase tracking-wide">
              {robot.name}
            </div>
            {showBrandInTable ? (
              <BrandLogo
                brand={robot.brand}
                size="xs"
                showName
                nameClassName="truncate text-xs text-muted font-normal"
              />
            ) : null}
          </Link>
        </div>
      </td>
      <td className={tagCell}>
        <RobotTypeTag type={robot.type} />
      </td>
      <td className={tdCell}>
        <BatteryBar
          value={robot.batteryLife}
          dataStatus={robot.fieldMeta.batteryLife?.status}
          specNote={robot.fieldMeta.batteryLife?.note}
          maxHours={maxBatteryHours}
          compact
        />
      </td>
      <td className={cn(tdCell, "font-mono text-[12px] font-bold xl:text-[13px]")}>
        <DataValue
          value={robot.price}
          fallback="TBA"
          mono
          priceStatus={robot.priceStatus}
          dataStatus={robot.fieldMeta.price?.status}
          specNote={robot.fieldMeta.price?.note}
        />
      </td>
      <td className={cn(tagCell, colXl)}>
        <DataStatusTag status={getRobotDataStatus(robot)} />
      </td>
      <td className={tagCell}>
        <AvailabilityStatusTag status={robot.availabilityStatus} />
      </td>
      <td className={primaryTaskCell}>
        <PrimaryTaskTag task={robot.primaryTask} />
      </td>
      <td className={cn(tdCell, "font-mono text-[12px] xl:text-[13px]", col2xl)}>
        <DataValue
          value={robot.height}
          mono
          dataStatus={robot.fieldMeta.height?.status}
          specNote={robot.fieldMeta.height?.note}
        />
      </td>
      <td className={cn(tdCell, "font-mono text-[12px] xl:text-[13px]", col2xl)}>
        <DataValue value={robot.weight} mono />
      </td>
      <td className={cn(tdCell, "text-center", col2xl)}>
        {robot.videoUrls.length > 0 ? (
          <VideoPlayLink
            href={robot.videoUrls[0]}
            title={`${robot.name} video`}
          />
        ) : (
          <span className="text-xs text-muted">—</span>
        )}
      </td>
      <td className={cn(tdCell, "text-center")}>
        <div className="flex justify-center">
          <CompareToggleButton slug={robot.slug} />
        </div>
      </td>
    </tr>
  );
}

function RobotMobileCard({
  robot,
  maxBatteryHours,
  showBrandInTable,
  rowIndex,
  transitionSignal,
  transitionDirection,
}: {
  robot: Robot;
  maxBatteryHours: number;
  showBrandInTable: boolean;
  rowIndex: number;
  transitionSignal: number;
  transitionDirection: MatrixTransitionDirection;
}) {
  const enterClass = matrixRowEnterClass(transitionSignal, transitionDirection);

  return (
    <div
      className={cn(
        "rounded-[18px] border border-line bg-panel-strong p-4 shadow-card",
        enterClass,
      )}
      style={matrixRowDelayStyle(rowIndex, transitionSignal)}
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
  );
}

export function RobotCatalogTable({
  robots,
  layoutRobots,
  maxBatteryHours,
  showBrandInTable = true,
  transitionSignal = 0,
  transitionDirection = "reset",
}: {
  robots: Robot[];
  /** Kept for API stability; column layout is breakpoint-driven, not content-measured. */
  layoutRobots: Robot[];
  maxBatteryHours: number;
  showBrandInTable?: boolean;
  transitionSignal?: number;
  transitionDirection?: MatrixTransitionDirection;
}) {
  void layoutRobots;

  return (
    <div id="matrix-table" className="scroll-mt-28">
      <div className="hidden min-w-0 max-w-full overflow-hidden rounded-[18px] border border-line bg-panel-strong shadow-card lg:block">
        <table className="w-full table-fixed text-left text-sm">
          <colgroup>
            <col className={COL.robot} />
            <col className={COL.form} />
            <col className={COL.battery} />
            <col className={COL.price} />
            <col className={cn(colXlGroup, COL.dataStatus)} />
            <col className={COL.availability} />
            <col className={cn(colXlGroup, COL.primaryTask)} />
            <col className={cn(col2xlGroup, COL.height)} />
            <col className={cn(col2xlGroup, COL.weight)} />
            <col className={cn(col2xlGroup, COL.video)} />
            <col className={cn(COL.compare, "min-w-[7.5rem] max-2xl:min-w-[6.75rem]")} />
          </colgroup>
          <thead>
            <tr className="border-b border-line bg-ink text-[10px] uppercase tracking-[0.12em] text-white">
              <th className={thCell}>Robot</th>
              <th className={thCell}>Form</th>
              <th className={thCell}>Battery</th>
              <th className={thCell}>Price</th>
              <th className={cn(thCell, colXl)}>Data Status</th>
              <th className={thCell}>Availability</th>
              <th className={cn(thCell, primaryTaskCell)}>Primary Task</th>
              <th className={cn(thCell, col2xl)}>Height</th>
              <th className={cn(thCell, col2xl)}>Weight</th>
              <th className={cn(thCell, "text-center", col2xl)}>Video</th>
              <th className={cn(thCell, "text-center")}>Compare</th>
            </tr>
          </thead>
          <tbody>
            {robots.map((robot, rowIndex) => (
              <RobotRow
                key={`${robot.slug}-${transitionSignal}`}
                robot={robot}
                maxBatteryHours={maxBatteryHours}
                showBrandInTable={showBrandInTable}
                rowIndex={rowIndex}
                transitionSignal={transitionSignal}
                transitionDirection={transitionDirection}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 lg:hidden">
        {robots.map((robot, rowIndex) => (
          <RobotMobileCard
            key={`${robot.slug}-${transitionSignal}`}
            robot={robot}
            maxBatteryHours={maxBatteryHours}
            showBrandInTable={showBrandInTable}
            rowIndex={rowIndex}
            transitionSignal={transitionSignal}
            transitionDirection={transitionDirection}
          />
        ))}
      </div>

      {robots.length === 0 ? (
        <div className="rounded-[18px] border border-line bg-panel-strong p-8 text-center text-muted">
          No robots match your filters.
        </div>
      ) : null}
    </div>
  );
}

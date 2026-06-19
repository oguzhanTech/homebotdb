import type {
  AvailabilityStatus,
  CommercialStatus,
  PrimaryTask,
  Robot,
  RobotType,
} from "@/types/robot";
import {
  AVAILABILITY_STATUS_LABELS,
  COMMERCIAL_STATUS_LABELS,
  PRIMARY_TASK_LABELS,
  ROBOT_TYPE_LABELS,
} from "@/types/robot";
import type { DataStatus } from "@/types/robot";
import { resolveSpecDisplay } from "@/lib/spec-display";
import { cn, getBatteryBarPercent, parseBatteryHours } from "@/lib/utils";
import { SpecEmptyHint } from "@/components/ui/SpecQualifierIcon";
import { SpecQualifierIcon } from "@/components/ui/SpecQualifierIcon";

const tagBase =
  "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] whitespace-nowrap";

const typeVariants: Record<RobotType, string> = {
  humanoid: "border-blue/35 bg-blue-soft text-blue",
  zoomorphic: "border-amber-400/45 bg-amber-50 text-amber-800",
  mobile: "border-emerald-300/80 bg-emerald-50 text-emerald-700",
  desktop: "border-violet-300/80 bg-violet-50 text-violet-700",
  specialty: "border-slate-300/80 bg-slate-50 text-slate-600",
};

const commercialVariants: Record<CommercialStatus, string> = {
  buy_now: "border-emerald-400/45 bg-emerald-50 text-emerald-700",
  pre_order: "border-amber-400/50 bg-amber-50 text-amber-800",
  waitlist: "border-orange-400/45 bg-orange-50 text-orange-700",
  coming_soon: "border-slate-300/80 bg-slate-50 text-slate-600",
  prototype: "border-blue/35 bg-blue-soft text-blue",
  limited: "border-amber-400/45 bg-amber-50 text-amber-800",
  discontinued: "border-slate-400/70 bg-slate-100 text-slate-600",
  unknown: "border-line bg-[#f0f1f3] text-muted",
};

const availabilityVariants: Record<AvailabilityStatus, string> = {
  available: "border-emerald-400/45 bg-emerald-50 text-emerald-700",
  limited: "border-amber-400/45 bg-amber-50 text-amber-800",
  waitlist: "border-orange-400/45 bg-orange-50 text-orange-700",
  coming_soon: "border-slate-300/80 bg-slate-50 text-slate-600",
  prototype: "border-blue/35 bg-blue-soft text-blue",
  unavailable: "border-rose-300/80 bg-rose-50 text-rose-700",
  discontinued: "border-slate-400/70 bg-slate-100 text-slate-600",
  unknown: "border-line bg-[#f0f1f3] text-muted",
};

const taskVariants: Record<PrimaryTask, string> = {
  home_assistant: "border-indigo-300/80 bg-indigo-50 text-indigo-700",
  cleaning: "border-emerald-300/80 bg-emerald-50 text-emerald-700",
  conversation: "border-violet-300/80 bg-violet-50 text-violet-700",
  education: "border-sky-300/80 bg-sky-50 text-sky-700",
  elder_care: "border-rose-300/80 bg-rose-50 text-rose-700",
  entertainment: "border-fuchsia-300/80 bg-fuchsia-50 text-fuchsia-700",
};

const dataStatusVariants = {
  confirmed: {
    tag: "text-emerald-700",
    dot: "bg-emerald-500",
    label: "Confirmed",
  },
  unconfirmed: {
    tag: "text-amber-700",
    dot: "bg-amber-500",
    label: "Unconfirmed",
  },
  coming_soon: {
    tag: "text-slate-500",
    dot: "bg-slate-400",
    label: "Coming soon",
  },
} as const;

export type RobotDataStatus = keyof typeof dataStatusVariants;

export function getRobotDataStatus(robot: Robot): RobotDataStatus {
  const entries = Object.values(robot.fieldMeta ?? {});
  if (entries.length === 0) return "unconfirmed";

  const confirmed = entries.filter((entry) => entry.status === "confirmed").length;
  const comingSoon = entries.filter((entry) => entry.status === "coming_soon").length;
  const ratio = confirmed / entries.length;

  if (ratio >= 0.55) return "confirmed";
  if (comingSoon > entries.length / 2) return "coming_soon";
  return "unconfirmed";
}

export function MatrixTag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={cn(tagBase, className)}>{children}</span>;
}

export function RobotTypeTag({
  type,
  className,
}: {
  type: RobotType;
  className?: string;
}) {
  return (
    <MatrixTag className={cn(typeVariants[type], className)}>
      {ROBOT_TYPE_LABELS[type]}
    </MatrixTag>
  );
}

export function CommercialStatusTag({
  status,
  purchaseUrl,
}: {
  status: CommercialStatus;
  purchaseUrl?: string | null;
}) {
  const label = COMMERCIAL_STATUS_LABELS[status];
  const className = commercialVariants[status];

  if (status === "buy_now" && purchaseUrl) {
    return (
      <a
        href={purchaseUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(tagBase, className, "cursor-pointer transition-opacity hover:opacity-85")}
      >
        {label}
      </a>
    );
  }

  return <MatrixTag className={className}>{label}</MatrixTag>;
}

export function AvailabilityStatusTag({
  status,
  className,
}: {
  status: AvailabilityStatus;
  className?: string;
}) {
  return (
    <MatrixTag className={cn(availabilityVariants[status], className)}>
      {AVAILABILITY_STATUS_LABELS[status]}
    </MatrixTag>
  );
}

export function PrimaryTaskTag({
  task,
  className,
}: {
  task: PrimaryTask;
  className?: string;
}) {
  return (
    <MatrixTag className={cn(taskVariants[task], className)}>
      {PRIMARY_TASK_LABELS[task]}
    </MatrixTag>
  );
}

export function DataStatusTag({
  status,
  className,
}: {
  status: RobotDataStatus;
  className?: string;
}) {
  const config = dataStatusVariants[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em]",
        config.tag,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}

export function BatteryBar({
  value,
  dataStatus,
  specNote,
  maxHours = 8,
  compact = false,
}: {
  value: string;
  dataStatus?: DataStatus;
  specNote?: string;
  maxHours?: number;
  compact?: boolean;
}) {
  const resolved = resolveSpecDisplay(value, { dataStatus, specNote });
  const hours = parseBatteryHours(resolved.display);
  const pct = getBatteryBarPercent(hours, maxHours);

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 xl:gap-2",
        compact ? "min-w-0" : "min-w-[88px]",
      )}
    >
      <div className="h-[5px] min-w-[28px] flex-1 overflow-hidden rounded-full bg-[#eceff2]">
        <span
          className="block h-full rounded-full bg-ink"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="inline-flex shrink-0 items-center gap-1 font-mono text-[10px] font-bold tracking-wide xl:text-[11px]">
        {resolved.emptyTooltip ? (
          <SpecEmptyHint tooltip={resolved.emptyTooltip} label={resolved.display} />
        ) : (
          <span>{resolved.display}</span>
        )}
        {resolved.tooltip ? (
          <SpecQualifierIcon label={resolved.tooltip} />
        ) : null}
      </span>
    </div>
  );
}

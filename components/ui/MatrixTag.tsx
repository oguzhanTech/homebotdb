import type {
  CommercialStatus,
  PrimaryTask,
  Robot,
  RobotType,
} from "@/types/robot";
import {
  COMMERCIAL_STATUS_LABELS,
  PRIMARY_TASK_LABELS,
  ROBOT_TYPE_LABELS,
} from "@/types/robot";
import { cn } from "@/lib/utils";

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

export function RobotTypeTag({ type }: { type: RobotType }) {
  return (
    <MatrixTag className={typeVariants[type]}>
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

export function PrimaryTaskTag({ task }: { task: PrimaryTask }) {
  return (
    <MatrixTag className={taskVariants[task]}>
      {PRIMARY_TASK_LABELS[task]}
    </MatrixTag>
  );
}

export function DataStatusTag({ status }: { status: RobotDataStatus }) {
  const config = dataStatusVariants[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em]",
        config.tag,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}

export function BatteryBar({ value }: { value: string }) {
  const hours = parseFloat(value) || 0;
  const pct = Math.min(Math.max((hours / 5) * 100, 8), 100);

  return (
    <div className="flex min-w-[88px] items-center gap-2">
      <div className="h-[5px] flex-1 overflow-hidden rounded-full bg-[#eceff2]">
        <span
          className="block h-full rounded-full bg-ink"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-mono text-[11px] font-bold tracking-wide">
        {value || "—"}
      </span>
    </div>
  );
}

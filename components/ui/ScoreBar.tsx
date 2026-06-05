import { cn } from "@/lib/utils";

export function ScoreBar({
  value,
  max = 100,
  className,
}: {
  value: number;
  max?: number;
  className?: string;
}) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);
  return (
    <div
      className={cn(
        "h-[5px] overflow-hidden rounded-full bg-[#edf0f3]",
        className,
      )}
    >
      <span
        className="block h-full rounded-full bg-blue transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function InfoRow({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-t border-line py-3 text-[13px] uppercase tracking-wider",
        className,
      )}
    >
      <span className="text-[#4f5864]">{label}</span>
      <span className="text-right font-bold">{value}</span>
    </div>
  );
}

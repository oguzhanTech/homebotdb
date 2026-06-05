import { cn } from "@/lib/utils";

export function StatusPill({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg border border-blue/35 bg-blue-soft px-2.5 py-1.5 font-mono text-xs font-bold tracking-wider text-blue",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-[10px] bg-[#f0f1f3] px-3 py-1.5 text-xs font-bold tracking-wider",
        className,
      )}
    >
      {children}
    </span>
  );
}

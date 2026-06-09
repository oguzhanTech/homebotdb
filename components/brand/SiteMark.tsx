import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const sizeClasses = {
  xs: "h-4 w-4 text-[7px] rounded-md",
  sm: "h-6 w-6 text-[8px] rounded-lg",
  md: "h-10 w-10 text-[10px] rounded-xl",
  card: "h-12 w-12 text-[11px] rounded-xl",
  lg: "h-14 w-14 text-xs rounded-xl",
  xl: "h-16 w-16 text-sm rounded-2xl",
  "2xl": "h-20 w-20 text-base rounded-2xl",
};

export function SiteMark({
  size = "md",
  className,
}: {
  size?: keyof typeof sizeClasses;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center border border-line bg-panel-strong font-mono font-bold uppercase tracking-wider text-muted",
        sizeClasses[size],
        className,
      )}
    >
      {siteConfig.shortName}
    </span>
  );
}

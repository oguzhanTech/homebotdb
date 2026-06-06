import { getBrandInitials, getBrandLogo } from "@/lib/brands";
import { cn } from "@/lib/utils";

const sizeClasses = {
  xs: "h-4 w-4",
  sm: "h-6 w-6",
  md: "h-10 w-10",
  lg: "h-14 w-14",
  xl: "h-16 w-16",
  "2xl": "h-20 w-20",
};

const monogramSizeClasses = {
  xs: "h-4 min-w-4 px-0.5 text-[8px]",
  sm: "h-6 min-w-6 px-1 text-[9px]",
  md: "h-10 min-w-10 px-1.5 text-[11px]",
  lg: "h-14 min-w-14 px-2 text-xs",
  xl: "h-16 min-w-16 px-2.5 text-sm",
  "2xl": "h-20 min-w-20 px-3 text-base",
};

export function BrandLogo({
  brand,
  size = "sm",
  showName = false,
  nameClassName,
  className,
}: {
  brand: string;
  size?: keyof typeof sizeClasses;
  showName?: boolean;
  nameClassName?: string;
  className?: string;
}) {
  const logo = getBrandLogo(brand);
  const initials = getBrandInitials(brand);

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo}
          alt={`${brand} logo`}
          className={cn(sizeClasses[size], "shrink-0 object-contain")}
        />
      ) : (
        <span
          aria-hidden
          className={cn(
            "inline-flex shrink-0 items-center justify-center rounded-md border border-line bg-panel-strong font-mono font-bold uppercase tracking-wider text-muted",
            monogramSizeClasses[size],
          )}
        >
          {initials}
        </span>
      )}
      {showName ? (
        <span className={cn("font-semibold", nameClassName)}>{brand}</span>
      ) : null}
    </span>
  );
}

import { getBrandLogo } from "@/lib/brands";
import { cn } from "@/lib/utils";
import { SiteMark } from "@/components/brand/SiteMark";

const sizeClasses = {
  xs: "h-4 w-4",
  sm: "h-6 w-6",
  md: "h-10 w-10",
  lg: "h-14 w-14",
  xl: "h-16 w-16",
  "2xl": "h-20 w-20",
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
        <SiteMark size={size} />
      )}
      {showName ? (
        <span className={cn("font-semibold", nameClassName)}>{brand}</span>
      ) : null}
    </span>
  );
}

import { SiteMark } from "@/components/brand/SiteMark";
import { cn } from "@/lib/utils";

export function NewsCoverThumb({
  src,
  alt,
  className,
  variant = "card",
}: {
  src?: string;
  alt: string;
  className?: string;
  variant?: "card" | "banner";
}) {
  const frameClass =
    variant === "banner"
      ? "aspect-[16/10] w-full rounded-xl"
      : "h-20 w-20 shrink-0 rounded-xl sm:h-[7.25rem] sm:w-[7.25rem]";

  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center border border-line/60 bg-panel-strong",
          frameClass,
          className,
        )}
      >
        <SiteMark size={variant === "banner" ? "lg" : "card"} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden border border-line/60 bg-panel-strong",
        frameClass,
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      />
    </div>
  );
}

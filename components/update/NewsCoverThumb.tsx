import { SiteMark } from "@/components/brand/SiteMark";
import { cn } from "@/lib/utils";

export function NewsCoverThumb({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex aspect-[16/10] w-full items-center justify-center rounded-xl border border-line bg-panel-strong",
          className,
        )}
      >
        <SiteMark size="lg" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "aspect-[16/10] w-full overflow-hidden rounded-xl border border-line bg-panel-strong",
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

import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[18px] border border-line bg-panel/82 shadow-card backdrop-blur-[18px]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

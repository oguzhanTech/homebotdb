import { cn } from "@/lib/utils";

export function SearchInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-[42px] w-full rounded-[14px] border border-line bg-panel/82 px-4 text-sm text-ink shadow-card outline-none placeholder:text-muted focus:border-blue/40",
        className,
      )}
      {...props}
    />
  );
}

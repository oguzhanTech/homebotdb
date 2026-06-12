import { cn } from "@/lib/utils";

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 12"
      className={cn("h-3 w-3 shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <path d="M2.5 4.5 6 8l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FilterSelect({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        {...props}
        className={cn(
          "h-[42px] w-full cursor-pointer appearance-none rounded-[14px] border border-line bg-white pl-3 pr-10 text-sm",
          className,
        )}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-3 flex w-3 items-center justify-center text-ink/65">
        <ChevronDown />
      </span>
    </div>
  );
}

export const filterNumberClassName =
  "h-[42px] w-full rounded-[14px] border border-line bg-white px-3 text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]";

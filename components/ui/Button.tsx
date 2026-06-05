import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-ink text-white shadow-card hover:bg-ink/90 border-0",
  secondary:
    "bg-panel-strong text-ink border border-line shadow-card hover:bg-white",
  ghost: "bg-transparent text-muted hover:text-ink border border-transparent",
  blue: "bg-blue text-white border-0 shadow-card hover:bg-blue/90",
};

const sizes = {
  sm: "h-9 px-4 text-[11px]",
  md: "h-10 px-5 text-xs",
  lg: "h-[42px] px-6 text-xs",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-bold uppercase tracking-widest transition-colors disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

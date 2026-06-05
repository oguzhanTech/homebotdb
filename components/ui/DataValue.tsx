import { displayValue } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function DataValue({
  value,
  fallback = "Not specified",
  className,
  mono = false,
}: {
  value: string | number | null | undefined;
  fallback?: "Not specified" | "Unknown" | "Coming soon" | "TBA";
  className?: string;
  mono?: boolean;
}) {
  const text = displayValue(value, fallback);
  const isFallback = text === fallback;
  return (
    <span
      className={cn(
        mono && "font-mono",
        isFallback && "text-muted italic normal-case",
        className,
      )}
    >
      {text}
    </span>
  );
}

export function MonoValue({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("font-mono tracking-wide", className)}>{children}</span>
  );
}

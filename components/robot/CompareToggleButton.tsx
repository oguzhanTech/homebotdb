"use client";

import { useCompare } from "@/contexts/CompareContext";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function CompareToggleButton({
  slug,
  className,
  compact = false,
}: {
  slug: string;
  className?: string;
  compact?: boolean;
}) {
  const { toggle, isSelected, isFull } = useCompare();
  const selected = isSelected(slug);

  return (
    <Button
      size="sm"
      variant={selected ? "blue" : "secondary"}
      disabled={!selected && isFull}
      onClick={() => toggle(slug)}
      className={cn(
        "h-8 min-w-[96px] justify-center px-3 text-[10px]",
        compact && "flex-1 min-w-0",
        className,
      )}
    >
      {selected ? "Added" : "Add"}
    </Button>
  );
}

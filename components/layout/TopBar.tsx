"use client";

import Link from "next/link";
import { useCompare } from "@/contexts/CompareContext";
import { SearchInput } from "@/components/ui/SearchInput";
import { Button } from "@/components/ui/Button";

export function TopBar({
  defaultQuery = "",
  onSearch,
}: {
  defaultQuery?: string;
  onSearch?: (query: string) => void;
}) {
  const { count, comparePath } = useCompare();

  return (
    <div className="mb-7 grid grid-cols-1 items-center gap-4 md:grid-cols-[minmax(260px,420px)_1fr_auto] md:gap-5">
      <label className="relative flex h-[42px] items-center gap-3 rounded-[14px] border border-line bg-panel/82 px-4 text-sm text-muted shadow-card">
        <span>⌕</span>
        <SearchInput
          className="h-full border-0 bg-transparent p-0 shadow-none focus:border-0"
          placeholder="Search robots, brands, capabilities..."
          defaultValue={defaultQuery}
          onChange={(e) => onSearch?.(e.target.value)}
        />
        <span className="ml-auto hidden font-mono text-xs sm:inline">⌘K</span>
      </label>
      <div className="hidden h-px bg-line md:block" />
      <div className="flex items-center gap-2.5">
        {comparePath ? (
          <Link href={comparePath}>
            <Button size="lg" className="w-full md:w-auto">
              Compare ({count})
            </Button>
          </Link>
        ) : (
          <Button size="lg" disabled className="w-full md:w-auto">
            Compare ({count})
          </Button>
        )}
      </div>
    </div>
  );
}

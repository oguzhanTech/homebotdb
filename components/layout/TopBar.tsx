"use client";

import Link from "next/link";
import { useCompare } from "@/contexts/CompareContext";
import { Button } from "@/components/ui/Button";
import { TopBarSearch } from "./TopBarSearch";

export function TopBar() {
  const { count, comparePath } = useCompare();

  return (
    <div className="mb-7 grid grid-cols-1 items-center gap-4 md:grid-cols-[minmax(260px,420px)_1fr_auto] md:gap-5">
      <TopBarSearch />
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

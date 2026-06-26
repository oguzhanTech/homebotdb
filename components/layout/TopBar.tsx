"use client";

import Link from "next/link";
import { useCompare } from "@/contexts/CompareContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { uiCopy } from "@/config/ui-copy";
import { Button } from "@/components/ui/Button";
import { TopBarSearch } from "./TopBarSearch";

export function TopBar() {
  const { count: compareCount, comparePath } = useCompare();
  const { count: trackedCount } = useFavorites();

  return (
    <div className="mb-7 grid grid-cols-1 items-center gap-4 md:grid-cols-[minmax(260px,420px)_1fr_auto] md:gap-5">
      <TopBarSearch />
      <div className="hidden h-px bg-line md:block" />
      <div className="flex flex-wrap items-center gap-2.5">
        <Link href="/tracked" className="flex-1 md:flex-none">
          <Button
            size="lg"
            variant={trackedCount > 0 ? "blue" : "secondary"}
            className="w-full md:w-auto"
          >
            Tracked ({trackedCount})
          </Button>
        </Link>
        {comparePath ? (
          <Link href={comparePath} className="flex-1 md:flex-none">
            <Button size="lg" className="w-full md:w-auto">
              {uiCopy.nav.compare} ({compareCount})
            </Button>
          </Link>
        ) : (
          <Link href="/compare" className="flex-1 md:flex-none">
            <Button size="lg" variant="secondary" className="w-full md:w-auto">
              {uiCopy.nav.compare} ({compareCount})
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Robot } from "@/types/robot";
import {
  filterRobots,
  sortRobots,
  type SortField,
} from "@/lib/data/repository";
import {
  buildMatrixQueryString,
  matrixFiltersToRobotFilters,
  parseMatrixFilters,
  type MatrixFilters,
} from "@/lib/matrix-search-params";
import type { MatrixTransitionDirection } from "@/lib/matrix-row-transition";
import { getMaxBatteryHours, parseBatteryHours } from "@/lib/utils";
import { paginateItems } from "@/lib/matrix-pagination";
import { useDebouncedCallback } from "@/lib/use-debounced-callback";
import { RobotMatrixFilters } from "@/components/robot/RobotMatrixFilters";
import { RobotCatalogTable } from "@/components/robot/RobotCatalogTable";
import { MatrixWindowNav } from "@/components/robot/MatrixWindowNav";

function scrollToTableTop() {
  const target = document.getElementById("matrix-table");
  if (!target) return;

  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }

  requestAnimationFrame(() => {
    target.scrollIntoView({ behavior: "auto", block: "start" });
  });
}

export function HomeMatrixClient({
  listingPath,
  allRobots,
  initialFilters,
  initialSort,
  sectionHeader,
  showBrandInTable = false,
}: {
  listingPath: string;
  allRobots: Robot[];
  initialFilters: MatrixFilters;
  initialSort: SortField;
  sectionHeader?: ReactNode;
  showBrandInTable?: boolean;
}) {
  const router = useRouter();
  const includeSortInUrl = listingPath !== "/";
  const lastSyncedQueryRef = useRef(
    buildMatrixQueryString(initialFilters, { includeSort: includeSortInUrl }),
  );
  const defaultSortRef = useRef(initialSort);

  const [filters, setFilters] = useState<MatrixFilters>(initialFilters);
  const [sort, setSort] = useState<SortField>(initialSort);
  const [page, setPage] = useState(1);
  const [transition, setTransition] = useState<{
    signal: number;
    direction: MatrixTransitionDirection;
  }>({ signal: 0, direction: "reset" });
  const scrollTableAfterPageChangeRef = useRef(false);

  const playTransition = (direction: MatrixTransitionDirection) => {
    setTransition((current) => ({
      signal: current.signal + 1,
      direction,
    }));
  };

  useEffect(() => {
    const syncFromUrl = () => {
      const parsed = parseMatrixFilters(
        Object.fromEntries(new URLSearchParams(window.location.search)),
        { defaultSort: defaultSortRef.current },
      );
      setFilters(parsed);
      if (includeSortInUrl) {
        setSort(parsed.sort);
      }
      lastSyncedQueryRef.current = buildMatrixQueryString(parsed, {
        includeSort: includeSortInUrl,
      });
    };

    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, [includeSortInUrl]);

  const syncUrl = useDebouncedCallback(
    (nextFilters: MatrixFilters, nextSort: SortField) => {
      const qs = buildMatrixQueryString(
        { ...nextFilters, sort: nextSort },
        { includeSort: includeSortInUrl },
      );
      lastSyncedQueryRef.current = qs;
      const href = qs ? `${listingPath}?${qs}` : listingPath;
      router.replace(href, { scroll: false });
    },
    400,
  );

  const filteredRobots = useMemo(
    () => filterRobots(matrixFiltersToRobotFilters(filters)),
    [filters],
  );

  const robots = useMemo(
    () => sortRobots(filteredRobots, sort),
    [filteredRobots, sort],
  );

  const paged = useMemo(() => paginateItems(robots, page), [robots, page]);

  useEffect(() => {
    if (!scrollTableAfterPageChangeRef.current) return;
    scrollTableAfterPageChangeRef.current = false;
    scrollToTableTop();
  }, [page]);

  const maxBatteryHours = useMemo(
    () =>
      getMaxBatteryHours(
        allRobots.map((robot) => parseBatteryHours(robot.batteryLife)),
      ),
    [allRobots],
  );

  const handleFiltersChange = (patch: Partial<MatrixFilters>) => {
    const next = { ...filters, ...patch };
    setFilters(next);
    setPage(1);
    playTransition("reset");
    syncUrl(next, sort);
  };

  const handleSortChange = (nextSort: SortField) => {
    setSort(nextSort);
    setPage(1);
    playTransition("reset");
    if (includeSortInUrl) {
      const next = { ...filters, sort: nextSort };
      setFilters(next);
      syncUrl(next, nextSort);
    } else {
      syncUrl(filters, nextSort);
    }
  };

  const handlePageChange = (nextPage: number) => {
    playTransition(
      nextPage > page ? "forward" : nextPage < page ? "back" : "reset",
    );
    scrollTableAfterPageChangeRef.current = true;
    setPage(nextPage);
  };

  return (
    <>
      {sectionHeader ? (
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>{sectionHeader}</div>
          <div className="text-sm text-muted">
            {filteredRobots.length} units tracked
          </div>
        </div>
      ) : null}

      <RobotMatrixFilters
        filters={filters}
        sort={sort}
        onFiltersChange={handleFiltersChange}
        onSortChange={handleSortChange}
      />
      <RobotCatalogTable
        robots={paged.items}
        layoutRobots={allRobots}
        maxBatteryHours={maxBatteryHours}
        showBrandInTable={showBrandInTable}
        transitionSignal={transition.signal}
        transitionDirection={transition.direction}
      />
      <MatrixWindowNav
        page={paged.page}
        pageCount={paged.pageCount}
        total={paged.total}
        rangeStart={paged.startIndex}
        rangeEnd={paged.endIndex}
        onPageChange={handlePageChange}
      />
    </>
  );
}

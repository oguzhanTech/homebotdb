"use client";

import { useEffect, useMemo, useState } from "react";
import type { Robot } from "@/types/robot";
import { getRobots, sortRobots, type SortField } from "@/lib/data/repository";
import type { MatrixFilters } from "@/lib/matrix-search-params";
import { getMaxBatteryHours, parseBatteryHours } from "@/lib/utils";
import { paginateItems } from "@/lib/matrix-pagination";
import { RobotMatrixFilters } from "@/components/robot/RobotMatrixFilters";
import { RobotCatalogTable } from "@/components/robot/RobotCatalogTable";
import { MatrixWindowNav } from "@/components/robot/MatrixWindowNav";

function filtersKey(filters: MatrixFilters): string {
  return JSON.stringify({
    query: filters.query,
    type: filters.type,
    availability: filters.availability,
    primaryTask: filters.primaryTask,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    showDiscontinued: filters.showDiscontinued,
    showBuyNowOnly: filters.showBuyNowOnly,
  });
}

function scrollToMatrix() {
  document.getElementById("matrix")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export function HomeMatrixClient({
  listingPath,
  filters,
  filteredRobots,
  initialSort,
}: {
  listingPath: string;
  filters: MatrixFilters;
  filteredRobots: Robot[];
  initialSort: SortField;
}) {
  const [sort, setSort] = useState<SortField>(initialSort);
  const [page, setPage] = useState(1);
  const layoutRobots = getRobots();
  const filterKey = filtersKey(filters);

  useEffect(() => {
    setPage(1);
  }, [filterKey]);

  const robots = useMemo(
    () => sortRobots(filteredRobots, sort),
    [filteredRobots, sort],
  );

  const paged = useMemo(() => paginateItems(robots, page), [robots, page]);

  useEffect(() => {
    if (page !== paged.page) {
      setPage(paged.page);
    }
  }, [page, paged.page]);

  const maxBatteryHours = useMemo(
    () =>
      getMaxBatteryHours(
        layoutRobots.map((robot) => parseBatteryHours(robot.batteryLife)),
      ),
    [layoutRobots],
  );

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    scrollToMatrix();
  };

  return (
    <>
      <RobotMatrixFilters
        listingPath={listingPath}
        filters={filters}
        sort={sort}
        onSortChange={setSort}
      />
      <div key={paged.page} className="matrix-window-in">
        <RobotCatalogTable
          robots={paged.items}
          layoutRobots={layoutRobots}
          maxBatteryHours={maxBatteryHours}
          showBrandInTable={false}
        />
      </div>
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

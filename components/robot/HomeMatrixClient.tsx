"use client";

import { useMemo, useState } from "react";
import type { Robot } from "@/types/robot";
import { getRobots, sortRobots, type SortField } from "@/lib/data/repository";
import type { MatrixFilters } from "@/lib/matrix-search-params";
import { getMaxBatteryHours, parseBatteryHours } from "@/lib/utils";
import { RobotMatrixFilters } from "@/components/robot/RobotMatrixFilters";
import { RobotCatalogTable } from "@/components/robot/RobotCatalogTable";

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
  const layoutRobots = getRobots();

  const robots = useMemo(
    () => sortRobots(filteredRobots, sort),
    [filteredRobots, sort],
  );

  const maxBatteryHours = useMemo(
    () =>
      getMaxBatteryHours(
        layoutRobots.map((robot) => parseBatteryHours(robot.batteryLife)),
      ),
    [layoutRobots],
  );

  return (
    <>
      <RobotMatrixFilters
        listingPath={listingPath}
        filters={filters}
        sort={sort}
        onSortChange={setSort}
      />
      <RobotCatalogTable
        robots={robots}
        layoutRobots={layoutRobots}
        maxBatteryHours={maxBatteryHours}
        showBrandInTable={false}
      />
    </>
  );
}

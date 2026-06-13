import { filterRobots, getRobots, sortRobots, type SortField } from "@/lib/data/repository";
import {
  matrixFiltersToRobotFilters,
  parseMatrixFilters,
  resolveSearchParams,
} from "@/lib/matrix-search-params";
import { getMaxBatteryHours, parseBatteryHours } from "@/lib/utils";
import { HomeMatrixClient } from "@/components/robot/HomeMatrixClient";
import { RobotMatrixFilters } from "@/components/robot/RobotMatrixFilters";
import { RobotCatalogTable } from "@/components/robot/RobotCatalogTable";

export async function RobotMatrixSection({
  listingPath = "/",
  searchParams,
  initialSort = "readiness",
}: {
  listingPath?: string;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
  initialSort?: SortField;
}) {
  const allRobots = getRobots();
  const params = await resolveSearchParams(searchParams);
  const filters = parseMatrixFilters(params, { defaultSort: initialSort });
  const filteredRobots = filterRobots(matrixFiltersToRobotFilters(filters));
  const isHome = listingPath === "/";
  const effectiveSort = isHome ? initialSort : filters.sort;
  const robots = sortRobots(filteredRobots, effectiveSort);
  const maxBatteryHours = getMaxBatteryHours(
    allRobots.map((robot) => parseBatteryHours(robot.batteryLife)),
  );

  return (
    <section id="matrix" className="scroll-mt-24">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Robot Matrix
          </div>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">
            Home & companion robots
          </h2>
        </div>
        <div className="text-sm text-muted">{robots.length} units tracked</div>
      </div>

      {isHome ? (
        <HomeMatrixClient
          listingPath={listingPath}
          filters={filters}
          filteredRobots={filteredRobots}
          initialSort={effectiveSort}
        />
      ) : (
        <>
          <RobotMatrixFilters
            listingPath={listingPath}
            filters={filters}
            sort={filters.sort}
          />
          <RobotCatalogTable
            robots={robots}
            layoutRobots={allRobots}
            maxBatteryHours={maxBatteryHours}
          />
        </>
      )}
    </section>
  );
}

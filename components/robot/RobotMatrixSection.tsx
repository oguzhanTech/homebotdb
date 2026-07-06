import { getRobots, type SortField } from "@/lib/data/repository";
import {
  mergeMatrixFilters,
  parseMatrixFilters,
  resolveSearchParams,
  type MatrixFilters,
} from "@/lib/matrix-search-params";
import { HomeMatrixClient } from "@/components/robot/HomeMatrixClient";

export async function RobotMatrixSection({
  listingPath = "/",
  searchParams,
  initialSort = "readiness",
  lockedFilters,
  defaultSearchParams,
  showBrandInTable = false,
}: {
  listingPath?: string;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
  initialSort?: SortField;
  lockedFilters?: Partial<Pick<MatrixFilters, "type" | "primaryTask">>;
  defaultSearchParams?: Record<string, string>;
  showBrandInTable?: boolean;
}) {
  const allRobots = getRobots();
  const params = await resolveSearchParams(searchParams);
  const mergedParams = { ...defaultSearchParams, ...params };
  const parsed = parseMatrixFilters(mergedParams, { defaultSort: initialSort });
  const filters = mergeMatrixFilters(parsed, lockedFilters);
  const isHome = listingPath === "/";
  const effectiveSort = isHome ? initialSort : filters.sort;

  return (
    <section id="matrix" className="min-w-0 scroll-mt-24">
      <HomeMatrixClient
        listingPath={listingPath}
        allRobots={allRobots}
        initialFilters={filters}
        initialSort={effectiveSort}
        lockedFilters={lockedFilters}
        showBrandInTable={showBrandInTable}
        sectionHeader={
          isHome ? (
            <>
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
                Robot Matrix
              </div>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                Home & companion robots
              </h2>
            </>
          ) : undefined
        }
      />
    </section>
  );
}

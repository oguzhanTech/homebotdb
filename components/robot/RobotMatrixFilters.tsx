"use client";

import { useRouter } from "next/navigation";
import {
  AVAILABILITY_STATUS_LABELS,
  PRIMARY_TASKS,
  ROBOT_TYPES,
  type AvailabilityStatus,
  type PrimaryTask,
  type RobotType,
} from "@/types/robot";
import type { SortField } from "@/lib/data/repository";
import {
  buildMatrixQueryString,
  type MatrixFilters,
} from "@/lib/matrix-search-params";
import { FilterSelect, filterNumberClassName } from "@/components/ui/FilterSelect";
import { SearchInput } from "@/components/ui/SearchInput";

const AVAILABILITY_FILTERS: { value: AvailabilityStatus | "all"; label: string }[] =
  [
    { value: "all", label: "All" },
    ...(
      [
        "available",
        "limited",
        "waitlist",
        "coming_soon",
        "prototype",
        "unknown",
      ] as const
    ).map((value) => ({
      value,
      label: AVAILABILITY_STATUS_LABELS[value],
    })),
  ];

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: "readiness", label: "Readiness" },
  { value: "price", label: "Price" },
  { value: "battery", label: "Battery" },
  { value: "lastUpdated", label: "Last update" },
];

export function RobotMatrixFilters({
  listingPath,
  filters,
  sort,
  onSortChange,
}: {
  listingPath: string;
  filters: MatrixFilters;
  sort: SortField;
  onSortChange?: (sort: SortField) => void;
}) {
  const router = useRouter();
  const includeSortInUrl = listingPath !== "/";

  const navigate = (next: MatrixFilters) => {
    const qs = buildMatrixQueryString(next, { includeSort: includeSortInUrl });
    const href = qs ? `${listingPath}?${qs}` : listingPath;
    router.replace(href, { scroll: false });
  };

  const update = (patch: Partial<MatrixFilters>) => {
    navigate({ ...filters, ...patch, sort });
  };

  const handleSortChange = (nextSort: SortField) => {
    if (includeSortInUrl) {
      navigate({ ...filters, sort: nextSort });
    } else {
      onSortChange?.(nextSort);
    }
  };

  return (
    <div className="mb-4 grid gap-3 rounded-[18px] border border-line bg-panel/82 p-4 shadow-card lg:grid-cols-2 xl:grid-cols-4">
      <SearchInput
        placeholder="Search..."
        value={filters.query}
        onChange={(e) => update({ query: e.target.value })}
      />
      <FilterSelect
        value={filters.type}
        onChange={(e) => update({ type: e.target.value as RobotType | "all" })}
      >
        {ROBOT_TYPES.map((opt) => (
          <option key={opt.value} value={opt.value}>
            Form: {opt.label}
          </option>
        ))}
      </FilterSelect>
      <FilterSelect
        value={filters.availability}
        onChange={(e) =>
          update({ availability: e.target.value as AvailabilityStatus | "all" })
        }
      >
        {AVAILABILITY_FILTERS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            Availability: {opt.label}
          </option>
        ))}
      </FilterSelect>
      <FilterSelect
        value={sort}
        onChange={(e) => handleSortChange(e.target.value as SortField)}
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            Sort: {opt.label}
          </option>
        ))}
      </FilterSelect>
      <FilterSelect
        value={filters.primaryTask}
        onChange={(e) =>
          update({ primaryTask: e.target.value as PrimaryTask | "all" })
        }
      >
        {PRIMARY_TASKS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            Primary task: {opt.label}
          </option>
        ))}
      </FilterSelect>
      <input
        type="number"
        placeholder="Min price"
        value={filters.minPrice}
        onChange={(e) => update({ minPrice: e.target.value })}
        className={filterNumberClassName}
      />
      <input
        type="number"
        placeholder="Max price"
        value={filters.maxPrice}
        onChange={(e) => update({ maxPrice: e.target.value })}
        className={filterNumberClassName}
      />
    </div>
  );
}

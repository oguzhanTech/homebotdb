"use client";

import {
  AVAILABILITY_STATUS_LABELS,
  PRIMARY_TASKS,
  ROBOT_TYPES,
  type AvailabilityStatus,
  type PrimaryTask,
  type RobotType,
} from "@/types/robot";
import type { SortField } from "@/lib/data/repository";
import type { MatrixFilters } from "@/lib/matrix-search-params";
import { FilterSelect, filterNumberClassName } from "@/components/ui/FilterSelect";
import { FilterSwitch } from "@/components/ui/FilterSwitch";
import { SearchInput } from "@/components/ui/SearchInput";
import { uiCopy } from "@/config/ui-copy";

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
        "unavailable",
        "discontinued",
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
  filters,
  sort,
  onFiltersChange,
  onSortChange,
}: {
  filters: MatrixFilters;
  sort: SortField;
  onFiltersChange: (patch: Partial<MatrixFilters>) => void;
  onSortChange: (sort: SortField) => void;
}) {
  return (
    <div className="mb-4 rounded-[18px] border border-line bg-panel/82 p-4 shadow-card">
      <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-4">
        <SearchInput
          placeholder="Search..."
          value={filters.query}
          onChange={(e) => onFiltersChange({ query: e.target.value })}
        />
        <FilterSelect
          value={filters.type}
          onChange={(e) =>
            onFiltersChange({ type: e.target.value as RobotType | "all" })
          }
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
            onFiltersChange({
              availability: e.target.value as AvailabilityStatus | "all",
            })
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
          onChange={(e) => onSortChange(e.target.value as SortField)}
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
            onFiltersChange({
              primaryTask: e.target.value as PrimaryTask | "all",
            })
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
          onChange={(e) => onFiltersChange({ minPrice: e.target.value })}
          className={filterNumberClassName}
        />
        <input
          type="number"
          placeholder="Max price"
          value={filters.maxPrice}
          onChange={(e) => onFiltersChange({ maxPrice: e.target.value })}
          className={filterNumberClassName}
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <FilterSwitch
            checked={filters.showDiscontinued}
            onChange={(showDiscontinued) => onFiltersChange({ showDiscontinued })}
            label={uiCopy.matrix.showDiscontinued}
            className="min-w-0 flex-1"
          />
          <FilterSwitch
            checked={filters.showBuyNowOnly}
            onChange={(showBuyNowOnly) => onFiltersChange({ showBuyNowOnly })}
            label={uiCopy.matrix.showBuyNowOnly}
            className="min-w-0 flex-1"
          />
        </div>
      </div>
    </div>
  );
}

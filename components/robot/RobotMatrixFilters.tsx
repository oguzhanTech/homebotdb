"use client";

import { useRouter } from "next/navigation";
import {
  PRIMARY_TASKS,
  ROBOT_TYPES,
  type CommercialStatus,
  type PrimaryTask,
  type RobotType,
} from "@/types/robot";
import type { SortField } from "@/lib/data/repository";
import {
  buildMatrixQueryString,
  type MatrixFilters,
} from "@/lib/matrix-search-params";
import { SearchInput } from "@/components/ui/SearchInput";

const STATUS_FILTERS: { value: CommercialStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "buy_now", label: "Buy Now" },
  { value: "pre_order", label: "Pre-order" },
  { value: "waitlist", label: "Waitlist" },
  { value: "coming_soon", label: "Coming Soon" },
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
      <select
        value={filters.type}
        onChange={(e) => update({ type: e.target.value as RobotType | "all" })}
        className="h-[42px] cursor-pointer rounded-[14px] border border-line bg-white px-3 text-sm"
      >
        {ROBOT_TYPES.map((opt) => (
          <option key={opt.value} value={opt.value}>
            Form: {opt.label}
          </option>
        ))}
      </select>
      <select
        value={filters.status}
        onChange={(e) =>
          update({ status: e.target.value as CommercialStatus | "all" })
        }
        className="h-[42px] cursor-pointer rounded-[14px] border border-line bg-white px-3 text-sm"
      >
        {STATUS_FILTERS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            Status: {opt.label}
          </option>
        ))}
      </select>
      <select
        value={sort}
        onChange={(e) => handleSortChange(e.target.value as SortField)}
        className="h-[42px] cursor-pointer rounded-[14px] border border-line bg-white px-3 text-sm"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            Sort: {opt.label}
          </option>
        ))}
      </select>
      <select
        value={filters.primaryTask}
        onChange={(e) =>
          update({ primaryTask: e.target.value as PrimaryTask | "all" })
        }
        className="h-[42px] cursor-pointer rounded-[14px] border border-line bg-white px-3 text-sm"
      >
        {PRIMARY_TASKS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            Primary task: {opt.label}
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Min price"
        value={filters.minPrice}
        onChange={(e) => update({ minPrice: e.target.value })}
        className="h-[42px] rounded-[14px] border border-line bg-white px-3 text-sm"
      />
      <input
        type="number"
        placeholder="Max price"
        value={filters.maxPrice}
        onChange={(e) => update({ maxPrice: e.target.value })}
        className="h-[42px] rounded-[14px] border border-line bg-white px-3 text-sm"
      />
    </div>
  );
}

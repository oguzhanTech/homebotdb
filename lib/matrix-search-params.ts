import { isSortField, type SortField } from "@/lib/data/repository";
import type {
  AvailabilityStatus,
  PrimaryTask,
  RobotType,
} from "@/types/robot";
import { PRIMARY_TASKS, ROBOT_TYPES } from "@/types/robot";

export interface MatrixFilters {
  query: string;
  type: RobotType | "all";
  availability: AvailabilityStatus | "all";
  primaryTask: PrimaryTask | "all";
  sort: SortField;
  minPrice: string;
  maxPrice: string;
  showDiscontinued: boolean;
  showBuyNowOnly: boolean;
}

const AVAILABILITY_STATUSES: AvailabilityStatus[] = [
  "available",
  "limited",
  "waitlist",
  "coming_soon",
  "prototype",
  "unavailable",
  "discontinued",
  "unknown",
];

function isRobotType(value: string): value is RobotType {
  return ROBOT_TYPES.some((opt) => opt.value !== "all" && opt.value === value);
}

function isAvailabilityStatus(value: string): value is AvailabilityStatus {
  return AVAILABILITY_STATUSES.includes(value as AvailabilityStatus);
}

function isPrimaryTask(value: string): value is PrimaryTask {
  return PRIMARY_TASKS.some((opt) => opt.value !== "all" && opt.value === value);
}

function getParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
): string {
  const value = searchParams[key];
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export function parseMatrixFilters(
  searchParams: Record<string, string | string[] | undefined>,
  options?: { defaultSort?: SortField },
): MatrixFilters {
  const typeRaw = getParam(searchParams, "type");
  const availabilityRaw = getParam(searchParams, "availability");
  const taskRaw = getParam(searchParams, "task");
  const sortRaw = getParam(searchParams, "sort");

  return {
    query: getParam(searchParams, "q"),
    type: isRobotType(typeRaw) ? typeRaw : "all",
    availability: isAvailabilityStatus(availabilityRaw) ? availabilityRaw : "all",
    primaryTask: isPrimaryTask(taskRaw) ? taskRaw : "all",
    sort: isSortField(sortRaw)
      ? sortRaw
      : (options?.defaultSort ?? "readiness"),
    minPrice: getParam(searchParams, "minPrice"),
    maxPrice: getParam(searchParams, "maxPrice"),
    showDiscontinued: getParam(searchParams, "discontinued") === "1",
    showBuyNowOnly: getParam(searchParams, "buyNow") === "1",
  };
}

export function matrixFiltersToRobotFilters(filters: MatrixFilters) {
  return {
    type: filters.type,
    availability: filters.availability,
    primaryTask: filters.primaryTask,
    query: filters.query,
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    includeDiscontinued:
      filters.showDiscontinued || filters.availability === "discontinued",
    buyNowOnly: filters.showBuyNowOnly,
  };
}

export function buildMatrixQueryString(
  filters: MatrixFilters,
  options?: {
    includeSort?: boolean;
    lockedFilters?: Partial<Pick<MatrixFilters, "type" | "primaryTask">>;
  },
): string {
  const sp = new URLSearchParams();
  const includeSort = options?.includeSort ?? true;
  const locked = options?.lockedFilters;

  if (filters.query) sp.set("q", filters.query);
  if (filters.type !== "all" && locked?.type == null) {
    sp.set("type", filters.type);
  }
  if (filters.availability !== "all") {
    sp.set("availability", filters.availability);
  }
  if (filters.primaryTask !== "all" && locked?.primaryTask == null) {
    sp.set("task", filters.primaryTask);
  }
  if (includeSort) sp.set("sort", filters.sort);
  if (filters.minPrice) sp.set("minPrice", filters.minPrice);
  if (filters.maxPrice) sp.set("maxPrice", filters.maxPrice);
  if (filters.showDiscontinued) sp.set("discontinued", "1");
  if (filters.showBuyNowOnly) sp.set("buyNow", "1");

  return sp.toString();
}

export function mergeMatrixFilters(
  filters: MatrixFilters,
  lockedFilters?: Partial<Pick<MatrixFilters, "type" | "primaryTask">>,
): MatrixFilters {
  if (!lockedFilters) return filters;

  return {
    ...filters,
    ...(lockedFilters.type ? { type: lockedFilters.type } : {}),
    ...(lockedFilters.primaryTask
      ? { primaryTask: lockedFilters.primaryTask }
      : {}),
  };
}

export async function resolveSearchParams(
  searchParams: Promise<Record<string, string | string[] | undefined>> | undefined,
): Promise<Record<string, string | string[] | undefined>> {
  if (!searchParams) return {};
  return searchParams;
}

import { isSortField, type SortField } from "@/lib/data/repository";
import type {
  CommercialStatus,
  PrimaryTask,
  RobotType,
} from "@/types/robot";
import { PRIMARY_TASKS, ROBOT_TYPES } from "@/types/robot";

export interface MatrixFilters {
  query: string;
  type: RobotType | "all";
  status: CommercialStatus | "all";
  primaryTask: PrimaryTask | "all";
  sort: SortField;
  minPrice: string;
  maxPrice: string;
}

const COMMERCIAL_STATUSES: CommercialStatus[] = [
  "buy_now",
  "pre_order",
  "waitlist",
  "coming_soon",
  "prototype",
  "limited",
  "unknown",
];

function isRobotType(value: string): value is RobotType {
  return ROBOT_TYPES.some((opt) => opt.value !== "all" && opt.value === value);
}

function isCommercialStatus(value: string): value is CommercialStatus {
  return COMMERCIAL_STATUSES.includes(value as CommercialStatus);
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
  const statusRaw = getParam(searchParams, "status");
  const taskRaw = getParam(searchParams, "task");
  const sortRaw = getParam(searchParams, "sort");

  return {
    query: getParam(searchParams, "q"),
    type: isRobotType(typeRaw) ? typeRaw : "all",
    status: isCommercialStatus(statusRaw) ? statusRaw : "all",
    primaryTask: isPrimaryTask(taskRaw) ? taskRaw : "all",
    sort: isSortField(sortRaw)
      ? sortRaw
      : (options?.defaultSort ?? "readiness"),
    minPrice: getParam(searchParams, "minPrice"),
    maxPrice: getParam(searchParams, "maxPrice"),
  };
}

export function matrixFiltersToRobotFilters(filters: MatrixFilters) {
  return {
    type: filters.type,
    status: filters.status,
    primaryTask: filters.primaryTask,
    query: filters.query,
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
  };
}

export function buildMatrixQueryString(
  filters: MatrixFilters,
  options?: { includeSort?: boolean },
): string {
  const sp = new URLSearchParams();
  const includeSort = options?.includeSort ?? true;

  if (filters.query) sp.set("q", filters.query);
  if (filters.type !== "all") sp.set("type", filters.type);
  if (filters.status !== "all") sp.set("status", filters.status);
  if (filters.primaryTask !== "all") sp.set("task", filters.primaryTask);
  if (includeSort) sp.set("sort", filters.sort);
  if (filters.minPrice) sp.set("minPrice", filters.minPrice);
  if (filters.maxPrice) sp.set("maxPrice", filters.maxPrice);

  return sp.toString();
}

export async function resolveSearchParams(
  searchParams: Promise<Record<string, string | string[] | undefined>> | undefined,
): Promise<Record<string, string | string[] | undefined>> {
  if (!searchParams) return {};
  return searchParams;
}

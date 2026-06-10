"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  PRIMARY_TASKS,
  ROBOT_TYPES,
  type CommercialStatus,
  type PrimaryTask,
  type RobotType,
} from "@/types/robot";
import {
  filterRobots,
  isSortField,
  sortRobots,
  type SortField,
} from "@/lib/data/repository";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { RobotAvatarHoverPreview } from "./RobotAvatarHoverPreview";
import { CompareToggleButton } from "./CompareToggleButton";
import { VideoPlayLink } from "@/components/ui/VideoPlayLink";
import { getPrimaryRobotImage } from "@/lib/robot-images";
import { DataValue } from "@/components/ui/DataValue";
import { SearchInput } from "@/components/ui/SearchInput";
import {
  BatteryBar,
  CommercialStatusTag,
  DataStatusTag,
  getRobotDataStatus,
  PrimaryTaskTag,
  RobotTypeTag,
} from "@/components/ui/MatrixTag";
import { getPurchaseUrl } from "@/lib/purchase";
import { formatDate, getMaxBatteryHours, parseBatteryHours } from "@/lib/utils";

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

export function RobotMatrix({
  listingPath = "/",
  initialSort = "readiness",
}: {
  listingPath?: string;
  initialSort?: SortField;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const useHomeAnchor = listingPath === "/";

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [type, setType] = useState<RobotType | "all">(
    (searchParams.get("type") as RobotType | "all") ?? "all",
  );
  const [status, setStatus] = useState<CommercialStatus | "all">(
    (searchParams.get("status") as CommercialStatus | "all") ?? "all",
  );
  const [primaryTask, setPrimaryTask] = useState<PrimaryTask | "all">(
    (searchParams.get("task") as PrimaryTask | "all") ?? "all",
  );
  const [sort, setSort] = useState<SortField>(() => {
    if (listingPath === "/") return initialSort;
    const fromUrl = searchParams.get("sort");
    return isSortField(fromUrl) ? fromUrl : "readiness";
  });
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");

  const syncUrl = useCallback(
    (params: Record<string, string>) => {
      const sp = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v && v !== "all") sp.set(k, v);
      });
      const qs = sp.toString();
      if (useHomeAnchor) {
        router.replace(qs ? `/?${qs}` : "/", { scroll: false });
      } else {
        router.replace(qs ? `${listingPath}?${qs}` : listingPath, { scroll: false });
      }
    },
    [router, listingPath, useHomeAnchor],
  );

  useEffect(() => {
    const params: Record<string, string> = {
      q: query,
      type,
      status,
      task: primaryTask,
      minPrice,
      maxPrice,
    };
    if (!useHomeAnchor) {
      params.sort = sort;
    }
    syncUrl(params);
  }, [
    query,
    type,
    status,
    primaryTask,
    sort,
    minPrice,
    maxPrice,
    syncUrl,
    useHomeAnchor,
  ]);

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
    setType((searchParams.get("type") as RobotType | "all") ?? "all");
    setStatus((searchParams.get("status") as CommercialStatus | "all") ?? "all");
    setPrimaryTask((searchParams.get("task") as PrimaryTask | "all") ?? "all");
    if (!useHomeAnchor) {
      const fromUrl = searchParams.get("sort");
      setSort(isSortField(fromUrl) ? fromUrl : "readiness");
    }
    setMinPrice(searchParams.get("minPrice") ?? "");
    setMaxPrice(searchParams.get("maxPrice") ?? "");
  }, [searchParams, useHomeAnchor]);

  const filtered = useMemo(() => {
    const result = filterRobots({
      type,
      status,
      primaryTask,
      query,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
    return sortRobots(result, sort);
  }, [type, status, primaryTask, query, minPrice, maxPrice, sort]);

  const maxBatteryHours = useMemo(
    () =>
      getMaxBatteryHours(
        filtered.map((robot) => parseBatteryHours(robot.batteryLife)),
      ),
    [filtered],
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
        <div className="text-sm text-muted">{filtered.length} units tracked</div>
      </div>

      <div className="mb-4 grid gap-3 rounded-[18px] border border-line bg-panel/82 p-4 shadow-card lg:grid-cols-2 xl:grid-cols-4">
        <SearchInput
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as RobotType | "all")}
          className="h-[42px] rounded-[14px] border border-line bg-white px-3 text-sm"
        >
          {ROBOT_TYPES.map((opt) => (
            <option key={opt.value} value={opt.value}>
              Form: {opt.label}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as CommercialStatus | "all")
          }
          className="h-[42px] rounded-[14px] border border-line bg-white px-3 text-sm"
        >
          {STATUS_FILTERS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              Status: {opt.label}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortField)}
          className="h-[42px] rounded-[14px] border border-line bg-white px-3 text-sm"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              Sort: {opt.label}
            </option>
          ))}
        </select>
        <select
          value={primaryTask}
          onChange={(e) =>
            setPrimaryTask(e.target.value as PrimaryTask | "all")
          }
          className="h-[42px] rounded-[14px] border border-line bg-white px-3 text-sm"
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
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="h-[42px] rounded-[14px] border border-line bg-white px-3 text-sm"
        />
        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="h-[42px] rounded-[14px] border border-line bg-white px-3 text-sm"
        />
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-[18px] border border-line bg-panel-strong shadow-card lg:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-ink text-[10px] uppercase tracking-[0.12em] text-white">
              <th className="px-4 py-3 font-bold">Robot</th>
              <th className="px-3 py-3 font-bold">Form</th>
              <th className="px-3 py-3 font-bold">Battery</th>
              <th className="px-3 py-3 font-bold">Price</th>
              <th className="px-3 py-3 font-bold">Data Status</th>
              <th className="px-3 py-3 font-bold">Availability</th>
              <th className="px-3 py-3 font-bold">Primary Task</th>
              <th className="px-3 py-3 font-bold">Height</th>
              <th className="px-3 py-3 font-bold">Weight</th>
              <th className="px-3 py-3 font-bold">Video</th>
              <th className="px-4 py-3 font-bold">Compare</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((robot) => (
              <tr
                key={robot.slug}
                className="border-b border-line/80 transition-colors hover:bg-blue-soft/20"
              >
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-line bg-white">
                      <RobotAvatarHoverPreview
                        name={robot.name}
                        imageUrl={getPrimaryRobotImage(robot)}
                        size="sm"
                        className="h-full w-full"
                      />
                    </div>
                    <Link
                      href={`/robots/${robot.slug}`}
                      className="min-w-0 cursor-pointer"
                    >
                      <div className="font-bold uppercase tracking-wide">
                        {robot.name}
                      </div>
                      <BrandLogo
                        brand={robot.brand}
                        size="xs"
                        showName
                        nameClassName="text-xs text-muted font-normal"
                      />
                    </Link>
                  </div>
                </td>
                <td className="px-3 py-3.5">
                  <RobotTypeTag type={robot.type} />
                </td>
                <td className="px-3 py-3.5">
                  <BatteryBar
                    value={robot.batteryLife}
                    dataStatus={robot.fieldMeta.batteryLife?.status}
                    specNote={robot.fieldMeta.batteryLife?.note}
                    maxHours={maxBatteryHours}
                  />
                </td>
                <td className="px-3 py-3.5 font-mono text-[13px] font-bold">
                  <DataValue
                    value={robot.price}
                    fallback="TBA"
                    mono
                    priceStatus={robot.priceStatus}
                    dataStatus={robot.fieldMeta.price?.status}
                  />
                </td>
                <td className="px-3 py-3.5">
                  <DataStatusTag status={getRobotDataStatus(robot)} />
                </td>
                <td className="px-3 py-3.5">
                  <CommercialStatusTag
                    status={robot.commercialStatus}
                    purchaseUrl={getPurchaseUrl(robot)}
                  />
                </td>
                <td className="px-3 py-3.5">
                  <PrimaryTaskTag task={robot.primaryTask} />
                </td>
                <td className="px-3 py-3.5 font-mono text-[13px]">
                  <DataValue
                    value={robot.height}
                    mono
                    dataStatus={robot.fieldMeta.height?.status}
                    specNote={robot.fieldMeta.height?.note}
                  />
                </td>
                <td className="px-3 py-3.5 font-mono text-[13px]">
                  <DataValue value={robot.weight} mono />
                </td>
                <td className="px-3 py-3.5">
                  {robot.videoUrls.length > 0 ? (
                    <VideoPlayLink
                      href={robot.videoUrls[0]}
                      title={`${robot.name} video`}
                    />
                  ) : (
                    <span className="text-xs text-muted">—</span>
                  )}
                </td>
                <td className="w-[108px] px-4 py-3.5">
                  <CompareToggleButton slug={robot.slug} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-3 lg:hidden">
        {filtered.map((robot) => (
          <div
            key={robot.slug}
            className="rounded-[18px] border border-line bg-panel-strong p-4 shadow-card"
          >
            <div className="flex gap-3">
              <div className="h-16 w-14 shrink-0 overflow-hidden rounded-xl border border-line bg-white">
                <RobotAvatarHoverPreview
                  name={robot.name}
                  imageUrl={getPrimaryRobotImage(robot)}
                  size="sm"
                  className="h-full w-full"
                />
              </div>
              <Link
                href={`/robots/${robot.slug}`}
                className="min-w-0 flex-1 cursor-pointer"
              >
                <div className="font-bold uppercase tracking-wide">{robot.name}</div>
                <BrandLogo
                  brand={robot.brand}
                  size="xs"
                  showName
                  nameClassName="text-sm text-muted font-normal"
                  className="mt-0.5"
                />
              </Link>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <RobotTypeTag type={robot.type} />
              <CommercialStatusTag
                status={robot.commercialStatus}
                purchaseUrl={getPurchaseUrl(robot)}
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <PrimaryTaskTag task={robot.primaryTask} />
              <DataStatusTag status={getRobotDataStatus(robot)} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-muted">Price</div>
                <DataValue
                  value={robot.price}
                  fallback="TBA"
                  mono
                  priceStatus={robot.priceStatus}
                  dataStatus={robot.fieldMeta.price?.status}
                />
              </div>
              <div>
                <div className="text-muted">Battery</div>
                <BatteryBar
                  value={robot.batteryLife}
                  dataStatus={robot.fieldMeta.batteryLife?.status}
                  specNote={robot.fieldMeta.batteryLife?.note}
                  maxHours={maxBatteryHours}
                />
              </div>
              <div>
                <div className="text-muted">Height</div>
                <DataValue
                  value={robot.height}
                  mono
                  dataStatus={robot.fieldMeta.height?.status}
                  specNote={robot.fieldMeta.height?.note}
                />
              </div>
              <div>
                <div className="text-muted">Updated</div>
                {formatDate(robot.lastUpdated)}
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <CompareToggleButton slug={robot.slug} compact />
              {robot.videoUrls[0] && (
                <VideoPlayLink
                  href={robot.videoUrls[0]}
                  size="sm"
                  title={`${robot.name} video`}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-[18px] border border-line bg-panel-strong p-8 text-center text-muted">
          No robots match your filters.
        </div>
      )}
    </section>
  );
}

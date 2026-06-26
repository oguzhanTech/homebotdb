"use client";

import Link from "next/link";
import { uiCopy } from "@/config/ui-copy";
import { useFavorites } from "@/contexts/FavoritesContext";
import { BrandLogo } from "@/components/brand/BrandLogo";
import {
  CompareRobotThumb,
  compareThumbSizes,
} from "@/components/robot/CompareRobotThumb";
import { Button } from "@/components/ui/Button";
import { DataValue, MonoValue } from "@/components/ui/DataValue";
import { RobotTypeTag } from "@/components/ui/MatrixTag";
import { getRobotsBySlugs } from "@/lib/data/repository";
import { formatDate } from "@/lib/utils";
import { COMMERCIAL_STATUS_LABELS } from "@/types/robot";

export function TrackedLandingView() {
  const { slugs, remove, clear, count } = useFavorites();
  const robots = getRobotsBySlugs(slugs);

  if (count === 0) {
    return (
      <div className="mt-8 rounded-[18px] border border-dashed border-line bg-panel-strong p-8 text-center shadow-card sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-blue-soft text-2xl">
          ♡
        </div>
        <h2 className="mt-5 text-xl font-semibold tracking-tight">
          {uiCopy.tracked.emptyTitle}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[#565f6b]">
          {uiCopy.tracked.emptyLead}
        </p>
        <Link href="/robots" className="mt-6 inline-block">
          <Button size="lg">{uiCopy.tracked.browseRobots}</Button>
        </Link>
        <p className="mx-auto mt-8 max-w-lg text-xs leading-relaxed text-muted">
          {uiCopy.tracked.localNote}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="sticky top-3 z-20 rounded-[18px] border border-blue/20 bg-panel/95 p-4 shadow-card backdrop-blur-[14px]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-blue">
            {uiCopy.tracked.eyebrow} ({count})
          </div>
          <button
            type="button"
            onClick={clear}
            className="cursor-pointer text-[11px] font-bold uppercase tracking-wider text-muted transition-colors hover:text-ink"
          >
            {uiCopy.tracked.clearAll}
          </button>
        </div>
        <p className="mt-2 text-sm text-[#565f6b]">{uiCopy.tracked.pageLead}</p>
      </div>

      <div className="mt-6 grid gap-3">
        {robots.map((robot) => (
          <div
            key={robot.slug}
            className="flex flex-col gap-4 rounded-[18px] border border-line bg-panel-strong p-3 shadow-card sm:flex-row sm:items-center sm:p-4"
          >
            <Link
              href={`/robots/${robot.slug}`}
              className="flex min-w-0 flex-1 cursor-pointer items-center gap-4"
            >
              <CompareRobotThumb
                robot={robot}
                seed={`${robot.slug}-tracked`}
                className={compareThumbSizes.list}
              />
              <div className="min-w-0 flex-1">
                <div className="font-bold uppercase tracking-wide">{robot.name}</div>
                <BrandLogo
                  brand={robot.brand}
                  size="xs"
                  showName
                  nameClassName="text-sm text-muted font-normal"
                  className="mt-1"
                />
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <RobotTypeTag type={robot.type} />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
                    {COMMERCIAL_STATUS_LABELS[robot.commercialStatus]}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.12em] text-muted">
                      Price
                    </div>
                    <div className="mt-0.5 text-sm font-bold">
                      <DataValue
                        value={robot.price}
                        priceStatus={robot.priceStatus}
                        dataStatus={robot.fieldMeta.price?.status}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.12em] text-muted">
                      Readiness
                    </div>
                    <MonoValue className="mt-0.5 text-sm font-bold">
                      {robot.readinessScore}
                    </MonoValue>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.12em] text-muted">
                      {uiCopy.scores.lastSignal}
                    </div>
                    <div className="mt-0.5 text-sm font-bold">
                      {formatDate(robot.lastUpdated)}
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col">
              <Link href={`/robots/${robot.slug}`} className="flex-1 sm:flex-none">
                <Button size="md" variant="primary" className="w-full">
                  {uiCopy.tracked.viewProfile}
                </Button>
              </Link>
              <Button
                size="md"
                variant="secondary"
                className="w-full flex-1 sm:flex-none"
                onClick={() => remove(robot.slug)}
              >
                {uiCopy.tracked.untrack}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-xs leading-relaxed text-muted">
        {uiCopy.tracked.localNote}
      </p>
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Robot } from "@/types/robot";
import { ROBOT_TYPE_LABELS } from "@/types/robot";
import { useCompare } from "@/contexts/CompareContext";
import { buildComparePath } from "@/lib/compare";
import type { FeaturedComparePair } from "@/lib/featured-comparisons";
import { getRobotsBySlugs } from "@/lib/data/repository";
import { CompareRobotThumb, compareThumbSizes } from "@/components/robot/CompareRobotThumb";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { CompareToggleButton } from "@/components/robot/CompareToggleButton";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { RobotTypeTag } from "@/components/ui/MatrixTag";
import { cn } from "@/lib/utils";

function RobotThumb({
  robot,
  seed,
  className,
}: {
  robot: Robot;
  seed: string;
  className?: string;
}) {
  return <CompareRobotThumb robot={robot} seed={seed} className={className} />;
}

function CompareSelectionBar() {
  const { slugs, remove, clear, comparePath, count } = useCompare();
  const router = useRouter();
  const selectedRobots = getRobotsBySlugs(slugs);

  if (count === 0) return null;

  return (
    <div className="sticky top-3 z-20 rounded-[18px] border border-blue/25 bg-blue-soft/90 p-4 shadow-card backdrop-blur-[14px]">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-blue">
          Compare queue ({count}/3)
        </div>
        <button
          type="button"
          onClick={clear}
          className="cursor-pointer text-[11px] font-bold uppercase tracking-wider text-muted transition-colors hover:text-ink"
        >
          Clear all
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-2">
          {selectedRobots.map((robot) => (
            <div
              key={robot.slug}
              className="flex items-center gap-2 rounded-xl border border-line bg-panel-strong py-1.5 pl-1.5 pr-2.5"
            >
              <RobotThumb robot={robot} seed={`${robot.slug}-queue`} className={compareThumbSizes.queue} />
              <span className="text-xs font-bold uppercase tracking-wide">{robot.name}</span>
              <button
                type="button"
                onClick={() => remove(robot.slug)}
                className="cursor-pointer text-muted transition-colors hover:text-ink"
                aria-label={`Remove ${robot.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="sm:ml-auto">
          {comparePath ? (
            <Button
              size="md"
              onClick={() => router.push(comparePath)}
              className="w-full sm:w-auto"
            >
              Compare now
            </Button>
          ) : (
            <p className="text-sm text-[#4d5662]">Add one more robot to compare.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function FeaturedCompareCard({
  label,
  slugs,
  robotsBySlug,
}: {
  label: string;
  slugs: string[];
  robotsBySlug: Map<string, Robot>;
}) {
  const pair = slugs
    .map((slug) => robotsBySlug.get(slug))
    .filter((robot): robot is Robot => Boolean(robot));

  if (pair.length < 2) return null;

  return (
    <Link
      href={buildComparePath(slugs)}
      className="group flex cursor-pointer items-center gap-3 rounded-[18px] border border-line bg-panel-strong p-3 shadow-card transition-colors hover:border-blue/30"
    >
      <div className="flex -space-x-2">
        {pair.map((robot, index) => (
          <RobotThumb
            key={robot.slug}
            robot={robot}
            seed={`${robot.slug}-featured-${index}`}
            className="h-16 w-14 ring-2 ring-panel-strong"
          />
        ))}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
          Featured
        </div>
        <div className="mt-0.5 text-sm font-bold tracking-tight">{label}</div>
      </div>
      <span className="text-xs font-bold uppercase tracking-wider text-blue">Open</span>
    </Link>
  );
}

export function CompareLandingView({
  robots,
  featuredPairs,
}: {
  robots: Robot[];
  featuredPairs: FeaturedComparePair[];
}) {
  const [query, setQuery] = useState("");
  const robotsBySlug = useMemo(
    () => new Map(robots.map((robot) => [robot.slug, robot])),
    [robots],
  );

  const filtered = useMemo(() => {
    const sorted = [...robots].sort((a, b) => b.readinessScore - a.readinessScore);
    if (!query.trim()) return sorted;

    const q = query.toLowerCase();
    return sorted.filter(
      (robot) =>
        robot.name.toLowerCase().includes(q) ||
        robot.brand.toLowerCase().includes(q) ||
        ROBOT_TYPE_LABELS[robot.type].toLowerCase().includes(q),
    );
  }, [robots, query]);

  return (
    <>
      <CompareSelectionBar />

      <section className="mt-8">
        <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
          Featured comparisons
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {featuredPairs.map((pair) => (
            <FeaturedCompareCard
              key={pair.slugs.join("-vs-")}
              label={pair.label}
              slugs={pair.slugs}
              robotsBySlug={robotsBySlug}
            />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
              Pick robots
            </div>
            <h2 className="mt-1 text-xl font-semibold tracking-tight">
              Add up to 3, then compare
            </h2>
          </div>
          <SearchInput
            placeholder="Search robots..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:max-w-xs"
          />
        </div>

        <div className="grid gap-3">
          {filtered.map((robot) => (
            <div
              key={robot.slug}
              className="flex items-center gap-4 rounded-[18px] border border-line bg-panel-strong p-3 shadow-card sm:p-4"
            >
              <Link
                href={`/robots/${robot.slug}`}
                className="flex min-w-0 flex-1 cursor-pointer items-center gap-4"
              >
                <RobotThumb
                  robot={robot}
                  seed={`${robot.slug}-compare-list`}
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
                  </div>
                </div>
              </Link>
              <CompareToggleButton slug={robot.slug} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-[18px] border border-line bg-panel-strong p-8 text-center text-muted">
            No robots match your search.
          </div>
        )}
      </section>
    </>
  );
}

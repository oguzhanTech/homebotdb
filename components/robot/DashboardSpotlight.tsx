import Link from "next/link";
import type { Robot } from "@/types/robot";
import {
  PRIMARY_TASK_LABELS,
  ROBOT_TYPE_LABELS,
} from "@/types/robot";
import { getSpotlightRobot } from "@/lib/random-robot";
import { getPurchaseUrl } from "@/lib/purchase";
import { getRobotHeroStatusLabel } from "@/lib/robot-status";
import { getPrimaryRobotImage } from "@/lib/robot-images";
import { uiCopy } from "@/config/ui-copy";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { RobotAvatar } from "./RobotAvatar";
import { StatusPill } from "@/components/ui/Badge";
import { MonoValue } from "@/components/ui/DataValue";
import { DataValue } from "@/components/ui/DataValue";
import { BuyNowLink, PrimaryLink } from "@/components/ui/PrimaryLink";

function DashboardStats({
  robotCount,
  avgReadiness,
}: {
  robotCount: number;
  avgReadiness: number;
}) {
  return (
    <div className="flex shrink-0 gap-2 sm:gap-3">
      <div className="min-w-[96px] rounded-xl border border-line bg-panel-strong px-3 py-2.5 shadow-card sm:min-w-[108px] sm:px-4 sm:py-3">
        <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
          Robots tracked
        </div>
        <div className="mt-0.5 font-mono text-xl font-bold sm:text-2xl">
          {robotCount}
        </div>
      </div>
      <div className="min-w-[96px] rounded-xl border border-line bg-panel-strong px-3 py-2.5 shadow-card sm:min-w-[108px] sm:px-4 sm:py-3">
        <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
          Avg readiness
        </div>
        <div className="mt-0.5 font-mono text-xl font-bold sm:text-2xl">
          {avgReadiness}
        </div>
      </div>
    </div>
  );
}

export function DashboardSpotlight({ robots }: { robots: Robot[] }) {
  const robot = robots.length > 0 ? getSpotlightRobot(robots) : null;

  const avgReadiness =
    robots.length > 0
      ? Math.round(
          robots.reduce((sum, entry) => sum + entry.readinessScore, 0) /
            robots.length,
        )
      : 0;

  if (!robot) return null;

  return (
    <section className="mb-8">
      <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
        {uiCopy.homepage.commandCenter}
      </div>

      <SpotlightCard
        robot={robot}
        robotCount={robots.length}
        avgReadiness={avgReadiness}
      />
    </section>
  );
}

function SpotlightCard({
  robot,
  robotCount,
  avgReadiness,
}: {
  robot: Robot;
  robotCount: number;
  avgReadiness: number;
}) {
  const purchaseUrl = getPurchaseUrl(robot);

  const highlights = [
    { label: "Primary task", value: PRIMARY_TASK_LABELS[robot.primaryTask] },
    { label: "Form", value: ROBOT_TYPE_LABELS[robot.type] },
    { label: "Readiness", value: `${robot.readinessScore}/100`, mono: true },
    { label: "Price", value: robot.price, mono: true },
    {
      label: "Status",
      value: getRobotHeroStatusLabel(robot),
    },
  ];

  return (
    <div className="mt-3 overflow-hidden rounded-[18px] border border-line bg-panel/82 shadow-card backdrop-blur-[18px]">
      <div className="grid items-center gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-stretch lg:gap-8">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill>
              {getRobotHeroStatusLabel(robot).toUpperCase()}
            </StatusPill>
            <span className="text-[11px] font-bold uppercase tracking-widest text-muted">
              Spotlight
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <BrandLogo brand={robot.brand} size="lg" />
            <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">
              {robot.name}
            </h1>
          </div>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[#565f6b]">
            {robot.shortDescription}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-line bg-panel-strong px-3 py-2.5"
              >
                <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
                  {item.label}
                </div>
                <div className="mt-1 text-sm font-bold">
                  {item.mono ? (
                    <MonoValue>
                      <DataValue value={item.value} fallback="Unknown" />
                    </MonoValue>
                  ) : (
                    item.value
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <PrimaryLink href={`/robots/${robot.slug}`}>
              {uiCopy.homepage.viewFullProfile}
            </PrimaryLink>
            {purchaseUrl ? <BuyNowLink href={purchaseUrl} /> : null}
            <Link
              href="/robots"
              className="inline-flex h-10 cursor-pointer items-center rounded-xl border border-line bg-panel-strong px-5 text-xs font-bold uppercase tracking-widest shadow-card transition-colors hover:border-blue/30"
            >
              Browse all robots
            </Link>
          </div>
        </div>

        <div className="flex w-full flex-col items-end gap-6 lg:justify-between lg:self-stretch">
          <RobotAvatar
            name={robot.name}
            imageUrl={getPrimaryRobotImage(robot)}
            size="lg"
            className="self-center lg:self-auto"
          />
          <DashboardStats
            robotCount={robotCount}
            avgReadiness={avgReadiness}
          />
        </div>
      </div>
    </div>
  );
}

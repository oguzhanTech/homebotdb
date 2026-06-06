"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Robot } from "@/types/robot";
import {
  COMMERCIAL_STATUS_LABELS,
  PRIMARY_TASK_LABELS,
  ROBOT_TYPE_LABELS,
} from "@/types/robot";
import { getSessionSpotlightRobot } from "@/lib/random-robot";
import { getPurchaseUrl } from "@/lib/purchase";
import { getPrimaryRobotImage } from "@/lib/robot-images";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { RobotAvatar } from "./RobotAvatar";
import { StatusPill } from "@/components/ui/Badge";
import { MonoValue } from "@/components/ui/DataValue";
import { DataValue } from "@/components/ui/DataValue";
import { BuyNowLink, PrimaryLink } from "@/components/ui/PrimaryLink";

function SpotlightSkeleton() {
  return (
    <div className="mt-3 animate-pulse overflow-hidden rounded-[18px] border border-line bg-panel/82 p-5 shadow-card sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="space-y-4">
          <div className="h-6 w-32 rounded-lg bg-soft" />
          <div className="h-10 w-56 max-w-full rounded-lg bg-soft" />
          <div className="h-16 max-w-xl rounded-lg bg-soft" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-16 rounded-xl bg-soft" />
            ))}
          </div>
        </div>
        <div className="mx-auto h-[140px] w-[140px] rounded-full bg-soft lg:mx-0" />
      </div>
    </div>
  );
}

export function DashboardSpotlight({ robots }: { robots: Robot[] }) {
  const [robot, setRobot] = useState<Robot | null>(null);

  useEffect(() => {
    setRobot(getSessionSpotlightRobot(robots));
  }, [robots]);

  const avgReadiness =
    robots.length > 0
      ? Math.round(
          robots.reduce((sum, entry) => sum + entry.readinessScore, 0) /
            robots.length,
        )
      : 0;

  return (
    <section className="mb-8">
      <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
        Dashboard
      </div>

      {!robot ? (
        <SpotlightSkeleton />
      ) : (
        <SpotlightCard robot={robot} />
      )}

      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="rounded-xl border border-line bg-panel-strong px-4 py-3 shadow-card">
          <div className="text-muted">Robots tracked</div>
          <div className="font-mono text-2xl font-bold">{robots.length}</div>
        </div>
        <div className="rounded-xl border border-line bg-panel-strong px-4 py-3 shadow-card">
          <div className="text-muted">Avg readiness</div>
          <div className="font-mono text-2xl font-bold">{avgReadiness}</div>
        </div>
      </div>
    </section>
  );
}

function SpotlightCard({ robot }: { robot: Robot }) {
  const purchaseUrl = getPurchaseUrl(robot);

  const highlights = [
    { label: "Primary task", value: PRIMARY_TASK_LABELS[robot.primaryTask] },
    { label: "Form", value: ROBOT_TYPE_LABELS[robot.type] },
    { label: "Readiness", value: `${robot.readinessScore}/100`, mono: true },
    { label: "Price", value: robot.price, mono: true },
    {
      label: "Status",
      value: COMMERCIAL_STATUS_LABELS[robot.commercialStatus],
    },
  ];

  return (
    <div className="mt-3 overflow-hidden rounded-[18px] border border-line bg-panel/82 shadow-card backdrop-blur-[18px]">
      <div className="grid items-center gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-8">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill>
              {COMMERCIAL_STATUS_LABELS[robot.commercialStatus].toUpperCase()}
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
            {purchaseUrl ? (
              <BuyNowLink href={purchaseUrl} />
            ) : (
              <PrimaryLink href={`/robots/${robot.slug}`}>
                Open robot page
              </PrimaryLink>
            )}
            <Link
              href="/robots"
              className="inline-flex h-10 cursor-pointer items-center rounded-xl border border-line bg-panel-strong px-5 text-xs font-bold uppercase tracking-widest shadow-card transition-colors hover:border-blue/30"
            >
              Browse all robots
            </Link>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <RobotAvatar
            name={robot.name}
            imageUrl={getPrimaryRobotImage(robot)}
            size="lg"
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { Robot } from "@/types/robot";
import {
  COMMERCIAL_STATUS_LABELS,
  PRIMARY_TASK_LABELS,
  ROBOT_TYPE_LABELS,
} from "@/types/robot";
import { getSpotlightRobot } from "@/lib/random-robot";
import { getPurchaseUrl } from "@/lib/purchase";
import { getPrimaryRobotImage } from "@/lib/robot-images";
import { RobotAvatar } from "./RobotAvatar";
import { StatusPill } from "@/components/ui/Badge";
import { MonoValue } from "@/components/ui/DataValue";
import { DataValue } from "@/components/ui/DataValue";
import { BuyNowLink, PrimaryLink } from "@/components/ui/PrimaryLink";

export function DashboardSpotlight({ robots }: { robots: Robot[] }) {
  const robot = useMemo(() => getSpotlightRobot(robots), [robots]);
  const purchaseUrl = getPurchaseUrl(robot);

  const highlights = [
    { label: "Primary task", value: PRIMARY_TASK_LABELS[robot.primaryTask] },
    { label: "Type", value: ROBOT_TYPE_LABELS[robot.type] },
    { label: "Readiness", value: `${robot.readinessScore}/100`, mono: true },
    { label: "Price", value: robot.price, mono: true },
    {
      label: "Status",
      value: COMMERCIAL_STATUS_LABELS[robot.commercialStatus],
    },
  ];

  return (
    <section className="mb-8">
      <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
        Dashboard
      </div>

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

            <h1 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
              {robot.name}
            </h1>
            <p className="mt-1 text-lg font-semibold text-[#4d5561]">
              {robot.brand}
            </p>
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
                        <DataValue
                          value={item.value}
                          fallback="Unknown"
                        />
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

      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="rounded-xl border border-line bg-panel-strong px-4 py-3 shadow-card">
          <div className="text-muted">Robots tracked</div>
          <div className="font-mono text-2xl font-bold">{robots.length}</div>
        </div>
        <div className="rounded-xl border border-line bg-panel-strong px-4 py-3 shadow-card">
          <div className="text-muted">Avg readiness</div>
          <div className="font-mono text-2xl font-bold">
            {Math.round(
              robots.reduce((sum, r) => sum + r.readinessScore, 0) /
                robots.length,
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

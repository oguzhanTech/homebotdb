"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Robot } from "@/types/robot";
import type { Update } from "@/types/update";
import {
  AVAILABILITY_STATUS_LABELS,
  COMMERCIAL_STATUS_LABELS,
  ROBOT_TYPE_LABELS,
} from "@/types/robot";
import { useCompare } from "@/contexts/CompareContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { getPurchaseUrl } from "@/lib/purchase";
import { getPrimaryRobotImage, getRobotImages } from "@/lib/robot-images";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { RobotAvatar } from "./RobotAvatar";
import { RobotFeaturedVideo } from "./RobotFeaturedVideo";
import { RobotImagePlaceholder } from "./RobotImagePlaceholder";
import { UpdateCard, NewsCard, splitUpdatesByKind } from "./UpdatesSection";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, StatusPill } from "@/components/ui/Badge";
import { InfoRow, ScoreBar } from "@/components/ui/ScoreBar";
import { Tabs } from "@/components/ui/Tabs";
import { DataValue, MonoValue } from "@/components/ui/DataValue";
import { BuyNowLink } from "@/components/ui/PrimaryLink";
import { ShareButtons } from "@/components/update/ShareButtons";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const TAB_LIST = [
  "Overview",
  "Capabilities",
  "Tech Specs",
  "Ecosystem",
  "Availability",
  "Updates",
  "Reviews",
];

export function RobotDetailView({
  robot,
  similarRobots,
  updates,
  reviewsSection,
}: {
  robot: Robot;
  similarRobots: Robot[];
  updates: Update[];
  reviewsSection: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState("Overview");
  const { toggle, isSelected, isFull } = useCompare();
  const { toggle: toggleFavorite, isFavorite } = useFavorites();
  const purchaseUrl = getPurchaseUrl(robot);
  const heroImages = useMemo(
    () => getRobotImages(robot),
    [robot.slug, robot.imageUrl, robot.imageUrls?.join("|")],
  );

  const ghostNumber = robot.name.match(/\d+/)?.[0] ?? "";

  return (
    <>
      <div className="hero-grid grid gap-5 xl:grid-cols-[minmax(0,1fr)_356px]">
        <section className="product-stage relative min-h-[660px] border-b border-line pb-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
            <div className="flex flex-wrap items-center gap-4 font-mono text-xs uppercase tracking-[0.17em] text-[#5d6570]">
              <Link href="/robots">Robots</Link>
              <span>/</span>
              <span>{ROBOT_TYPE_LABELS[robot.type]}</span>
              <span>/</span>
              <span>{robot.brand}</span>
              <span>/</span>
              <span>{robot.name}</span>
            </div>
            <ShareButtons
              variant="subtle"
              showLabel={false}
              title={`${robot.name} — ${robot.brand}`}
              path={`/robots/${robot.slug}`}
              className="ml-auto shrink-0"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-[clamp(52px,6.6vw,88px)] font-medium leading-[0.82] tracking-[-0.08em]">
              {robot.name.toUpperCase()}
            </h1>
            <StatusPill>
              {COMMERCIAL_STATUS_LABELS[robot.commercialStatus].toUpperCase()}
            </StatusPill>
          </div>

          <BrandLogo
            brand={robot.brand}
            size="2xl"
            showName
            nameClassName="text-2xl font-semibold"
            className="mt-3.5"
          />
          <p className="mt-5 max-w-[405px] text-[15px] leading-relaxed text-[#565f6b]">
            {robot.shortDescription}
          </p>

          {ghostNumber && (
            <div className="pointer-events-none absolute left-4 top-[255px] z-0 text-[176px] font-bold tracking-[-0.12em] text-ink/[0.035] max-md:hidden">
              {ghostNumber}
            </div>
          )}

          <div className="relative mx-auto mt-8 flex -translate-x-1 justify-center sm:-translate-x-2 xl:absolute xl:right-16 xl:top-[108px] xl:mt-0 xl:translate-x-0">
            <RobotAvatar
              name={robot.name}
              imageUrls={heroImages}
              size="hero"
              enableCarousel={heroImages.length > 1}
            />
          </div>

          <div className="relative z-[3] mt-4 grid grid-cols-2 gap-4 font-mono xl:absolute xl:right-2 xl:top-20 xl:w-[142px] xl:grid-cols-1">
            {[
              ["Unit ID", robot.unitId ?? "Unknown"],
              ["Form", ROBOT_TYPE_LABELS[robot.type]],
              ["Height", robot.height],
              ["Weight", robot.weight],
            ].map(([label, value]) => (
              <div key={label} className="border-l border-line pl-3.5">
                <div className="text-[10px] uppercase tracking-[0.14em] text-[#a0a6ae]">
                  {label}
                </div>
                <div className="mt-1 text-xs font-bold tracking-wider">
                  <DataValue value={value} />
                </div>
              </div>
            ))}
          </div>

          <div className="relative z-[5] mt-5 flex flex-wrap gap-3 xl:absolute xl:left-0 xl:top-[375px] xl:mt-0">
            {purchaseUrl ? (
              <BuyNowLink href={purchaseUrl} className="h-11 px-6" />
            ) : null}
            <Button
              size="md"
              variant={isSelected(robot.slug) ? "blue" : "primary"}
              disabled={!isSelected(robot.slug) && isFull}
              onClick={() => toggle(robot.slug)}
            >
              {isSelected(robot.slug) ? "✓ In compare" : "＋ Add to compare"}
            </Button>
            <Button
              size="md"
              variant="secondary"
              onClick={() => toggleFavorite(robot.slug)}
            >
              {isFavorite(robot.slug) ? "♥ Favorited" : "♡ Add to favorites"}
            </Button>
          </div>

          <Card className="relative z-[5] mt-5 w-full max-w-[400px] xl:absolute xl:bottom-[34px] xl:mt-0">
            <div className="px-[18px] py-[17px] text-xs font-bold uppercase tracking-[0.13em]">
              Key Specs
            </div>
            <div className="grid grid-cols-2 border-y border-line sm:grid-cols-3">
              {(
                [
                  ["Height", robot.height, "height"],
                  ["Weight", robot.weight, "weight"],
                  ["Battery", robot.batteryLife, "batteryLife"],
                  ["Speed", robot.speed, "speed"],
                  ["Payload", robot.payload, "payload"],
                  ["DOF", robot.degreesOfFreedom ?? "Not specified", null],
                ] as const
              ).map(([label, value, metaKey]) => (
                <div
                  key={label}
                  className="border-r border-line p-[18px] last:border-r-0 nth-[2n]:border-r-0 sm:nth-[2n]:border-r sm:nth-[3n]:border-r-0"
                >
                  <div className="text-[10px] uppercase tracking-[0.12em] text-muted">
                    {label}
                  </div>
                  <div className="mt-1 text-[13px] font-bold">
                    <DataValue
                      value={value}
                      dataStatus={
                        metaKey ? robot.fieldMeta[metaKey]?.status : undefined
                      }
                      specNote={
                        metaKey ? robot.fieldMeta[metaKey]?.note : undefined
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <aside className="grid gap-[18px] md:grid-cols-3 xl:grid-cols-1">
          <Card className="p-5">
            <div className="text-xs font-bold uppercase tracking-[0.15em]">
              Readiness Score ⓘ
            </div>
            <div className="my-3 font-mono text-[56px] leading-none tracking-[-0.06em]">
              {robot.readinessScore}{" "}
              <span className="text-lg font-normal text-muted">/100</span>
            </div>
            <ScoreBar value={robot.readinessScore} />
            <InfoRow
              label="Reality Score"
              value={`${robot.realityScore} /100`}
            />
            <InfoRow
              label="Commercial Status"
              value={COMMERCIAL_STATUS_LABELS[robot.commercialStatus]}
            />
            <InfoRow
              label="Est. Price"
              value={
                <DataValue
                  value={robot.price}
                  fallback="Unknown"
                  priceStatus={robot.priceStatus}
                  dataStatus={robot.fieldMeta.price?.status}
                />
              }
            />
            <InfoRow
              label="Availability"
              value={AVAILABILITY_STATUS_LABELS[robot.availabilityStatus]}
            />
            <InfoRow label="First Announced" value={robot.firstAnnounced} />
            <InfoRow label="Last Update" value={formatDate(robot.lastUpdated)} />
            <InfoRow
              label="Data Freshness"
              value={`${robot.dataFreshnessScore}%`}
            />
            <InfoRow
              label="Data Confidence"
              value={`${robot.dataConfidenceScore}%`}
            />
            <Link
              href={`/admin/robots/${robot.slug}/price-history`}
              className="mt-2 flex h-[42px] items-center justify-between rounded-xl border border-line px-3.5 text-xs font-bold uppercase tracking-[0.12em]"
            >
              <span>⌁ Price History</span>
              <span>›</span>
            </Link>
          </Card>

          <Card className="p-3.5">
            <div className="mb-3 px-1.5 text-xs font-bold uppercase tracking-[0.15em]">
              Featured Video
            </div>
            <RobotFeaturedVideo
              videoUrls={robot.videoUrls}
              robotName={robot.name}
            />
          </Card>

          <Card className="p-[18px]">
            <div className="mb-3.5 flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-[0.15em]">
                Similar Robots
              </div>
              <Link href="/robots" className="text-xs font-bold text-blue">
                VIEW ALL
              </Link>
            </div>
            {similarRobots.map((similar) => (
              <Link
                key={similar.slug}
                href={`/robots/${similar.slug}`}
                className="grid grid-cols-[42px_1fr_auto] items-center gap-3 py-2.5"
              >
                <div className="overflow-hidden rounded-[10px] border border-line bg-gradient-to-b from-white to-[#e9ecef]">
                  <RobotAvatar
                    name={similar.name}
                    imageUrl={getPrimaryRobotImage(similar)}
                    size="sm"
                    showRings={false}
                    className="mx-auto"
                  />
                </div>
                <div>
                  <div className="text-[13px] font-bold">{similar.name.toUpperCase()}</div>
                  <BrandLogo brand={similar.brand} size="xs" showName nameClassName="text-xs text-muted font-normal" />
                </div>
                <MonoValue className="font-bold">{similar.readinessScore}</MonoValue>
              </Link>
            ))}
          </Card>
        </aside>
      </div>

      <Card className="mt-5 overflow-hidden">
        <Tabs tabs={TAB_LIST} active={activeTab} onChange={setActiveTab} />
        <div className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr]">
          {activeTab === "Overview" && (
            <>
              <div>
                <h3 className="mb-4 text-[13px] uppercase tracking-[0.14em]">
                  About {robot.name}
                </h3>
                <div className="space-y-4">
                  {robot.longDescription.split(/\n\n+/).map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-[15px] leading-[1.62] text-[#4d5662]"
                    >
                      {paragraph.trim()}
                    </p>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {robot.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-4 text-[13px] uppercase tracking-[0.14em]">
                  Data sources
                </h3>
                {robot.sourceUrls.length > 0 ? (
                  <ul className="space-y-2 text-sm">
                    {robot.sourceUrls.map((url) => (
                      <li key={url}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue hover:underline"
                        >
                          {url}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted">Unknown</p>
                )}
              </div>
            </>
          )}

          {activeTab === "Capabilities" && (
            <div className="lg:col-span-2">
              {robot.capabilities.map((cap) => (
                <div
                  key={cap.name}
                  className="mb-3.5 grid grid-cols-[120px_1fr_38px] items-center gap-3 text-sm"
                >
                  <span>{cap.name}</span>
                  <div className="h-[5px] overflow-hidden rounded-full bg-[#eceff2]">
                    <span
                      className="block h-full rounded-full bg-ink"
                      style={{ width: `${cap.score}%` }}
                    />
                  </div>
                  <strong>{cap.score}</strong>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Tech Specs" && (
            <div className="lg:col-span-2 grid sm:grid-cols-2 sm:gap-x-14">
              {[
                ["Battery life", robot.batteryLife, "batteryLife"],
                ["Charge time", robot.chargeTime, "chargeTime"],
                ["Speed", robot.speed, "speed"],
                ["Payload", robot.payload, "payload"],
                ["Sensors", robot.sensors, null],
                ["Processor", robot.processor, null],
                ["Connectivity", robot.connectivity, null],
                ["Height", robot.height, "height"],
                ["Weight", robot.weight, "weight"],
              ].map(([label, value, metaKey], index) => (
                <InfoRow
                  key={String(label)}
                  label={String(label)}
                  value={
                    <DataValue
                      value={value as string}
                      dataStatus={
                        metaKey ? robot.fieldMeta[metaKey]?.status : undefined
                      }
                      specNote={
                        metaKey ? robot.fieldMeta[metaKey]?.note : undefined
                      }
                    />
                  }
                  className={cn(index % 2 === 0 ? "sm:pr-5" : "sm:pl-5")}
                />
              ))}
            </div>
          )}

          {activeTab === "Ecosystem" && (
            <div className="lg:col-span-2">
              {robot.ecosystem.length > 0 ? (
                <ul className="space-y-2">
                  {robot.ecosystem.map((item) => (
                    <li key={item} className="rounded-xl border border-line px-4 py-3 text-sm">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">Coming soon</p>
              )}
            </div>
          )}

          {activeTab === "Availability" && (
            <div className="lg:col-span-2">
              <InfoRow label="Commercial status" value={COMMERCIAL_STATUS_LABELS[robot.commercialStatus]} />
              <InfoRow
                label="Availability"
                value={AVAILABILITY_STATUS_LABELS[robot.availabilityStatus]}
              />
              <InfoRow
                label="Countries"
                value={
                  robot.countriesAvailable.length > 0
                    ? robot.countriesAvailable.join(", ")
                    : "Unknown"
                }
              />
            </div>
          )}

          {activeTab === "Updates" && (
            <div className="lg:col-span-2 space-y-8">
              {(() => {
                const { dataUpdates, news } = splitUpdatesByKind(updates);
                return (
                  <>
                    <div>
                      <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
                        Data updates
                      </div>
                      {dataUpdates.length > 0 ? (
                        <div className="grid gap-3 md:grid-cols-2">
                          {dataUpdates.map((update) => (
                            <UpdateCard key={update.id} update={update} />
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted">No data updates for this robot.</p>
                      )}
                    </div>
                    <div>
                      <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
                        News
                      </div>
                      {news.length > 0 ? (
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                          {news.map((update) => (
                            <NewsCard
                              key={update.id}
                              update={update}
                              showAuthor={false}
                              compact
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted">No news for this robot.</p>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {activeTab === "Reviews" && (
            <div className="lg:col-span-2">{reviewsSection}</div>
          )}
        </div>
      </Card>
    </>
  );
}

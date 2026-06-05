import type { Robot } from "@/types/robot";

const TRACKED_FIELDS: (keyof Robot)[] = [
  "price",
  "batteryLife",
  "chargeTime",
  "height",
  "weight",
  "speed",
  "payload",
  "sensors",
  "processor",
  "connectivity",
  "readinessScore",
  "realityScore",
  "commercialStatus",
  "availabilityStatus",
  "countriesAvailable",
  "firstAnnounced",
  "longDescription",
  "videoUrls",
  "sourceUrls",
];

function isFieldFilled(robot: Robot, field: keyof Robot): boolean {
  const value = robot[field];
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return true;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

export function computeFieldCompleteness(robot: Robot): number {
  const filled = TRACKED_FIELDS.filter((field) => isFieldFilled(robot, field)).length;
  return Math.round((filled / TRACKED_FIELDS.length) * 100);
}

export function computeConfirmedRatio(robot: Robot): number {
  const metaEntries = Object.values(robot.fieldMeta ?? {});
  if (metaEntries.length === 0) return 50;
  const confirmed = metaEntries.filter((entry) => entry.status === "confirmed").length;
  return Math.round((confirmed / metaEntries.length) * 100);
}

export function computeRecencyScore(lastUpdated: string): number {
  if (!lastUpdated) return 0;
  const updated = new Date(lastUpdated);
  if (Number.isNaN(updated.getTime())) return 0;

  const daysSince = Math.floor(
    (Date.now() - updated.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysSince <= 30) return 100;
  if (daysSince <= 90) return 75;
  if (daysSince <= 180) return 50;
  if (daysSince <= 365) return 25;
  return 10;
}

export function computeDataFreshnessScore(robot: Robot): number {
  const completeness = computeFieldCompleteness(robot);
  const recency = computeRecencyScore(robot.lastUpdated);
  return Math.round(completeness * 0.4 + recency * 0.6);
}

export function computeDataConfidenceScore(robot: Robot): number {
  const confirmed = computeConfirmedRatio(robot);
  const sourceBonus = Math.min((robot.sourceUrls?.length ?? 0) * 10, 30);
  return Math.min(Math.round(confirmed * 0.7 + sourceBonus), 100);
}

export function enrichRobotScores(robot: Robot): Robot {
  return {
    ...robot,
    dataFreshnessScore: computeDataFreshnessScore(robot),
    dataConfidenceScore: computeDataConfidenceScore(robot),
  };
}

export function computeAggregateFreshness(robots: Robot[]): number {
  if (robots.length === 0) return 0;
  const total = robots.reduce(
    (sum, robot) => sum + computeDataFreshnessScore(robot),
    0,
  );
  return Math.round(total / robots.length);
}

export function getLatestUpdateDate(robots: Robot[]): string | null {
  const dates = robots
    .map((robot) => robot.lastUpdated)
    .filter(Boolean)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  return dates[0] ?? null;
}

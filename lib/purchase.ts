import type { Robot } from "@/types/robot";

export function getPurchaseUrl(robot: Robot): string | null {
  if (
    robot.availabilityStatus === "unavailable" ||
    robot.availabilityStatus === "discontinued"
  ) {
    return null;
  }
  if (robot.commercialStatus === "discontinued") return null;
  if (robot.commercialStatus !== "buy_now") return null;
  const url = robot.affiliateUrl?.trim();
  if (!url) return null;
  return url;
}

export function isPurchasable(robot: Robot): boolean {
  return getPurchaseUrl(robot) !== null;
}

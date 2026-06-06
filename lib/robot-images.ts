import type { Robot } from "@/types/robot";

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getRobotImages(robot: Robot): string[] {
  const fromList = robot.imageUrls?.map((url) => url.trim()).filter(Boolean) ?? [];
  if (fromList.length > 0) return fromList;

  const primary = robot.imageUrl?.trim();
  if (primary) return [primary];

  return [];
}

export function getPrimaryRobotImage(robot: Robot): string | undefined {
  return getRobotImages(robot)[0];
}

/** Stable image pick for UI cards — avoids hydration flicker. */
export function pickRobotImage(robot: Robot, seed = robot.slug): string | undefined {
  const images = getRobotImages(robot);
  if (images.length === 0) return undefined;
  if (images.length === 1) return images[0];
  return images[hashString(seed) % images.length];
}

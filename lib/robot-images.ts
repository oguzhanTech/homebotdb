import type { Robot } from "@/types/robot";

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

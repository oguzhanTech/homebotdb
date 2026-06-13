import type { Robot } from "@/types/robot";
import {
  AVAILABILITY_STATUS_LABELS,
  COMMERCIAL_STATUS_LABELS,
} from "@/types/robot";

/** Hero pill / spotlight: reflect stock reality when not simply "available". */
export function getRobotHeroStatusLabel(robot: Robot): string {
  if (robot.availabilityStatus !== "available") {
    return AVAILABILITY_STATUS_LABELS[robot.availabilityStatus];
  }
  return COMMERCIAL_STATUS_LABELS[robot.commercialStatus];
}

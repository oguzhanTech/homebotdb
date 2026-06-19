import { isPurchasable } from "@/lib/purchase";
import type { Robot } from "@/types/robot";

export function getRobotCatalogErrors(robot: Robot): string[] {
  const errors: string[] = [];

  if (robot.availabilityStatus === "available" && !isPurchasable(robot)) {
    errors.push(
      `${robot.slug}: availability is Available but there is no Buy Now purchase link`,
    );
  }

  return errors;
}

export function assertRobotCatalogConsistency(robots: Robot[]): void {
  const errors = robots.flatMap(getRobotCatalogErrors);
  if (errors.length === 0) return;

  throw new Error(`Robot catalog inconsistencies:\n${errors.map((e) => `  - ${e}`).join("\n")}`);
}

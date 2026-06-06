import { siteConfig } from "@/config/site";
import { getRobotBySlug } from "@/lib/data/repository";
import { getPrimaryRobotImage } from "@/lib/robot-images";
import type { Update } from "@/types/update";
import { isNewsUpdate } from "@/types/update";

export function getUpdateCoverImage(update: Update): string | undefined {
  if (update.coverImage?.trim()) return update.coverImage.trim();

  if (isNewsUpdate(update.type) && update.robotSlug) {
    const robot = getRobotBySlug(update.robotSlug);
    const robotImage = robot ? getPrimaryRobotImage(robot) : undefined;
    if (robotImage) return robotImage;
  }

  if (isNewsUpdate(update.type)) {
    return siteConfig.defaultOgImage;
  }

  return undefined;
}

export function getAbsoluteUpdateCoverImage(update: Update): string {
  const cover = getUpdateCoverImage(update);
  if (!cover) return `${siteConfig.url}${siteConfig.defaultOgImage}`;
  if (cover.startsWith("http")) return cover;
  return `${siteConfig.url}${cover}`;
}

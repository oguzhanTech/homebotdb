import { buildComparePath } from "@/lib/compare";
import { getRobotBySlug } from "@/lib/data/repository";
import type { Robot } from "@/types/robot";
import type { Update } from "@/types/update";

export interface UpdateExploreLink {
  href: string;
  label: string;
  primary?: boolean;
}

export interface UpdateExploreSections {
  featured: UpdateExploreLink[];
  compare: UpdateExploreLink[];
  relatedRobots: UpdateExploreLink[];
  site: UpdateExploreLink[];
}

function robotLink(robot: Robot, primary = false): UpdateExploreLink {
  return {
    href: `/robots/${robot.slug}`,
    label: robot.name,
    primary,
  };
}

function compareLink(a: Robot, b: Robot): UpdateExploreLink {
  return {
    href: buildComparePath([a.slug, b.slug]),
    label: `${a.name} vs ${b.name}`,
  };
}

export function getUpdateExploreSections(update: Update): UpdateExploreSections {
  const robot = update.robotSlug ? getRobotBySlug(update.robotSlug) : undefined;
  const featured: UpdateExploreLink[] = [];
  const compare: UpdateExploreLink[] = [];
  const relatedRobots: UpdateExploreLink[] = [];

  if (robot) {
    featured.push(robotLink(robot, true));

    const peers = robot.similarRobotSlugs
      .map((slug) => getRobotBySlug(slug))
      .filter((peer): peer is Robot => Boolean(peer))
      .slice(0, 3);

    for (const peer of peers) {
      compare.push(compareLink(robot, peer));
      relatedRobots.push(robotLink(peer));
    }
  }

  const site: UpdateExploreLink[] = [
    { href: "/compare", label: "Compare robots" },
    { href: "/robots", label: "Robot catalog" },
    { href: "/wizard", label: "Robot Matchmaker" },
    {
      href: update.type === "news" ? "/news" : "/updates",
      label: update.type === "news" ? "All news" : "Radar Feed",
    },
  ];

  return { featured, compare, relatedRobots, site };
}

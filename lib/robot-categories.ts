import type { PrimaryTask, RobotType } from "@/types/robot";
import { uiCopy } from "@/config/ui-copy";
import { filterRobots } from "@/lib/data/repository";

export interface RobotCategoryHub {
  slug: string;
  title: string;
  description: string;
  icon: string;
  filterType: "type" | "task";
  filterValue: RobotType | PrimaryTask;
}

export const ROBOT_CATEGORY_HUBS: RobotCategoryHub[] = [
  {
    slug: "humanoid",
    title: "Humanoid",
    description: "Bipedal home and companion robots with arms and mobility.",
    icon: uiCopy.categoryMissionIcons.humanoid,
    filterType: "type",
    filterValue: "humanoid",
  },
  {
    slug: "home-assistant",
    title: "Home Assistant",
    description: "Robots built for daily help, presence, and household tasks.",
    icon: uiCopy.categoryMissionIcons.homeAssistant,
    filterType: "task",
    filterValue: "home_assistant",
  },
  {
    slug: "elder-care",
    title: "Elder Care",
    description: "Companions and assistants focused on aging in place.",
    icon: uiCopy.categoryMissionIcons.elderCare,
    filterType: "task",
    filterValue: "elder_care",
  },
  {
    slug: "conversation",
    title: "Conversation",
    description: "Social bots tuned for chat, memory, and emotional presence.",
    icon: uiCopy.categoryMissionIcons.conversation,
    filterType: "task",
    filterValue: "conversation",
  },
  {
    slug: "zoomorphic",
    title: "Animal-like",
    description: "Pet-form companions and zoomorphic desk robots.",
    icon: uiCopy.categoryMissionIcons.zoomorphic,
    filterType: "type",
    filterValue: "zoomorphic",
  },
  {
    slug: "desktop",
    title: "Desktop",
    description: "Tabletop assistants, kits, and compact desk companions.",
    icon: uiCopy.categoryMissionIcons.desktop,
    filterType: "type",
    filterValue: "desktop",
  },
];

const categoryBySlug = new Map(
  ROBOT_CATEGORY_HUBS.map((category) => [category.slug, category]),
);

export function getRobotCategoryBySlug(
  slug: string,
): RobotCategoryHub | undefined {
  return categoryBySlug.get(slug);
}

export function getAllCategorySlugs(): string[] {
  return ROBOT_CATEGORY_HUBS.map((category) => category.slug);
}

export function isCategorySlug(slug: string): boolean {
  return categoryBySlug.has(slug);
}

export function getCategoryRobotCount(category: RobotCategoryHub): number {
  if (category.filterType === "type") {
    return filterRobots({ type: category.filterValue as RobotType }).length;
  }
  return filterRobots({
    primaryTask: category.filterValue as PrimaryTask,
  }).length;
}

export function getCategoryLockedFilters(
  category: RobotCategoryHub,
): { type?: RobotType; primaryTask?: PrimaryTask } {
  if (category.filterType === "type") {
    return { type: category.filterValue as RobotType };
  }
  return { primaryTask: category.filterValue as PrimaryTask };
}

export function getCategorySearchParams(
  category: RobotCategoryHub,
): Record<string, string> {
  if (category.filterType === "type") {
    return { type: category.filterValue };
  }
  return { task: category.filterValue };
}

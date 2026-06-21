import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { getRobotBySlug, getRobots } from "@/lib/data/repository";

export const INTERNAL_PATH_PATTERN =
  /(\/(?:robots|compare|updates|news|wizard)(?:\/[a-z0-9-]+(?:-vs-[a-z0-9-]+)?)?)/i;

export const INTERNAL_LINK_CLASS =
  "prose-internal-link cursor-pointer rounded-[6px] border border-blue/30 bg-blue-soft px-1.5 py-0.5 font-semibold text-blue transition-colors hover:border-blue/45 hover:bg-[#dce8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/30";

export const EXTERNAL_PROSE_LINK_CLASS =
  "cursor-pointer font-semibold text-blue underline decoration-blue/50 underline-offset-[3px] transition-colors hover:decoration-blue";

type TextSegment = { type: "text"; value: string };

type LinkSegment = {
  type: "link";
  href: string;
  label: string;
  matchLength: number;
};

type Segment = TextSegment | LinkSegment;

type RobotMatcher = {
  pattern: RegExp;
  href: string;
};

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function asciiFold(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "");
}

function robotNamePattern(name: string): RegExp {
  return new RegExp(`(?<![A-Za-z0-9_/])${escapeRegex(name)}(?![A-Za-z0-9])`, "i");
}

function buildRobotMatchers(): RobotMatcher[] {
  const entries = new Map<string, string>();

  for (const robot of getRobots()) {
    const add = (label: string) => {
      const key = label.trim().toLowerCase();
      if (!key || entries.has(key)) return;
      entries.set(key, robot.slug);
    };

    add(robot.name);

    const folded = asciiFold(robot.name);
    if (folded !== robot.name) {
      add(folded);
    }

    const slugWords = robot.slug.replace(/-/g, " ");
    if (slugWords.toLowerCase() !== robot.name.toLowerCase()) {
      add(slugWords);
    }

    if (!robot.name.toLowerCase().includes(robot.brand.toLowerCase())) {
      add(`${robot.brand} ${robot.name}`);
    }
  }

  return [...entries.entries()]
    .sort(([left], [right]) => right.length - left.length)
    .map(([label, slug]) => ({
      pattern: robotNamePattern(label),
      href: `/robots/${slug}`,
    }));
}

let cachedRobotMatchers: RobotMatcher[] | null = null;

function getRobotMatchers(): RobotMatcher[] {
  if (!cachedRobotMatchers) {
    cachedRobotMatchers = buildRobotMatchers();
  }
  return cachedRobotMatchers;
}

export function labelForPath(href: string): string {
  if (href === "/robots") return "robot catalog";
  if (href === "/compare") return "Compare robots";
  if (href === "/updates") return "Radar Feed";
  if (href === "/news") return "News";
  if (href === "/wizard") return "Robot Matchmaker";

  if (href.startsWith("/robots/")) {
    const slug = href.replace("/robots/", "");
    return getRobotBySlug(slug)?.name ?? slug.replace(/-/g, " ");
  }

  if (href.startsWith("/compare/")) {
    const slug = href.replace("/compare/", "");
    const parts = slug.split("-vs-");
    if (parts.length === 2) {
      const left = getRobotBySlug(parts[0])?.name ?? parts[0];
      const right = getRobotBySlug(parts[1])?.name ?? parts[1];
      return `${left} vs ${right}`;
    }
    return slug.replace(/-vs-/g, " vs ");
  }

  return href.replace(/^\//, "");
}

function tryMatchAt(text: string, index: number): LinkSegment | null {
  const rest = text.slice(index);

  const pathMatch = rest.match(INTERNAL_PATH_PATTERN);
  if (pathMatch?.index === 0) {
    const href = pathMatch[0];
    return {
      type: "link",
      href,
      label: labelForPath(href),
      matchLength: href.length,
    };
  }

  for (const matcher of getRobotMatchers()) {
    const robotMatch = rest.match(matcher.pattern);
    if (robotMatch?.index === 0) {
      return {
        type: "link",
        href: matcher.href,
        label: robotMatch[0],
        matchLength: robotMatch[0].length,
      };
    }
  }

  return null;
}

export function segmentPlainText(text: string): Segment[] {
  const segments: Segment[] = [];
  let index = 0;

  while (index < text.length) {
    const match = tryMatchAt(text, index);
    if (match) {
      segments.push(match);
      index += match.matchLength;
      continue;
    }

    const nextIndex = index + 1;
    const previous = segments.at(-1);
    if (previous?.type === "text") {
      previous.value += text[index];
    } else {
      segments.push({ type: "text", value: text[index] ?? "" });
    }
    index = nextIndex;
  }

  return segments;
}

export function linkifyPlainText(text: string, keyPrefix: string): ReactNode[] {
  return segmentPlainText(text).map((segment, index) => {
    if (segment.type === "text") {
      return <Fragment key={`${keyPrefix}-${index}`}>{segment.value}</Fragment>;
    }

    return (
      <Link
        key={`${keyPrefix}-${index}`}
        href={segment.href}
        className={INTERNAL_LINK_CLASS}
      >
        {segment.label}
      </Link>
    );
  });
}

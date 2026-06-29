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
  return new RegExp(`${escapeRegex(name)}`, "i");
}

function hasValidRobotNameBoundaries(
  text: string,
  start: number,
  length: number,
): boolean {
  const before = start > 0 ? text[start - 1]! : "";
  const after =
    start + length < text.length ? text[start + length]! : "";
  return !/[A-Za-z0-9_/]/.test(before) && !/[A-Za-z0-9]/.test(after);
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
      const matchLength = robotMatch[0].length;
      if (!hasValidRobotNameBoundaries(text, index, matchLength)) {
        continue;
      }

      return {
        type: "link",
        href: matcher.href,
        label: robotMatch[0],
        matchLength,
      };
    }
  }

  return null;
}

function appendTextChar(segments: Segment[], char: string) {
  const previous = segments.at(-1);
  if (previous?.type === "text") {
    previous.value += char;
  } else {
    segments.push({ type: "text", value: char });
  }
}

function appendPlainText(segments: Segment[], value: string) {
  if (!value) return;
  const previous = segments.at(-1);
  if (previous?.type === "text") {
    previous.value += value;
  } else {
    segments.push({ type: "text", value });
  }
}

export function segmentPlainText(
  text: string,
  usedHrefs?: Set<string>,
): Segment[] {
  const segments: Segment[] = [];
  let index = 0;

  while (index < text.length) {
    const match = tryMatchAt(text, index);
    if (match) {
      if (usedHrefs?.has(match.href)) {
        appendPlainText(segments, text.slice(index, index + match.matchLength));
        index += match.matchLength;
        continue;
      }

      usedHrefs?.add(match.href);
      segments.push(match);
      index += match.matchLength;
      continue;
    }

    appendTextChar(segments, text[index] ?? "");
    index += 1;
  }

  return segments;
}

export function linkifyPlainText(
  text: string,
  keyPrefix: string,
  usedHrefs?: Set<string>,
): ReactNode[] {
  return segmentPlainText(text, usedHrefs).map((segment, index) => {
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

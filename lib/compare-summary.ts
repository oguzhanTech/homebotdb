import type { Robot } from "@/types/robot";
import {
  AVAILABILITY_STATUS_LABELS,
  COMMERCIAL_STATUS_LABELS,
  PRIMARY_TASK_LABELS,
  ROBOT_TYPE_LABELS,
} from "@/types/robot";
import { uiCopy } from "@/config/ui-copy";
import { getWinningIndices, parseCompareNumber } from "@/lib/compare-metrics";

export const COMPARE_CAPABILITY_NAMES = [
  "Mobility",
  "Manipulation",
  "Perception",
  "Autonomy",
  "Social Interaction",
  "Home Navigation",
] as const;

export const COMPARE_SECTION_IDS = [
  "performance",
  "specs",
  "availability",
  "intelligence",
] as const;

export type CompareSectionId = (typeof COMPARE_SECTION_IDS)[number];

export type CompareRowKind = "score" | "text";

export interface CompareRow {
  label: string;
  values: string[];
  winners: number[];
  kind: CompareRowKind;
}

export interface CompareSection {
  id: CompareSectionId;
  title: string;
  rows: CompareRow[];
}

export interface CompareRobotWins {
  robotIndex: number;
  robotName: string;
  robotSlug: string;
  winCount: number;
  categories: string[];
}

export interface CompareVerdict {
  comparableRowCount: number;
  winsByRobot: CompareRobotWins[];
  headline: string;
  detail: string;
  summaryForMeta: string;
}

export interface CompareChooseEntry {
  robotIndex: number;
  robotName: string;
  robotSlug: string;
  bullets: string[];
}

function capabilityValue(robot: Robot, name: string): string {
  const cap = robot.capabilities.find((c) => c.name === name);
  return cap ? String(cap.score) : "Not specified";
}

function row(
  label: string,
  values: string[],
  kind: CompareRowKind,
): CompareRow {
  return {
    label,
    values,
    winners: getWinningIndices(label, values),
    kind,
  };
}

export function buildCompareSections(robots: Robot[]): CompareSection[] {
  const performanceRows: CompareRow[] = [
    row(
      uiCopy.scores.readinessScore,
      robots.map((r) => String(r.readinessScore)),
      "score",
    ),
    row(
      uiCopy.scores.realityScore,
      robots.map((r) => String(r.realityScore)),
      "score",
    ),
    row(
      uiCopy.scores.freshnessScore,
      robots.map((r) => `${r.dataFreshnessScore}%`),
      "score",
    ),
    row(
      "Speed",
      robots.map((r) => r.speed || "Not specified"),
      "text",
    ),
    row(
      "Payload",
      robots.map((r) => r.payload || "Not specified"),
      "text",
    ),
  ];

  const specsRows: CompareRow[] = [
    row("Height", robots.map((r) => r.height || "Not specified"), "text"),
    row("Weight", robots.map((r) => r.weight || "Not specified"), "text"),
    row("Battery", robots.map((r) => r.batteryLife || "Not specified"), "text"),
    row("Form", robots.map((r) => ROBOT_TYPE_LABELS[r.type]), "text"),
  ];

  const availabilityRows: CompareRow[] = [
    row("Price", robots.map((r) => r.price || "Unknown"), "text"),
    row(
      uiCopy.scores.marketStatus,
      robots.map((r) => COMMERCIAL_STATUS_LABELS[r.commercialStatus]),
      "text",
    ),
    row(
      "Availability",
      robots.map((r) => AVAILABILITY_STATUS_LABELS[r.availabilityStatus]),
      "text",
    ),
    row(
      "Countries",
      robots.map((r) =>
        r.countriesAvailable.length > 0
          ? r.countriesAvailable.join(", ")
          : "Unknown",
      ),
      "text",
    ),
  ];

  const intelligenceRows: CompareRow[] = [
    ...COMPARE_CAPABILITY_NAMES.map((name) =>
      row(
        name,
        robots.map((r) => capabilityValue(r, name)),
        "score",
      ),
    ),
    row("Sensors", robots.map((r) => r.sensors || "Not specified"), "text"),
    row(
      "Connectivity",
      robots.map((r) => r.connectivity || "Not specified"),
      "text",
    ),
    row(
      "Ecosystem",
      robots.map((r) =>
        r.ecosystem.length > 0 ? r.ecosystem.join("; ") : "Coming soon",
      ),
      "text",
    ),
  ];

  return [
    { id: "performance", title: uiCopy.compare.sections.performance, rows: performanceRows },
    { id: "specs", title: uiCopy.compare.sections.specs, rows: specsRows },
    {
      id: "availability",
      title: uiCopy.compare.sections.availability,
      rows: availabilityRows,
    },
    {
      id: "intelligence",
      title: uiCopy.compare.sections.intelligence,
      rows: intelligenceRows,
    },
  ];
}

function formatCategoryList(categories: string[]): string {
  if (categories.length === 0) return "";
  if (categories.length === 1) return categories[0]!;
  if (categories.length === 2) return `${categories[0]} and ${categories[1]}`;
  return `${categories.slice(0, -1).join(", ")}, and ${categories[categories.length - 1]}`;
}

export function buildCompareVerdict(
  robots: Robot[],
  sections: CompareSection[],
): CompareVerdict {
  const allRows = sections.flatMap((section) => section.rows);
  const comparableRows = allRows.filter((r) => r.winners.length === 1);

  const winsByRobot: CompareRobotWins[] = robots.map((robot, robotIndex) => ({
    robotIndex,
    robotName: robot.name,
    robotSlug: robot.slug,
    winCount: 0,
    categories: [],
  }));

  for (const compareRow of comparableRows) {
    const winnerIndex = compareRow.winners[0]!;
    const entry = winsByRobot[winnerIndex]!;
    entry.winCount += 1;
    entry.categories.push(compareRow.label);
  }

  const sorted = [...winsByRobot].sort((a, b) => b.winCount - a.winCount);
  const leader = sorted[0]!;
  const comparableRowCount = comparableRows.length;

  const headline =
    comparableRowCount === 0
      ? uiCopy.compare.verdict.noComparableRows
      : uiCopy.compare.verdict.headline(
          leader.robotName,
          leader.winCount,
          comparableRowCount,
        );

  const detailParts = winsByRobot
    .filter((entry) => entry.winCount > 0)
    .map(
      (entry) =>
        `${entry.robotName} leads on ${formatCategoryList(entry.categories.slice(0, 4))}${entry.categories.length > 4 ? ` (+${entry.categories.length - 4} more)` : ""}.`,
    );

  const detail = detailParts.join(" ");

  const summaryParts = sorted
    .filter((entry) => entry.winCount > 0)
    .map((entry) => {
      const top = entry.categories.slice(0, 3);
      return `${entry.robotName} leads on ${formatCategoryList(top)}`;
    });

  const names = robots.map((r) => r.name).join(" vs ");
  const summaryForMeta =
    summaryParts.length > 0
      ? `${summaryParts.join(". ")}. Compare ${names} specs and scores on HomeBotRadar.`
      : `Compare ${names} side by side. Specs, scores, availability, and home capabilities on HomeBotRadar.`;

  return {
    comparableRowCount,
    winsByRobot,
    headline,
    detail,
    summaryForMeta,
  };
}

function avgOpponentScore(robot: Robot, others: Robot[], field: "readinessScore" | "realityScore"): number {
  if (others.length === 0) return 0;
  const sum = others.reduce((acc, r) => acc + r[field], 0);
  return sum / others.length;
}

function commercialLabel(status: Robot["commercialStatus"]): string {
  return COMMERCIAL_STATUS_LABELS[status].toLowerCase();
}

function topCapabilities(robot: Robot, limit = 2): string[] {
  return [...robot.capabilities]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((c) => c.name.toLowerCase());
}

export function buildChooseGuidance(robots: Robot[]): CompareChooseEntry[] {
  return robots.map((robot, robotIndex) => {
    const others = robots.filter((_, i) => i !== robotIndex);
    const bullets: string[] = [];

    const readinessLead =
      robot.readinessScore - avgOpponentScore(robot, others, "readinessScore");
    if (readinessLead >= 5) {
      bullets.push(
        `You want higher readiness (${robot.readinessScore}/100 vs peers) for near-term home use.`,
      );
    }

    const realityLead =
      robot.realityScore - avgOpponentScore(robot, others, "realityScore");
    if (realityLead >= 5) {
      bullets.push(
        `Verified shipping and public proof matter more to you (reality score ${robot.realityScore}/100).`,
      );
    }

    const robotPrice = parseCompareNumber(robot.price);
    const opponentPrices = others
      .map((r) => parseCompareNumber(r.price))
      .filter((p): p is number => p !== null);
    if (robotPrice !== null && opponentPrices.length > 0) {
      const minOpponent = Math.min(...opponentPrices);
      if (robotPrice < minOpponent * 0.85) {
        bullets.push(
          `Budget is a priority and ${robot.name} lists lower (${robot.price}).`,
        );
      }
    }

    const buyableStatuses: Robot["commercialStatus"][] = [
      "buy_now",
      "pre_order",
    ];
    const opponentBuyable = others.some((r) =>
      buyableStatuses.includes(r.commercialStatus),
    );
    if (
      buyableStatuses.includes(robot.commercialStatus) &&
      !opponentBuyable
    ) {
      bullets.push(
        `You need a ${commercialLabel(robot.commercialStatus)} path today while alternatives are still prototype or coming soon.`,
      );
    } else if (
      robot.commercialStatus === "prototype" &&
      others.every((r) => buyableStatuses.includes(r.commercialStatus))
    ) {
      bullets.push(
        `You are tracking a prototype platform and do not need a buy box this year.`,
      );
    }

    if (robot.primaryTask !== others[0]?.primaryTask) {
      const taskLabel = PRIMARY_TASK_LABELS[robot.primaryTask].toLowerCase();
      const uniqueAmongPeers = others.every(
        (r) => r.primaryTask !== robot.primaryTask,
      );
      if (uniqueAmongPeers) {
        bullets.push(
          `Your main goal is ${taskLabel}, which ${robot.name} targets directly.`,
        );
      }
    }

    const tops = topCapabilities(robot);
    if (tops.length >= 2) {
      bullets.push(
        `Strengths like ${tops[0]} and ${tops[1]} match how you plan to use it at home.`,
      );
    }

    if (robot.type !== others[0]?.type) {
      const typeLabel = ROBOT_TYPE_LABELS[robot.type].toLowerCase();
      const uniqueType = others.every((r) => r.type !== robot.type);
      if (uniqueType) {
        bullets.push(
          `You prefer a ${typeLabel} form factor over the alternatives in this compare.`,
        );
      }
    }

    if (bullets.length === 0) {
      bullets.push(
        `${robot.name} is the closest overall match if you want balanced scores across this pair.`,
      );
    }

    return {
      robotIndex,
      robotName: robot.name,
      robotSlug: robot.slug,
      bullets: bullets.slice(0, 5),
    };
  });
}

export function buildCompareFaqAnswer(
  robots: Robot[],
  verdict: CompareVerdict,
  guidance: CompareChooseEntry[],
): string {
  const names = robots.map((r) => r.name).join(" or ");
  const chooseParts = guidance.map(
    (entry) =>
      `Choose ${entry.robotName} if ${entry.bullets[0]?.replace(/^You /, "you ").replace(/\.$/, "") ?? "it fits your goals"}.`,
  );
  return `${verdict.headline} ${verdict.detail} ${chooseParts.join(" ")}`.trim();
}

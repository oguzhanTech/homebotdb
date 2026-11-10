import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { getPrimaryRobotImage } from "@/lib/robot-images";
import { RobotAvatarHoverPreview } from "@/components/robot/RobotAvatarHoverPreview";
import {
  COMMERCIAL_STATUS_LABELS,
} from "@/types/robot";
import type { RankingArticle } from "@/lib/rankings";
import { rankingUsesScore, robotsForRanking } from "@/lib/rankings";

export function RankingTable({ article }: { article: RankingArticle }) {
  const robots = robotsForRanking(article.list);
  const byScore = rankingUsesScore(article.list);

  return (
    <div className="mt-6">
      <p className="text-sm leading-relaxed text-[#565f6b]">
        {article.list === "cheapest"
          ? "This order is the confirmed starting price, lowest first. Readiness and reality stay on the row, and they do not change the rank."
          : article.list === "coming"
            ? "Order is the two catalog scores added together. Readiness is how close the robot is to home use. Reality is how much of that is already proven outside a demo. None of these robots has a cart."
            : "Best on this page is the two catalog scores added together. Readiness is how close the robot is to home use. Reality is how much of that is already proven outside a demo. Price does not move this order."}
      </p>
      <div className="mt-4 overflow-x-auto rounded-[18px] border border-line bg-panel/82 shadow-card">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-line text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
            <th className="px-4 py-3 font-bold">#</th>
            <th className="px-4 py-3 font-bold">Robot</th>
            <th className="px-4 py-3 font-bold">Price</th>
            <th className="px-4 py-3 font-bold">Status</th>
            <th className="px-4 py-3 font-bold">Readiness</th>
            <th className="px-4 py-3 font-bold">Reality</th>
            {byScore ? <th className="px-4 py-3 font-bold">Total</th> : null}
          </tr>
        </thead>
        <tbody>
          {robots.map((robot, index) => (
            <tr key={robot.slug} className="border-b border-line last:border-0">
              <td className="px-4 py-3 font-mono text-xs text-muted">{index + 1}</td>
              <td className="px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-line bg-white">
                    <RobotAvatarHoverPreview
                      name={robot.name}
                      imageUrl={getPrimaryRobotImage(robot)}
                      size="sm"
                      className="h-full w-full"
                    />
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/robots/${robot.slug}`}
                      className="cursor-pointer font-semibold text-ink hover:text-blue"
                    >
                      {robot.name}
                    </Link>
                    <div className="text-[11px] text-muted">{robot.brand}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">{robot.price}</td>
              <td className="px-4 py-3">
                {COMMERCIAL_STATUS_LABELS[robot.commercialStatus]}
              </td>
              <td className="px-4 py-3 font-mono">{robot.readinessScore}</td>
              <td className="px-4 py-3 font-mono">{robot.realityScore}</td>
              {byScore ? (
                <td className="px-4 py-3 font-mono font-semibold">
                  {robot.readinessScore + robot.realityScore}
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export function RankingCard({ article }: { article: RankingArticle }) {
  const robots = robotsForRanking(article.list);
  const faces = robots.slice(0, 3);

  return (
    <Link
      href={`/rankings/${article.slug}`}
      className="group flex h-full cursor-pointer flex-col rounded-[22px] border border-line bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:border-blue/35"
    >
      <div className="flex items-end">
        {faces.map((robot, index) => (
          <div
            key={robot.slug}
            className="overflow-hidden rounded-2xl border border-white bg-soft shadow-sm"
            style={{
              width: index === 0 ? 64 : 44,
              height: index === 0 ? 64 : 44,
              marginLeft: index === 0 ? 0 : -12,
              zIndex: 10 - index,
            }}
          >
            <img
              src={getPrimaryRobotImage(robot) ?? ""}
              alt=""
              className="h-full w-full object-cover object-bottom"
            />
          </div>
        ))}
      </div>
      <h3 className="mt-4 text-[15px] font-semibold leading-snug tracking-tight text-ink group-hover:text-blue">
        {article.title}
      </h3>
      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <span className="font-mono text-[11px] font-bold text-blue">
          {robots.length} robots
        </span>
        <span className="text-[10px] text-muted">{formatDate(article.updatedAt)}</span>
      </div>
    </Link>
  );
}

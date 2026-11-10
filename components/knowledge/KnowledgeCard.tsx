import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { getRobotBySlug } from "@/lib/data/repository";
import { getPrimaryRobotImage } from "@/lib/robot-images";
import type { KnowledgeAnswer } from "@/lib/knowledge";

export function KnowledgeCard({ answer }: { answer: KnowledgeAnswer }) {
  const robots = answer.robotSlugs
    .map((slug) => getRobotBySlug(slug))
    .filter((robot) => robot !== undefined)
    .slice(0, 3);

  return (
    <Link
      href={`/knowledge/${answer.slug}`}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[22px] border border-line bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:border-blue/35"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-1 -top-3 font-mono text-6xl font-bold leading-none text-blue/10"
      >
        ?
      </span>
      <h3 className="relative text-base font-semibold leading-snug tracking-tight text-ink group-hover:text-blue">
        {answer.title}
      </h3>
      <div className="relative mt-auto flex items-end justify-between gap-3 pt-5">
        <div className="flex items-end">
          {robots.map((robot, index) => (
            <div
              key={robot.slug}
              className="overflow-hidden rounded-2xl border-2 border-white bg-soft shadow-sm"
              style={{
                width: index === 0 ? 56 : 40,
                height: index === 0 ? 56 : 40,
                marginLeft: index === 0 ? 0 : -10,
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
        <span className="shrink-0 text-[10px] text-muted">
          {formatDate(answer.updatedAt)}
        </span>
      </div>
    </Link>
  );
}

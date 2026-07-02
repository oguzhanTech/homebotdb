import Link from "next/link";
import type { CompareChooseEntry } from "@/lib/compare-summary";
import { uiCopy } from "@/config/ui-copy";
import { Card } from "@/components/ui/Card";
import {
  CompareRobotThumb,
  compareThumbSizes,
} from "@/components/robot/CompareRobotThumb";
import type { Robot } from "@/types/robot";

export function CompareChooseGuide({
  robots,
  guidance,
}: {
  robots: Robot[];
  guidance: CompareChooseEntry[];
}) {
  const columnClass =
    robots.length >= 3
      ? "md:grid-cols-3"
      : robots.length === 2
        ? "md:grid-cols-2"
        : "md:grid-cols-1";

  return (
    <section className="mb-5">
      <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
        {uiCopy.compare.chooseGuide.title}
      </h2>
      <div className={`grid gap-4 ${columnClass}`}>
        {guidance.map((entry) => {
          const robot = robots[entry.robotIndex];
          if (!robot) return null;

          return (
            <Card
              key={entry.robotSlug}
              className="bg-panel-strong p-4 sm:p-5"
            >
              <Link
                href={`/robots/${robot.slug}`}
                className="mb-4 flex items-center gap-3"
              >
                <CompareRobotThumb
                  robot={robot}
                  seed={`${robot.slug}-compare-choose`}
                  className={compareThumbSizes.header}
                />
                <div className="min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                    {uiCopy.compare.chooseGuide.choosePrefix}{" "}
                    {entry.robotName}{" "}
                    {uiCopy.compare.chooseGuide.chooseSuffix}
                  </div>
                </div>
              </Link>
              <ul className="grid gap-2.5 text-sm leading-relaxed text-ink">
                {entry.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2">
                    <span
                      className="mt-2 h-1 w-1 shrink-0 rounded-full bg-blue"
                      aria-hidden
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

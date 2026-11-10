import Link from "next/link";
import { uiCopy } from "@/config/ui-copy";
import { getRobotBySlug } from "@/lib/data/repository";
import { getPrimaryRobotImage } from "@/lib/robot-images";
import { RobotAvatarHoverPreview } from "@/components/robot/RobotAvatarHoverPreview";

export function KnowledgeRobots({ slugs }: { slugs: string[] }) {
  const robots = slugs
    .map((slug) => getRobotBySlug(slug))
    .filter((robot) => robot !== undefined);

  if (robots.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
        {uiCopy.knowledge.robotsInAnswer}
      </div>
      <ul className="mt-3 grid gap-2">
        {robots.map((robot) => (
          <li key={robot.slug}>
            <Link
              href={`/robots/${robot.slug}`}
              className="flex cursor-pointer items-center gap-3 rounded-[14px] border border-line bg-panel/82 px-3 py-2 shadow-card hover:border-blue/30"
            >
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-line bg-white">
                <RobotAvatarHoverPreview
                  name={robot.name}
                  imageUrl={getPrimaryRobotImage(robot)}
                  size="sm"
                  className="h-full w-full"
                />
              </div>
              <span>
                <span className="block font-semibold text-ink">{robot.name}</span>
                <span className="block text-[11px] text-muted">{robot.brand}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

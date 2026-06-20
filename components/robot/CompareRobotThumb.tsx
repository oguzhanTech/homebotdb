import { pickRobotImage } from "@/lib/robot-images";
import { RobotImagePlaceholder } from "@/components/robot/RobotImagePlaceholder";
import { cn } from "@/lib/utils";
import type { Robot } from "@/types/robot";

const thumbBoxClass =
  "relative shrink-0 overflow-hidden rounded-xl border border-line bg-gradient-to-b from-white to-[#eef1f4]";

const thumbImageClass =
  "absolute bottom-0 left-1/2 h-[132%] w-[118%] max-w-none -translate-x-1/2 object-contain object-bottom";

export function CompareRobotThumb({
  robot,
  seed,
  className,
}: {
  robot: Robot;
  seed: string;
  className?: string;
}) {
  const image = pickRobotImage(robot, seed);

  return (
    <div className={cn(thumbBoxClass, className)}>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={robot.name} className={thumbImageClass} />
      ) : (
        <RobotImagePlaceholder name={robot.name} className="h-full w-full" compact />
      )}
    </div>
  );
}

export const compareThumbSizes = {
  header: "h-20 w-[72px]",
  list: "h-20 w-[72px] sm:h-24 sm:w-20",
  queue: "h-11 w-10",
} as const;

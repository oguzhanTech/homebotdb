import Link from "next/link";
import type { Update } from "@/types/update";
import { isNewsUpdate } from "@/types/update";
import { buildComparePath } from "@/lib/compare";
import { getRobotBySlug } from "@/lib/data/repository";

export function UpdateExploreMore({ update }: { update: Update }) {
  const robot = update.robotSlug ? getRobotBySlug(update.robotSlug) : null;
  const isNews = isNewsUpdate(update.type);
  const links: { href: string; label: string; primary?: boolean }[] = [
    { href: isNews ? "/news" : "/updates", label: isNews ? "All news" : "All updates" },
    { href: "/robots", label: "Robot catalog" },
  ];

  if (robot) {
    links.unshift({
      href: `/robots/${robot.slug}`,
      label: `${robot.name} page`,
      primary: true,
    });
  }

  if (update.slug === "humanoid-comparison-data-refresh") {
    links.unshift({
      href: buildComparePath(["figure-02", "unitree-g1"]),
      label: "Compare Figure 02 vs Unitree G1",
      primary: true,
    });
  }

  return (
    <div className="rounded-[18px] border border-line bg-panel-strong p-5 shadow-card">
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
        Explore more
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              link.primary
                ? "inline-flex cursor-pointer items-center rounded-full border border-blue/35 bg-blue-soft px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue transition-colors hover:border-blue/50"
                : "inline-flex cursor-pointer items-center rounded-full border border-line bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#4d5662] transition-colors hover:border-blue/30"
            }
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

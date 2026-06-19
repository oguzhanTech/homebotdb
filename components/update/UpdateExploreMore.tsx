import Link from "next/link";
import type { Update } from "@/types/update";
import { uiCopy } from "@/config/ui-copy";
import { getUpdateExploreSections } from "@/lib/update-related-links";
import { cn } from "@/lib/utils";

function LinkPill({
  href,
  label,
  primary,
}: {
  href: string;
  label: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex cursor-pointer items-center rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors",
        primary
          ? "border-blue/35 bg-blue-soft text-blue hover:border-blue/50"
          : "border-line bg-white text-[#4d5662] hover:border-blue/30",
      )}
    >
      {label}
    </Link>
  );
}

function LinkGroup({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string; primary?: boolean }[];
}) {
  if (links.length === 0) return null;

  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
        {title}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {links.map((link) => (
          <LinkPill key={link.href + link.label} {...link} />
        ))}
      </div>
    </div>
  );
}

export function UpdateExploreMore({ update }: { update: Update }) {
  const { featured, compare, relatedRobots, site } = getUpdateExploreSections(update);

  return (
    <div className="rounded-[18px] border border-line bg-panel-strong p-5 shadow-card">
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
        {uiCopy.links.exploreMore}
      </div>

      <div className="mt-4 grid gap-4">
        {featured.length > 0 ? (
          <LinkGroup title={uiCopy.links.featuredRobot} links={featured} />
        ) : null}
        <LinkGroup title={uiCopy.links.compareSideBySide} links={compare} />
        <LinkGroup title={uiCopy.links.relatedRobots} links={relatedRobots} />
        <LinkGroup title={uiCopy.links.moreOnSite} links={site} />
      </div>
    </div>
  );
}

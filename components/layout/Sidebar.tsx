"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: "⌂" },
  { href: "/robots", label: "Robots", icon: "⌘" },
  { href: "/compare", label: "Compare", icon: "✣" },
  { href: "/updates", label: "Updates", icon: "⟳" },
  { href: "/wizard", label: "Wizard", icon: "⌁" },
  { href: "/admin", label: "Admin", icon: "⚙" },
];

export function Sidebar({
  freshnessScore,
  lastUpdate,
}: {
  freshnessScore: number;
  lastUpdate: string | null;
}) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 z-10 hidden h-screen w-[178px] shrink-0 flex-col justify-between border-r border-line bg-panel/78 px-5 py-7 backdrop-blur-[18px] xl:flex">
      <div>
        <Link href="/" className="mb-14 block cursor-pointer text-center">
          <div className="relative inline-block text-[36px] font-extrabold leading-none tracking-[-0.12em]">
            {siteConfig.shortName}
            <span className="absolute -right-2.5 top-2 h-2 w-2 rounded-full bg-blue" />
          </div>
          <div className="mt-3 text-[13px] font-bold tracking-[0.18em]">
            {siteConfig.name.toUpperCase()}
          </div>
          <div className="mt-0.5 text-xs text-muted">{siteConfig.version}</div>
        </Link>

        <nav className="grid gap-1.5">
          {navItems.map((item) => {
            const hrefBase = item.href.split("#")[0];
            const active =
              item.label === "Dashboard"
                ? pathname === "/"
                : item.label === "Robots"
                  ? pathname === "/robots" || pathname.startsWith("/robots/")
                  : hrefBase !== "/" && pathname.startsWith(hrefBase);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex h-11 cursor-pointer items-center gap-3.5 rounded-2xl px-2.5 text-[13px] font-semibold uppercase tracking-wider text-[#4d5561] transition-colors",
                  active && "bg-blue/[0.06] text-ink",
                )}
              >
                <span className="w-[18px] text-center text-[15px]">{item.icon}</span>
                {item.label}
                {active && (
                  <span className="absolute -right-4 h-1.5 w-1.5 rounded-full bg-blue" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div>
        <div className="rounded-[18px] border border-line bg-panel-strong p-[18px] shadow-card">
          <div className="text-[11px] font-medium uppercase tracking-[0.11em] text-muted">
            Data Freshness
          </div>
          <div className="my-2 font-mono text-2xl tracking-tight">
            {freshnessScore}%
          </div>
          <ScoreBar value={freshnessScore} className="mb-3.5" />
          <div className="text-[11px] font-medium uppercase tracking-[0.11em] text-muted">
            Last update
          </div>
          <div className="mt-1 text-[13px]">
            {lastUpdate ? formatDate(lastUpdate) : "Unknown"}
          </div>
        </div>
      </div>
    </aside>
  );
}

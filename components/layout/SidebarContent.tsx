"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { isNavItemActive, navItems } from "./nav-config";

export function SidebarContent({
  freshnessScore,
  lastUpdate,
  onNavigate,
  variant = "desktop",
}: {
  freshnessScore: number;
  lastUpdate: string | null;
  onNavigate?: () => void;
  variant?: "desktop" | "mobile";
}) {
  const pathname = usePathname();
  const isMobile = variant === "mobile";

  return (
    <>
      <div className={cn(isMobile ? "mt-2" : "")}>
        <Link
          href="/"
          onClick={onNavigate}
          className="mb-10 block cursor-pointer text-center xl:mb-14"
        >
          <div className="relative inline-block text-[36px] font-extrabold leading-none tracking-[-0.12em]">
            {siteConfig.shortName}
            <span className="absolute -right-2.5 top-2 h-2 w-2 rounded-full bg-blue" />
          </div>
          <div className="mt-3 text-[11px] font-bold leading-[1.15] tracking-[0.14em]">
            {siteConfig.logoLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </div>
        </Link>

        <nav className="grid gap-1.5">
          {navItems.map((item) => {
            const active = isNavItemActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "relative flex h-11 cursor-pointer items-center gap-3.5 rounded-2xl px-2.5 text-[13px] font-semibold uppercase tracking-wider text-[#4d5561] transition-colors",
                  active && "bg-blue/[0.06] text-ink",
                )}
              >
                <span className="w-[18px] text-center text-[15px]">{item.icon}</span>
                {item.label}
                {active && (
                  <span
                    className={cn(
                      "absolute h-1.5 w-1.5 rounded-full bg-blue",
                      isMobile ? "-left-4" : "-right-4",
                    )}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className={cn(isMobile ? "mt-8" : "")}>
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
    </>
  );
}

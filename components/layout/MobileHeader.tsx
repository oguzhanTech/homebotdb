"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { useMobileNav } from "@/contexts/MobileNavContext";
import { cn } from "@/lib/utils";

export function MobileHeader() {
  const { open, isOpen } = useMobileNav();

  return (
    <header
      className="sticky top-0 z-30 border-b border-line bg-panel/88 backdrop-blur-[18px] xl:hidden"
      style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
    >
      <div className="flex items-center justify-between gap-3 px-3.5 py-3 sm:px-7">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <span className="relative shrink-0 text-[28px] font-extrabold leading-none tracking-[-0.12em]">
            {siteConfig.shortName}
            <span className="absolute -right-1.5 top-1 h-1.5 w-1.5 rounded-full bg-blue" />
          </span>
          <span className="truncate text-[10px] font-bold leading-tight tracking-[0.12em] text-[#4d5561]">
            {siteConfig.logoLines.join(" ")}
          </span>
        </Link>

        <button
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
          onClick={open}
          className={cn(
            "inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-line bg-panel-strong text-lg leading-none text-[#4d5561] shadow-card transition-colors hover:border-blue/30",
            isOpen && "border-blue/35 bg-blue-soft text-blue",
          )}
        >
          <span aria-hidden>☰</span>
        </button>
      </div>
    </header>
  );
}

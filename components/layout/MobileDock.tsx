"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home" },
  { href: "/robots", label: "Robots" },
  { href: "/compare", label: "Compare" },
  { href: "/updates", label: "Alerts" },
  { href: "/admin", label: "Menu" },
];

export function MobileDock() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-3.5 bottom-3.5 z-40 grid h-[62px] grid-cols-5 items-center rounded-[20px] border border-line bg-panel/88 shadow-[0_18px_50px_rgba(8,11,18,0.14)] backdrop-blur-[18px] xl:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {items.map((item) => {
        const hrefBase = item.href.split("#")[0];
        const active =
          item.label === "Home"
            ? pathname === "/"
            : item.label === "Robots"
              ? pathname === "/robots" || pathname.startsWith("/robots/")
              : hrefBase !== "/" && pathname.startsWith(hrefBase);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "cursor-pointer text-center text-[11px] font-bold uppercase tracking-wider text-muted",
              active && "text-blue",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

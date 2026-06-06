"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return <>{children}</>;
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <>
      <div className="border-b border-line bg-panel-strong/90 px-3.5 py-2.5 sm:px-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-muted">
            <Link href="/admin" className="cursor-pointer text-ink hover:text-blue">
              Admin
            </Link>
            <span>·</span>
            <Link href="/" className="cursor-pointer hover:text-ink">
              {siteConfig.name}
            </Link>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="cursor-pointer text-xs font-bold uppercase tracking-wider text-muted transition-colors hover:text-ink"
          >
            Sign out
          </button>
        </div>
      </div>
      {children}
    </>
  );
}

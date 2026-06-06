import { Suspense } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata = buildPageMetadata({
  title: `Admin sign in — ${siteConfig.name}`,
  description: "Password-protected admin access.",
  path: "/admin/login",
});

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-3.5 py-10 sm:px-7">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            {siteConfig.name} admin
          </div>
          <h1 className="mt-1 text-2xl font-medium tracking-tight">Sign in</h1>
          <p className="mt-2 text-sm text-[#565f6b]">
            Enter the admin password configured on the server.
          </p>
        </div>

        <div className="mt-6">
          <Suspense fallback={<div className="text-sm text-muted">Loading…</div>}>
            <AdminLoginForm />
          </Suspense>
        </div>

        <p className="mt-4 text-center text-xs text-muted">
          <Link href="/" className="cursor-pointer text-blue hover:underline">
            Back to site
          </Link>
        </p>
      </div>
    </main>
  );
}

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo";
import { getRobots } from "@/lib/data/repository";

export const metadata = buildPageMetadata({
  title: `Admin — ${siteConfig.name}`,
  description: "Admin panel for managing robots, updates, and data confidence.",
  path: "/admin",
});

export default function AdminDashboardPage() {
  const robots = getRobots();
  const unconfirmedCount = robots.reduce((sum, robot) => {
    return (
      sum +
      Object.values(robot.fieldMeta).filter((m) => m.status === "unconfirmed").length
    );
  }, 0);

  return (
    <main className="px-3.5 py-5 sm:px-7 sm:py-7">
      <div className="mb-6">
        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
          Admin
        </div>
        <h1 className="mt-1 text-3xl font-medium tracking-tight">Dashboard</h1>
        <p className="mt-2 text-sm text-[#565f6b]">
          Demo admin UI — forms are ready for database integration.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-[18px] border border-line bg-panel-strong p-5 shadow-card">
          <div className="text-muted">Robots</div>
          <div className="font-mono text-3xl font-bold">{robots.length}</div>
        </div>
        <div className="rounded-[18px] border border-line bg-panel-strong p-5 shadow-card">
          <div className="text-muted">Unconfirmed fields</div>
          <div className="font-mono text-3xl font-bold">{unconfirmedCount}</div>
        </div>
        <div className="rounded-[18px] border border-line bg-panel-strong p-5 shadow-card">
          <div className="text-muted">Auth</div>
          <div className="mt-2 text-sm font-bold uppercase tracking-wider text-muted">
            Not configured
          </div>
        </div>
      </div>

      <nav className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["/admin/robots", "Robot list"],
          ["/admin/robots/new", "Add robot"],
          ["/admin/updates", "Update list"],
          ["/admin/updates/new", "Add update"],
          ["/", "View site"],
        ].map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className="rounded-[18px] border border-line bg-panel-strong px-5 py-4 text-sm font-bold uppercase tracking-wider shadow-card hover:border-blue/30"
          >
            {label}
          </Link>
        ))}
      </nav>
    </main>
  );
}

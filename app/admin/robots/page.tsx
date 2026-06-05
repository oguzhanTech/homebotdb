import Link from "next/link";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo";
import { getRobots } from "@/lib/data/repository";
import { COMMERCIAL_STATUS_LABELS } from "@/types/robot";

export const metadata = buildPageMetadata({
  title: `Admin Robots — ${siteConfig.name}`,
  description: "Manage robot listings.",
  path: "/admin/robots",
});

export default function AdminRobotsPage() {
  const robots = getRobots();

  return (
    <main className="px-3.5 py-5 sm:px-7 sm:py-7">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link href="/admin" className="text-xs font-bold uppercase tracking-wider text-blue">
            ← Admin
          </Link>
          <h1 className="mt-2 text-2xl font-medium tracking-tight">Robots</h1>
        </div>
        <Link
          href="/admin/robots/new"
          className="rounded-xl bg-ink px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white"
        >
          Add robot
        </Link>
      </div>

      <div className="overflow-hidden rounded-[18px] border border-line bg-panel-strong shadow-card">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[10px] uppercase tracking-wider text-muted">
              <th className="px-4 py-3">Name</th>
              <th className="px-3 py-3">Brand</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Freshness</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {robots.map((robot) => (
              <tr key={robot.slug} className="border-b border-line/80">
                <td className="px-4 py-3 font-bold">{robot.name}</td>
                <td className="px-3 py-3">{robot.brand}</td>
                <td className="px-3 py-3">
                  {COMMERCIAL_STATUS_LABELS[robot.commercialStatus]}
                </td>
                <td className="px-3 py-3 font-mono">{robot.dataFreshnessScore}%</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/robots/${robot.slug}/edit`}
                      className="text-xs font-bold uppercase tracking-wider text-blue"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/admin/robots/${robot.slug}/price-history`}
                      className="text-xs font-bold uppercase tracking-wider text-muted"
                    >
                      Prices
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

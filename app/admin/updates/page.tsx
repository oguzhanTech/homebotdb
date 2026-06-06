import Link from "next/link";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo";
import { getDataUpdates, getNewsUpdates } from "@/lib/data/repository";
import { getEditorById } from "@/lib/editors";
import { getUpdatePublicPath } from "@/lib/update-paths";
import { formatDate } from "@/lib/utils";
import { UPDATE_TYPE_LABELS, isNewsUpdate } from "@/types/update";

export const metadata = buildPageMetadata({
  title: `Updates — Admin — ${siteConfig.name}`,
  description: "Manage robot updates and news entries.",
  path: "/admin/updates",
});

function AdminUpdateRow({ update }: { update: ReturnType<typeof getDataUpdates>[number] }) {
  const editor = getEditorById(update.authorId);
  const isNews = isNewsUpdate(update.type);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-line bg-panel-strong p-5 shadow-card">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted">
          <span className="font-bold uppercase tracking-wider text-blue">
            {UPDATE_TYPE_LABELS[update.type]}
          </span>
          <span>{formatDate(update.createdAt)}</span>
          <span>· {editor.name}</span>
        </div>
        <h2 className="mt-1 font-semibold tracking-tight">{update.title}</h2>
        <p className="mt-1 line-clamp-1 text-sm text-[#565f6b]">{update.summary}</p>
        {isNews ? (
          <p className="mt-2 font-mono text-[11px] text-muted">
            data/news/{update.slug}.md
          </p>
        ) : null}
      </div>
      {isNews ? (
        <Link
          href={getUpdatePublicPath(update)}
          className="shrink-0 rounded-full border border-line bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#4d5662] hover:border-blue/30"
        >
          View
        </Link>
      ) : (
        <Link
          href={`/admin/updates/${update.slug}/edit`}
          className="shrink-0 rounded-full border border-line bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#4d5662] hover:border-blue/30"
        >
          Edit
        </Link>
      )}
    </div>
  );
}

export default function AdminUpdatesPage() {
  const dataUpdates = getDataUpdates();
  const news = getNewsUpdates();

  return (
    <main className="px-3.5 py-5 sm:px-7 sm:py-7">
      <Link href="/admin" className="text-xs font-bold uppercase tracking-wider text-blue">
        ← Admin
      </Link>
      <div className="mb-6 mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Admin
          </div>
          <h1 className="mt-1 text-3xl font-medium tracking-tight">Updates & news</h1>
        </div>
        <Link
          href="/admin/updates/new"
          className="rounded-full border border-blue/35 bg-blue-soft px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue"
        >
          Add entry
        </Link>
      </div>

      <section className="mb-10">
        <div className="mb-4">
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            Data updates
          </div>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">
            Spec, price, and availability
          </h2>
        </div>
        <div className="grid gap-3">
          {dataUpdates.length > 0 ? (
            dataUpdates.map((update) => <AdminUpdateRow key={update.id} update={update} />)
          ) : (
            <p className="text-sm text-muted">No data updates yet.</p>
          )}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            News
          </div>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">Stories and roundups</h2>
          <p className="mt-2 text-sm text-[#565f6b]">
            Edit Markdown files in <code className="font-mono text-xs">data/news/</code>, then
            run <code className="font-mono text-xs">npm run news:build</code>.
          </p>
        </div>
        <div className="grid gap-3">
          {news.length > 0 ? (
            news.map((update) => <AdminUpdateRow key={update.id} update={update} />)
          ) : (
            <p className="text-sm text-muted">No news yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}

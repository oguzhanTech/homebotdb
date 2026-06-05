import Link from "next/link";
import type { Update } from "@/types/update";
import { UPDATE_TYPE_LABELS } from "@/types/update";
import { formatDate } from "@/lib/utils";

export function UpdateCard({ update }: { update: Update }) {
  return (
    <Link
      href={`/updates/${update.slug}`}
      className="group block cursor-pointer rounded-[18px] border border-line bg-panel/82 p-5 shadow-card transition-colors hover:border-blue/30"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue">
          {UPDATE_TYPE_LABELS[update.type]}
        </span>
        <span className="text-[11px] text-muted">{formatDate(update.createdAt)}</span>
      </div>
      <h3 className="mt-2 font-semibold tracking-tight">{update.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#565f6b]">
        {update.summary}
      </p>
      {update.robotSlug && (
        <span className="mt-3 inline-block text-xs font-bold uppercase tracking-wider text-muted">
          → View robot
        </span>
      )}
    </Link>
  );
}

export function UpdatesSection({
  title,
  updates,
  viewAllHref = "/updates",
}: {
  title: string;
  updates: Update[];
  viewAllHref?: string;
}) {
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            {title}
          </div>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">
            Stay current
          </h2>
        </div>
        <Link
          href={viewAllHref}
          className="text-xs font-bold uppercase tracking-wider text-blue"
        >
          View all
        </Link>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {updates.map((update) => (
          <UpdateCard key={update.id} update={update} />
        ))}
      </div>
    </section>
  );
}

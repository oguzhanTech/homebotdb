import Link from "next/link";
import type { Update } from "@/types/update";
import { formatDate } from "@/lib/utils";

export function FeaturedNewsHero({ update }: { update: Update }) {
  return (
    <section className="mb-8">
      <Link
        href={`/updates/${update.slug}`}
        className="group block cursor-pointer rounded-[18px] border border-line bg-panel-strong p-6 shadow-card transition-colors hover:border-blue/30 sm:p-8"
      >
        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-blue">
          Robot news · {formatDate(update.createdAt)}
        </div>
        <h1 className="mt-3 text-3xl font-medium leading-tight tracking-tight transition-colors group-hover:text-blue sm:text-4xl lg:text-5xl">
          {update.title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#565f6b] sm:text-lg">
          {update.summary}
        </p>
        <span className="mt-5 inline-flex text-xs font-bold uppercase tracking-widest text-ink group-hover:text-blue">
          Read update
        </span>
      </Link>
    </section>
  );
}

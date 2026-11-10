import type { UpdateChange } from "@/types/update";
import { uiCopy } from "@/config/ui-copy";

function Arrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function UpdateChangeCallout({ change }: { change: UpdateChange }) {
  return (
    <figure className="mt-6 overflow-hidden rounded-[18px] border border-line bg-white shadow-card">
      <figcaption className="border-b border-line px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-blue">
        {change.label}
      </figcaption>
      <div className="relative grid grid-cols-1 sm:grid-cols-2">
        <div className="px-6 py-5 sm:py-6 sm:pr-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
            {uiCopy.updates.was}
          </p>
          <p className="mt-2 font-mono text-[1.65rem] leading-none tracking-tight text-muted line-through decoration-[1.5px]">
            {change.from}
          </p>
        </div>
        <div className="border-t border-line bg-blue-soft/70 px-6 py-5 sm:border-t-0 sm:border-l sm:py-6 sm:pl-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue">
            {uiCopy.updates.now}
          </p>
          <p className="mt-2 font-mono text-[1.65rem] leading-none tracking-tight text-ink">
            {change.to}
          </p>
        </div>
        <span className="absolute left-1/2 top-1/2 z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 rotate-90 items-center justify-center rounded-full border-4 border-white bg-blue-soft text-blue shadow-card sm:rotate-0">
          <Arrow />
        </span>
      </div>
    </figure>
  );
}

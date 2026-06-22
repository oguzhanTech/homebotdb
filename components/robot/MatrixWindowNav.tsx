"use client";

import { uiCopy } from "@/config/ui-copy";
import { cn } from "@/lib/utils";

function WindowNavButton({
  disabled,
  onClick,
  children,
  className,
}: {
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-10 cursor-pointer items-center justify-center rounded-xl border px-4 text-[10px] font-bold uppercase tracking-[0.12em] transition-colors",
        disabled
          ? "cursor-not-allowed border-line bg-[#fafbfc] text-muted opacity-50"
          : "border-line bg-white text-ink shadow-card hover:border-blue/30 hover:bg-blue-soft/30",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function MatrixWindowNav({
  page,
  pageCount,
  total,
  rangeStart,
  rangeEnd,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  total: number;
  rangeStart: number;
  rangeEnd: number;
  onPageChange: (nextPage: number) => void;
}) {
  if (pageCount <= 1) return null;

  const progress = (page / pageCount) * 100;

  return (
    <div className="mt-4 rounded-[18px] border border-line bg-panel-strong p-4 shadow-card sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
            {uiCopy.navIcons.radarFeed} {uiCopy.matrix.windowEyebrow}
          </span>
          <span className="hidden h-3 w-px bg-line sm:block" aria-hidden />
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#4d5662]">
            {uiCopy.matrix.unitsRange(rangeStart, rangeEnd, total)}
          </span>
        </div>
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-blue">
          {uiCopy.matrix.windowLabel(page, pageCount)}
        </span>
      </div>

      <div className="mt-3 h-1 overflow-hidden rounded-full bg-soft">
        <div
          className="h-full rounded-full bg-blue transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={page}
          aria-valuemin={1}
          aria-valuemax={pageCount}
          aria-label={uiCopy.matrix.windowLabel(page, pageCount)}
        />
      </div>

      <div className="mt-3 flex items-center justify-center gap-1">
        {Array.from({ length: pageCount }, (_, index) => {
          const slot = index + 1;
          const isActive = slot === page;

          return (
            <button
              key={slot}
              type="button"
              onClick={() => onPageChange(slot)}
              aria-label={`${uiCopy.matrix.windowLabel(slot, pageCount)}`}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "group relative flex h-6 w-3 cursor-pointer items-end justify-center pb-0.5 transition-opacity hover:opacity-100",
                isActive ? "opacity-100" : "opacity-45 hover:opacity-75",
              )}
            >
              {isActive ? (
                <span
                  aria-hidden
                  className="absolute bottom-0 left-1/2 h-3 w-px -translate-x-1/2 animate-ping bg-blue/50"
                />
              ) : null}
              <span
                aria-hidden
                className={cn(
                  "relative z-[1] w-px rounded-full transition-all duration-200",
                  isActive ? "h-3 bg-blue" : "h-2 bg-[#c5ccd6] group-hover:bg-blue/50",
                )}
              />
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-3">
        <WindowNavButton
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="sm:min-w-[148px]"
        >
          ⟨ {uiCopy.matrix.prevWindow}
        </WindowNavButton>
        <WindowNavButton
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          className="sm:min-w-[148px]"
        >
          {uiCopy.matrix.nextWindow} ⟩
        </WindowNavButton>
      </div>
    </div>
  );
}

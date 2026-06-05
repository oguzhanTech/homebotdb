export function EmailAlertPlaceholder({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={
        compact
          ? "rounded-[18px] border border-line bg-panel/82 p-5 shadow-card"
          : "rounded-[18px] border border-line bg-panel/82 p-6 shadow-card"
      }
    >
      <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
        Email alerts
      </div>
      <h3 className="mt-2 text-lg font-semibold tracking-tight">
        Get robot price & availability alerts
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[#565f6b]">
        Coming soon — subscribe to track Figure 02, Unitree G1, and new home
        robot listings.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          disabled
          placeholder="you@email.com"
          className="h-10 flex-1 rounded-xl border border-line bg-white/80 px-3 text-sm text-muted"
        />
        <button
          type="button"
          disabled
          className="h-10 rounded-xl bg-ink px-5 text-xs font-bold uppercase tracking-widest text-white opacity-60"
        >
          Notify me
        </button>
      </div>
    </div>
  );
}

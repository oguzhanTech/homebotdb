import { siteConfig } from "@/config/site";
import { uiCopy } from "@/config/ui-copy";
import { buildPageMetadata } from "@/lib/seo";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/Button";

export const metadata = buildPageMetadata({
  title: `Which robot fits your home? — ${siteConfig.name}`,
  description:
    "Coming soon: personalized home robot recommendations based on budget, space, and needs.",
  path: "/wizard",
});

export default function WizardPage() {
  const fields = [
    "Budget",
    "Home size",
    "Primary need",
    "Pets",
    "Elder care need",
    "Companion / social need",
  ];

  return (
    <main className="px-3.5 py-5 sm:px-7 sm:py-7">
      <TopBar />
      <div className="mx-auto max-w-xl">
        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
          {uiCopy.nav.robotMatchmaker}
        </div>
        <h1 className="mt-1 text-3xl font-medium tracking-tight">
          Which robot fits your home?
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[#565f6b]">
          This {uiCopy.nav.robotMatchmaker} flow is coming in a future release. Form fields
          below are placeholders.
        </p>

        <form className="mt-8 space-y-4 rounded-[18px] border border-line bg-panel-strong p-6 shadow-card">
          {fields.map((field) => (
            <label key={field} className="block">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
                {field}
              </span>
              <input
                disabled
                placeholder="Coming soon"
                className="mt-2 h-11 w-full rounded-xl border border-line bg-white/70 px-3 text-sm text-muted"
              />
            </label>
          ))}
          <Button disabled className="w-full opacity-60">
            Find my robot
          </Button>
        </form>
      </div>
    </main>
  );
}

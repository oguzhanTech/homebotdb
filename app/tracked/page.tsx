import { siteConfig } from "@/config/site";
import { uiCopy } from "@/config/ui-copy";
import { buildPageMetadata } from "@/lib/seo";
import { TopBar } from "@/components/layout/TopBar";
import { TrackedLandingView } from "@/components/tracked/TrackedLandingView";

export const metadata = buildPageMetadata({
  title: `${uiCopy.tracked.pageTitle} — ${siteConfig.name}`,
  description: uiCopy.tracked.pageLead,
  path: "/tracked",
});

export default function TrackedPage() {
  return (
    <main className="px-3.5 py-5 sm:px-7 sm:py-7">
      <TopBar />
      <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
        {uiCopy.tracked.eyebrow}
      </div>
      <h1 className="mt-1 text-3xl font-medium tracking-tight">
        {uiCopy.tracked.pageTitle}
      </h1>
      <p className="mt-3 max-w-xl text-[15px] text-[#565f6b]">
        {uiCopy.tracked.pageLead}
      </p>

      <div className="mt-6">
        <TrackedLandingView />
      </div>
    </main>
  );
}

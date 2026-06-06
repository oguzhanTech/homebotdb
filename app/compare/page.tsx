import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo";
import { getRobots } from "@/lib/data/repository";
import { CompareLandingView } from "@/components/compare/CompareLandingView";
import { TopBar } from "@/components/layout/TopBar";

export const metadata = buildPageMetadata({
  title: `Compare Robots — ${siteConfig.name}`,
  description:
    "Pick up to 3 home robots and compare specs, scores, and availability side by side.",
  path: "/compare",
});

export default function CompareLandingPage() {
  const robots = getRobots();

  return (
    <main className="px-3.5 py-5 sm:px-7 sm:py-7">
      <TopBar />
      <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
        Compare
      </div>
      <h1 className="mt-1 text-3xl font-medium tracking-tight">
        Side-by-side robot comparison
      </h1>
      <p className="mt-3 max-w-xl text-[15px] text-[#565f6b]">
        Add robots below, then open the comparison table. You can compare 2 or 3
        robots at once.
      </p>

      <div className="mt-6">
        <CompareLandingView robots={robots} />
      </div>
    </main>
  );
}

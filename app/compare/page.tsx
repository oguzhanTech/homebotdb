import Link from "next/link";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo";
import { getRobots } from "@/lib/data/repository";
import { buildComparePath } from "@/lib/compare";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/Button";

export const metadata = buildPageMetadata({
  title: `Compare Robots — ${siteConfig.name}`,
  description: "Select up to 3 home robots to compare specs, scores, and availability side by side.",
  path: "/compare",
});

export default function CompareLandingPage() {
  const robots = getRobots();
  const featuredPair = ["figure-02", "unitree-g1"];

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
        Add up to 3 robots from the matrix, or jump into a featured comparison.
      </p>

      <Link href={buildComparePath(featuredPair)} className="mt-6 inline-block">
        <Button size="lg">Compare Figure 02 vs Unitree G1</Button>
      </Link>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {robots.map((robot) => (
          <Link
            key={robot.slug}
            href={`/robots/${robot.slug}`}
            className="rounded-[18px] border border-line bg-panel-strong p-4 shadow-card hover:border-blue/30"
          >
            <div className="font-bold uppercase tracking-wide">{robot.name}</div>
            <div className="text-sm text-muted">{robot.brand}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}

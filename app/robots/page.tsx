import { Suspense } from "react";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo";
import { getRobots } from "@/lib/data/repository";
import { TopBar } from "@/components/layout/TopBar";
import { RobotMatrix } from "@/components/robot/RobotMatrix";

export const metadata = buildPageMetadata({
  title: `All Robots — ${siteConfig.name}`,
  description:
    "Browse home robots, humanoids, companions, and elder-care assistants. Filter by type, task, price, and availability.",
  path: "/robots",
});

export default function RobotsPage() {
  const robots = getRobots();

  return (
    <main className="px-3.5 py-5 sm:px-7 sm:py-7">
      <TopBar />

      <section className="mb-6">
        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
          Robots
        </div>
        <h1 className="mt-1 text-3xl font-medium tracking-tight sm:text-4xl">
          Home robot catalog
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#565f6b]">
          Compare specs, readiness scores, and availability for {robots.length}{" "}
          home-focused robots. Industrial models are excluded.
        </p>
      </section>

      <Suspense fallback={<div className="text-muted">Loading robots...</div>}>
        <RobotMatrix listingPath="/robots" />
      </Suspense>
    </main>
  );
}

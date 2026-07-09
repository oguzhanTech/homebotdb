import type { Robot } from "@/types/robot";
import {
  getLatestCatalogAdditions,
  getRobots,
} from "@/lib/data/repository";
import { listRecentComments } from "@/lib/data/comments";
import { CategoryHubGrid } from "@/components/home/CategoryHubGrid";
import { PopularTodaySection } from "@/components/home/PopularTodaySection";
import { LatestCatalogRobots } from "@/components/home/LatestCatalogRobots";
import { LatestCommentsPanel } from "@/components/home/LatestCommentsPanel";

async function loadRecentComments() {
  try {
    return await listRecentComments(4);
  } catch {
    return [];
  }
}

export async function HomeDashboard({ robots }: { robots?: Robot[] }) {
  const catalog = robots ?? getRobots();
  const additions = getLatestCatalogAdditions(5);
  const comments = await loadRecentComments();

  return (
    <div className="mb-8 space-y-3.5">
      <CategoryHubGrid />

      <div className="grid grid-cols-1 items-start gap-3.5 lg:grid-cols-2 xl:grid-cols-12">
        <PopularTodaySection
          robots={catalog}
          className="lg:col-span-2 xl:col-span-5"
        />
        <LatestCatalogRobots
          additions={additions}
          className="xl:col-span-3"
        />
        <LatestCommentsPanel
          comments={comments}
          className="lg:col-span-2 xl:col-span-4"
        />
      </div>
    </div>
  );
}

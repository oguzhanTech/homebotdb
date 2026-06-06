import {
  computeAggregateFreshness,
  getLatestUpdateDate,
} from "@/lib/score";
import { getRobots } from "@/lib/data/repository";
import { CompareProvider } from "@/contexts/CompareContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { MobileNavProvider } from "@/contexts/MobileNavContext";
import { Sidebar } from "./Sidebar";
import { MobileHeader } from "./MobileHeader";
import { MobileSidebar } from "./MobileSidebar";
import { MobileDock } from "./MobileDock";
import { CompareDock } from "./CompareDock";
import { CommandPalette } from "@/components/search/CommandPalette";

export function AppShell({ children }: { children: React.ReactNode }) {
  const robots = getRobots();
  const freshnessScore = computeAggregateFreshness(robots);
  const lastUpdate = getLatestUpdateDate(robots);

  return (
    <CompareProvider>
      <FavoritesProvider>
        <MobileNavProvider>
          <div className="grid min-h-screen xl:grid-cols-[178px_minmax(0,1fr)]">
            <Sidebar freshnessScore={freshnessScore} lastUpdate={lastUpdate} />
            <div className="min-w-0 pb-28 xl:pb-9">
              <MobileHeader />
              {children}
            </div>
          </div>
          <MobileSidebar freshnessScore={freshnessScore} lastUpdate={lastUpdate} />
          <MobileDock />
          <CompareDock />
          <CommandPalette />
        </MobileNavProvider>
      </FavoritesProvider>
    </CompareProvider>
  );
}

"use client";

import { SidebarContent } from "./SidebarContent";

export function Sidebar({
  freshnessScore,
  lastUpdate,
}: {
  freshnessScore: number;
  lastUpdate: string | null;
}) {
  return (
    <aside className="sticky top-0 z-10 hidden h-screen w-[178px] shrink-0 flex-col justify-between border-r border-line bg-panel/78 px-5 py-7 backdrop-blur-[18px] xl:flex">
      <SidebarContent freshnessScore={freshnessScore} lastUpdate={lastUpdate} />
    </aside>
  );
}

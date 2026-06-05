import type { Update } from "@/types/update";

export const updates: Update[] = [
  {
    id: "upd-001",
    title: "Figure 02 readiness score updated",
    slug: "figure-02-readiness-score-updated",
    type: "data_update",
    robotSlug: "figure-02",
    summary:
      "Readiness score revised to 74/100 after new demo footage and spec confirmations.",
    content:
      "HomeBotDB analysts updated the Figure 02 readiness score from 71 to 74 based on improved manipulation demos and confirmed physical dimensions. Reality score remains at 68 pending broader commercial availability signals.",
    sourceUrl: "https://www.figure.ai/",
    createdAt: "2026-05-18T10:00:00Z",
    updatedAt: "2026-05-18T10:00:00Z",
  },
  {
    id: "upd-002",
    title: "Unitree G1 availability checked",
    slug: "unitree-g1-availability-checked",
    type: "availability_update",
    robotSlug: "unitree-g1",
    summary:
      "G1 confirmed available for pre-order in US, China, Japan, and Germany.",
    content:
      "Availability status for the Unitree G1 was re-verified across official channels. Pre-order remains active in four countries with stable lead times reported by regional distributors.",
    sourceUrl: "https://www.unitree.com/g1",
    createdAt: "2026-05-20T08:30:00Z",
    updatedAt: "2026-05-20T08:30:00Z",
  },
  {
    id: "upd-003",
    title: "New companion robot added",
    slug: "new-companion-robot-added",
    type: "news",
    robotSlug: "emo-companion",
    summary: "EMO companion robot added to HomeBotDB with full consumer availability data.",
    content:
      "We added the Living AI EMO desktop companion to the database, covering social interaction scores, smart home integrations, and confirmed retail pricing for major markets.",
    sourceUrl: "https://living.ai/",
    createdAt: "2026-05-01T14:00:00Z",
    updatedAt: "2026-05-01T14:00:00Z",
  },
  {
    id: "upd-004",
    title: "Price estimate revised for Figure 02",
    slug: "figure-02-price-estimate-revised",
    type: "price_update",
    robotSlug: "figure-02",
    summary: "Estimated price band moved to $20,000+ based on analyst consensus.",
    content:
      "Following industry reports and supply chain signals, HomeBotDB revised the Figure 02 price estimate upward. Status remains unconfirmed — no official MSRP published.",
    createdAt: "2026-05-18T11:00:00Z",
    updatedAt: "2026-05-18T11:00:00Z",
  },
  {
    id: "upd-005",
    title: "Humanoid comparison data refresh",
    slug: "humanoid-comparison-data-refresh",
    type: "news",
    summary:
      "Compare matrix updated with latest Unitree G1 and Figure 02 field confirmations.",
    content:
      "Our humanoid comparison tables now reflect May 2026 data freshness scores, including updated battery and payload fields where sources confirmed values.",
    createdAt: "2026-06-04T09:00:00Z",
    updatedAt: "2026-06-04T09:00:00Z",
  },
  {
    id: "upd-006",
    title: "Unitree G1 battery specs confirmed",
    slug: "unitree-g1-battery-specs-confirmed",
    type: "data_update",
    robotSlug: "unitree-g1",
    summary: "Battery life and charge time marked as confirmed in field metadata.",
    content:
      "Official spec sheet alignment confirmed 2 h runtime and 1.5 h charge time for the standard G1 battery module.",
    sourceUrl: "https://www.unitree.com/g1",
    createdAt: "2026-05-17T16:00:00Z",
    updatedAt: "2026-05-17T16:00:00Z",
  },
  {
    id: "upd-007",
    title: "Home robot market weekly digest",
    slug: "home-robot-market-weekly-digest",
    type: "news",
    summary:
      "Weekly roundup of companion and humanoid home robot news — May 2026.",
    content:
      "This week: Figure AI demo cycle continues, Unitree expands G1 regional support, and companion robot EMO sees app update 3.2 with new personality modes.",
    createdAt: "2026-05-15T12:00:00Z",
    updatedAt: "2026-05-15T12:00:00Z",
  },
  {
    id: "upd-008",
    title: "Optimus Gen 2 home data status unchanged",
    slug: "optimus-gen2-home-data-unchanged",
    type: "data_update",
    robotSlug: "optimus-gen2-dummy",
    summary: "No new home-relevant confirmations for Optimus Gen 2 this cycle.",
    content:
      "Tesla has not released home deployment specs. Commercial status remains Coming Soon with low data confidence for consumer use cases.",
    createdAt: "2026-04-10T10:00:00Z",
    updatedAt: "2026-04-10T10:00:00Z",
  },
];

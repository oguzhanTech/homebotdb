import type { Update } from "@/types/update";

export const updates: Update[] = [
  {
    id: "upd-009",
    title: "Vector 2.0 added to the catalog",
    slug: "vector-2-added-to-catalog",
    type: "data_update",
    authorId: "maya-chen",
    robotSlug: "vector-2",
    summary:
      "Digital Dream Labs' desk companion now has a full profile, scores, and buy links on HomeBotRadar.",
    content:
      "We added Vector 2.0 to HomeBotRadar. It is the palm-sized Anki successor from Digital Dream Labs: tracked movement on a desk, expressive face, local face recognition, and a replaceable battery with longer runtime than the original.\n\nOur listing covers hardware specs, readiness and reality scores, and availability in six countries. Voice commands, ChatGPT chat, and full Alexa features still depend on a paid Vector AI subscription, and we note that in the robot profile.\n\nCompare Vector 2.0 with EMO on the robot page if you are shopping for a desktop companion.",
    sourceUrl: "https://www.digitaldreamlabs.com/pages/meet-vector",
    createdAt: "2026-06-07T12:00:00Z",
    updatedAt: "2026-06-07T12:00:00Z",
  },
  {
    id: "upd-001",
    title: "Figure 02 readiness score updated",
    slug: "figure-02-readiness-score-updated",
    type: "data_update",
    authorId: "oguzhan-aydin",
    robotSlug: "figure-02",
    summary: "Readiness score is now 74/100 after new demo footage and confirmed dimensions.",
    content:
      "We raised the Figure 02 readiness score from 71 to 74. The change reflects stronger manipulation demos and confirmed height and weight. Reality score stays at 68 until we see clearer buy or ship signals.",
    sourceUrl: "https://www.figure.ai/",
    createdAt: "2026-05-18T10:00:00Z",
    updatedAt: "2026-05-18T10:00:00Z",
  },
  {
    id: "upd-002",
    title: "Unitree G1 availability checked",
    slug: "unitree-g1-availability-checked",
    type: "availability_update",
    authorId: "maya-chen",
    robotSlug: "unitree-g1",
    summary: "G1 pre-order is open in the US, China, Japan, and Germany.",
    content:
      "We checked Unitree's channels again. Pre-order is still live in four countries and lead times look stable. If you are shopping region by region, start with the official G1 page for your country.",
    sourceUrl: "https://www.unitree.com/g1",
    createdAt: "2026-05-20T08:30:00Z",
    updatedAt: "2026-05-20T08:30:00Z",
  },
  {
    id: "upd-004",
    title: "Price estimate revised for Figure 02",
    slug: "figure-02-price-estimate-revised",
    type: "price_update",
    authorId: "maya-chen",
    robotSlug: "figure-02",
    summary: "Estimated price band is now $20,000+ based on recent analyst reports.",
    content:
      "Figure still has not posted an official MSRP. We moved our estimate band to $20,000+ after new industry reports. Treat this as an estimate, not a store price.",
    createdAt: "2026-05-18T11:00:00Z",
    updatedAt: "2026-05-18T11:00:00Z",
  },
  {
    id: "upd-006",
    title: "Unitree G1 battery specs confirmed",
    slug: "unitree-g1-battery-specs-confirmed",
    type: "data_update",
    authorId: "oguzhan-aydin",
    robotSlug: "unitree-g1",
    summary: "Battery life and charge time are marked confirmed in our database.",
    content:
      "Unitree's spec sheet matches what we list: 2 h runtime and 1.5 h charge on the standard battery. Both fields are now marked confirmed in G1 metadata.",
    sourceUrl: "https://www.unitree.com/g1",
    createdAt: "2026-05-17T16:00:00Z",
    updatedAt: "2026-05-17T16:00:00Z",
  },
  {
    id: "upd-008",
    title: "Optimus Gen 2 home data status unchanged",
    slug: "optimus-gen2-home-data-unchanged",
    type: "data_update",
    authorId: "oguzhan-aydin",
    robotSlug: "optimus-gen2-dummy",
    summary: "No new home-use specs from Tesla this cycle.",
    content:
      "Tesla did not publish new home deployment specs for Optimus Gen 2. Status stays Coming Soon and our confidence score for consumer home use remains low.",
    createdAt: "2026-04-10T10:00:00Z",
    updatedAt: "2026-04-10T10:00:00Z",
  },
];

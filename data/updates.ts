import type { Update } from "@/types/update";

export const updates: Update[] = [
  {
    id: "upd-013",
    title: "Sony aibo added to the catalog",
    slug: "aibo-ers1000-added-to-catalog",
    type: "data_update",
    authorId: "maya-chen",
    robotSlug: "aibo-ers1000",
    summary:
      "Sony's AI robot puppy is listed with US pricing, cloud plan terms, and regional sale restrictions.",
    content:
      "We added Sony aibo (ERS-1000) to HomeBotRadar. It is the cloud-connected robot dog with 22 axes of motion, dual cameras for mapping, and a personality that grows through the My aibo app.\n\nOur listing at /robots/aibo-ers1000 covers the $3,199.99 US price with a bundled three-year AI Cloud Plan, the $300 annual renewal afterward, and the Illinois and Baltimore shipping limits.\n\nCompare aibo with MarsCat or Tombot Jennie if you are choosing between robot pets for the home.",
    sourceUrl: "https://electronics.sony.com/more/aibo/p/ers1000",
    createdAt: "2026-06-08T16:00:00Z",
    updatedAt: "2026-06-08T16:00:00Z",
  },
  {
    id: "upd-012",
    title: "MarsCat added to the catalog",
    slug: "marscat-added-to-catalog",
    type: "data_update",
    authorId: "maya-chen",
    robotSlug: "marscat",
    summary:
      "Elephant Robotics' autonomous bionic cat joins the catalog with open-source SDK and buy-now pricing.",
    content:
      "We added MarsCat to HomeBotRadar. It is Elephant Robotics' fully autonomous robot cat: quadruped walking, personality that shifts with touch and voice, and optional auto-docking on its charging station.\n\nOur profile on /robots/marscat includes confirmed specs from the official GitBook, the current $1,199 store price, and links to the MarsAI open-source stack for developers.\n\nCompare MarsCat with aibo or Jennie on the robot page if you are shopping for a home robot pet.",
    sourceUrl: "https://www.elephantrobotics.com/en/mars-en/",
    createdAt: "2026-06-08T15:00:00Z",
    updatedAt: "2026-06-08T15:00:00Z",
  },
  {
    id: "upd-011",
    title: "Tombot Jennie added to the catalog",
    slug: "tombot-jennie-added-to-catalog",
    type: "data_update",
    authorId: "maya-chen",
    robotSlug: "tombot-jennie",
    summary:
      "Jim Henson-designed lap puppy for dementia care joins HomeBotRadar with waitlist status and target pricing.",
    content:
      "We added Tombot Jennie to HomeBotRadar. She is a golden retriever-style animatronic for seniors who cannot keep a live pet: touch sensors, voice commands, and a caregiver app over local Bluetooth or Wi-Fi.\n\nOur listing at /robots/tombot-jennie notes the waitlist-only status, the roughly $1,500 target price, and that Tombot is still working toward FDA clearance for clinical settings.\n\nCompare Jennie with MarsCat or aibo if you want a walking robot pet instead of a lap therapy dog.",
    sourceUrl: "https://tombot.com/pages/meet-our-puppies",
    createdAt: "2026-06-08T14:00:00Z",
    updatedAt: "2026-06-08T14:00:00Z",
  },
  {
    id: "upd-010",
    title: "Mirokaï added to the catalog",
    slug: "mirokai-added-to-catalog",
    type: "data_update",
    authorId: "maya-chen",
    robotSlug: "mirokai",
    summary:
      "Enchanted Tools' expressive ball-bot humanoid is now tracked for elder care and hospitality deployments.",
    content:
      "We added Mirokaï to HomeBotRadar. It is the social humanoid from Enchanted Tools with a projected face, multi-LLM conversation, and an omnidirectional ball base for clinics, nursing homes, airports, and retail.\n\nOur profile at /robots/mirokai covers confirmed dimensions from distributor specs, partner pricing around $30,000+, and limited enterprise availability in France, Japan, and the United States.\n\nCompare Mirokaï with NEO Gamma or Unitree G1 on the robot page if you are evaluating humanoids for care or concierge roles.",
    sourceUrl: "https://enchanted.tools/robot",
    createdAt: "2026-06-08T13:00:00Z",
    updatedAt: "2026-06-08T13:00:00Z",
  },
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

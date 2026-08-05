import type { SocialFeedItem } from "@/types/social-feed";

/** Curated X posts with native video. Use embed-friendly status URLs only. */
export const socialFeedItems: SocialFeedItem[] = [
  {
    id: "sf-017",
    tweetUrl: "https://x.com/NoriRobotics/status/2085073763750817915",
    handle: "NoriRobotics",
    brandLabel: "Nori",
    summary:
      "Nori introduced L3, an affordable US-made bimanual robot you can teach tasks, with pre-orders and fall 2026 shipping claims. L3 is not in our catalog yet.",
    publishedAt: "2026-08-05T18:41:38Z",
    compareSlugs: ["reachy-2", "stretch-4"],
  },
  {
    id: "sf-016",
    tweetUrl: "https://x.com/RoboStrategy/status/2082902522927149550",
    handle: "RoboStrategy",
    brandLabel: "RoboStrategy",
    summary:
      "RoboStrategy posted a short Invest in Robotics video montage on physical AI and humanoids. Industry hype reel, not a product launch. Useful context while factory lines scale.",
    publishedAt: "2026-07-30T18:53:54Z",
    compareSlugs: ["figure-02", "unitree-g1"],
  },
  {
    id: "sf-015",
    tweetUrl: "https://x.com/GoogleDeepMind/status/2082844168154435957",
    handle: "GoogleDeepMind",
    brandLabel: "Google DeepMind",
    summary:
      "DeepMind shows Gemini Robotics 2 whole-body control on Apptronik Apollo 2: one prompt to reach, bend, and pick up a watering can. Apollo is in our catalog as the enterprise logistics humanoid.",
    publishedAt: "2026-07-30T15:02:01Z",
    robotSlug: "apollo",
    compareSlugs: ["apollo", "figure-02"],
  },
  {
    id: "sf-014",
    tweetUrl: "https://x.com/irvinxyz/status/2081023625470333356",
    handle: "irvinxyz",
    brandLabel: "Irvin",
    summary:
      "Video from Japan shows an autonomous cage-fight robot trying to leave the ring mid-bout. Spectacle humanoids, not home chores. Related: REK's San Francisco fighting-bot shop.",
    publishedAt: "2026-07-25T14:27:50Z",
    newsSlug: "rek-san-francisco-humanoid-robot-fighting-storefront",
    compareSlugs: ["figure-02", "unitree-g1"],
  },
  {
    id: "sf-013",
    tweetUrl: "https://x.com/UnitreeRobotics/status/2080549171661295907",
    handle: "UnitreeRobotics",
    brandLabel: "Unitree",
    summary:
      "Unitree shows the wheeled Super Athlete AS2-W: compact motion, continuous 16 kg payload, and 30+ km unloaded range. AS2-W is not in our catalog; G1 is the listed Unitree home-adjacent platform.",
    publishedAt: "2026-07-24T07:02:31Z",
    robotSlug: "unitree-g1",
    compareSlugs: ["spot", "unitree-g1"],
  },
  {
    id: "sf-010",
    tweetUrl: "https://x.com/CobotMy/status/2079159381833425140",
    handle: "CobotMy",
    brandLabel: "Elephant Robotics",
    summary:
      "Elephant Robotics shows Drag-and-Teach on the myCobot 280 arm: guide it by hand, no code. myCobot is not in our catalog; MarsCat is their listed home pet.",
    publishedAt: "2026-07-20T11:00:00Z",
    robotSlug: "marscat",
    compareSlugs: ["loona", "marscat"],
  },
  {
    id: "sf-011",
    tweetUrl: "https://x.com/UnitreeRobotics/status/2079113095188984161",
    handle: "UnitreeRobotics",
    brandLabel: "Unitree",
    summary:
      "Unitree demos UnifoLM-OminiA-0.3 for whole-body mobile manipulation on home-care and wellness tasks, with omni-modal interaction and disturbance-resistant runs.",
    publishedAt: "2026-07-20T07:56:04Z",
    robotSlug: "unitree-g1",
    compareSlugs: ["neo-gamma", "unitree-g1"],
  },
  {
    id: "sf-009",
    tweetUrl: "https://x.com/TheHumanoidHub/status/2077896972082778583",
    handle: "TheHumanoidHub",
    brandLabel: "The Humanoid Hub",
    summary:
      "A longer robot-fight cut is making the rounds, the spectacle end of humanoids rather than home chores. Related: REK's San Francisco fighting-bot shop.",
    publishedAt: "2026-07-16T23:23:38Z",
    newsSlug: "rek-san-francisco-humanoid-robot-fighting-storefront",
    compareSlugs: ["figure-02", "unitree-g1"],
  },
  {
    id: "sf-008",
    tweetUrl: "https://x.com/BostonDynamics/status/2077031281095819386",
    handle: "BostonDynamics",
    brandLabel: "Boston Dynamics",
    summary:
      "Boston Dynamics is testing a last-mile delivery run from van to doorstep. It is an enterprise logistics pilot, not a consumer home product.",
    publishedAt: "2026-07-14T14:03:41Z",
    robotSlug: "spot",
    compareSlugs: ["figure-02", "spot"],
  },
  {
    id: "sf-007",
    tweetUrl: "https://x.com/TheHumanoidHub/status/2076731175046127622",
    handle: "TheHumanoidHub",
    brandLabel: "The Humanoid Hub",
    summary:
      "A giant EngineAI T800 figure is up at Shenzhen's Coco Park mall. T800 is not in our catalog yet; EngineAI's listed platform is PM01.",
    publishedAt: "2026-07-13T18:11:10Z",
    robotSlug: "pm01",
    compareSlugs: ["pm01", "unitree-g1"],
  },
  {
    id: "sf-004",
    tweetUrl: "https://x.com/BostonDynamics/status/2075625943012368443",
    handle: "BostonDynamics",
    brandLabel: "Boston Dynamics",
    summary:
      "Boston Dynamics kept the World Cup buzz going with a Viking Row video filmed at HQ, riding the momentum from Atlas's live pitch appearance.",
    publishedAt: "2026-07-10T16:59:22Z",
    robotSlug: "spot",
    newsSlug: "atlas-world-cup-match-ball-delivery",
    compareSlugs: ["figure-02", "unitree-g1"],
  },
  {
    id: "sf-005",
    tweetUrl: "https://x.com/Cointelegraph/status/2075379474993152276",
    handle: "BerntBornich",
    brandLabel: "1X Technologies",
    summary:
      "1X CEO Bernt Bornich walked through NEO's new 25-DoF tendon-driven hands and why fingertip dexterity matters for home humanoids.",
    publishedAt: "2026-07-09T16:20:43Z",
    robotSlug: "neo-gamma",
    newsSlug: "neo-gamma-hands-25-dof-tactile-sensing",
    compareSlugs: ["neo-gamma", "figure-02"],
  },
  {
    id: "sf-006",
    tweetUrl: "https://x.com/Figure_robot/status/2075232609450520937",
    handle: "Figure_robot",
    brandLabel: "Figure AI",
    summary:
      "Figure posted a four-year company recap video, from early startup days through today's factory humanoid work.",
    publishedAt: "2026-07-09T14:56:24Z",
    robotSlug: "figure-02",
    compareSlugs: ["figure-02", "unitree-g1"],
  },
  {
    id: "sf-001",
    tweetUrl: "https://x.com/1x_tech/status/2075252899442204952",
    handle: "1x_tech",
    brandLabel: "1X Technologies",
    summary:
      "1X showed NEO Gamma with new 25-DoF hands, tactile slip sensing, and an IP68 wash-down build in its July launch demo.",
    publishedAt: "2026-07-09T16:17:02Z",
    robotSlug: "neo-gamma",
    newsSlug: "neo-gamma-hands-25-dof-tactile-sensing",
    compareSlugs: ["neo-gamma", "figure-02"],
  },
  {
    id: "sf-003",
    tweetUrl: "https://x.com/BostonDynamics/status/2020882391439483191",
    handle: "BostonDynamics",
    brandLabel: "Boston Dynamics",
    summary:
      "Boston Dynamics gave the research Atlas one more agility run with the RAI Institute before the enterprise platform moves toward factory rollout.",
    publishedAt: "2026-02-09T15:28:02Z",
    robotSlug: "spot",
    newsSlug: "atlas-world-cup-match-ball-delivery",
    compareSlugs: ["unitree-g1", "figure-02"],
  },
  {
    id: "sf-012",
    tweetUrl: "https://x.com/livinoffwater/status/2017172436119331133",
    handle: "livinoffwater",
    brandLabel: "Natalie",
    summary:
      "Maker Natalie built a physical OpenClaw desk robot that dances while thinking and thumbs-up when tasks finish. Not in our catalog; closest buyable desk pets are EMO and Vector 2.0.",
    publishedAt: "2026-01-30T09:46:00Z",
    robotSlug: "emo-companion",
    compareSlugs: ["emo-companion", "vector-2"],
  },
];

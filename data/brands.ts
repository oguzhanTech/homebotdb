export interface Brand {
  id: string;
  name: string;
  /** Public path, e.g. /brands/tesla.svg or /brands/tesla.png */
  logo?: string;
  aliases: string[];
}

/**
 * Brand registry. Add SVG/PNG files under public/brands/ using the brand id
 * (e.g. public/brands/figure-ai.svg).
 */
export const brands: Brand[] = [
  {
    id: "figure-ai",
    name: "Figure AI",
    logo: "/brands/figure-ai.png",
    aliases: ["Figure AI", "Figure"],
  },
  {
    id: "unitree",
    name: "Unitree",
    logo: "/brands/unitree-logo.png",
    aliases: ["Unitree"],
  },
  {
    id: "tesla",
    name: "Tesla",
    logo: "/brands/tesla.png",
    aliases: ["Tesla"],
  },
  {
    id: "living-ai",
    name: "Living AI",
    logo: "/brands/living-ai-logo.png",
    aliases: ["Living AI", "Living.Ai"],
  },
  {
    id: "1x",
    name: "1X",
    logo: "/brands/1x.png",
    aliases: ["1X", "1X Technologies", "1X Tech"],
  },
  {
    id: "digital-dream-labs",
    name: "Digital Dream Labs",
    logo: "/brands/digital-dream-labs.jpg",
    aliases: ["Digital Dream Labs", "DDL", "Anki"],
  },
  {
    id: "enchanted-tools",
    name: "Enchanted Tools",
    logo: "/brands/enchanted-tools.png",
    aliases: ["Enchanted Tools"],
  },
  {
    id: "tombot",
    name: "Tombot",
    logo: "/brands/tombot.png",
    aliases: ["Tombot", "Tombot Inc."],
  },
  {
    id: "elephant-robotics",
    name: "Elephant Robotics",
    logo: "/brands/elephant-robotics.png",
    aliases: ["Elephant Robotics"],
  },
  {
    id: "sony",
    name: "Sony",
    logo: "/brands/sony.png",
    aliases: ["Sony", "Sony Electronics"],
  },
  {
    id: "keyi-tech",
    name: "KEYi Tech",
    logo: "/brands/keyi-tech.png",
    aliases: ["KEYi Tech", "KEYi", "KEYi Robot"],
  },
  {
    id: "pollen-robotics",
    name: "Pollen Robotics",
    logo: "/brands/pollen-robotics.png",
    aliases: ["Pollen Robotics", "Pollen", "Hugging Face Robotics"],
  },
  {
    id: "samsung",
    name: "Samsung",
    logo: "/brands/samsung.png",
    aliases: ["Samsung", "Samsung Electronics"],
  },
  {
    id: "embodied",
    name: "Embodied",
    logo: "/brands/embodied.png",
    aliases: ["Embodied", "Embodied Inc.", "Moxie Robots", "Moxie Robots Inc."],
  },
  {
    id: "boston-dynamics",
    name: "Boston Dynamics",
    logo: "/brands/Boston_Dynamics.svg",
    aliases: ["Boston Dynamics", "BD"],
  },
  {
    id: "intuition-robotics",
    name: "Intuition Robotics",
    logo: "/brands/intuition-robotics.png",
    aliases: ["Intuition Robotics", "Intuition"],
  },
  {
    id: "enabot",
    name: "Enabot",
    logo: "/brands/enabot.png",
    aliases: ["Enabot", "Enabot Robotics"],
  },
  {
    id: "apptronik",
    name: "Apptronik",
    logo: "/brands/apptronik.png",
    aliases: ["Apptronik", "Apptronik Inc."],
  },
  {
    id: "hello-robot",
    name: "Hello Robot",
    logo: "/brands/hello-robot.png",
    aliases: ["Hello Robot", "Hello Robot Inc."],
  },
  {
    id: "aeolus-robotics",
    name: "Aeolus Robotics",
    logo: "/brands/aeolus-robotics.png",
    aliases: ["Aeolus Robotics", "Aeolus"],
  },
  {
    id: "blue-frog-robotics",
    name: "Blue Frog Robotics",
    logo: "/brands/blue-frog-robotics.png",
    aliases: ["Blue Frog Robotics", "Blue Frog"],
  },
  {
    id: "groove-x",
    name: "GROOVE X",
    logo: "/brands/groove-x.png",
    aliases: ["GROOVE X", "Groove X", "GX"],
  },
  {
    id: "misa-robotics",
    name: "Misa Robotics",
    logo: "/brands/misa-robotics.png",
    aliases: ["Misa Robotics", "Misa Robotics LLC", "Misa Robot"],
  },
  {
    id: "engineai",
    name: "EngineAI",
    logo: "/brands/engineai.png",
    aliases: ["EngineAI", "ENGINEAI", "Engine AI", "Shenzhen EngineAI Robotics"],
  },
  {
    id: "ropet-ai",
    name: "Ropet AI",
    logo: "/brands/ropet-ai.png",
    aliases: ["Ropet AI", "Ropet", "ROPET", "Ropet CO.LTD"],
  },
  {
    id: "mixi",
    name: "MIXI",
    logo: "/brands/mixi.png",
    aliases: ["MIXI", "MIXI Inc.", "株式会社MIXI"],
  },
  {
    id: "realbotix",
    name: "Realbotix",
    logo: "/brands/realbotix.png",
    aliases: ["Realbotix", "Realbotix Corp."],
  },
  {
    id: "ubtech",
    name: "UBTech",
    logo: "/brands/ubtech.png",
    aliases: ["UBTech", "UBTECH", "UBTech Robotics", "UBTECH Robotics"],
  },
  {
    id: "leju-robotics",
    name: "Leju Robotics",
    logo: "/brands/leju-robotics.png",
    aliases: [
      "Leju Robotics",
      "Leju",
      "Leju Robot",
      "乐聚机器人",
      "Suzhou Leju Robotics",
    ],
  },
  {
    id: "keenon-robotics",
    name: "KEENON Robotics",
    logo: "/brands/keenon-robotics.png",
    aliases: ["KEENON Robotics", "Keenon Robotics", "Keenon", "KEENON"],
  },
  {
    id: "casbot",
    name: "CASBOT",
    logo: "/brands/casbot.png",
    aliases: ["CASBOT", "Lingbao CASBOT", "灵宝CASBOT"],
  },
];

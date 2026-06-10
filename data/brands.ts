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
];

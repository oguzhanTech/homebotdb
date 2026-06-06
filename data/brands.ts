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
];

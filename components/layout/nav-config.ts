export const navItems = [
  { href: "/", label: "Dashboard", icon: "⌂" },
  { href: "/robots", label: "Robots", icon: "⌘" },
  { href: "/compare", label: "Compare", icon: "✣" },
  { href: "/updates", label: "Updates", icon: "⟳" },
  { href: "/news", label: "News", icon: "✎" },
  { href: "/wizard", label: "Wizard", icon: "⌁" },
] as const;

export type NavItem = (typeof navItems)[number];

export function isNavItemActive(pathname: string, item: NavItem): boolean {
  const hrefBase = item.href.split("#")[0];

  if (item.label === "Dashboard") return pathname === "/";
  if (item.label === "Robots") {
    return pathname === "/robots" || pathname.startsWith("/robots/");
  }
  if (item.label === "Updates") return pathname === "/updates";
  return hrefBase !== "/" && pathname.startsWith(hrefBase);
}

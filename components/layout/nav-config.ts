import { uiCopy } from "@/config/ui-copy";

export const navItems = [
  { href: "/", label: uiCopy.nav.commandCenter, icon: uiCopy.navIcons.commandCenter },
  { href: "/robots", label: uiCopy.nav.robots, icon: uiCopy.navIcons.robots },
  { href: "/compare", label: uiCopy.nav.compare, icon: uiCopy.navIcons.compare },
  { href: "/updates", label: uiCopy.nav.radarFeed, icon: uiCopy.navIcons.radarFeed },
  { href: "/news", label: uiCopy.nav.news, icon: uiCopy.navIcons.news },
  {
    href: "/wizard",
    label: uiCopy.nav.robotMatchmaker,
    icon: uiCopy.navIcons.robotMatchmaker,
  },
] as const;

export type NavItem = (typeof navItems)[number];

export function isNavItemActive(pathname: string, item: NavItem): boolean {
  const hrefBase = item.href.split("#")[0];

  if (item.href === "/") return pathname === "/";
  if (item.href === "/robots") {
    return pathname === "/robots" || pathname.startsWith("/robots/");
  }
  if (item.href === "/updates") {
    return pathname === "/updates" || pathname.startsWith("/updates/");
  }
  return hrefBase !== "/" && pathname.startsWith(hrefBase);
}

export type MobileNavItem = {
  id: string;
  label: string;
  href: string;
  /** Match exact path or hash anchor on home */
  match: "path" | "hash" | "prefix";
};

export const MOBILE_NAV_ITEMS: MobileNavItem[] = [
  { id: "home", label: "Home", href: "/", match: "path" },
  { id: "discover", label: "Discover", href: "/discover", match: "path" },
  { id: "trending", label: "Trending", href: "/#trending-anime", match: "hash" },
  { id: "communities", label: "Hubs", href: "/#communities", match: "hash" },
  { id: "watchlist", label: "List", href: "/watchlist", match: "prefix" },
];

export function isMobileNavActive(
  pathname: string,
  hash: string,
  item: MobileNavItem,
): boolean {
  if (item.match === "path") {
    return pathname === item.href;
  }
  if (item.match === "prefix") {
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  }
  if (item.match === "hash") {
    if (pathname !== "/") return false;
    const anchor = item.href.includes("#") ? item.href.split("#")[1] : "";
    return hash === `#${anchor}` || (anchor === "trending-anime" && hash === "");
  }
  return false;
}

"use client";

const RAIL_ITEMS = [
  { id: "community-pulse", label: "Pulse" },
  { id: "community-trending", label: "Trending" },
  { id: "community-theories", label: "Theories" },
  { id: "community-reactions", label: "Reactions" },
  { id: "community-clips", label: "Clips" },
  { id: "community-sidebar", label: "Explore" },
] as const;

export function CommunityPageRailNav() {
  return (
    <nav className="community-page__rail" aria-label="Community page sections">
      <div className="community-page__rail-inner horizontal-scroll">
        {RAIL_ITEMS.map((item) => (
          <a key={item.id} href={`#${item.id}`} className="community-page__rail-link">
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

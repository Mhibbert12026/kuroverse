/** Non-AniList sidebar data (communities without API-backed covers). */

export type Community = {
  id: string;
  name: string;
  members: string;
  online: number;
  icon: string;
  category: string;
  trending?: boolean;
};

export const communities: Community[] = [
  {
    id: "1",
    name: "AMV Creators Hub",
    members: "89K",
    online: 1890,
    icon: "🎬",
    category: "Creative",
    trending: true,
  },
  {
    id: "2",
    name: "Manga Readers Lounge",
    members: "210K",
    online: 5100,
    icon: "📚",
    category: "Discussion",
  },
  {
    id: "3",
    name: "Fan Art Studio",
    members: "67K",
    online: 920,
    icon: "🎨",
    category: "Art",
  },
  {
    id: "4",
    name: "Seasonal Watch Party",
    members: "45K",
    online: 2400,
    icon: "📺",
    category: "Events",
    trending: true,
  },
  {
    id: "5",
    name: "Studio Ghibli Society",
    members: "156K",
    online: 2800,
    icon: "🌿",
    category: "Classic",
  },
];

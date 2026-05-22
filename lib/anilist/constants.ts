/** Default cover when AniList returns no artwork. */
export const FALLBACK_COVER = "/art/scenes/fallback-cover.svg";

export const REVALIDATE_SECONDS = 3600;

/** AniList media IDs for legendary fandom community cards. */
export const FEATURED_FANDOM_IDS = [
  20, // Naruto
  269, // Bleach
  101922, // Demon Slayer
  21, // One Piece
  113415, // Jujutsu Kaisen
] as const;

export const FEATURED_FANDOM_META: Record<
  number,
  {
    slug: string;
    description: string;
    accent: "orange" | "cyan" | "emerald" | "gold" | "purple";
    members: string;
    online: number;
  }
> = {
  20: {
    slug: "naruto",
    description: "Shinobi discussions, filler guides & Boruto debates",
    accent: "orange",
    members: "892K",
    online: 12400,
  },
  269: {
    slug: "bleach",
    description: "Thousand-Year Blood War watch parties & soul reaper lore",
    accent: "cyan",
    members: "534K",
    online: 8100,
  },
  101922: {
    slug: "demon-slayer",
    description: "Hashira training hype, manga spoilers & figure drops",
    accent: "emerald",
    members: "1.2M",
    online: 18900,
  },
  21: {
    slug: "one-piece",
    description: "Theory crafting, chapter leaks & grand line adventures",
    accent: "gold",
    members: "2.1M",
    online: 28400,
  },
  113415: {
    slug: "jujutsu-kaisen",
    description: "Cursed techniques, Gojo edits & manga chapter threads",
    accent: "purple",
    members: "978K",
    online: 15600,
  },
};

export const CLIP_FEED_META = [
  { creator: "ShadowMonarch", suffix: "— fan edit", views: "2.4M", likes: "184K", tag: "#AMV" },
  { creator: "MageArchive", suffix: "— emotional AMV", views: "1.8M", likes: "142K", tag: "#Fantasy" },
  { creator: "DevilHunterTV", suffix: "— compilation", views: "3.1M", likes: "256K", tag: "#Action" },
  { creator: "CursedEnergy", suffix: "— 4K edit", views: "4.2M", likes: "312K", tag: "#Trending" },
  { creator: "ForgerFamily", suffix: "— supercut", views: "980K", likes: "89K", tag: "#Comedy" },
] as const;

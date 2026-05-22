import { avatarForCreator } from "@/lib/images";
import type { CommunityRegistryEntry } from "./registry";
import { COMMUNITY_REGISTRY, COMMUNITY_SLUGS, type CommunitySlug } from "./registry";
import type { CommunitySidebarData } from "./sidebar.types";

function hashSeed(slug: string, salt: string): number {
  let h = 0;
  const s = slug + salt;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

const CONTRIBUTORS = [
  { name: "ShadowMonarch", badge: "gold" as const },
  { name: "MageArchive", badge: "silver" as const },
  { name: "DevilHunterTV", badge: "bronze" as const },
  { name: "CursedEnergy", badge: undefined },
  { name: "SoulReaperX", badge: undefined },
] as const;

const GLOBAL_RANK_ORDER: CommunitySlug[] = [
  "one-piece",
  "jujutsu-kaisen",
  "naruto",
  "demon-slayer",
  "bleach",
];

export function buildCommunitySidebar(
  entry: CommunityRegistryEntry,
  allSlugs: {
    slug: string;
    name: string;
    members: string;
    online: number;
    accent: CommunityRegistryEntry["accent"];
    coverUrl: string;
  }[],
  relatedAnime?: {
    anilistId: number;
    title: string;
    coverUrl: string;
    accent: CommunityRegistryEntry["accent"];
  },
): CommunitySidebarData {
  const seed = hashSeed(entry.slug, "sidebar");

  const related = allSlugs
    .filter((c) => c.slug !== entry.slug)
    .slice(0, 4)
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      members: c.members,
      online: formatCompactOnline(c.online),
      accent: c.accent,
      coverUrl: c.coverUrl,
    }));

  const trendingTags = [
    ...entry.trendingTopics.slice(0, 4).map((topic, i) => ({
      label: topic.startsWith("#") ? topic : `#${topic}`,
      posts: formatPosts(800 + ((seed + i * 17) % 4200)),
      hot: i === 0,
    })),
    ...entry.tags.slice(0, 3).map((tag, i) => ({
      label: tag,
      posts: formatPosts(200 + ((seed + i * 9) % 1800)),
      hot: false,
    })),
  ].slice(0, 8);

  const topContributors = CONTRIBUTORS.slice(0, 5).map((c, i) => ({
    rank: i + 1,
    name: c.name,
    avatarUrl: avatarForCreator(c.name),
    reputation: `${(12 - i) * 1.2}K XP`,
    posts: 120 + (hashSeed(entry.slug, `contrib-${i}`) % 480),
    badge: c.badge,
  }));

  const upcomingEpisodes = [
    {
      id: "next-ep",
      title: `${entry.title} — New Episode`,
      subtitle: `Ep. ${108 + (seed % 12)} simulcast`,
      eta: `${2 + (seed % 5)}d`,
      urgent: false,
    },
    {
      id: "watch-party",
      title: "Community Watch Party",
      subtitle: "Live chat + clip drops",
      eta: "Sat 8PM",
      urgent: true,
    },
    {
      id: "manga",
      title: "Manga Chapter Megathread",
      subtitle: "Spoiler tags required",
      eta: `${1 + (seed % 3)}d`,
      urgent: false,
    },
    {
      id: "season",
      title: "Season Premiere Countdown",
      subtitle: "Cour 2 announcement",
      eta: `${14 + (seed % 10)}d`,
      urgent: false,
    },
  ];

  const popularRankings = GLOBAL_RANK_ORDER.map((slug, index) => {
    const c = COMMUNITY_REGISTRY[slug];
    const rankSeed = hashSeed(entry.slug, `rank-${slug}`);
    const trends: ("up" | "down" | "same")[] = ["up", "up", "same", "down", "up"];
    const deltas = ["+2", "+1", "—", "-1", "+3"];
    return {
      rank: index + 1,
      title: c.title,
      slug: c.slug,
      coverUrl: c.coverImage,
      score: (8.4 + (rankSeed % 60) / 100).toFixed(1),
      delta: deltas[index] ?? "+1",
      trend: trends[index] ?? "same",
    };
  });

  return {
    relatedAnime: {
      anilistId: relatedAnime?.anilistId ?? entry.anilistId,
      title: relatedAnime?.title ?? entry.title,
      coverUrl: relatedAnime?.coverUrl ?? entry.coverImage,
      accent: relatedAnime?.accent ?? entry.accent,
      genres: entry.tags.slice(0, 3).join(" · "),
    },
    related,
    trendingTags,
    topContributors,
    upcomingEpisodes,
    popularRankings,
  };
}

function formatCompactOnline(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K online`;
  return `${n} online`;
}

function formatPosts(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K posts`;
  return `${n} posts`;
}

export function getSidebarRegistryRows() {
  return COMMUNITY_SLUGS.map((slug) => {
    const e = COMMUNITY_REGISTRY[slug];
    return {
      slug,
      name: e.title,
      members: e.members,
      online: e.online,
      accent: e.accent,
      coverUrl: e.coverImage,
    };
  });
}

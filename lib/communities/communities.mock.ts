import { sceneArt } from "@/lib/images";
import type { AnimeCommunity } from "./community-data";

/**
 * Mock anime community directory — single source of truth for fandom hub metadata.
 * Replace with API responses when backend is ready.
 */
export const MOCK_COMMUNITIES = [
  {
    id: "community-naruto",
    slug: "naruto",
    title: "Naruto",
    description:
      "The ultimate shinobi hangout — filler arc survival guides, Boruto debates, Akatsuki tier lists, and weekly episode reaction threads.",
    bannerImage: sceneArt("comm-naruto"),
    coverImage: sceneArt("comm-naruto"),
    memberCount: 892_400,
    onlineCount: 12_400,
    tags: ["#Shinobi", "#NarutoRun", "#Akatsuki", "#Boruto", "#Fillers", "#AMV"],
    trendingTopics: [
      "AkatsukiTierList",
      "BorutoVsClassic",
      "FillerGuide",
      "JiraiyaTribute",
    ],
    anilistId: 20,
    accent: "orange",
  },
  {
    id: "community-one-piece",
    slug: "one-piece",
    title: "One Piece",
    description:
      "Sail the Grand Line with the largest crew on KuroVerse — chapter theories, bounty predictions, gear debates, and legendary watch parties.",
    bannerImage: sceneArt("comm-one-piece"),
    coverImage: sceneArt("comm-one-piece"),
    memberCount: 2_140_000,
    onlineCount: 28_400,
    tags: ["#GrandLine", "#TheoryCraft", "#Gear5", "#BountyHunters", "#Manga", "#Nakama"],
    trendingTopics: [
      "FinalSagaTheories",
      "Gear5Hype",
      "ChapterLeaks",
      "BountyFriday",
    ],
    anilistId: 21,
    accent: "gold",
  },
  {
    id: "community-bleach",
    slug: "bleach",
    title: "Bleach",
    description:
      "Soul Society HQ for Thousand-Year Blood War watch parties, Bankai reveals, Ichigo vs Aizen discourse, and vintage shounen nostalgia.",
    bannerImage: sceneArt("comm-bleach"),
    coverImage: sceneArt("comm-bleach"),
    memberCount: 534_800,
    onlineCount: 8_100,
    tags: ["#SoulReaper", "#TYBW", "#Bankai", "#Ichigo", "#Espada", "#Kubo"],
    trendingTopics: [
      "TYBWWatchParty",
      "BankaiReveal",
      "EspadaRanking",
      "SoulSocietyLore",
    ],
    anilistId: 269,
    accent: "cyan",
  },
  {
    id: "community-jujutsu-kaisen",
    slug: "jujutsu-kaisen",
    title: "Jujutsu Kaisen",
    description:
      "Cursed energy central — Gojo edits, domain expansion breakdowns, manga chapter megathreads, and MAPPA sakuga appreciation.",
    bannerImage: sceneArt("comm-jjk"),
    coverImage: sceneArt("comm-jjk"),
    memberCount: 978_200,
    onlineCount: 15_600,
    tags: ["#JJK", "#Gojo", "#DomainExpansion", "#CursedEnergy", "#MAPPA", "#Manga"],
    trendingTopics: [
      "GojoEdits",
      "ChapterDiscussion",
      "DomainBattles",
      "SukunaArc",
    ],
    anilistId: 113415,
    accent: "purple",
  },
  {
    id: "community-demon-slayer",
    slug: "demon-slayer",
    title: "Demon Slayer",
    description:
      "Hashira training grounds — breathing style guides, figure drop alerts, Infinity Castle theories, and Ufotable animation worship.",
    bannerImage: sceneArt("comm-demon-slayer"),
    coverImage: sceneArt("comm-demon-slayer"),
    memberCount: 1_205_000,
    onlineCount: 18_900,
    tags: ["#Hashira", "#BreathingStyles", "#Nezuko", "#Ufotable", "#Figures", "#AMV"],
    trendingTopics: [
      "HashiraTraining",
      "InfinityCastle",
      "NezukoMoments",
      "UfotableSakuga",
    ],
    anilistId: 101922,
    accent: "emerald",
  },
] as const satisfies readonly AnimeCommunity[];

export type MockCommunitySlug = (typeof MOCK_COMMUNITIES)[number]["slug"];

/** Lookup map by URL slug. */
export const MOCK_COMMUNITIES_BY_SLUG = {
  naruto: MOCK_COMMUNITIES[0],
  "one-piece": MOCK_COMMUNITIES[1],
  bleach: MOCK_COMMUNITIES[2],
  "jujutsu-kaisen": MOCK_COMMUNITIES[3],
  "demon-slayer": MOCK_COMMUNITIES[4],
} satisfies Record<MockCommunitySlug, AnimeCommunity>;

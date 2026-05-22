import { avatarForCreator } from "@/lib/images";
import { FEATURED_COMMUNITY_DISCUSSIONS } from "./discussion-content";
import type { CommunityRegistryEntry } from "./registry";
import { isCommunitySlug } from "./registry";
import type { CommunityThread } from "./types";

function hashSeed(slug: string, salt: string): number {
  let h = 0;
  const s = slug + salt;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

const CREATORS = [
  "ShadowMonarch",
  "MageArchive",
  "DevilHunterTV",
  "CursedEnergy",
  "ForgerFamily",
  "NakamaCaptain",
  "EpisodeOracle",
] as const;

const TIMESTAMPS = [
  "3m ago",
  "12m ago",
  "34m ago",
  "1h ago",
  "2h ago",
  "5h ago",
  "8h ago",
  "12h ago",
  "1d ago",
];

type ThreadTemplate = Omit<
  CommunityThread,
  "id" | "author" | "avatarUrl" | "timeAgo" | "likes" | "replies" | "views"
>;

function templatesForCommunity(title: string): ThreadTemplate[] {
  return [
    {
      category: "trending",
      title: `Weekly ${title} discussion megathread`,
      excerpt:
        "Drop your hot takes, rankings, and rewatch plans. One thread for everything — rules in the pinned reply.",
      pinned: true,
      hot: true,
    },
    {
      category: "episode",
      title: `Episode reaction — the ending broke me`,
      excerpt:
        "No words. That final scene with the soundtrack had me standing up. Who else rewatched it three times?",
      episodeLabel: "Latest ep",
      hot: true,
    },
    {
      category: "theory",
      title: "Fan theory: the villain's motive was foreshadowed in ep 4",
      excerpt:
        "Re-watch the festival arc — background character placement is NOT random. Screenshots inside.",
    },
    {
      category: "manga",
      title: "Manga chapter discussion — FULL SPOILERS",
      excerpt:
        "Anime-onlies turn back. We're unpacking the latest chapter and what it means for the final arc.",
      hasSpoilers: true,
      spoilerScope: "Manga latest",
    },
    {
      category: "episode",
      title: "Episode 12 live reaction thread",
      excerpt:
        "Watching with the community tonight. Drop timestamps for peak moments and sakuga shots.",
      episodeLabel: "Ep. 12",
    },
    {
      category: "discussion",
      title: "Best arc to hook a friend who's never watched?",
      excerpt:
        "Trying to convert my roommate — do I start classic order or the hype arc everyone's on?",
    },
    {
      category: "theory",
      title: "Power scaling tier list (prepare for war)",
      excerpt:
        "I made a chart. It's controversial. Defend your favorite in the replies with evidence.",
      hot: true,
    },
    {
      category: "manga",
      title: "Anime-only fans — ask manga readers (spoiler-free)",
      excerpt:
        "Questions about pacing and filler only. Manga readers please use spoiler tags in replies.",
      hasSpoilers: false,
    },
    {
      category: "episode",
      title: "Sakuga appreciation — this week's animation",
      excerpt:
        "The fight choreography at 14:22 is insane. Frame-by-frame breakdown welcome.",
      episodeLabel: "Ep. 11",
    },
    {
      category: "trending",
      title: "Fan edit Friday — drop your AMVs",
      excerpt:
        "Community vote for clip of the week. Link edits only, no self-promo spam.",
    },
  ];
}

/** Build discussion threads for a community from mock templates. */
export function buildDiscussionThreads(entry: CommunityRegistryEntry): CommunityThread[] {
  const templates = isCommunitySlug(entry.slug)
    ? FEATURED_COMMUNITY_DISCUSSIONS[entry.slug]
    : templatesForCommunity(entry.title);

  return templates.map((t, i) => {
    const author = CREATORS[hashSeed(entry.slug, `author-${i}`) % CREATORS.length];
    const seed = hashSeed(entry.slug, `thread-${i}`);
    return {
      id: `${entry.slug}-thread-${i}`,
      ...t,
      author,
      avatarUrl: avatarForCreator(author),
      timeAgo: TIMESTAMPS[i] ?? "2d ago",
      likes: 48 + (seed % 2400),
      replies: 4 + (seed % 120),
      views: `${1 + (seed % 40)}.${seed % 10}K`,
    };
  });
}

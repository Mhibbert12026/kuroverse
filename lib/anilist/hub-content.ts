import { avatarForCreator } from "@/lib/images";
import type { AnimeDetail } from "./detail-types";
import { CLIP_FEED_META } from "./constants";
import type {
  HubComment,
  HubCommunityStats,
  HubDiscussion,
  HubReaction,
} from "./hub-types";
import type { AnimeCard, TrendingClipCard } from "./types";

function hashSeed(id: number, salt: string): number {
  let h = id;
  for (let i = 0; i < salt.length; i++) {
    h = (h * 31 + salt.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function buildHubCommunityStats(anime: AnimeDetail): HubCommunityStats {
  const pop = anime.popularity ?? 50_000;
  const seed = hashSeed(anime.id, "stats");
  const members = Math.floor(pop * 0.42 + (seed % 8000));
  const online = Math.floor(members * 0.018 + (seed % 400));
  return {
    members: formatCompact(members),
    online,
    discussionsToday: 120 + (seed % 480),
    clipsShared: formatCompact(Math.floor(pop * 0.08 + (seed % 2000))),
    watchlistAdds: formatCompact(Math.floor(pop * 0.15 + (seed % 5000))),
    episodeThreads: anime.episodes ? Math.min(anime.episodes, 24) + (seed % 12) : 18 + (seed % 30),
    growthPercent: 8 + (seed % 24),
  };
}

export function buildHubDiscussions(anime: AnimeDetail): HubDiscussion[] {
  const creators = [
    "ShadowMonarch",
    "MageArchive",
    "DevilHunterTV",
    "CursedEnergy",
    "ForgerFamily",
    "NakamaCaptain",
    "EpisodeOracle",
  ];
  const templates = [
    `Just finished the latest ${anime.title} stretch — that pacing was insane. Anyone else rewatching tonight?`,
    `Hot take: ${anime.genres[0] ?? "this"} fans are sleeping on the soundtrack. Fight me in the replies.`,
    `Episode discussion thread — drop your theories without manga spoilers please.`,
    `Looking for a watch party crew. ${anime.episodesLabel} and still hyped every week.`,
    `Fan edit dropped and it's already blowing up. Check the clips row below.`,
    `Unpopular opinion but I think ${anime.title} has the best character writing this season.`,
  ];
  const times = ["2m ago", "18m ago", "1h ago", "3h ago", "6h ago", "12h ago"];

  return templates.map((body, i) => {
    const author = pick(creators, hashSeed(anime.id, `author-${i}`));
    const seed = hashSeed(anime.id, `disc-${i}`);
    return {
      id: `disc-${anime.id}-${i}`,
      author,
      avatarUrl: avatarForCreator(author),
      timeAgo: times[i] ?? "1d ago",
      body,
      likes: 40 + (seed % 900),
      replies: 3 + (seed % 80),
      pinned: i === 0,
    };
  });
}

export function buildHubReactions(anime: AnimeDetail): HubReaction[] {
  const base = [
    { id: "fire", emoji: "🔥", label: "Fire" },
    { id: "goat", emoji: "🐐", label: "GOAT" },
    { id: "cry", emoji: "😭", label: "Tears" },
    { id: "hype", emoji: "⚡", label: "Hype" },
    { id: "art", emoji: "🎨", label: "Sakuga" },
    { id: "ship", emoji: "💜", label: "Ship" },
  ];
  return base.map((r, i) => ({
    ...r,
    count: 200 + (hashSeed(anime.id, r.id) % 4000) + i * 180,
  }));
}

export function buildHubClips(anime: AnimeDetail, pool: AnimeCard[]): TrendingClipCard[] {
  const fallback: AnimeCard = {
    id: anime.id,
    title: anime.title,
    coverUrl: anime.coverUrl,
    genres: anime.genresLabel,
    rating: anime.rating,
    ratingValue: anime.ratingValue,
    popularityLabel: anime.popularityLabel,
    popularity: anime.popularity,
    status: anime.status,
    episodesLabel: anime.episodesLabel,
    accentColor: anime.accentColor,
    accentClass: "from-violet-600/50 to-indigo-950/90",
  };
  const cards = pool.length > 0 ? pool : [fallback];

  return CLIP_FEED_META.map((meta, index) => {
    const source = cards[index % cards.length];
    return {
      id: `hub-clip-${anime.id}-${index}`,
      anime: source,
      creator: meta.creator,
      displayTitle: `${anime.title} ${meta.suffix}`,
      views: meta.views,
      likes: meta.likes,
      tag: meta.tag,
    };
  });
}

export function buildHubComments(anime: AnimeDetail): HubComment[] {
  const creators = ["ShadowMonarch", "MageArchive", "CursedEnergy", "ForgerFamily", "EpisodeOracle"];
  const snippets = [
    "This episode broke me. No notes.",
    "The animation during the fight scene was unreal.",
    "Rewatching with friends this weekend — who's in?",
    "OST on repeat for the third day straight.",
    "That cliffhanger though…",
    "Peak fiction. We're so back.",
  ];
  const times = ["1m ago", "8m ago", "22m ago", "45m ago", "1h ago", "2h ago"];

  return snippets.map((body, i) => {
    const author = pick(creators, hashSeed(anime.id, `comment-${i}`));
    const seed = hashSeed(anime.id, `cmt-${i}`);
    return {
      id: `cmt-${anime.id}-${i}`,
      author,
      avatarUrl: avatarForCreator(author),
      timeAgo: times[i] ?? "3h ago",
      body,
      likes: 12 + (seed % 200),
    };
  });
}

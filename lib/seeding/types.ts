export const SEED_KINDS = [
  "discussion_prompt",
  "episode_thread",
  "ai_summary",
  "hot_take",
  "trending_rec",
  "featured_drop",
] as const;

export type SeedKind = (typeof SEED_KINDS)[number];

export type SeedConfig = {
  enabled: boolean;
  seedUserId: string | null;
  postsPerRun: number;
  episodeThreadsPerRun: number;
  hotTakesPerRun: number;
  summariesPerRun: number;
  trendingRecsPerRun: number;
  useAiSummaries: boolean;
  scheduleHours: number;
  lastRunAt: string | null;
  nextRunAt: string | null;
};

export type SeedBatch = {
  id: string;
  triggeredBy: "cron" | "manual" | "admin";
  actorId: string | null;
  postsCreated: number;
  featuredAnimeId: number | null;
  notes: string | null;
  createdAt: string;
};

export type DailyFeatured = {
  featuredDate: string;
  animeId: number;
  animeTitle: string;
  animeCoverUrl: string | null;
  communitySlug: string;
  tagline: string;
  summary: string;
  hotTake: string | null;
};

export type SeedContext = {
  animeTitle: string;
  animeId: number;
  communitySlug: string;
  communityTitle: string;
  genres: string;
  episode: number;
  episodeMax: number;
  rating: string;
  status: string;
};

export type GeneratedSeedPost = {
  kind: SeedKind;
  communitySlug: string;
  category: "discussion" | "episode" | "theory" | "trending";
  title: string;
  body: string;
  episodeLabel?: string;
  hasSpoilers?: boolean;
  spoilerScope?: string;
  animeId: number;
};

export type SeedRunResult = {
  ok: boolean;
  error?: string;
  batchId?: string;
  postsCreated?: number;
  featuredAnimeId?: number;
};

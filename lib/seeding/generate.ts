import type { SeedConfig, GeneratedSeedPost, SeedContext, SeedKind } from "./types";
import { contextVars } from "./context";
import { applyTemplate, pickTemplate } from "./templates";
import { buildAiSummary } from "./summary";

function hashSeed(...parts: (string | number)[]): number {
  const s = parts.join(":");
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

async function postFromKind(
  kind: SeedKind,
  ctx: SeedContext,
  seed: number,
  useAi: boolean,
): Promise<GeneratedSeedPost> {
  if (kind === "ai_summary") {
    const summary = await buildAiSummary(ctx, useAi);
    return {
      kind,
      communitySlug: ctx.communitySlug,
      category: "discussion",
      title: summary.title,
      body: summary.body,
      animeId: ctx.animeId,
    };
  }

  const template = pickTemplate(kind, seed);
  const vars = contextVars(ctx, kind === "featured_drop" ? { tagline: "Today's KuroVerse spotlight." } : {});
  const { title, body } = applyTemplate(template, vars);

  const category =
    kind === "episode_thread"
      ? "episode"
      : kind === "hot_take"
        ? "theory"
        : kind === "trending_rec"
          ? "trending"
          : "discussion";

  return {
    kind,
    communitySlug: ctx.communitySlug,
    category,
    title: title.slice(0, 200),
    body: body.slice(0, 4000),
    episodeLabel: kind === "episode_thread" ? `Episode ${ctx.episode}` : undefined,
    hasSpoilers: kind === "episode_thread",
    spoilerScope: kind === "episode_thread" ? `Episode ${ctx.episode}` : undefined,
    animeId: ctx.animeId,
  };
}

export async function generateSeedPosts(
  contexts: SeedContext[],
  config: SeedConfig,
  batchSeed: string,
): Promise<GeneratedSeedPost[]> {
  const posts: GeneratedSeedPost[] = [];
  const baseSeed = hashSeed(batchSeed);

  const quotas: { kind: SeedKind; count: number }[] = [
    { kind: "discussion_prompt", count: Math.max(1, config.postsPerRun - config.episodeThreadsPerRun - config.hotTakesPerRun - config.summariesPerRun - config.trendingRecsPerRun) },
    { kind: "episode_thread", count: config.episodeThreadsPerRun },
    { kind: "hot_take", count: config.hotTakesPerRun },
    { kind: "ai_summary", count: config.summariesPerRun },
    { kind: "trending_rec", count: config.trendingRecsPerRun },
  ];

  let ctxIndex = 0;
  for (const { kind, count } of quotas) {
    for (let i = 0; i < count; i++) {
      const ctx = contexts[ctxIndex % contexts.length];
      ctxIndex++;
      posts.push(await postFromKind(kind, ctx, baseSeed + i + kind.length, config.useAiSummaries));
    }
  }

  return posts;
}

export function generateFeaturedDrop(ctx: SeedContext, tagline: string): GeneratedSeedPost {
  const seed = hashSeed(ctx.animeId, "featured");
  const template = pickTemplate("featured_drop", seed);
  const { title, body } = applyTemplate(template, contextVars(ctx, { tagline }));

  return {
    kind: "featured_drop",
    communitySlug: ctx.communitySlug,
    category: "trending",
    title,
    body,
    animeId: ctx.animeId,
  };
}

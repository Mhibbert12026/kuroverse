import { cache } from "react";
import {
  ANIME_RECOMMENDATIONS_QUERY,
  ANIME_RELATED_BY_GENRE_QUERY,
} from "./queries";
import { getAnimeDetail } from "./detail";
import type { AniListGraphQLResponse, AniListPageResponse } from "./types";
import { toAnimeCards } from "./transform";
import { REVALIDATE_SECONDS } from "./constants";
import type { AniListRecommendationsResponse, AnimeHubData } from "./hub-types";
import {
  buildHubClips,
  buildHubCommunityStats,
  buildHubComments,
  buildHubDiscussions,
  buildHubReactions,
} from "./hub-content";

const ANILIST_GRAPHQL_URL = "https://graphql.anilist.co";

async function anilistHubRequest<T>(
  query: string,
  variables: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(ANILIST_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`AniList request failed: ${response.status}`);
  }

  const json = (await response.json()) as AniListGraphQLResponse<T>;
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }
  return json.data;
}

async function fetchAlsoWatch(animeId: number) {
  try {
    const data = await anilistHubRequest<AniListRecommendationsResponse>(
      ANIME_RECOMMENDATIONS_QUERY,
      { id: animeId, perPage: 12 },
    );
    const edges = data.Media?.recommendations?.edges ?? [];
    const media = edges
      .map((e) => e.node?.mediaRecommendation)
      .filter((m): m is NonNullable<typeof m> => m != null && m.id !== animeId);
    return toAnimeCards(media.slice(0, 10));
  } catch {
    return [];
  }
}

async function fetchRelated(animeId: number, genres: string[]) {
  if (!genres.length) return [];
  try {
    const data = await anilistHubRequest<AniListPageResponse>(
      ANIME_RELATED_BY_GENRE_QUERY,
      { genres: genres.slice(0, 3), perPage: 12, excludeId: animeId },
    );
    const media = (data.Page?.media ?? []).filter((m) => m.id !== animeId);
    return toAnimeCards(media.slice(0, 10), { withRank: true });
  } catch {
    return [];
  }
}

export const getAnimeHub = cache(async (id: number): Promise<AnimeHubData | null> => {
  const anime = await getAnimeDetail(id);
  if (!anime) return null;

  const [alsoWatch, related] = await Promise.all([
    fetchAlsoWatch(id),
    fetchRelated(id, anime.genres),
  ]);

  const pool = [...alsoWatch, ...related];
  const clips = buildHubClips(anime, pool);

  return {
    anime,
    related,
    alsoWatch,
    clips,
    discussions: buildHubDiscussions(anime),
    reactions: buildHubReactions(anime),
    comments: buildHubComments(anime),
    stats: buildHubCommunityStats(anime),
  };
});

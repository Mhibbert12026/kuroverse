import { ANIME_BY_IDS_QUERY, ANIME_LIST_QUERY } from "./queries";
import { toAnimeCard, toAnimeCards } from "./transform";
import type {
  AniListGraphQLResponse,
  AniListMedia,
  AniListPageResponse,
  AnimeCard,
  MediaSort,
} from "./types";
import { REVALIDATE_SECONDS } from "./constants";

const ANILIST_GRAPHQL_URL = "https://graphql.anilist.co";

type FetchOptions = {
  page?: number;
  perPage?: number;
  sort?: MediaSort;
  ids?: number[];
  revalidate?: number;
};

async function anilistRequest<T>(
  query: string,
  variables: Record<string, unknown>,
  revalidate = REVALIDATE_SECONDS,
): Promise<T> {
  const response = await fetch(ANILIST_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate },
  });

  if (!response.ok) {
    throw new Error(`AniList request failed: ${response.status} ${response.statusText}`);
  }

  const json = (await response.json()) as AniListGraphQLResponse<T>;

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }

  return json.data;
}

export async function fetchAnimeMediaList(
  options: FetchOptions = {},
): Promise<AniListMedia[]> {
  const page = options.page ?? 1;
  const perPage = options.perPage ?? 12;
  const sort = options.sort ?? "TRENDING_DESC";
  const revalidate = options.revalidate ?? REVALIDATE_SECONDS;

  const data = await anilistRequest<AniListPageResponse>(
    ANIME_LIST_QUERY,
    { page, perPage, sort: [sort] },
    revalidate,
  );

  return data.Page?.media ?? [];
}

export async function fetchAnimeByIds(ids: number[]): Promise<AniListMedia[]> {
  if (!ids.length) return [];

  const data = await anilistRequest<AniListPageResponse>(
    ANIME_BY_IDS_QUERY,
    { ids, perPage: ids.length },
  );

  const media = data.Page?.media ?? [];
  const byId = new Map(media.map((m) => [m.id, m]));
  return ids.map((id) => byId.get(id)).filter((m): m is AniListMedia => m != null);
}

export async function fetchTrendingAnimeCards(perPage = 12): Promise<AnimeCard[]> {
  const media = await fetchAnimeMediaList({ perPage, sort: "TRENDING_DESC" });
  return toAnimeCards(media, { withRank: true });
}

export function dedupeMediaById(lists: AniListMedia[][]): AniListMedia[] {
  const seen = new Set<number>();
  const result: AniListMedia[] = [];
  for (const list of lists) {
    for (const item of list) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        result.push(item);
      }
    }
  }
  return result;
}

import { MOCK_COMMUNITIES } from "./communities.mock";

/** Map AniList media id → community hub slug when a fandom exists. */
export function getCommunitySlugForAnime(anilistId: number): string | null {
  const entry = MOCK_COMMUNITIES.find((c) => c.anilistId === anilistId);
  return entry?.slug ?? null;
}

import { formatMemberCount } from "./community-data";
import { MOCK_COMMUNITIES, MOCK_COMMUNITIES_BY_SLUG, type MockCommunitySlug } from "./communities.mock";
import type { AnimeCommunity } from "./community-data";
import type { CommunityAccent } from "./types";

export const COMMUNITY_SLUGS = MOCK_COMMUNITIES.map((c) => c.slug) as MockCommunitySlug[];

export type CommunitySlug = MockCommunitySlug;

/** Primary fandom hubs — static generation & marketing focus. */
export const FEATURED_COMMUNITY_SLUGS = [
  "naruto",
  "one-piece",
  "bleach",
  "jujutsu-kaisen",
] as const satisfies readonly CommunitySlug[];

export type FeaturedCommunitySlug = (typeof FEATURED_COMMUNITY_SLUGS)[number];

/** Registry entry used by page builders (extends mock with display labels). */
export type CommunityRegistryEntry = AnimeCommunity & {
  members: string;
  online: number;
};

function toRegistryEntry(community: AnimeCommunity): CommunityRegistryEntry {
  return {
    ...community,
    members: formatMemberCount(community.memberCount),
    online: community.onlineCount,
  };
}

export const COMMUNITY_REGISTRY: Record<CommunitySlug, CommunityRegistryEntry> =
  Object.fromEntries(
    MOCK_COMMUNITIES.map((c) => [c.slug, toRegistryEntry(c)]),
  ) as Record<CommunitySlug, CommunityRegistryEntry>;

export function isCommunitySlug(slug: string): slug is CommunitySlug {
  return slug in MOCK_COMMUNITIES_BY_SLUG;
}

export function getRegistryEntry(slug: CommunitySlug): CommunityRegistryEntry {
  return COMMUNITY_REGISTRY[slug];
}

export function getAllCommunities(): CommunityRegistryEntry[] {
  return COMMUNITY_SLUGS.map((slug) => COMMUNITY_REGISTRY[slug]);
}

export { MOCK_COMMUNITIES, MOCK_COMMUNITIES_BY_SLUG };
export type { AnimeCommunity } from "./community-data";

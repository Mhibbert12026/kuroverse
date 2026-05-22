import type { AnimeCommunity } from "@/lib/communities/community-data";
import type { CommunityPageData } from "@/lib/communities/types";
import type { CommunityHeroSectionProps } from "./types";

/** Map full community page payload to hero props. */
export function communityPageToHeroProps(
  community: CommunityPageData,
): CommunityHeroSectionProps {
  return {
    title: community.title,
    description: community.description,
    bannerImage: community.bannerUrl ?? community.coverUrl,
    coverImage: community.coverUrl,
    memberCount: community.members,
    onlineCount: community.online,
    accent: community.accent,
    accentColor: community.accentColor,
    anilistId: community.anilistId,
    joinHref: "#community-feed",
  };
}

/** Map mock/API `AnimeCommunity` to hero props. */
export function animeCommunityToHeroProps(
  community: AnimeCommunity,
): CommunityHeroSectionProps {
  return {
    title: community.title,
    description: community.description,
    bannerImage: community.bannerImage,
    coverImage: community.coverImage,
    memberCount: community.memberCount,
    onlineCount: community.onlineCount,
    accent: community.accent,
    anilistId: community.anilistId,
    joinHref: `/communities/${community.slug}#community-feed`,
  };
}

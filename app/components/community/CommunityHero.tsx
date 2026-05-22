import type { CommunityPageData } from "@/lib/communities/types";
import { CommunityHeroSection, communityPageToHeroProps } from "./hero";

type CommunityHeroProps = {
  community: CommunityPageData;
};

/** @deprecated Use `CommunityHeroSection` from `./hero` directly. */
export function CommunityHero({ community }: CommunityHeroProps) {
  return <CommunityHeroSection {...communityPageToHeroProps(community)} />;
}

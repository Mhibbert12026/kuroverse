import type { CommunityPageData } from "@/lib/communities/types";
import { CommunityHeroBanner } from "./hero/CommunityHeroBanner";

type CommunityBannerProps = {
  community: CommunityPageData;
};

/** @deprecated Banner is included in `CommunityHeroSection`. */
export function CommunityBanner({ community }: CommunityBannerProps) {
  return (
    <CommunityHeroBanner
      bannerImage={community.bannerUrl ?? community.coverUrl}
      title={community.title}
      accentColor={community.accentColor ?? "#7c3aed"}
    />
  );
}

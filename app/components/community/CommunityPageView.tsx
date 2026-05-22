import type { CommunityPageData } from "@/lib/communities/types";
import { CommunityPageLayout } from "./layout";

type CommunityPageViewProps = {
  community: CommunityPageData;
};

/** Community fandom page — hero, discussion, clips, sidebar. */
export function CommunityPageView({ community }: CommunityPageViewProps) {
  return <CommunityPageLayout community={community} />;
}

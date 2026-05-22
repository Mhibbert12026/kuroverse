import type { CommunityThread } from "@/lib/communities/types";
import { DiscussionFeed } from "./discussion";

type CommunityDiscussionFeedProps = {
  threads: CommunityThread[];
  title: string;
  communitySlug: string;
};

/** Community discussion feed — Reddit/Discord-inspired thread list. */
export function CommunityDiscussionFeed({
  threads,
  title,
  communitySlug,
}: CommunityDiscussionFeedProps) {
  return <DiscussionFeed threads={threads} title={title} communitySlug={communitySlug} />;
}

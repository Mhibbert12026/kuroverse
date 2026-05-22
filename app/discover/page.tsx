import type { Metadata } from "next";
import { DiscoverFeed } from "@/app/components/discover/DiscoverFeed";
import { getDiscoverFeedPage } from "@/lib/discover/feed";

export const metadata: Metadata = {
  title: "Discover",
  description: "Swipe through trending anime clips, fan edits, and fandom highlights on KuroVerse.",
};

export default async function DiscoverPage() {
  const { clips, hasMore } = await getDiscoverFeedPage(1);

  return <DiscoverFeed initialClips={clips} initialHasMore={hasMore} />;
}

import type { CommunityClip } from "@/lib/communities/types";
import { TrendingClipsSection } from "./clips";

type CommunityClipsProps = {
  clips: CommunityClip[];
};

/** Trending clips row — TikTok / Crunchyroll-inspired horizontal feed. */
export function CommunityClips({ clips }: CommunityClipsProps) {
  return <TrendingClipsSection clips={clips} />;
}

import type { CommunityAccent } from "@/lib/communities/types";

/** Props for the reusable community hero — works with page data or mock `AnimeCommunity`. */
export type CommunityHeroSectionProps = {
  title: string;
  description: string;
  bannerImage: string;
  coverImage: string;
  /** Raw number or pre-formatted label (e.g. "892K"). */
  memberCount: number | string;
  onlineCount: number;
  accent: CommunityAccent;
  accentColor?: string | null;
  badgeLabel?: string;
  backHref?: string;
  backLabel?: string;
  anilistId?: number;
  /** Primary CTA — defaults to button; set `joinHref` for link behavior. */
  joinHref?: string;
  joinLabel?: string;
  showSecondaryActions?: boolean;
  className?: string;
};

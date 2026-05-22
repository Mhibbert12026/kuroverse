import { formatTimeAgo } from "@/lib/community-posts/format";
import { getRegistryEntry, isCommunitySlug } from "@/lib/communities/registry";
import type { CommunityAccent } from "@/lib/communities/types";

export function communityTitleFromSlug(slug: string): string {
  if (isCommunitySlug(slug)) return getRegistryEntry(slug).title;
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function communityAccentFromSlug(slug: string): CommunityAccent {
  if (isCommunitySlug(slug)) return getRegistryEntry(slug).accent;
  return "orange";
}

export function timeAgo(iso: string): string {
  return formatTimeAgo(iso);
}

export function communityHref(slug: string, postId?: string): string {
  const base = `/communities/${slug}`;
  return postId ? `${base}#${postId}` : base;
}

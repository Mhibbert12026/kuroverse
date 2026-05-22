import { avatarForCreator } from "@/lib/images";
import { MOCK_COMMUNITIES } from "@/lib/communities/communities.mock";
import { communityHref, communityTitleFromSlug, timeAgo } from "./format";
import type {
  HomeActivityItem,
  HomeActivityPage,
  HomeLiveSnapshot,
  RecentCommunityJoin,
  WatchingNowMember,
} from "./types";

const MOCK_NOW = Date.now();

function minutesAgo(m: number): string {
  return new Date(MOCK_NOW - m * 60_000).toISOString();
}

export function getMockActivityPage(page = 1): HomeActivityPage {
  const all: HomeActivityItem[] = [
    {
      id: "mock-post-1",
      kind: "post",
      createdAt: minutesAgo(2),
      timeAgo: "2m ago",
      communitySlug: "jujutsu-kaisen",
      communityTitle: "Jujutsu Kaisen",
      title: "Episode 23 reaction thread — that domain expansion",
      body: "The animation team cooked. Drop your favorite panel from the chapter too.",
      href: communityHref("jujutsu-kaisen", "mock-post-1"),
      actor: {
        id: "mock-1",
        name: "CursedEnergy",
        username: "cursed_energy",
        avatarUrl: avatarForCreator("CursedEnergy"),
      },
      likeCount: 42,
      commentCount: 18,
      hot: true,
    },
    {
      id: "mock-comment-1",
      kind: "comment",
      createdAt: minutesAgo(5),
      timeAgo: "5m ago",
      communitySlug: "naruto",
      communityTitle: "Naruto",
      title: "Replied in “Ship wars but make it constructive”",
      body: "Honestly the latest databook clears a lot of scaling debates.",
      href: communityHref("naruto"),
      postId: "mock-post-naruto",
      actor: {
        id: "mock-2",
        name: "ShadowMonarch",
        username: "shadow_monarch",
        avatarUrl: avatarForCreator("ShadowMonarch"),
      },
    },
    {
      id: "mock-like-1",
      kind: "like",
      createdAt: minutesAgo(8),
      timeAgo: "8m ago",
      communitySlug: "one-piece",
      communityTitle: "One Piece",
      title: "Liked a theory post",
      body: "Void Century timeline — updated mega-thread",
      href: communityHref("one-piece"),
      actor: {
        id: "mock-3",
        name: "MageArchive",
        username: "mage_archive",
        avatarUrl: avatarForCreator("MageArchive"),
      },
    },
    {
      id: "mock-post-2",
      kind: "post",
      createdAt: minutesAgo(14),
      timeAgo: "14m ago",
      communitySlug: "demon-slayer",
      communityTitle: "Demon Slayer",
      title: "Mugen Train rewatch party tonight?",
      body: "Sync watch at 9pm EST. Bring tissues.",
      href: communityHref("demon-slayer"),
      actor: {
        id: "mock-4",
        name: "DevilHunter",
        username: "devil_hunter",
        avatarUrl: avatarForCreator("DevilHunter"),
      },
      likeCount: 12,
      commentCount: 6,
    },
  ];

  const pageSize = 8;
  const start = (page - 1) * pageSize;
  const slice = all.slice(start, start + pageSize);

  return {
    items: slice,
    page,
    hasMore: start + pageSize < all.length,
  };
}

export function getMockLiveSnapshot(): HomeLiveSnapshot {
  const watchingNow: WatchingNowMember[] = [
    {
      userId: "w1",
      username: "shadow_monarch",
      displayName: "ShadowMonarch",
      avatarUrl: avatarForCreator("ShadowMonarch"),
      animeId: 21,
      animeTitle: "One Piece",
      animeCoverUrl: null,
      updatedAt: minutesAgo(1),
    },
    {
      userId: "w2",
      username: "cursed_energy",
      displayName: "CursedEnergy",
      avatarUrl: avatarForCreator("CursedEnergy"),
      animeId: 113415,
      animeTitle: "Jujutsu Kaisen",
      animeCoverUrl: null,
      updatedAt: minutesAgo(3),
    },
  ];

  const recentJoins: RecentCommunityJoin[] = MOCK_COMMUNITIES.slice(0, 4).map((c, i) => ({
    userId: `j${i}`,
    username: ["fan_01", "otaku_x", "senpai", "weeb_lord"][i],
    displayName: ["Nova", "Kai", "Yuki", "Rin"][i],
    avatarUrl: avatarForCreator(["Nova", "Kai", "Yuki", "Rin"][i]),
    communitySlug: c.slug,
    communityTitle: c.title,
    accent: c.accent,
    joinedAt: minutesAgo(10 + i * 4),
  }));

  const trendingDiscussions = getMockActivityPage(1).items.filter((i) => i.kind === "post");

  return {
    onlinePulse: 1284,
    activeCommunities: MOCK_COMMUNITIES.length,
    postsLastHour: 24,
    watchingNow,
    recentJoins,
    trendingDiscussions,
  };
}

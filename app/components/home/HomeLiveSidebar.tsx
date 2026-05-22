"use client";

import Link from "next/link";
import { AnimeImage } from "@/app/components/AnimeImage";
import { ProfileAvatar } from "@/app/components/profile/ProfileAvatar";
import { ProfileHoverAnchor } from "@/app/components/profile/ProfileHoverAnchor";
import { FALLBACK_COVER } from "@/lib/anilist/constants";
import type { HomeActivityItem, HomeLiveSnapshot } from "@/lib/home/types";

type HomeLiveSidebarProps = {
  snapshot: HomeLiveSnapshot;
};

export function HomeLiveSidebar({ snapshot }: HomeLiveSidebarProps) {
  return (
    <aside className="home-live-sidebar" aria-label="Live fandom pulse">
      <HomeLivePulseBar snapshot={snapshot} />

      <section className="home-sidebar-panel" aria-labelledby="watching-now-heading">
        <h3 id="watching-now-heading" className="home-sidebar-panel__title">
          People watching now
        </h3>
        {snapshot.watchingNow.length === 0 ? (
          <p className="home-sidebar-panel__empty">No public watch sessions yet.</p>
        ) : (
          <ul className="home-watching-list">
            {snapshot.watchingNow.map((member) => (
              <li key={`${member.userId}-${member.animeId}`}>
                <Link
                  href={member.username ? `/u/${member.username}` : `/anime/${member.animeId}`}
                  className="home-watching-card"
                >
                  <ProfileHoverAnchor
                    userId={member.userId}
                    username={member.username}
                    className="home-watching-card__avatar"
                  >
                    <ProfileAvatar
                      src={member.avatarUrl}
                      name={member.displayName}
                      size="sm"
                    />
                  </ProfileHoverAnchor>
                  <div className="home-watching-card__meta">
                    <span className="home-watching-card__user">
                      {member.username ? `@${member.username}` : member.displayName}
                    </span>
                    <span className="home-watching-card__anime">{member.animeTitle}</span>
                  </div>
                  <AnimeImage
                    src={member.animeCoverUrl ?? FALLBACK_COVER}
                    alt=""
                    width={40}
                    height={56}
                    className="home-watching-card__cover"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="home-sidebar-panel" aria-labelledby="recent-joins-heading">
        <h3 id="recent-joins-heading" className="home-sidebar-panel__title">
          Recently joined communities
        </h3>
        <ul className="home-joins-list">
          {snapshot.recentJoins.map((join) => (
            <li key={`${join.userId}-${join.communitySlug}-${join.joinedAt}`}>
              <Link
                href={`/communities/${join.communitySlug}`}
                className={`home-join-card home-join-card--${join.accent}`}
              >
                <ProfileHoverAnchor
                  userId={join.userId}
                  username={join.username}
                  className="home-join-card__avatar"
                >
                  <ProfileAvatar src={join.avatarUrl} name={join.displayName} size="sm" />
                </ProfileHoverAnchor>
                <div className="home-join-card__text">
                  <span className="home-join-card__user">
                    {join.username ? `@${join.username}` : join.displayName}
                  </span>
                  <span className="home-join-card__community">joined {join.communityTitle}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="home-sidebar-panel" aria-labelledby="trending-discussions-heading">
        <h3 id="trending-discussions-heading" className="home-sidebar-panel__title">
          Trending discussions
        </h3>
        <div className="home-trending-discussions">
          {snapshot.trendingDiscussions.length === 0 ? (
            <p className="home-sidebar-panel__empty">Start a thread in any hub.</p>
          ) : (
            snapshot.trendingDiscussions.slice(0, 4).map((item, index) => (
              <HomeTrendingDiscussionCompact key={item.id} item={item} index={index} />
            ))
          )}
        </div>
      </section>
    </aside>
  );
}

function HomeLivePulseBar({ snapshot }: { snapshot: HomeLiveSnapshot }) {
  return (
    <div className="home-live-pulse-bar">
      <div className="home-live-pulse-bar__stat">
        <span className="home-live-pulse-bar__value">
          {snapshot.onlinePulse.toLocaleString()}
        </span>
        <span className="home-live-pulse-bar__label">fans active</span>
      </div>
      <div className="home-live-pulse-bar__stat">
        <span className="home-live-pulse-bar__value">{snapshot.postsLastHour}</span>
        <span className="home-live-pulse-bar__label">posts / hr</span>
      </div>
      <div className="home-live-pulse-bar__stat">
        <span className="home-live-pulse-bar__value">{snapshot.activeCommunities}</span>
        <span className="home-live-pulse-bar__label">hubs buzzing</span>
      </div>
    </div>
  );
}

function HomeTrendingDiscussionCompact({
  item,
  index,
}: {
  item: HomeActivityItem;
  index: number;
}) {
  return (
    <article
      className="home-trending-discussion"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <Link href={item.href} className="home-trending-discussion__link">
        <span className="home-trending-discussion__community">{item.communityTitle}</span>
        <span className="home-trending-discussion__title">{item.title}</span>
        <span className="home-trending-discussion__meta">
          {item.likeCount ?? 0} likes · {item.commentCount ?? 0} replies
        </span>
      </Link>
    </article>
  );
}

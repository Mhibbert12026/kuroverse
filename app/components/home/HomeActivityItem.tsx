"use client";

import Link from "next/link";
import type { HomeActivityItem } from "@/lib/home/types";
import { ProfileAvatar } from "@/app/components/profile/ProfileAvatar";
import { ProfileHoverAnchor } from "@/app/components/profile/ProfileHoverAnchor";

const KIND_LABELS = {
  post: "New post",
  comment: "Reply",
  like: "Like",
  reaction: "Reaction",
} as const;

type HomeActivityItemCardProps = {
  item: HomeActivityItem;
  index: number;
};

export function HomeActivityItemCard({ item, index }: HomeActivityItemCardProps) {
  return (
    <article
      className={`home-activity-item home-activity-item--${item.kind}${item.hot ? " home-activity-item--hot" : ""}`}
      style={{ animationDelay: `${Math.min(index, 14) * 40}ms` }}
    >
      <div className="home-activity-item__glow" aria-hidden />
      <ProfileHoverAnchor
        userId={item.actor.id}
        username={item.actor.username}
        className="home-activity-item__avatar-wrap"
      >
        <ProfileAvatar src={item.actor.avatarUrl} name={item.actor.name} size="sm" />
      </ProfileHoverAnchor>

      <div className="home-activity-item__body">
        <div className="home-activity-item__meta">
          <span className={`home-activity-item__kind home-activity-item__kind--${item.kind}`}>
            {KIND_LABELS[item.kind]}
          </span>
          <Link href={item.href} className="home-activity-item__community">
            {item.communityTitle}
          </Link>
          <time className="home-activity-item__time" dateTime={item.createdAt}>
            {item.timeAgo}
          </time>
        </div>

        <h3 className="home-activity-item__title">
          <Link href={item.href}>{item.title}</Link>
        </h3>
        <p className="home-activity-item__excerpt">{item.body}</p>

        <p className="home-activity-item__actor">
          <span className="home-activity-item__actor-name">
            {item.actor.username ? `@${item.actor.username}` : item.actor.name}
          </span>
          {item.likeCount != null || item.commentCount != null ? (
            <span className="home-activity-item__stats">
              {item.likeCount != null ? `${item.likeCount} likes` : null}
              {item.likeCount != null && item.commentCount != null ? " · " : null}
              {item.commentCount != null ? `${item.commentCount} replies` : null}
            </span>
          ) : null}
        </p>
      </div>
    </article>
  );
}

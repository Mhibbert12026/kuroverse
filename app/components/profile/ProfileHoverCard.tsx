"use client";

import Link from "next/link";
import type { ProfileCardData } from "@/lib/profile/card";
import { ProfileAvatar } from "./ProfileAvatar";

type ProfileHoverCardProps = {
  data: ProfileCardData;
  style?: React.CSSProperties;
  className?: string;
};

function formatMemberSince(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(iso));
  } catch {
    return "Member";
  }
}

export function ProfileHoverCard({ data, style, className = "" }: ProfileHoverCardProps) {
  const handle = data.username ? `@${data.username}` : null;

  return (
    <div
      className={`profile-hover-card ${className}`.trim()}
      style={style}
      role="tooltip"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="profile-hover-card__glow" aria-hidden />
      <div className="profile-hover-card__header">
        <ProfileAvatar src={data.avatarUrl} name={data.displayName} size="md" ring="neon" />
        <div className="profile-hover-card__meta">
          <p className="profile-hover-card__name">{data.displayName}</p>
          {handle ? <p className="profile-hover-card__handle">{handle}</p> : null}
          <p className="profile-hover-card__since">Since {formatMemberSince(data.memberSince)}</p>
        </div>
      </div>

      {data.bio ? <p className="profile-hover-card__bio">{data.bio}</p> : null}
      {data.favoriteAnime ? (
        <p className="profile-hover-card__pick">
          <span className="profile-hover-card__pick-label">Top pick</span>
          {data.favoriteAnime}
        </p>
      ) : null}

      <div className="profile-hover-card__stats">
        <span>{data.stats.favoriteCount} favorites</span>
        <span aria-hidden>·</span>
        <span>{data.stats.watchlistCount} watchlist</span>
        <span aria-hidden>·</span>
        <span>{data.stats.fandomCount} fandoms</span>
      </div>

      <Link href={data.profileHref} className="profile-hover-card__cta">
        View profile
      </Link>
    </div>
  );
}

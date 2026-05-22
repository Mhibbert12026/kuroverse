"use client";

import Link from "next/link";
import { useState } from "react";
import type { UserProfile } from "@/lib/auth/types";
import type { AnimeFavorite } from "@/lib/favorites/types";
import type { JoinedFandom } from "@/lib/profile/fandoms";
import type { ProfileStats } from "@/lib/profile/stats";
import type { WatchlistEntry } from "@/lib/watchlist/types";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileEditForm } from "./ProfileEditForm";
import { ProfileFandomsSection } from "./ProfileFandomsSection";
import { ProfileFavoritesGrid } from "./ProfileFavoritesGrid";
import { ProfileFollowButton } from "./ProfileFollowButton";
import { ProfileStatsRow } from "./ProfileStatsRow";
import { ProfileWatchlistPreview } from "./ProfileWatchlistPreview";

type ProfilePageViewProps = {
  profile: UserProfile;
  isOwner: boolean;
  favorites: AnimeFavorite[];
  fandoms: JoinedFandom[];
  watchlistPreview: WatchlistEntry[];
  stats: ProfileStats;
};

function formatMemberSince(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(new Date(iso));
  } catch {
    return "Recently";
  }
}

export function ProfilePageView({
  profile,
  isOwner,
  favorites,
  fandoms,
  watchlistPreview,
  stats,
}: ProfilePageViewProps) {
  const [editOpen, setEditOpen] = useState(false);
  const displayName = profile.display_name ?? profile.username ?? "Member";
  const handle = profile.username ? `@${profile.username}` : null;

  return (
    <div className="profile-page">
      <div className="profile-page__glow profile-page__glow--orange" aria-hidden />
      <div className="profile-page__glow profile-page__glow--purple" aria-hidden />
      <div className="profile-page__frame" aria-hidden />

      <section className="profile-hero profile-hero--premium">
        <div className="profile-hero__banner">
          <div className="profile-hero__banner-mesh" aria-hidden />
        </div>

        <div className="profile-hero__body">
          <ProfileAvatar
            src={profile.avatar_url}
            name={displayName}
            size="xl"
            ring="neon"
            className="profile-hero__avatar"
          />

          <div className="profile-hero__content">
            <p className="profile-hero__eyebrow">KuroVerse · Fandom profile</p>
            <h1 className="profile-hero__name">{displayName}</h1>
            {handle ? (
              <p className="profile-hero__handle">
                {handle}
                <span className="profile-hero__handle-sep" aria-hidden>
                  ·
                </span>
                <span className="profile-hero__joined">Since {formatMemberSince(profile.created_at)}</span>
              </p>
            ) : (
              <p className="profile-hero__joined">Member since {formatMemberSince(profile.created_at)}</p>
            )}

            <div className="profile-hero__actions">
              {!isOwner ? <ProfileFollowButton targetUserId={profile.id} /> : null}
              {isOwner ? (
                <button
                  type="button"
                  className="profile-hero__edit-btn"
                  aria-expanded={editOpen}
                  onClick={() => setEditOpen((v) => !v)}
                >
                  {editOpen ? "Close editor" : "Edit profile"}
                </button>
              ) : null}
              {isOwner ? (
                <Link href="/watchlist" className="profile-hero__link-btn">
                  Watchlist
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        <div className="profile-hero__bio-block">
          {profile.bio ? (
            <p className="profile-hero__bio">{profile.bio}</p>
          ) : (
            <p className="profile-hero__bio profile-hero__bio--empty">
              {isOwner ? "Tell the fandom who you are — add a bio below." : "No bio yet."}
            </p>
          )}
          {profile.favorite_anime ? (
            <p className="profile-hero__top-pick">
              <span className="profile-hero__top-pick-label">Signature series</span>
              {profile.favorite_anime}
            </p>
          ) : null}
        </div>

        <ProfileStatsRow stats={stats} />
      </section>

      {isOwner && editOpen ? (
        <section className="profile-panel profile-panel--edit">
          <div className="profile-panel__head">
            <h2 className="profile-panel__title">Edit profile</h2>
            <p className="profile-panel__subtitle">Avatar, display name, bio, and signature series.</p>
          </div>
          <ProfileEditForm profile={profile} onSaved={() => setEditOpen(false)} />
        </section>
      ) : null}

      <div className="profile-page__sections">
        <ProfileFavoritesGrid
          favorites={favorites}
          isOwner={isOwner}
          legacyFavorite={profile.favorite_anime}
        />
        <ProfileWatchlistPreview
          entries={watchlistPreview}
          isOwner={isOwner}
          username={profile.username}
        />
        <ProfileFandomsSection fandoms={fandoms} isOwner={isOwner} />
      </div>

      {!isOwner ? (
        <section className="profile-panel profile-panel--guest">
          <p className="profile-panel__guest-text">
            <Link href="/discover" className="profile-panel__link">
              Discover clips
            </Link>
            {" · "}
            <Link href="/#communities" className="profile-panel__link">
              Join a fandom
            </Link>
          </p>
        </section>
      ) : null}
    </div>
  );
}

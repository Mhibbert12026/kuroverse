"use client";

import { useState } from "react";
import { AnimeImage } from "@/app/components/AnimeImage";
import type { CommunityClip } from "@/lib/communities/types";

type ClipCardProps = {
  clip: CommunityClip;
};

export function ClipCard({ clip }: ClipCardProps) {
  const [liked, setLiked] = useState(false);

  return (
    <article className="clips-card group">
      <button type="button" className="clips-card__media" aria-label={`Play ${clip.title}`}>
        <AnimeImage
          src={clip.coverUrl}
          alt=""
          fill
          className="clips-card__thumb object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          sizes="(max-width: 640px) 168px, 200px"
        />
        <div className="clips-card__scrim" aria-hidden />
        <div className="clips-card__shine" aria-hidden />

        {clip.rank != null && (
          <span className="clips-card__rank">#{clip.rank}</span>
        )}

        <span className="clips-card__duration">{clip.duration}</span>

        <span className="clips-card__tag">{clip.tag}</span>

        <div className="clips-card__play" aria-hidden>
          <span className="clips-card__play-icon">
            <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </div>

        <div className="clips-card__overlay">
          <div className="clips-card__creator">
            <div className="clips-card__avatar">
              <AnimeImage
                src={clip.avatarUrl}
                alt={clip.creator}
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
            <span className="clips-card__creator-name">@{clip.creator}</span>
          </div>
          <p className="clips-card__title">{clip.title}</p>
          <div className="clips-card__metrics">
            <span>{clip.views} views</span>
            <span className="clips-card__dot" aria-hidden />
            <span>{clip.likes} likes</span>
          </div>
        </div>
      </button>

      <div className="clips-card__actions">
        <button
          type="button"
          className={`clips-action ${liked ? "clips-action--active" : ""}`}
          onClick={() => setLiked((v) => !v)}
          aria-pressed={liked}
        >
          <HeartIcon filled={liked} />
          <span>{liked ? "Liked" : clip.likes}</span>
        </button>
        <button type="button" className="clips-action">
          <CommentIcon />
          <span>{clip.comments}</span>
        </button>
        <button type="button" className="clips-action">
          <ShareIcon />
          <span>{clip.shares}</span>
        </button>
      </div>
    </article>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg className="h-3.5 w-3.5" fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  );
}

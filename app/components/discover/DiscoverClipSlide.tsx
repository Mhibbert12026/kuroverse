"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { AnimeImage } from "@/app/components/AnimeImage";
import { FavoriteControl } from "@/app/components/favorites/FavoriteControl";
import { WatchlistControl } from "@/app/components/watchlist/WatchlistControl";
import { useAuth } from "@/app/providers/AuthProvider";
import type { DiscoverClipItem } from "@/lib/discover/types";

type DiscoverClipSlideProps = {
  clip: DiscoverClipItem;
  isActive: boolean;
};

export function DiscoverClipSlide({ clip, isActive }: DiscoverClipSlideProps) {
  const { user, openAuth } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeLabel, setLikeLabel] = useState(clip.likes);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentDraft, setCommentDraft] = useState("");
  const [shareNote, setShareNote] = useState<string | null>(null);

  const toggleLike = () => {
    setLiked((prev) => {
      const next = !prev;
      setLikeLabel(next ? "Liked" : clip.likes);
      return next;
    });
  };

  const handleShare = useCallback(async () => {
    const url = `${window.location.origin}/anime/${clip.animeId}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: clip.displayTitle, url });
      } else {
        await navigator.clipboard.writeText(url);
        setShareNote("Link copied");
        window.setTimeout(() => setShareNote(null), 2000);
      }
    } catch {
      /* user cancelled share */
    }
  }, [clip.animeId, clip.displayTitle]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuth("sign-in", "/discover");
      return;
    }
    if (!commentDraft.trim()) return;
    setCommentDraft("");
    setCommentsOpen(false);
  };

  const accentStyle = clip.accentColor
    ? ({ "--discover-accent": clip.accentColor } as React.CSSProperties)
    : undefined;

  return (
    <section
      className={`discover-slide ${isActive ? "discover-slide--active" : ""}`}
      style={accentStyle}
      aria-label={clip.displayTitle}
    >
      <div className="discover-slide__media" aria-hidden>
        <AnimeImage
          src={clip.coverUrl}
          alt=""
          fill
          priority={isActive}
          className="discover-slide__cover object-cover"
          sizes="100vw"
        />
        <div className="discover-slide__vignette" />
        <div className="discover-slide__grain" />
      </div>

      <div className="discover-slide__play-hint" aria-hidden>
        <span className="discover-slide__play-icon">
          <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </div>

      <span className="discover-slide__duration">{clip.duration}</span>

      <aside className="discover-slide__rail">
        <Link href={`/anime/${clip.animeId}`} className="discover-action discover-action--avatar">
          <div className="discover-action__avatar">
            <AnimeImage
              src={clip.creatorAvatarUrl}
              alt={clip.creator}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
        </Link>

        <button
          type="button"
          className={`discover-action ${liked ? "discover-action--liked" : ""}`}
          onClick={toggleLike}
          aria-pressed={liked}
        >
          <HeartIcon filled={liked} />
          <span>{likeLabel}</span>
        </button>

        <button
          type="button"
          className={`discover-action ${commentsOpen ? "discover-action--active" : ""}`}
          onClick={() => setCommentsOpen((v) => !v)}
          aria-expanded={commentsOpen}
        >
          <CommentIcon />
          <span>{clip.comments}</span>
        </button>

        <button type="button" className="discover-action" onClick={() => void handleShare()}>
          <ShareIcon />
          <span>{shareNote ?? clip.shares}</span>
        </button>

        <FavoriteControl
          animeId={clip.animeId}
          title={clip.animeTitle}
          coverUrl={clip.coverUrl}
          variant="discover"
        />

        <WatchlistControl
          animeId={clip.animeId}
          title={clip.animeTitle}
          coverUrl={clip.coverUrl}
          variant="discover"
        />
      </aside>

      <div className="discover-slide__info">
        <div className="discover-slide__creator">
          <span>@{clip.creator}</span>
          <span className="discover-slide__dot" aria-hidden />
          <span>{clip.views} views</span>
        </div>

        <Link href={`/anime/${clip.animeId}`} className="discover-slide__title">
          {clip.displayTitle}
        </Link>

        <div className="discover-slide__meta">
          <span className="discover-slide__rating">{clip.rating}</span>
          <span className="discover-slide__status">{clip.status}</span>
        </div>

        <div className="discover-slide__tags">
          <span className="discover-tag discover-tag--clip">{clip.clipTag}</span>
          {clip.animeTags.map((tag) => (
            <span key={tag} className="discover-tag discover-tag--anime">
              {tag}
            </span>
          ))}
          {clip.community ? (
            <Link
              href={`/communities/${clip.community.slug}`}
              className={`discover-tag discover-tag--community discover-tag--${clip.community.accent}`}
            >
              {clip.community.tag}
            </Link>
          ) : null}
        </div>
      </div>

      {commentsOpen ? (
        <div className="discover-comments">
          <form className="discover-comments__form" onSubmit={handleCommentSubmit}>
            <textarea
              rows={2}
              value={commentDraft}
              onChange={(e) => setCommentDraft(e.target.value)}
              placeholder={user ? "Drop a reaction…" : "Sign in to comment"}
              className="discover-comments__input"
              maxLength={280}
            />
            <div className="discover-comments__footer">
              <span className="discover-comments__hint">
                {clip.community
                  ? `Join ${clip.community.name} for full threads`
                  : "Comments sync to communities soon"}
              </span>
              <button type="submit" className="hub-btn hub-btn--primary text-xs">
                Post
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg className="h-6 w-6" fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  );
}

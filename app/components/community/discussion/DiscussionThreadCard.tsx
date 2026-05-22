"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimeImage } from "@/app/components/AnimeImage";
import { ProfileHoverAnchor } from "@/app/components/profile/ProfileHoverAnchor";
import { ProfileAvatar } from "@/app/components/profile/ProfileAvatar";
import { useAuth } from "@/app/providers/AuthProvider";
import { togglePostLikeAction } from "@/lib/community-posts/actions";
import type { CommunityThread } from "@/lib/communities/types";
import { PostCommentsPanel } from "./PostCommentsPanel";
import { getThreadCategoryMeta } from "./thread-meta";

type DiscussionThreadCardProps = {
  thread: CommunityThread;
};

export function DiscussionThreadCard({ thread }: DiscussionThreadCardProps) {
  const router = useRouter();
  const { user, openAuth } = useAuth();
  const [liked, setLiked] = useState(Boolean(thread.likedByUser));
  const [likeCount, setLikeCount] = useState(thread.likes);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [spoilerRevealed, setSpoilerRevealed] = useState(false);
  const [pending, startTransition] = useTransition();
  const meta = getThreadCategoryMeta(thread.category);
  const isLive = Boolean(thread.isLive);
  const commentCount = thread.commentCount ?? thread.replies;
  const bodyText = thread.body ?? thread.excerpt;
  const hideSpoilerBody = thread.hasSpoilers && !spoilerRevealed;

  const toggleLike = () => {
    if (isLive) {
      if (!user) {
        openAuth("sign-in");
        return;
      }
      const nextLiked = !liked;
      setLiked(nextLiked);
      setLikeCount((c) => (nextLiked ? c + 1 : Math.max(0, c - 1)));
      startTransition(async () => {
        const result = await togglePostLikeAction(thread.id);
        if (!result.ok) {
          setLiked(!nextLiked);
          setLikeCount((c) => (nextLiked ? Math.max(0, c - 1) : c + 1));
          return;
        }
        router.refresh();
      });
      return;
    }

    setLiked((prev) => {
      setLikeCount((c) => (prev ? c - 1 : c + 1));
      return !prev;
    });
  };

  const toggleComments = () => {
    if (isLive) {
      setCommentsOpen((open) => !open);
      return;
    }
    setCommentsOpen((open) => !open);
  };

  return (
    <article
      id={thread.id}
      className={`feed-thread ${thread.pinned ? "feed-thread--pinned" : ""} ${thread.hot ? "feed-thread--hot" : ""} ${isLive ? "feed-thread--live" : ""}`}
    >
      <div className="feed-thread__vote hidden sm:flex" aria-hidden>
        <span className="feed-thread__vote-bar" />
      </div>

      <div className="feed-thread__body min-w-0 flex-1">
        <div className="feed-thread__meta flex flex-wrap items-center gap-2">
          {thread.pinned && (
            <span className="feed-badge feed-badge--pinned">Pinned</span>
          )}
          {thread.hot && <span className="feed-badge feed-badge--hot">Hot</span>}
          {isLive && <span className="feed-badge feed-badge--live">Live</span>}
          <span className={meta.chipClass}>
            <span aria-hidden>{meta.icon}</span>
            {meta.label}
          </span>
          {thread.episodeLabel && (
            <span className="feed-badge feed-badge--episode">{thread.episodeLabel}</span>
          )}
          {thread.hasSpoilers && (
            <span className="feed-badge feed-badge--spoiler" title={thread.spoilerScope}>
              ⚠ Spoilers{thread.spoilerScope ? `: ${thread.spoilerScope}` : ""}
            </span>
          )}
          <span className="feed-thread__views">{thread.views} views</span>
        </div>

        <h3 className="feed-thread__title">
          <Link href={`#${thread.id}`}>{thread.title}</Link>
        </h3>

        <div
          className={`feed-thread__content ${hideSpoilerBody ? "feed-thread__content--spoiler" : ""}`}
        >
          <p className="feed-thread__excerpt">{bodyText}</p>
          {thread.hasSpoilers && !spoilerRevealed && (
            <button
              type="button"
              className="feed-thread__reveal-spoiler"
              onClick={() => setSpoilerRevealed(true)}
            >
              Reveal spoilers
            </button>
          )}
        </div>

        {thread.imageUrl && (!thread.hasSpoilers || spoilerRevealed) && (
          <div className="feed-thread__media">
            <AnimeImage
              src={thread.imageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 560px"
            />
          </div>
        )}

        <div className="feed-thread__footer">
          <ProfileHoverAnchor
            userId={thread.authorId}
            username={thread.authorUsername ?? (thread.isLive ? thread.author : null)}
            className="feed-thread__author"
            disabled={!thread.isLive || !thread.authorId}
          >
            <div className="feed-thread__avatar">
              {thread.isLive && thread.authorId ? (
                <ProfileAvatar
                  src={thread.avatarUrl}
                  name={thread.author}
                  size="sm"
                  className="feed-thread__avatar-inner"
                />
              ) : (
                <AnimeImage
                  src={thread.avatarUrl}
                  alt={thread.author}
                  fill
                  className="object-cover"
                  sizes="36px"
                />
              )}
            </div>
            <div className="min-w-0">
              <p className="feed-thread__author-name">@{thread.author}</p>
              <time className="feed-thread__time" dateTime={thread.createdAt ?? thread.timeAgo}>
                {thread.timeAgo}
              </time>
            </div>
          </ProfileHoverAnchor>

          <div className="feed-thread__actions">
            <button
              type="button"
              onClick={toggleLike}
              className={`feed-action ${liked ? "feed-action--liked" : ""}`}
              aria-pressed={liked}
              disabled={isLive && pending}
            >
              <HeartIcon filled={liked} />
              <span>{likeCount.toLocaleString()}</span>
            </button>
            <button
              type="button"
              className={`feed-action ${commentsOpen ? "feed-action--active" : ""}`}
              onClick={toggleComments}
              aria-expanded={commentsOpen}
            >
              <CommentIcon />
              <span>{commentCount}</span>
            </button>
            <button type="button" className="feed-action feed-action--share">
              Share
            </button>
          </div>
        </div>

        {isLive ? (
          <PostCommentsPanel
            postId={thread.id}
            initialCount={commentCount}
            open={commentsOpen}
          />
        ) : (
          commentsOpen && (
            <p className="post-comments__demo-hint">
              Demo thread — sign in and post to start real comments.
            </p>
          )
        )}
      </div>
    </article>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className="h-4 w-4"
      fill={filled ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}

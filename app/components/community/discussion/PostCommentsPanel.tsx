"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ProfileAvatar } from "@/app/components/profile/ProfileAvatar";
import { ProfileHoverAnchor } from "@/app/components/profile/ProfileHoverAnchor";
import { useAuth } from "@/app/providers/AuthProvider";
import {
  addPostCommentAction,
  fetchPostCommentsAction,
} from "@/lib/community-posts/actions";
import { formatTimeAgo } from "@/lib/community-posts/format";
import type { CommunityCommentRecord } from "@/lib/community-posts/types";

type PostCommentsPanelProps = {
  postId: string;
  initialCount: number;
  open: boolean;
};

export function PostCommentsPanel({ postId, initialCount, open }: PostCommentsPanelProps) {
  const router = useRouter();
  const { user, openAuth } = useAuth();
  const [comments, setComments] = useState<CommunityCommentRecord[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(initialCount);
  const [pending, startTransition] = useTransition();

  const loadComments = useCallback(async () => {
    const rows = await fetchPostCommentsAction(postId);
    setComments(rows);
    setLoaded(true);
  }, [postId]);

  useEffect(() => {
    if (open && !loaded) {
      void loadComments();
    }
  }, [open, loaded, loadComments]);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuth("sign-in");
      return;
    }
    const text = draft.trim();
    if (!text) return;

    setError(null);
    startTransition(async () => {
      const result = await addPostCommentAction(postId, text);
      if (!result.ok) {
        setError(result.error ?? "Could not post comment.");
        return;
      }
      setDraft("");
      setCount((c) => c + 1);
      await loadComments();
      router.refresh();
    });
  };

  if (!open) return null;

  return (
    <div className="post-comments">
      {!loaded ? (
        <p className="post-comments__loading">Loading comments…</p>
      ) : comments.length === 0 ? (
        <p className="post-comments__empty">No comments yet — be the first.</p>
      ) : (
        <ul className="post-comments__list">
          {comments.map((comment) => (
            <li key={comment.id} className="post-comments__item">
              <ProfileHoverAnchor
                userId={comment.userId}
                username={comment.authorUsername}
                className="post-comments__author-wrap"
              >
                <ProfileAvatar
                  src={comment.authorAvatarUrl}
                  name={comment.authorName}
                  size="sm"
                  className="post-comments__avatar-inner"
                />
              </ProfileHoverAnchor>
              <div className="min-w-0 flex-1">
                <p className="post-comments__author">
                  {comment.authorUsername ? `@${comment.authorUsername}` : comment.authorName}
                  <time className="post-comments__time" dateTime={comment.createdAt}>
                    {formatTimeAgo(comment.createdAt)}
                  </time>
                </p>
                <p className="post-comments__body">{comment.body}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form className="post-comments__form" onSubmit={handleSubmit}>
        <textarea
          rows={2}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={user ? "Add a comment…" : "Sign in to comment"}
          className="post-comments__input"
          disabled={pending}
          maxLength={1200}
        />
        {error && <p className="post-comments__error">{error}</p>}
        <div className="post-comments__form-footer">
          <span className="post-comments__count">{count} comments</span>
          <button
            type="submit"
            className="hub-btn hub-btn--primary text-xs"
            disabled={pending || !draft.trim()}
          >
            {pending ? "Posting…" : "Reply"}
          </button>
        </div>
      </form>
    </div>
  );
}

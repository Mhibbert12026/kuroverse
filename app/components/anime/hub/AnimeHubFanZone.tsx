"use client";

import { useCallback, useState } from "react";
import { AnimeImage } from "@/app/components/AnimeImage";
import type { HubComment, HubReaction } from "@/lib/anilist/hub-types";
import { AnimeHubSection } from "./AnimeHubSection";

type AnimeHubFanZoneProps = {
  reactions: HubReaction[];
  comments: HubComment[];
  title: string;
};

export function AnimeHubFanZone({ reactions, comments, title }: AnimeHubFanZoneProps) {
  const [counts, setCounts] = useState(() =>
    Object.fromEntries(reactions.map((r) => [r.id, r.count])),
  );
  const [activeReaction, setActiveReaction] = useState<string | null>(null);
  const [commentLikes, setCommentLikes] = useState<Record<string, number>>(() =>
    Object.fromEntries(comments.map((c) => [c.id, c.likes])),
  );
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [draft, setDraft] = useState("");

  const react = useCallback((id: string) => {
    setCounts((prev) => {
      const wasActive = activeReaction === id;
      const next = { ...prev };
      if (wasActive) {
        next[id] = (next[id] ?? 0) - 1;
        setActiveReaction(null);
      } else {
        if (activeReaction) next[activeReaction] = (next[activeReaction] ?? 0) - 1;
        next[id] = (next[id] ?? 0) + 1;
        setActiveReaction(id);
      }
      return next;
    });
  }, [activeReaction]);

  const toggleCommentLike = (id: string) => {
    setLikedComments((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setCommentLikes((likes) => ({ ...likes, [id]: (likes[id] ?? 0) - 1 }));
      } else {
        next.add(id);
        setCommentLikes((likes) => ({ ...likes, [id]: (likes[id] ?? 0) + 1 }));
      }
      return next;
    });
  };

  return (
    <AnimeHubSection
      id="hub-fan-zone"
      title="Fan Reactions & Comments"
      subtitle={`Live vibes from ${title} fans`}
    >
      <div className="flex flex-wrap gap-3">
        {reactions.map((r) => {
          const isActive = activeReaction === r.id;
          const count = counts[r.id] ?? r.count;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => react(r.id)}
              aria-pressed={isActive}
              className={`hub-reaction ${isActive ? "hub-reaction--active" : ""}`}
            >
              <span className="text-xl" aria-hidden>
                {r.emoji}
              </span>
              <span className="text-xs font-bold text-white/80">{r.label}</span>
              <span className="text-[10px] font-semibold text-white/45">
                {count.toLocaleString()}
              </span>
            </button>
          );
        })}
      </div>

      <div className="hub-comment-compose mt-8">
        <label htmlFor="hub-comment-input" className="sr-only">
          Add a comment
        </label>
        <textarea
          id="hub-comment-input"
          rows={2}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Share your reaction…"
          className="w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-accent-orange/40 focus:outline-none focus:ring-2 focus:ring-accent-orange/15"
        />
        <button
          type="button"
          disabled={!draft.trim()}
          className="mt-3 hub-btn hub-btn--primary disabled:opacity-40 disabled:hover:scale-100"
          onClick={() => setDraft("")}
        >
          Post comment
        </button>
      </div>

      <ul className="mt-6 flex flex-col gap-3">
        {comments.map((comment) => (
          <li key={comment.id} className="hub-comment">
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-white/10">
              <AnimeImage
                src={comment.avatarUrl}
                alt={comment.author}
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-white">@{comment.author}</span>
                <span className="text-[10px] text-white/35">{comment.timeAgo}</span>
              </div>
              <p className="mt-1.5 text-sm text-white/65">{comment.body}</p>
              <button
                type="button"
                onClick={() => toggleCommentLike(comment.id)}
                className={`mt-2 text-xs font-semibold transition-colors ${
                  likedComments.has(comment.id)
                    ? "text-accent-pink"
                    : "text-white/40 hover:text-accent-pink"
                }`}
              >
                ♥ {(commentLikes[comment.id] ?? comment.likes).toLocaleString()}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </AnimeHubSection>
  );
}

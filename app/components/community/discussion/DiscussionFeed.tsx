"use client";

import { useMemo, useState } from "react";
import type { CommunityThread, CommunityThreadCategory } from "@/lib/communities/types";
import { DiscussionCompose } from "./DiscussionCompose";
import { DiscussionThreadCard } from "./DiscussionThreadCard";
import { FEED_FILTER_OPTIONS } from "./thread-meta";

export type DiscussionFeedProps = {
  threads: CommunityThread[];
  title: string;
  communitySlug: string;
  id?: string;
};

export function DiscussionFeed({
  threads,
  title,
  communitySlug,
  id = "community-feed",
}: DiscussionFeedProps) {
  const [filter, setFilter] = useState<CommunityThreadCategory | "all">("all");

  const sorted = useMemo(() => {
    const list = [...threads];
    list.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;
    });
    return list;
  }, [threads]);

  const filtered = useMemo(() => {
    if (filter === "all") return sorted;
    return sorted.filter((t) => t.category === filter);
  }, [sorted, filter]);

  return (
    <section id={id} className="feed-panel hub-panel">
      <header className="feed-panel__header">
        <div>
          <h2 id="community-feed-heading" className="font-display text-xl font-bold text-white sm:text-2xl">
            Discussion Feed
          </h2>
          <p className="mt-1 text-sm text-white/45">
            Episode reactions, fan theories, manga threads & trending topics
          </p>
        </div>
        <button type="button" className="hub-btn hub-btn--secondary shrink-0 text-xs">
          New thread
        </button>
      </header>

      <DiscussionCompose communitySlug={communitySlug} communityTitle={title} />

      <nav className="feed-filters" aria-label="Filter discussions">
        {FEED_FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setFilter(opt.id)}
            className={`feed-filter ${filter === opt.id ? "feed-filter--active" : ""}`}
            aria-pressed={filter === opt.id}
          >
            {opt.label}
          </button>
        ))}
      </nav>

      <div className="feed-thread-list" role="feed">
        {filtered.length === 0 ? (
          <p className="feed-empty">No threads in this category yet.</p>
        ) : (
          filtered.map((thread) => <DiscussionThreadCard key={thread.id} thread={thread} />)
        )}
      </div>
    </section>
  );
}

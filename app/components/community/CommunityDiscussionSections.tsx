"use client";

import type { CommunityPageData, CommunityThread } from "@/lib/communities/types";
import { DiscussionCompose } from "./discussion/DiscussionCompose";
import { DiscussionThreadCard } from "./discussion/DiscussionThreadCard";

type CommunityDiscussionSectionsProps = {
  community: CommunityPageData;
};

type ChannelSectionProps = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  accentClass: string;
  threads: CommunityThread[];
  emptyLabel: string;
};

function ChannelSection({
  id,
  title,
  subtitle,
  icon,
  accentClass,
  threads,
  emptyLabel,
}: ChannelSectionProps) {
  return (
    <section id={id} className="community-channel" aria-labelledby={`${id}-heading`}>
      <header className={`community-channel__header ${accentClass}`}>
        <span className="community-channel__icon" aria-hidden>
          {icon}
        </span>
        <div className="community-channel__titles">
          <h2 id={`${id}-heading`} className="community-channel__title">
            {title}
          </h2>
          <p className="community-channel__subtitle">{subtitle}</p>
        </div>
        <span className="community-channel__count">{threads.length}</span>
      </header>

      <div className="community-channel__body" role="feed" aria-label={title}>
        {threads.length === 0 ? (
          <p className="community-channel__empty">{emptyLabel}</p>
        ) : (
          <ul className="community-channel__list">
            {threads.map((thread, index) => (
              <li
                key={thread.id}
                className="community-channel__item"
                style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
              >
                <DiscussionThreadCard thread={thread} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

/** Discord/Reddit-inspired channel sections for community discussions. */
export function CommunityDiscussionSections({ community }: CommunityDiscussionSectionsProps) {
  const { discussions, title } = community;

  return (
    <div id="community-feed" className="community-discussion-hub">
      <header className="community-discussion-hub__hero feed-panel hub-panel">
        <div className="community-discussion-hub__hero-inner">
          <div>
            <p className="community-discussion-hub__eyebrow">#{title.replace(/\s+/g, "")} · Live</p>
            <h2 className="font-display text-xl font-bold text-white sm:text-2xl">
              Fandom channels
            </h2>
            <p className="mt-1 max-w-xl text-sm text-white/45">
              Trending threads, fan theories, and episode reactions — curated like your favorite
              Discord server.
            </p>
          </div>
        </div>
        <DiscussionCompose communitySlug={community.slug} communityTitle={title} />
      </header>

      <ChannelSection
        id="community-trending"
        title="Trending discussions"
        subtitle="Hot takes, megathreads, and what the fandom is arguing about right now"
        icon="🔥"
        accentClass="community-channel__header--trending"
        threads={discussions.trending}
        emptyLabel="No trending threads yet — start the conversation."
      />

      <ChannelSection
        id="community-theories"
        title="Fan theories"
        subtitle="Evidence boards, power scaling, and endgame predictions"
        icon="🧠"
        accentClass="community-channel__header--theories"
        threads={discussions.theories}
        emptyLabel="No theories posted yet. Drop your wildest take."
      />

      <ChannelSection
        id="community-reactions"
        title="Episode reactions"
        subtitle="Live watches, sakuga appreciation, and episode-by-episode feels"
        icon="📺"
        accentClass="community-channel__header--reactions"
        threads={discussions.reactions}
        emptyLabel="No reaction threads yet. Who's watching tonight?"
      />
    </div>
  );
}

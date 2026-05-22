"use client";

import { useRef } from "react";
import type { CommunityClip } from "@/lib/communities/types";
import { ClipCard } from "./ClipCard";

export type TrendingClipsSectionProps = {
  clips: CommunityClip[];
  title?: string;
  subtitle?: string;
  id?: string;
};

export function TrendingClipsSection({
  clips,
  title = "Trending Clips",
  subtitle = "Fan edits & AMVs from the community",
  id = "community-clips",
}: TrendingClipsSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  return (
    <section id={id} className="clips-section">
      <div className="clips-section__header hub-panel !pb-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="community-clips-heading" className="font-display text-xl font-bold text-white sm:text-2xl">
              {title}
            </h2>
            <p className="mt-1 text-sm text-white/45">{subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll(-1)}
              className="clips-nav-btn"
              aria-label="Scroll clips left"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              className="clips-nav-btn"
              aria-label="Scroll clips right"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <a href="#community-feed" className="clips-section__link">
              View all
            </a>
          </div>
        </div>
      </div>

      <div className="clips-section__rail-wrap relative">
        <div className="clips-section__fade clips-section__fade--left" aria-hidden />
        <div className="clips-section__fade clips-section__fade--right" aria-hidden />

        <div
          ref={scrollRef}
          className="clips-row horizontal-scroll"
          role="list"
          aria-label="Trending anime clips"
        >
          {clips.map((clip) => (
            <ClipCard key={clip.id} clip={clip} />
          ))}
        </div>
      </div>
    </section>
  );
}

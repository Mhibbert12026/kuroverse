"use client";

import { useRef } from "react";
import type { AnimeCard } from "@/lib/anilist";
import { LazyAnimeCard } from "../../feeds/LazyAnimeCard";
import { type AnimeCardGlow } from "../AnimeInteractiveCard";
import { AnimeHubSection } from "./AnimeHubSection";

type AnimeHubCarouselProps = {
  title: string;
  subtitle: string;
  anime: AnimeCard[];
  glow?: AnimeCardGlow;
  emptyMessage: string;
};

export function AnimeHubCarousel({
  title,
  subtitle,
  anime,
  glow = "purple",
  emptyMessage,
}: AnimeHubCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <AnimeHubSection title={title} subtitle={subtitle}>
      {anime.length === 0 ? (
        <p className="rounded-xl border border-white/8 bg-white/5 px-4 py-8 text-center text-sm text-white/45">
          {emptyMessage}
        </p>
      ) : (
        <div
          ref={scrollRef}
          className="horizontal-scroll feed-scroll-horizontal -mx-2 flex gap-4 overflow-x-auto px-2 pb-3 pt-1"
        >
          {anime.map((item, index) => (
            <LazyAnimeCard
              key={item.id}
              index={index}
              rootRef={scrollRef}
              anime={item}
              variant="portrait"
              glow={glow}
              rank={item.rank}
              className="w-[180px] shrink-0 sm:w-[200px]"
            />
          ))}
        </div>
      )}
    </AnimeHubSection>
  );
}

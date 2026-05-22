import type { CSSProperties } from "react";
import type { AnimeCard } from "@/lib/anilist";
import { AnimeCardLink } from "./anime/AnimeCardLink";
import { AnimeCover } from "./anime/AnimeCover";
import { AnimeMetaRow, AnimeStatusBadge } from "./anime/AnimeBadges";

type HeroSectionProps = {
  anime: AnimeCard;
};

export function HeroSection({ anime }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/8 glass-panel-deep hero-mesh cinematic-vignette">
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/80" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,90,31,0.08)_0%,transparent_40%,rgba(147,51,234,0.08)_100%)]" />
      <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-accent-orange/25 blur-[100px] animate-pulse-glow" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent-purple/20 blur-[90px] animate-pulse-glow" />

      <div className="relative grid gap-10 p-6 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14 lg:p-12">
        <div className="flex flex-col gap-6 sm:gap-7">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-accent-orange/40 bg-accent-orange/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent-orange shadow-[0_0_20px_rgba(255,90,31,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-orange opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-orange shadow-[0_0_8px_#ff5a1f]" />
            </span>
            #1 Trending on AniList
          </div>

          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl xl:text-[3.75rem]">
            A living home for{" "}
            <span className="gradient-text">anime fandom</span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-white/55 sm:text-lg">
            Real-time discussions, watch parties, and trending hubs — your feed updates
            as the community moves.
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <a
              href="#live-feed"
              className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-accent-orange via-accent-pink to-accent-purple px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_40px_rgba(255,90,31,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_55px_rgba(255,90,31,0.55)]"
            >
              See live activity
            </a>
            <a
              href="#trending-anime"
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-accent-cyan/40 hover:bg-white/10"
            >
              <svg className="h-5 w-5 text-accent-cyan" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Trending
            </a>
          </div>

          <div className="max-w-md border-t border-white/8 pt-6">
            <AnimeMetaRow
              genres={anime.genres}
              rating={anime.rating}
              popularityLabel={anime.popularityLabel}
              episodesLabel={anime.episodesLabel}
            />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[300px] lg:max-w-none lg:mx-0">
          <div className="relative aspect-[3/4] w-full animate-float">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-accent-orange/50 via-accent-pink/30 to-accent-purple/50 blur-3xl opacity-50" />
            <AnimeCardLink
              animeId={anime.id}
              className="anime-card-premium anime-card-glow-orange group relative block h-full overflow-hidden rounded-2xl border border-white/15 shadow-[0_25px_80px_rgba(0,0,0,0.6)] sm:rounded-3xl glow-border-orange"
              style={
                anime.accentColor
                  ? ({ "--card-accent": anime.accentColor } as CSSProperties)
                  : undefined
              }
            >
              <div className="anime-card-gradient-orb pointer-events-none rounded-3xl" aria-hidden />
              <div className="anime-card-cinematic pointer-events-none rounded-3xl" aria-hidden />
              <div className="anime-card-vignette pointer-events-none rounded-3xl" aria-hidden />
              <div className="absolute inset-0">
                <AnimeCover
                  anime={anime}
                  alt={`${anime.title} cover art`}
                  sizes="(max-width: 1024px) 300px, 420px"
                  priority
                  aspectClassName="absolute inset-0"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 z-10 p-5 sm:p-6">
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-block rounded-md bg-accent-orange px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-[0_0_16px_rgba(255,90,31,0.5)]">
                    #1 Trending
                  </span>
                  <AnimeStatusBadge status={anime.status} />
                </div>
                <p className="font-display text-xl font-bold text-white sm:text-2xl line-clamp-2">
                  {anime.title}
                </p>
                <p className="mt-1 text-sm text-white/65 line-clamp-1">{anime.genres}</p>
              </div>
            </AnimeCardLink>
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import type { AnimeDetail } from "@/lib/anilist/detail-types";
import type { HubCommunityStats } from "@/lib/anilist/hub-types";
import { AnimeImage } from "@/app/components/AnimeImage";
import { AnimeRatingBadge, AnimeStatusBadge } from "../AnimeBadges";
import { FavoriteControl } from "@/app/components/favorites/FavoriteControl";
import { AnimeHubWatchlist } from "./AnimeHubWatchlist";
import { AnimeHubStats } from "./AnimeHubStats";

type AnimeHubHeroProps = {
  anime: AnimeDetail;
  stats: HubCommunityStats;
};

export function AnimeHubHero({ anime, stats }: AnimeHubHeroProps) {
  const accent = anime.accentColor ?? "#7c3aed";

  return (
    <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
      <div className="-mt-[4.5rem] sm:-mt-28 lg:-mt-36">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-accent-orange"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to home
        </Link>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[minmax(140px,200px)_1fr] lg:gap-10 xl:grid-cols-[220px_1fr_280px]">
          <div className="mx-auto w-full max-w-[180px] sm:max-w-[200px] lg:mx-0 lg:max-w-none">
            <div className="anime-card-premium anime-card-glow-orange relative overflow-hidden rounded-2xl border border-white/12 shadow-[0_32px_100px_rgba(0,0,0,0.65)]">
              <div className="relative aspect-[2/3]">
                <AnimeImage
                  src={anime.coverUrl}
                  alt={`${anime.title} cover`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 640px) 180px, 220px"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to top, ${accent}cc 0%, transparent 55%)`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-end gap-4 sm:gap-5">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-accent-orange/90">
                Fandom Hub
              </p>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <AnimeStatusBadge status={anime.status} />
                {anime.format && (
                  <span className="rounded-full border border-white/10 bg-black/50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white/60 backdrop-blur-sm">
                    {anime.format.replace(/_/g, " ")}
                  </span>
                )}
                {anime.seasonYear && (
                  <span className="rounded-full border border-white/10 bg-black/50 px-2.5 py-0.5 text-[10px] font-semibold text-white/50 backdrop-blur-sm">
                    {anime.seasonYear}
                  </span>
                )}
              </div>
              <h1 className="font-display text-2xl font-bold leading-[1.08] text-white drop-shadow-lg sm:text-4xl lg:text-5xl">
                {anime.title}
              </h1>
              {anime.nativeTitle && (
                <p className="mt-2 text-sm text-white/50">{anime.nativeTitle}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <AnimeRatingBadge rating={anime.rating} />
              <span className="rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-sm">
                {anime.popularityLabel}
              </span>
              <span className="rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-sm">
                {anime.episodesLabel}
              </span>
            </div>

            <div className="hidden flex-wrap gap-2 sm:flex">
              {anime.genres.slice(0, 5).map((genre) => (
                <span
                  key={genre}
                  className="rounded-full border border-accent-cyan/20 bg-accent-cyan/10 px-3 py-1 text-xs font-medium text-accent-cyan"
                >
                  {genre}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              <AnimeHubWatchlist animeId={anime.id} title={anime.title} coverUrl={anime.coverUrl} compact />
              <FavoriteControl
                animeId={anime.id}
                title={anime.title}
                coverUrl={anime.coverUrl}
                variant="hub-compact"
                className="hub-btn hub-btn--secondary"
              />
              <a href="#hub-trailer" className="hub-btn hub-btn--secondary text-xs sm:text-sm">
                Watch Trailer
              </a>
              <a href="#hub-discussions" className="hub-btn hub-btn--secondary text-xs sm:text-sm">
                Discussions
              </a>
              <a
                href="/#communities"
                className="hub-btn hub-btn--primary hidden text-xs sm:inline-flex sm:text-sm lg:hidden"
              >
                Join Community
              </a>
            </div>
          </div>

          <div className="hidden xl:block">
            <AnimeHubStats stats={stats} title={anime.title} />
            <a
              href="/#communities"
              className="hub-btn hub-btn--primary mt-4 w-full justify-center"
            >
              Join Community
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

import type { AnimeDetail } from "@/lib/anilist/detail-types";
import type { HubCommunityStats } from "@/lib/anilist/hub-types";
import { AnimeRatingBadge, AnimeStatusBadge } from "../AnimeBadges";

type AnimeHubMetadataProps = {
  anime: AnimeDetail;
  stats: HubCommunityStats;
};

export function AnimeHubMetadata({ anime, stats }: AnimeHubMetadataProps) {
  const metaItems = [
    { label: "Score", value: anime.rating },
    { label: "Popularity", value: anime.popularityLabel },
    { label: "Episodes", value: anime.episodesLabel },
    { label: "Status", value: anime.status },
    ...(anime.format ? [{ label: "Format", value: anime.format.replace(/_/g, " ") }] : []),
    ...(anime.seasonYear ? [{ label: "Year", value: String(anime.seasonYear) }] : []),
  ];

  return (
    <section id="hub-metadata" className="hub-panel hub-metadata">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-white sm:text-2xl">About</h2>
          <p className="mt-1 text-sm text-white/45">Series metadata · AniList</p>
        </div>
        <AnimeStatusBadge status={anime.status} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {metaItems.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-white/6 bg-white/[0.03] px-4 py-3 transition-colors hover:border-white/12"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/35">
              {item.label}
            </p>
            <p className="mt-1 font-display text-sm font-semibold text-white">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <AnimeRatingBadge rating={anime.rating} />
        {anime.genres.map((genre) => (
          <span
            key={genre}
            className="rounded-full border border-accent-cyan/20 bg-accent-cyan/10 px-3 py-1 text-xs font-medium text-accent-cyan"
          >
            {genre}
          </span>
        ))}
      </div>

      <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-white/60 sm:text-base">
        {anime.synopsis}
      </p>

      <div className="mt-6 flex flex-wrap gap-4 border-t border-white/6 pt-6 text-xs text-white/40">
        <span>
          <strong className="text-white/70">{stats.members}</strong> community members
        </span>
        <span>
          <strong className="text-emerald-400">{stats.online.toLocaleString()}</strong> online now
        </span>
        <span>
          <strong className="text-white/70">{stats.discussionsToday}</strong> discussions today
        </span>
      </div>
    </section>
  );
}

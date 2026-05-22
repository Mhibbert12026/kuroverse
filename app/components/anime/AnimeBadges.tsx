import type { AnimeDisplayStatus } from "@/lib/anilist";

const statusStyles: Record<AnimeDisplayStatus, string> = {
  Airing: "bg-accent-cyan/20 text-accent-cyan border-accent-cyan/35",
  Hot: "bg-accent-orange/25 text-accent-orange border-accent-orange/40 shadow-[0_0_12px_rgba(255,90,31,0.3)]",
  New: "bg-accent-purple/25 text-accent-purple border-accent-purple/40 shadow-[0_0_12px_rgba(147,51,234,0.25)]",
  Completed: "bg-white/10 text-white/80 border-white/20",
};

export function AnimeStatusBadge({ status }: { status: AnimeDisplayStatus }) {
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

export function AnimeRatingBadge({ rating }: { rating: string }) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-black/60 px-2 py-1 backdrop-blur-md">
      <svg className="h-3.5 w-3.5 text-accent-gold" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
      <span className="text-xs font-bold text-white">{rating}</span>
    </div>
  );
}

export function AnimeMetaRow({
  genres,
  rating,
  popularityLabel,
  episodesLabel,
}: {
  genres: string;
  rating: string;
  popularityLabel: string;
  episodesLabel?: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-white/55 line-clamp-1">{genres}</p>
      <div className="flex flex-wrap items-center gap-2">
        <AnimeRatingBadge rating={rating} />
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/70">
          {popularityLabel}
        </span>
      </div>
      {episodesLabel && (
        <p className="text-[10px] text-white/40">{episodesLabel}</p>
      )}
    </div>
  );
}

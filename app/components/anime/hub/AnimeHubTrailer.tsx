import type { AnimeDetail } from "@/lib/anilist/detail-types";

type AnimeHubTrailerProps = {
  anime: AnimeDetail;
};

export function AnimeHubTrailer({ anime }: AnimeHubTrailerProps) {
  if (!anime.trailerEmbedUrl) return null;

  return (
    <section id="hub-trailer" className="hub-panel hub-trailer overflow-hidden p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-4 py-4 sm:px-6">
        <div>
          <h2 className="font-display text-xl font-bold text-white sm:text-2xl">Trailer</h2>
          <p className="mt-0.5 text-sm text-white/45">Official preview · {anime.title}</p>
        </div>
        <span className="rounded-full border border-accent-purple/30 bg-accent-purple/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-purple">
          Now playing
        </span>
      </div>
      <div className="relative aspect-video w-full bg-black">
        <div className="pointer-events-none absolute inset-0 z-10 ring-1 ring-inset ring-white/10" />
        <iframe
          src={anime.trailerEmbedUrl}
          title={`${anime.title} trailer`}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </section>
  );
}

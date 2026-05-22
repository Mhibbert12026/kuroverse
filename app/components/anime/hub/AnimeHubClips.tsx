import type { TrendingClipCard } from "@/lib/anilist";
import { avatarForCreator } from "@/lib/images";
import { AnimeImage } from "@/app/components/AnimeImage";
import { AnimeCardLink } from "../AnimeCardLink";
import { AnimeCover } from "../AnimeCover";
import { AnimeHubSection } from "./AnimeHubSection";

type AnimeHubClipsProps = {
  clips: TrendingClipCard[];
  title: string;
};

export function AnimeHubClips({ clips, title }: AnimeHubClipsProps) {
  return (
    <AnimeHubSection
      id="hub-clips"
      title="Trending Clips"
      subtitle={`Fan edits & AMVs from ${title} fans`}
      action={{ label: "View all clips", href: "/#trending" }}
    >
      <div className="horizontal-scroll -mx-2 flex gap-4 overflow-x-auto px-2 pb-2 pt-1">
        {clips.map((clip, index) => (
          <article
            key={clip.id}
            className="anime-card-premium anime-card-glow-orange group w-[280px] shrink-0 overflow-hidden rounded-2xl border border-white/8 bg-surface-card sm:w-[300px]"
          >
            <div className="relative aspect-video overflow-hidden">
              <AnimeCover
                anime={clip.anime}
                alt={clip.displayTitle}
                sizes="300px"
                aspectClassName="absolute inset-0"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="anime-card-cinematic pointer-events-none" aria-hidden />
              <span className="absolute left-2 top-2 z-10 rounded-lg bg-black/70 px-2 py-1 font-display text-xs font-bold text-white">
                #{index + 1}
              </span>
              <div className="anime-card-play pointer-events-none">
                <span className="anime-card-play-btn">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </div>
              <span className="absolute bottom-2 right-2 z-10 rounded-full border border-accent-cyan/30 bg-accent-cyan/15 px-2 py-0.5 text-[10px] font-medium text-accent-cyan">
                {clip.tag}
              </span>
            </div>
            <div className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="relative h-7 w-7 overflow-hidden rounded-full ring-1 ring-accent-orange/40">
                  <AnimeImage
                    src={avatarForCreator(clip.creator)}
                    alt={clip.creator}
                    fill
                    className="object-cover"
                    sizes="28px"
                  />
                </div>
                <span className="text-xs text-white/50">@{clip.creator}</span>
              </div>
              <AnimeCardLink
                animeId={clip.anime.id}
                className="line-clamp-2 text-sm font-semibold text-white hover:text-accent-orange"
              >
                {clip.displayTitle}
              </AnimeCardLink>
              <p className="mt-2 text-[10px] text-white/40">
                {clip.views} views · <span className="text-accent-pink">{clip.likes} likes</span>
              </p>
            </div>
          </article>
        ))}
      </div>
    </AnimeHubSection>
  );
}

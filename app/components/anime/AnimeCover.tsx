import { AnimeImage } from "../AnimeImage";
import type { AnimeCard } from "@/lib/anilist";

type AnimeCoverProps = {
  anime: AnimeCard;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  aspectClassName?: string;
};

export function AnimeCover({
  anime,
  alt,
  sizes,
  priority,
  className = "object-cover transition-transform duration-700 group-hover:scale-105",
  aspectClassName = "relative overflow-hidden",
}: AnimeCoverProps) {
  return (
    <div className={aspectClassName}>
      <AnimeImage
        src={anime.coverUrl}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
      />
      {anime.accentColor ? (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${anime.accentColor}e6 0%, ${anime.accentColor}55 40%, transparent 72%)`,
          }}
        />
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-t ${anime.accentClass} via-black/50 to-black/15`}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/45" />
    </div>
  );
}

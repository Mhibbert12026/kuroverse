import type { CSSProperties } from "react";
import type { AnimeCard, FeaturedCommunityCard } from "@/lib/anilist";
import { getCommunitySlugForAnime } from "@/lib/communities/resolve-community";
import { CommunityCardLink } from "../community/CommunityCardLink";
import { AnimeCardLink } from "./AnimeCardLink";
import { AnimeCover } from "./AnimeCover";
import { AnimeRatingBadge, AnimeStatusBadge } from "./AnimeBadges";
import { AnimeCardQuickActions } from "./AnimeCardQuickActions";

export type AnimeCardVariant = "portrait" | "landscape" | "community" | "thumb";
export type AnimeCardGlow = "orange" | "purple" | "cyan" | "gold" | "emerald" | "violet" | "auto";

const glowClasses: Record<Exclude<AnimeCardGlow, "auto">, string> = {
  orange: "anime-card-glow-orange",
  purple: "anime-card-glow-purple",
  cyan: "anime-card-glow-cyan",
  gold: "anime-card-glow-gold",
  emerald: "anime-card-glow-emerald",
  violet: "anime-card-glow-violet",
};

const communityAccentGlow: Record<
  FeaturedCommunityCard["accent"],
  Exclude<AnimeCardGlow, "auto">
> = {
  orange: "orange",
  cyan: "cyan",
  emerald: "emerald",
  gold: "gold",
  purple: "purple",
};

type AnimeInteractiveCardProps = {
  anime: AnimeCard;
  variant: AnimeCardVariant;
  glow?: AnimeCardGlow;
  className?: string;
  rank?: number;
  matchPercent?: number;
  community?: Pick<
    FeaturedCommunityCard,
    "description" | "members" | "online" | "accent" | "popularityLabel" | "slug"
  >;
  communitySlug?: string;
  communityBadge?: string;
  sizes?: string;
  priority?: boolean;
  showPlayIcon?: boolean;
  embedded?: boolean;
};

function resolveGlow(anime: AnimeCard, glow: AnimeCardGlow): string {
  if (glow !== "auto") return glowClasses[glow];
  if (anime.accentColor) return "anime-card-glow-auto";
  return glowClasses.orange;
}

function HoverMetadata({ anime }: { anime: AnimeCard }) {
  return (
    <div className="anime-card-meta-reveal">
      <p className="anime-card-meta-reveal__genres">{anime.genres}</p>
      <div className="anime-card-meta-reveal__stats">
        <AnimeRatingBadge rating={anime.rating} />
        <span className="anime-card-meta-pill">{anime.popularityLabel}</span>
        <span className="anime-card-meta-pill anime-card-meta-pill--muted">{anime.episodesLabel}</span>
      </div>
    </div>
  );
}

function CardOverlays({ showPlay }: { showPlay?: boolean }) {
  return (
    <>
      <div className="anime-card-ambient" aria-hidden />
      <div className="anime-card-gradient-orb pointer-events-none" aria-hidden />
      <div className="anime-card-shine-sweep pointer-events-none" aria-hidden />
      <div className="anime-card-cinematic pointer-events-none" aria-hidden />
      <div className="anime-card-vignette pointer-events-none" aria-hidden />
      {showPlay && (
        <div className="anime-card-play pointer-events-none" aria-hidden>
          <span className="anime-card-play-btn">
            <svg className="h-6 w-6 text-white sm:h-7 sm:w-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="anime-card-play-label">Preview</span>
        </div>
      )}
    </>
  );
}

function HoverActionPanel({
  anime,
  layout,
  communitySlug,
}: {
  anime: AnimeCard;
  layout?: "stacked" | "row";
  communitySlug?: string | null;
}) {
  return (
    <div className="anime-card-hover-panel">
      <div className="anime-card-hover-panel__glass" aria-hidden />
      <HoverMetadata anime={anime} />
      <AnimeCardQuickActions
        animeId={anime.id}
        title={anime.title}
        coverUrl={anime.coverUrl}
        layout={layout}
        communitySlug={communitySlug}
      />
    </div>
  );
}

function CardMedia({
  anime,
  sizes = "240px",
  priority,
  showPlayIcon,
  mediaClassName = "",
  children,
}: {
  anime: AnimeCard;
  sizes?: string;
  priority?: boolean;
  showPlayIcon?: boolean;
  mediaClassName?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`anime-card-media ${mediaClassName}`.trim()}>
      <AnimeCover
        anime={anime}
        alt={`${anime.title} cover art`}
        sizes={sizes}
        priority={priority}
        aspectClassName="anime-card-cover"
        className="anime-card-cover__img object-cover"
      />
      <CardOverlays showPlay={showPlayIcon ?? true} />
      {children}
    </div>
  );
}

export function AnimeInteractiveCard({
  anime,
  variant,
  glow = "auto",
  className = "",
  rank,
  matchPercent,
  community,
  communityBadge = "Community",
  sizes,
  priority,
  showPlayIcon,
  embedded = false,
  communitySlug: communitySlugProp,
}: AnimeInteractiveCardProps) {
  const resolvedGlow =
    variant === "community" && community
      ? glowClasses[communityAccentGlow[community.accent]]
      : resolveGlow(anime, glow);

  const glowStyle =
    glow === "auto" && anime.accentColor
      ? ({ "--card-accent": anime.accentColor } as CSSProperties)
      : undefined;

  const communitySlug =
    communitySlugProp ?? community?.slug ?? getCommunitySlugForAnime(anime.id);

  const shellClass = embedded
    ? `group anime-card-embedded relative block h-full overflow-hidden ${className}`
    : `anime-card-premium group relative block overflow-hidden rounded-2xl border border-white/8 bg-surface-card ${resolvedGlow} ${className}`;
  const Shell = embedded ? "div" : "article";

  if (variant === "portrait") {
    return (
      <Shell className={shellClass} style={glowStyle}>
        <AnimeCardLink animeId={anime.id} className="anime-card-hit-area" aria-label={`View ${anime.title}`} />
        <div className="anime-card-content">
          <CardMedia anime={anime} sizes={sizes ?? "240px"} priority={priority} showPlayIcon={showPlayIcon} mediaClassName="anime-card-media--portrait">
            {rank != null && (
              <span className="anime-card-rank">{rank}</span>
            )}
            <div className="anime-card-badge-slot anime-card-badge-slot--tr">
              <AnimeStatusBadge status={anime.status} />
            </div>
          </CardMedia>

          <div className="anime-card-footer anime-card-footer--portrait">
            <p className="anime-card-title">{anime.title}</p>
            <p className="anime-card-title-meta">{anime.genres}</p>
            <HoverActionPanel anime={anime} communitySlug={communitySlug} />
          </div>
        </div>
      </Shell>
    );
  }

  if (variant === "landscape") {
    return (
      <Shell className={shellClass} style={glowStyle}>
        <AnimeCardLink animeId={anime.id} className="anime-card-hit-area" aria-label={`View ${anime.title}`} />
        <div className="anime-card-content">
          <CardMedia anime={anime} sizes={sizes ?? "(max-width: 640px) 100vw, 50vw"} showPlayIcon={showPlayIcon} mediaClassName="anime-card-media--landscape">
            <div className="anime-card-badge-slot anime-card-badge-slot--tl">
              <AnimeStatusBadge status={anime.status} />
              {matchPercent != null && (
                <span className="anime-card-match-chip">{matchPercent}% match</span>
              )}
            </div>
            <div className="anime-card-badge-slot anime-card-badge-slot--br anime-card-badge-fade">
              <AnimeRatingBadge rating={anime.rating} />
            </div>
            <div className="anime-card-footer anime-card-footer--overlay">
              <HoverActionPanel anime={anime} layout="row" communitySlug={communitySlug} />
            </div>
          </CardMedia>

          <div className="anime-card-landscape-body">
            <h3 className="anime-card-title anime-card-title--compact">{anime.title}</h3>
            <p className="anime-card-title-meta">{anime.genres}</p>
            <div className="anime-card-landscape-meta anime-card-title-meta">
              <span>{anime.episodesLabel}</span>
              <span>{anime.popularityLabel}</span>
            </div>
            {matchPercent != null && (
              <div className="anime-card-match-track anime-card-title-meta">
                <div
                  className="anime-card-match-bar h-full rounded-full"
                  style={{ width: `${matchPercent}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </Shell>
    );
  }

  if (variant === "community" && community) {
    const accentBadge: Record<FeaturedCommunityCard["accent"], string> = {
      orange: "bg-accent-orange/20 text-accent-orange",
      cyan: "bg-accent-cyan/20 text-accent-cyan",
      emerald: "bg-emerald-500/20 text-emerald-400",
      gold: "bg-accent-gold/20 text-accent-gold",
      purple: "bg-accent-purple/20 text-accent-purple",
    };

    const slug = communitySlug ?? community.slug;

    return (
      <Shell className={shellClass} style={glowStyle}>
        {slug ? (
          <CommunityCardLink
            slug={slug}
            className="anime-card-hit-area"
            aria-label={`Enter ${anime.title} community`}
          />
        ) : (
          <AnimeCardLink animeId={anime.id} className="anime-card-hit-area" aria-label={`View ${anime.title}`} />
        )}
        <div className="anime-card-content">
          <CardMedia
            anime={anime}
            sizes={sizes ?? "(max-width: 640px) 100vw, 20vw"}
            showPlayIcon={false}
            mediaClassName="anime-card-media--community"
          >
            <div className="anime-card-badge-slot anime-card-badge-slot--tl">
              <span className={`anime-card-community-badge ${accentBadge[community.accent]}`}>
                {communityBadge}
              </span>
              <AnimeStatusBadge status={anime.status} />
            </div>
            <div className="anime-card-badge-slot anime-card-badge-slot--br anime-card-badge-fade">
              <AnimeRatingBadge rating={anime.rating} />
            </div>
          </CardMedia>

          <div className="anime-card-footer anime-card-footer--portrait">
            <h3 className="anime-card-title">{anime.title}</h3>
            <p className="anime-card-title-meta">{anime.genres}</p>
            <p className="anime-card-title-meta anime-card-community-blurb">{community.description}</p>
            <HoverActionPanel anime={anime} communitySlug={slug} />
          </div>

          <div className="anime-card-community-stats anime-card-title-meta">
            <div>
              <p className="anime-card-community-stats__value">{community.members}</p>
              <p className="anime-card-community-stats__label">members</p>
            </div>
            <div className="text-right">
              <p className="anime-card-community-stats__online">
                <span className="anime-card-community-stats__dot" aria-hidden />
                {community.online.toLocaleString()}
              </p>
              <p className="anime-card-community-stats__label">{community.popularityLabel}</p>
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell className={`${shellClass} h-full`} style={glowStyle}>
      <AnimeCardLink animeId={anime.id} className="anime-card-hit-area" aria-label={`View ${anime.title}`} />
      <div className="anime-card-content h-full">
        <CardMedia
          anime={anime}
          sizes={sizes ?? "140px"}
          showPlayIcon={showPlayIcon}
          priority={priority}
          mediaClassName="anime-card-media--thumb"
        >
          <div className="anime-card-footer anime-card-footer--overlay anime-card-footer--thumb">
            <p className="anime-card-title anime-card-title--sm">{anime.title}</p>
            <HoverActionPanel anime={anime} layout="row" communitySlug={communitySlug} />
          </div>
        </CardMedia>
      </div>
    </Shell>
  );
}

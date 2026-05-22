import type { AnimeDetail } from "@/lib/anilist/detail-types";
import { AnimeImage } from "@/app/components/AnimeImage";

type AnimeHubCinematicBannerProps = {
  anime: AnimeDetail;
};

/** Edge-to-edge cinematic banner for fandom hub pages. */
export function AnimeHubCinematicBanner({ anime }: AnimeHubCinematicBannerProps) {
  const accent = anime.accentColor ?? "#7c3aed";

  return (
    <div className="hub-banner relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen max-w-[100vw] overflow-hidden">
      <div className="relative h-[42vh] min-h-[240px] max-h-[520px] w-full sm:h-[48vh] lg:h-[56vh]">
        {anime.bannerUrl ? (
          <AnimeImage
            src={anime.bannerUrl}
            alt=""
            fill
            className="object-cover object-top"
            priority
            sizes="100vw"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${accent}66 0%, #020208 45%, #0a0a14 100%)`,
            }}
          />
        )}
        <div className="hub-banner-scrim absolute inset-0" />
        <div className="hub-banner-vignette absolute inset-0" />
        <div className="hub-banner-noise absolute inset-0 opacity-40" aria-hidden />
      </div>
    </div>
  );
}

import Link from "next/link";
import { AnimeImage } from "@/app/components/AnimeImage";
import { FALLBACK_COVER } from "@/lib/anilist/constants";
import type { DailyFeatured } from "@/lib/seeding/types";

type DailyFeaturedBannerProps = {
  featured: DailyFeatured | null;
};

export function DailyFeaturedBanner({ featured }: DailyFeaturedBannerProps) {
  if (!featured) return null;

  return (
    <section className="daily-featured" aria-labelledby="daily-featured-heading">
      <div className="daily-featured__glow" aria-hidden />
      <div className="daily-featured__layout">
        <div className="daily-featured__cover-wrap">
          <AnimeImage
            src={featured.animeCoverUrl ?? FALLBACK_COVER}
            alt=""
            width={200}
            height={280}
            className="daily-featured__cover"
          />
          <span className="daily-featured__badge">Featured today</span>
        </div>
        <div className="daily-featured__body">
          <p className="daily-featured__eyebrow">Daily spotlight</p>
          <h2 id="daily-featured-heading" className="daily-featured__title">
            {featured.animeTitle}
          </h2>
          <p className="daily-featured__tagline">{featured.tagline}</p>
          <p className="daily-featured__summary">{featured.summary}</p>
          {featured.hotTake ? (
            <p className="daily-featured__hot-take">
              <span className="daily-featured__hot-label">Hot take</span>
              {featured.hotTake}
            </p>
          ) : null}
          <div className="daily-featured__actions">
            <Link
              href={`/communities/${featured.communitySlug}`}
              className="daily-featured__cta daily-featured__cta--primary"
            >
              Join {featured.communitySlug.replace(/-/g, " ")}
            </Link>
            <Link href={`/anime/${featured.animeId}`} className="daily-featured__cta">
              View hub
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

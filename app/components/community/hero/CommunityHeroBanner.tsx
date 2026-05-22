import { AnimeImage } from "@/app/components/AnimeImage";

type CommunityHeroBannerProps = {
  bannerImage: string;
  title: string;
  accentColor: string;
};

export function CommunityHeroBanner({
  bannerImage,
  title,
  accentColor,
}: CommunityHeroBannerProps) {
  return (
    <div className="community-hero-banner relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen max-w-[100vw] overflow-hidden">
      <div className="community-hero-banner__frame relative h-[44vh] min-h-[260px] max-h-[560px] w-full sm:h-[48vh] lg:h-[52vh]">
        <AnimeImage
          src={bannerImage}
          alt=""
          fill
          className="community-hero-banner__image object-cover object-top"
          priority
          sizes="100vw"
        />
        <div
          className="community-hero-banner__accent-fallback absolute inset-0 opacity-0"
          style={{
            background: `linear-gradient(135deg, ${accentColor}55 0%, #020208 50%, #0a0a14 100%)`,
          }}
          aria-hidden
        />
        <div className="community-hero-banner__scrim absolute inset-0" />
        <div className="community-hero-banner__vignette absolute inset-0" />
        <div className="community-hero-banner__mesh absolute inset-0" aria-hidden />
        <div className="community-hero-banner__noise absolute inset-0" aria-hidden />
        <div className="community-hero-banner__bottom-fade absolute inset-x-0 bottom-0 h-1/2" aria-hidden />
      </div>
      <span className="sr-only">{title} community banner</span>
    </div>
  );
}

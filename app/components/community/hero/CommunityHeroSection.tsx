import type { CSSProperties } from "react";
import Link from "next/link";
import { formatMemberCount } from "@/lib/communities/community-data";
import { AnimeImage } from "@/app/components/AnimeImage";
import { CommunityJoinButton, CommunityJoinLink } from "../CommunityJoinButton";
import { accentBadge, accentGlow } from "../community-styles";
import { CommunityHeroBanner } from "./CommunityHeroBanner";
import { CommunityHeroStats } from "./CommunityHeroStats";
import type { CommunityHeroSectionProps } from "./types";

function resolveMemberLabel(count: number | string): string {
  return typeof count === "number" ? formatMemberCount(count) : count;
}

export function CommunityHeroSection({
  title,
  description,
  bannerImage,
  coverImage,
  memberCount,
  onlineCount,
  accent,
  accentColor = null,
  badgeLabel = "Official Fandom",
  backHref = "/",
  backLabel = "Communities",
  anilistId,
  showSecondaryActions = true,
  className = "",
}: CommunityHeroSectionProps) {
  const accentHex = accentColor ?? "#7c3aed";
  const members = resolveMemberLabel(memberCount);

  const joinCta = (
    <CommunityJoinButton communityTitle={title} className="community-hero-cta community-hero-cta--primary" />
  );

  return (
    <header className={`community-hero relative ${className}`}>
      <div
        className="community-hero__ambient pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div
          className="community-hero__orb community-hero__orb--left absolute -left-24 top-0 h-72 w-72 rounded-full blur-[100px] opacity-30"
          style={{ backgroundColor: accentHex }}
        />
        <div className="community-hero__orb community-hero__orb--right absolute -right-24 top-1/4 h-64 w-64 rounded-full bg-accent-purple/20 blur-[90px]" />
      </div>

      <CommunityHeroBanner
        bannerImage={bannerImage}
        title={title}
        accentColor={accentHex}
      />

      <div className="community-hero__content relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="community-hero__overlap -mt-[4.5rem] pb-6 sm:-mt-32 sm:pb-8 lg:-mt-36">
          <Link href={backHref} className="community-hero__back mb-4 sm:mb-6">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {backLabel}
          </Link>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:gap-10 xl:gap-12">
            <div className="community-hero__cover mx-auto w-full max-w-[148px] shrink-0 sm:max-w-[172px] lg:mx-0">
              <div
                className={`anime-card-premium ${accentGlow[accent]} overflow-hidden rounded-2xl border border-white/15 shadow-[0_28px_90px_rgba(0,0,0,0.65)]`}
                style={{ "--hero-accent": accentHex } as CSSProperties}
              >
                <div className="relative aspect-square overflow-hidden">
                  <AnimeImage
                    src={coverImage}
                    alt={`${title} community`}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    priority
                    sizes="(max-width: 640px) 148px, 172px"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, ${accentHex}cc 0%, transparent 55%)`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-black/40" />
                </div>
              </div>
            </div>

            <div className="min-w-0 flex-1 text-center lg:text-left">
              <span
                className={`mb-3 inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] ${accentBadge[accent]}`}
              >
                {badgeLabel}
              </span>

              <h1 className="community-hero__title font-display text-3xl font-bold leading-[1.05] text-white sm:text-4xl lg:text-[3.25rem] xl:text-6xl">
                {title}
              </h1>

              <p className="community-hero__description mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base lg:mx-0">
                {description}
              </p>

              <div className="mt-6 flex justify-center lg:justify-start">
                <CommunityHeroStats memberLabel={members} onlineCount={onlineCount} />
              </div>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                {joinCta}
                {showSecondaryActions && (
                  <>
                    <CommunityJoinLink href="#community-trending" className="community-hero-cta community-hero-cta--secondary">
                      Discussions
                    </CommunityJoinLink>
                    <CommunityJoinLink href="#community-theories" className="community-hero-cta community-hero-cta--secondary">
                      Theories
                    </CommunityJoinLink>
                    <CommunityJoinLink href="#community-reactions" className="community-hero-cta community-hero-cta--secondary">
                      Reactions
                    </CommunityJoinLink>
                    <CommunityJoinLink href="#community-clips" className="community-hero-cta community-hero-cta--secondary">
                      Clips
                    </CommunityJoinLink>
                    {anilistId != null && (
                      <Link
                        href={`/anime/${anilistId}`}
                        className="community-hero-cta community-hero-cta--secondary"
                      >
                        View anime
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}


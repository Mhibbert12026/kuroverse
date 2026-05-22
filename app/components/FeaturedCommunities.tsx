"use client";

import type { FeaturedCommunityCard } from "@/lib/anilist";
import { AnimeSectionNotice } from "./anime/AnimeSectionNotice";
import { LazyAnimeCard } from "./feeds/LazyAnimeCard";
import { SectionHeader } from "./SectionHeader";

type FeaturedCommunitiesProps = {
  communities: FeaturedCommunityCard[];
};

export function FeaturedCommunities({ communities }: FeaturedCommunitiesProps) {
  return (
    <section id="communities" className="section-glow home-section flex flex-col gap-5 sm:gap-6">
      <SectionHeader
        title="Legendary Fandoms"
        subtitle="Official AniList artwork · Naruto, Bleach, Demon Slayer & more"
        action={{ label: "Browse all", href: "/communities/naruto" }}
      />

      {communities.length === 0 ? (
        <AnimeSectionNotice
          message="Community cards could not be loaded."
          variant="empty"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {communities.map((community, index) => (
            <LazyAnimeCard
              key={community.id}
              index={index}
              anime={community}
              variant="community"
              communitySlug={community.slug}
              community={{
                slug: community.slug,
                description: community.description,
                members: community.members,
                online: community.online,
                accent: community.accent,
                popularityLabel: community.popularityLabel,
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

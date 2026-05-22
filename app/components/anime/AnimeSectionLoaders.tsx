import { Suspense } from "react";
import {
  getTrendingFeedPage,
  getRecommendationsFeedPage,
  getHomeClipsFeedPage,
} from "@/lib/feeds";
import { getFeaturedBundle, getTrendingBundle } from "@/lib/anilist";
import { HeroSection } from "../HeroSection";
import { TrendingAnimeSection } from "../TrendingAnime";
import { FeaturedCommunities } from "../FeaturedCommunities";
import { RecommendationCards } from "../RecommendationCards";
import { TrendingFeed } from "../TrendingFeed";
import { AnimeSectionNotice } from "./AnimeSectionNotice";
import {
  HeroSkeleton,
  TrendingAnimeSectionSkeleton,
  FeaturedCommunitiesSkeleton,
  RecommendationCardsSkeleton,
  TrendingFeedSkeleton,
} from "./AnimeSkeletons";

async function HeroLoader() {
  const { hero, error } = await getTrendingBundle();
  return (
    <>
      {error && <AnimeSectionNotice message={error} variant="error" />}
      <HeroSection anime={hero} />
    </>
  );
}

async function TrendingAnimeLoader() {
  const { items, hasMore } = await getTrendingFeedPage(1);
  return <TrendingAnimeSection initialAnime={items} initialHasMore={hasMore} />;
}

async function FeaturedCommunitiesLoader() {
  const { featuredCommunities, error } = await getFeaturedBundle();
  return (
    <>
      {error && !featuredCommunities.length && (
        <AnimeSectionNotice message={error} variant="error" />
      )}
      <FeaturedCommunities communities={featuredCommunities} />
    </>
  );
}

async function RecommendationsLoader() {
  const { items, hasMore } = await getRecommendationsFeedPage(1);
  return (
    <RecommendationCards initialAnime={items} initialHasMore={hasMore} />
  );
}

async function TrendingFeedLoader() {
  const { items, hasMore } = await getHomeClipsFeedPage(1);
  return <TrendingFeed initialClips={items} initialHasMore={hasMore} />;
}

export function HeroSectionWithSkeleton() {
  return (
    <Suspense fallback={<HeroSkeleton />}>
      <HeroLoader />
    </Suspense>
  );
}

export function TrendingAnimeSectionWithSkeleton() {
  return (
    <Suspense fallback={<TrendingAnimeSectionSkeleton />}>
      <TrendingAnimeLoader />
    </Suspense>
  );
}

export function FeaturedCommunitiesWithSkeleton() {
  return (
    <Suspense fallback={<FeaturedCommunitiesSkeleton />}>
      <FeaturedCommunitiesLoader />
    </Suspense>
  );
}

export function RecommendationCardsWithSkeleton() {
  return (
    <Suspense fallback={<RecommendationCardsSkeleton />}>
      <RecommendationsLoader />
    </Suspense>
  );
}

export function TrendingFeedWithSkeleton() {
  return (
    <Suspense fallback={<TrendingFeedSkeleton />}>
      <TrendingFeedLoader />
    </Suspense>
  );
}

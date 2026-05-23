import { Suspense } from "react";
import { CommunitySidebar } from "./CommunitySidebar";
import { JoinCommunityCTA } from "./JoinCommunityCTA";
import { DailyFeaturedLoader } from "./home/DailyFeaturedLoader";
import { HomePersonalizedLoader } from "./home/HomePersonalizedLoader";
import { HomeSocialLoader } from "./home/HomeSocialLoader";
import { HomeSocialSkeleton } from "./home/HomeSocialSkeleton";
import {
  HeroSectionWithSkeleton,
  TrendingAnimeSectionWithSkeleton,
  FeaturedCommunitiesWithSkeleton,
  TrendingFeedWithSkeleton,
} from "./anime/AnimeSectionLoaders";
import { RecommendationCardsSkeleton } from "./anime/AnimeSkeletons";

function HomePersonalizedWithSkeleton() {
  return (
    <Suspense fallback={<RecommendationCardsSkeleton />}>
      <HomePersonalizedLoader />
    </Suspense>
  );
}

function HomeSocialWithSkeleton() {
  return (
    <Suspense fallback={<HomeSocialSkeleton />}>
      <HomeSocialLoader />
    </Suspense>
  );
}

export function HomeAnimeContent() {
  return (
    <div className="home-section-stack mt-8 flex flex-col gap-10 sm:mt-16 sm:gap-14 lg:gap-16">
      <HeroSectionWithSkeleton />

      <Suspense fallback={null}>
        <DailyFeaturedLoader />
      </Suspense>

      <HomeSocialWithSkeleton />

      <HomePersonalizedWithSkeleton />

      <TrendingAnimeSectionWithSkeleton />

      <FeaturedCommunitiesWithSkeleton />

      <div className="grid gap-8 lg:grid-cols-[1fr_280px] xl:gap-10">
        <div id="trending" className="min-w-0">
          <TrendingFeedWithSkeleton />
        </div>
        <div id="communities-sidebar" className="lg:col-span-1">
          <CommunitySidebar />
        </div>
      </div>

      <div id="messages">
        <JoinCommunityCTA />
      </div>
    </div>
  );
}

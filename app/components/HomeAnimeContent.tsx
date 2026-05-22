import { CommunitySidebar } from "./CommunitySidebar";
import { JoinCommunityCTA } from "./JoinCommunityCTA";
import {
  HeroSectionWithSkeleton,
  TrendingAnimeSectionWithSkeleton,
  FeaturedCommunitiesWithSkeleton,
  RecommendationCardsWithSkeleton,
  TrendingFeedWithSkeleton,
} from "./anime/AnimeSectionLoaders";

export function HomeAnimeContent() {
  return (
    <div className="home-section-stack mt-8 flex flex-col gap-10 sm:mt-16 sm:gap-16 lg:gap-20">
      <HeroSectionWithSkeleton />
      <TrendingAnimeSectionWithSkeleton />
      <FeaturedCommunitiesWithSkeleton />

      <div className="grid gap-8 lg:grid-cols-[1fr_300px] xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_280px] xl:gap-10">
        <div id="watchlists" className="flex flex-col gap-8 xl:col-span-1">
          <RecommendationCardsWithSkeleton />
        </div>

        <div id="trending" className="flex flex-col gap-8 xl:col-span-1">
          <TrendingFeedWithSkeleton />
        </div>

        <div id="communities-sidebar" className="lg:col-span-1 xl:col-span-1">
          <CommunitySidebar />
        </div>
      </div>

      <div id="messages">
        <JoinCommunityCTA />
      </div>
    </div>
  );
}

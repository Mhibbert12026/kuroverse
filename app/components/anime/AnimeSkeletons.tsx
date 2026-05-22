import { SkeletonBone, SkeletonCover, SectionHeaderSkeleton } from "./SkeletonBone";

const rankRingSkeleton = [
  "ring-accent-orange/20",
  "ring-accent-cyan/15",
  "ring-accent-gold/15",
  "ring-violet-500/15",
  "ring-pink-400/15",
  "ring-red-500/15",
];

type StaggerProps = { index?: number };

export function AnimeCardPortraitSkeleton({ index = 0 }: StaggerProps) {
  const delay = index * 90;
  return (
    <div
      className={`skeleton-stagger skeleton-card-glow w-[200px] shrink-0 overflow-hidden rounded-2xl border border-white/8 bg-surface-card ring-1 ${rankRingSkeleton[index % rankRingSkeleton.length]} sm:w-[220px] lg:w-[240px]`}
      style={{ animationDelay: `${index * 60}ms` }}
      aria-hidden
      role="presentation"
    >
      <div className="relative aspect-[2/3]">
        <SkeletonCover className="absolute inset-0" delay={delay} />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-black/40 to-transparent" />
        <SkeletonBone
          className="absolute left-3 top-3 h-8 w-8 rounded-lg"
          delay={delay + 100}
        />
        <SkeletonBone
          className="absolute right-3 top-3 h-5 w-14 rounded-full"
          delay={delay + 150}
        />
        <div className="absolute bottom-0 left-0 right-0 space-y-2 p-4">
          <SkeletonBone className="h-5 w-full rounded-md" delay={delay + 200} />
          <SkeletonBone className="h-3 w-4/5 rounded-md" delay={delay + 240} />
          <div className="flex gap-2 pt-1">
            <SkeletonBone className="h-6 w-12 rounded-lg" delay={delay + 280} />
            <SkeletonBone className="h-6 w-16 rounded-full" delay={delay + 300} />
          </div>
          <SkeletonBone className="h-3 w-1/2 rounded-md" delay={delay + 320} />
        </div>
      </div>
    </div>
  );
}

export function AnimeCardLandscapeSkeleton({ index = 0 }: StaggerProps) {
  const delay = index * 100;
  return (
    <div
      className="skeleton-stagger skeleton-card-glow overflow-hidden rounded-2xl border border-white/8 bg-surface-card"
      style={{ animationDelay: `${index * 70}ms` }}
      aria-hidden
      role="presentation"
    >
      <div className="relative aspect-[16/9]">
        <SkeletonCover className="absolute inset-0" delay={delay} />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-black/30 to-transparent" />
        <div className="absolute left-3 top-3 flex gap-2">
          <SkeletonBone className="h-5 w-14 rounded-full" delay={delay + 80} />
          <SkeletonBone className="h-5 w-16 rounded-full" delay={delay + 120} />
        </div>
        <SkeletonBone
          className="absolute bottom-3 right-3 h-7 w-12 rounded-lg"
          delay={delay + 160}
        />
      </div>
      <div className="space-y-2 p-4">
        <SkeletonBone className="h-4 w-3/4 rounded-md" delay={delay + 200} />
        <SkeletonBone className="h-3 w-1/2 rounded-md" delay={delay + 240} />
        <div className="flex justify-between pt-1">
          <SkeletonBone className="h-3 w-20 rounded-md" delay={delay + 280} />
          <SkeletonBone className="h-3 w-16 rounded-md" delay={delay + 300} />
        </div>
        <SkeletonBone className="mt-2 h-1 w-full rounded-full" delay={delay + 320} />
      </div>
    </div>
  );
}

export function AnimeCardCommunitySkeleton({ index = 0 }: StaggerProps) {
  const delay = index * 80;
  return (
    <div
      className="skeleton-stagger skeleton-card-glow overflow-hidden rounded-2xl border border-white/8 bg-surface-card"
      style={{ animationDelay: `${index * 65}ms` }}
      aria-hidden
      role="presentation"
    >
      <div className="relative aspect-[10/7]">
        <SkeletonCover className="absolute inset-0" delay={delay} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        <SkeletonBone className="absolute left-3 top-3 h-5 w-20 rounded-full" delay={delay + 100} />
        <div className="absolute bottom-3 left-3 right-3 space-y-2">
          <SkeletonBone className="h-5 w-2/3 rounded-md" delay={delay + 180} />
          <SkeletonBone className="h-3 w-full rounded-md" delay={delay + 220} />
        </div>
      </div>
      <div className="flex justify-between border-t border-white/6 bg-black/30 px-4 py-3">
        <div className="space-y-1">
          <SkeletonBone className="h-3 w-12 rounded-md" delay={delay + 260} />
          <SkeletonBone className="h-2 w-10 rounded-md" delay={delay + 280} />
        </div>
        <div className="space-y-1">
          <SkeletonBone className="ml-auto h-3 w-10 rounded-md" delay={delay + 300} />
          <SkeletonBone className="ml-auto h-2 w-14 rounded-md" delay={delay + 320} />
        </div>
      </div>
    </div>
  );
}

export function AnimeClipRowSkeleton({ index = 0 }: StaggerProps) {
  const delay = index * 70;
  return (
    <div
      className="skeleton-stagger flex shrink-0 gap-4 overflow-hidden rounded-2xl border border-white/8 bg-surface-card"
      style={{ animationDelay: `${index * 55}ms` }}
      aria-hidden
      role="presentation"
    >
      <div className="relative h-[200px] w-[120px] shrink-0 overflow-hidden sm:h-[240px] sm:w-[140px]">
        <SkeletonCover className="absolute inset-0" delay={delay} />
        <SkeletonBone className="absolute left-2 top-2 h-6 w-8 rounded-lg" delay={delay + 80} />
      </div>
      <div className="flex flex-1 flex-col justify-between py-4 pr-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <SkeletonBone className="h-8 w-8 shrink-0 rounded-full" delay={delay + 100} />
            <SkeletonBone className="h-3 w-24 rounded-md" delay={delay + 120} />
          </div>
          <SkeletonBone className="h-4 w-full rounded-md" delay={delay + 160} />
          <SkeletonBone className="h-4 w-4/5 rounded-md" delay={delay + 200} />
          <div className="flex gap-2">
            <SkeletonBone className="h-5 w-14 rounded-full" delay={delay + 240} />
            <SkeletonBone className="h-5 w-12 rounded-lg" delay={delay + 260} />
          </div>
        </div>
        <div className="mt-3 flex gap-4">
          <SkeletonBone className="h-3 w-16 rounded-md" delay={delay + 300} />
          <SkeletonBone className="h-3 w-14 rounded-md" delay={delay + 320} />
        </div>
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <section
      className="skeleton-stagger overflow-hidden rounded-3xl border border-white/8 glass-panel-deep"
      aria-busy="true"
      aria-label="Loading featured anime"
    >
      <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14 lg:p-12">
        <div className="flex flex-col gap-6">
          <SkeletonBone className="h-7 w-52 rounded-full" />
          <div className="space-y-3">
            <SkeletonBone className="h-10 w-full rounded-lg sm:h-12" delay={60} />
            <SkeletonBone className="h-10 w-4/5 rounded-lg sm:h-12" delay={100} />
          </div>
          <SkeletonBone className="h-20 w-full max-w-xl rounded-xl" delay={140} />
          <div className="flex gap-3">
            <SkeletonBone className="h-12 w-40 rounded-full" delay={180} />
            <SkeletonBone className="h-12 w-36 rounded-full" delay={220} />
          </div>
          <div className="flex gap-6 border-t border-white/8 pt-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <SkeletonBone className="h-8 w-16 rounded-md" delay={260 + i * 40} />
                <SkeletonBone className="h-3 w-20 rounded-md" delay={280 + i * 40} />
              </div>
            ))}
          </div>
        </div>
        <div className="relative mx-auto aspect-[3/4] w-full max-w-[300px] lg:max-w-none">
          <div className="absolute -inset-4 rounded-[2rem] bg-accent-orange/10 blur-2xl animate-pulse-glow" />
          <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 sm:rounded-3xl">
            <SkeletonCover className="absolute inset-0 h-full w-full" delay={80} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 space-y-2">
              <SkeletonBone className="h-5 w-24 rounded-md" delay={200} />
              <SkeletonBone className="h-7 w-3/4 rounded-md" delay={240} />
              <SkeletonBone className="h-4 w-1/2 rounded-md" delay={280} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TrendingAnimeSectionSkeleton() {
  return (
    <section className="section-glow flex flex-col gap-6" aria-busy="true" aria-label="Loading trending anime">
      <SectionHeaderSkeleton />
      <div className="horizontal-scroll -mx-4 flex gap-4 overflow-hidden px-4 pb-2 sm:-mx-6 sm:px-6 lg:gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <AnimeCardPortraitSkeleton key={i} index={i} />
        ))}
      </div>
    </section>
  );
}

export function FeaturedCommunitiesSkeleton() {
  return (
    <section className="section-glow flex flex-col gap-6" aria-busy="true" aria-label="Loading communities">
      <SectionHeaderSkeleton />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <AnimeCardCommunitySkeleton key={i} index={i} />
        ))}
      </div>
    </section>
  );
}

export function RecommendationCardsSkeleton() {
  return (
    <section className="flex flex-col gap-5" aria-busy="true" aria-label="Loading recommendations">
      <SectionHeaderSkeleton />
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <AnimeCardLandscapeSkeleton key={i} index={i} />
        ))}
      </div>
    </section>
  );
}

export function TrendingFeedSkeleton() {
  return (
    <section className="flex flex-col gap-5" aria-busy="true" aria-label="Loading trending clips">
      <SectionHeaderSkeleton />
      <div className="flex max-h-[520px] flex-col gap-4 overflow-hidden sm:max-h-[640px]">
        {Array.from({ length: 4 }).map((_, i) => (
          <AnimeClipRowSkeleton key={i} index={i} />
        ))}
      </div>
    </section>
  );
}

export function HomeAnimeSkeleton() {
  return (
    <div
      className="mt-12 flex flex-col gap-14 sm:mt-16 sm:gap-16 lg:gap-20"
      aria-busy="true"
      aria-label="Loading anime content"
    >
      <HeroSkeleton />
      <TrendingAnimeSectionSkeleton />
      <FeaturedCommunitiesSkeleton />
      <div className="grid gap-8 lg:grid-cols-[1fr_300px] xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_280px] xl:gap-10">
        <RecommendationCardsSkeleton />
        <TrendingFeedSkeleton />
        <div className="hidden rounded-2xl border border-white/8 bg-surface-card/50 p-5 lg:block xl:block">
          <SectionHeaderSkeleton />
          <div className="mt-4 space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonBone key={i} className="h-12 w-full rounded-xl" delay={i * 60} />
            ))}
          </div>
        </div>
      </div>
      <SkeletonBone className="h-40 w-full rounded-3xl" />
    </div>
  );
}

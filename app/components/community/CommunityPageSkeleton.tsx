import { SkeletonBone, SkeletonCover } from "@/app/components/anime/SkeletonBone";

export function CommunityPageSkeleton() {
  return (
    <div className="community-page hub-page min-h-screen pb-28" aria-busy="true" aria-label="Loading community">
      <div className="hub-banner relative left-1/2 -ml-[50vw] w-screen">
        <SkeletonCover className="h-[40vh] min-h-[220px] w-full" />
      </div>

      <div className="community-page__shell relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="-mt-20 sm:-mt-28">
          <SkeletonBone className="mb-4 h-4 w-28 rounded-md" />
          <div className="flex flex-col gap-6 lg:flex-row">
            <SkeletonBone className="aspect-square w-[140px] rounded-2xl" delay={80} />
            <div className="flex flex-1 flex-col gap-4">
              <SkeletonBone className="h-10 w-full rounded-lg" delay={120} />
              <SkeletonBone className="h-6 w-3/4 rounded-md" delay={160} />
              <SkeletonBone className="h-12 w-48 rounded-full" delay={200} />
            </div>
          </div>
        </div>

        <div className="community-page__rail mt-6 lg:hidden">
          <div className="flex gap-2 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonBone key={i} className="h-8 w-20 shrink-0 rounded-full" delay={220 + i * 20} />
            ))}
          </div>
        </div>

        <div className="community-page__grid mt-8">
          <div className="community-page__main flex flex-col gap-8">
            <SkeletonBone className="h-36 w-full rounded-2xl lg:hidden" delay={260} />
            <SkeletonBone className="h-80 w-full rounded-2xl" delay={280} />
            <SkeletonBone className="h-64 w-full rounded-2xl" delay={300} />
            <SkeletonBone className="hidden h-48 w-full rounded-2xl lg:block" delay={320} />
          </div>
          <SkeletonBone className="community-page__aside h-96 rounded-2xl" delay={290} />
        </div>
      </div>
    </div>
  );
}

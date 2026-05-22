import { SkeletonBone, SkeletonCover } from "./SkeletonBone";

export function AnimeDetailSkeleton() {
  return (
    <div className="hub-page min-h-screen bg-background pb-28" aria-busy="true" aria-label="Loading fandom hub">
      <div className="hub-banner relative left-1/2 -ml-[50vw] w-screen">
        <SkeletonCover className="h-[42vh] min-h-[240px] w-full" />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="-mt-20 sm:-mt-28">
          <SkeletonBone className="mb-4 h-4 w-28 rounded-md" />
          <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
            <SkeletonBone className="aspect-[2/3] w-full max-w-[200px] rounded-2xl" delay={80} />
            <div className="flex flex-col gap-4">
              <SkeletonBone className="h-10 w-full rounded-lg" delay={120} />
              <SkeletonBone className="h-8 w-3/4 rounded-lg" delay={160} />
              <SkeletonBone className="h-10 w-56 rounded-full" delay={200} />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
          <div className="flex flex-col gap-6">
            <SkeletonBone className="h-56 w-full rounded-2xl" delay={240} />
            <SkeletonBone className="h-52 w-full rounded-2xl" delay={280} />
            <SkeletonBone className="h-40 w-full rounded-2xl" delay={320} />
            <SkeletonBone className="h-64 w-full rounded-2xl" delay={360} />
          </div>
          <SkeletonBone className="hidden h-80 rounded-2xl lg:block" delay={300} />
        </div>
      </div>
    </div>
  );
}

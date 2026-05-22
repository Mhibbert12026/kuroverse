import { SkeletonBone, SkeletonCover } from "@/app/components/anime/SkeletonBone";

export function DiscoverSlideSkeleton() {
  return (
    <div className="discover-feed__snap discover-slide-skeleton" aria-hidden>
      <SkeletonCover className="absolute inset-0" />
      <div className="discover-slide-skeleton__scrim" />
      <div className="discover-slide-skeleton__rail">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonBone key={i} className="h-10 w-10 rounded-full" delay={i * 60} />
        ))}
      </div>
      <div className="discover-slide-skeleton__info">
        <SkeletonBone className="h-4 w-32 rounded-md" />
        <SkeletonBone className="mt-2 h-6 w-4/5 rounded-md" delay={80} />
        <div className="mt-3 flex gap-2">
          <SkeletonBone className="h-5 w-14 rounded-full" delay={120} />
          <SkeletonBone className="h-5 w-16 rounded-full" delay={140} />
        </div>
      </div>
    </div>
  );
}

type SkeletonBoneProps = {
  className?: string;
  delay?: number;
};

export function SkeletonBone({ className = "", delay = 0 }: SkeletonBoneProps) {
  return (
    <div
      className={`skeleton-bone ${className}`}
      style={{ animationDelay: `${delay}ms` }}
      aria-hidden
    />
  );
}

export function SkeletonCover({ className = "", delay = 0 }: SkeletonBoneProps) {
  return (
    <div
      className={`skeleton-cover ${className}`}
      style={{ animationDelay: `${delay}ms` }}
      aria-hidden
    />
  );
}

export function SectionHeaderSkeleton() {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="space-y-2">
        <SkeletonBone className="h-7 w-44 rounded-lg sm:h-8 sm:w-52" />
        <SkeletonBone className="h-4 w-64 max-w-full rounded-md" delay={80} />
      </div>
      <SkeletonBone className="hidden h-9 w-28 shrink-0 rounded-full sm:block" delay={120} />
    </div>
  );
}

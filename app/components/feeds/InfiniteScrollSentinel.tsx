"use client";

type InfiniteScrollSentinelProps = {
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
};

export function InfiniteScrollSentinel({ sentinelRef, className = "" }: InfiniteScrollSentinelProps) {
  return (
    <div
      ref={sentinelRef}
      className={`feed-sentinel ${className}`.trim()}
      aria-hidden
    />
  );
}

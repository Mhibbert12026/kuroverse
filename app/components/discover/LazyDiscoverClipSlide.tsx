"use client";

import type { RefObject } from "react";
import type { DiscoverClipItem } from "@/lib/discover/types";
import { useLazyVisible } from "@/app/hooks/useLazyVisible";
import { DiscoverClipSlide } from "./DiscoverClipSlide";
import { DiscoverSlideSkeleton } from "./DiscoverSlideSkeleton";

type LazyDiscoverClipSlideProps = {
  clip: DiscoverClipItem;
  isActive: boolean;
  rootRef: RefObject<HTMLDivElement | null>;
};

export function LazyDiscoverClipSlide({ clip, isActive, rootRef }: LazyDiscoverClipSlideProps) {
  const { ref, visible } = useLazyVisible<HTMLDivElement>({
    rootRef,
    rootMargin: "80px 0px",
    once: true,
  });

  return (
    <div ref={ref} className="discover-feed__snap h-full min-h-full">
      {visible ? (
        <DiscoverClipSlide clip={clip} isActive={isActive} />
      ) : (
        <DiscoverSlideSkeleton />
      )}
    </div>
  );
}

"use client";

import { CommunityJoinButton } from "./CommunityJoinButton";

type CommunityStickyJoinProps = {
  title: string;
};

export function CommunityStickyJoin({ title }: CommunityStickyJoinProps) {
  return (
    <div className="hub-sticky-join pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:px-6 lg:hidden">
      <div className="pointer-events-auto mx-auto flex max-w-lg items-center gap-3 rounded-2xl border border-white/12 bg-[rgba(4,4,12,0.92)] p-3 shadow-[0_-8px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-bold uppercase tracking-wider text-white/40">{title}</p>
          <p className="truncate text-sm font-semibold text-white">Join the fandom</p>
        </div>
        <CommunityJoinButton communityTitle={title} size="compact" />
      </div>
    </div>
  );
}

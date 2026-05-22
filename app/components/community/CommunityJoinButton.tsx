"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";

type CommunityJoinButtonProps = {
  communityTitle: string;
  className?: string;
  size?: "default" | "compact";
};

export function CommunityJoinButton({
  communityTitle,
  className = "community-hero-cta community-hero-cta--primary",
  size = "default",
}: CommunityJoinButtonProps) {
  const pathname = usePathname();
  const { user, openAuth } = useAuth();
  const [joined, setJoined] = useState(false);
  const [pulse, setPulse] = useState(false);

  const handleJoin = useCallback(() => {
    if (!user) {
      openAuth("sign-up", pathname.startsWith("/") ? pathname : "/");
      return;
    }
    setJoined(true);
    setPulse(true);
    window.setTimeout(() => setPulse(false), 600);
  }, [user, openAuth, pathname]);

  const label = joined ? "Joined" : "Join Community";
  const compactClass = size === "compact" ? "hub-btn hub-btn--primary shrink-0 px-5 py-2.5 text-xs" : className;

  return (
    <button
      type="button"
      onClick={handleJoin}
      className={`${compactClass} ${joined ? "community-join-btn--joined" : ""} ${pulse ? "community-join-btn--pulse" : ""}`.trim()}
      aria-pressed={joined}
      aria-label={joined ? `Joined ${communityTitle} community` : `Join ${communityTitle} community`}
    >
      <JoinIcon joined={joined} />
      {label}
    </button>
  );
}

export function CommunityJoinLink({
  href,
  children,
  className = "community-hero-cta community-hero-cta--secondary",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function JoinIcon({ joined }: { joined: boolean }) {
  if (joined) {
    return (
      <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    );
  }
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l-.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72m0 0a9.094 9.094 0 003.74.477M12 21c2.17 0 4.207-.576 5.963-1.584"
      />
    </svg>
  );
}

"use client";

import Link from "next/link";
import { BrandLogo } from "@/app/components/BrandLogo";

export function DiscoverFeedChrome() {
  return (
    <header className="discover-chrome">
      <Link href="/" className="discover-chrome__back" aria-label="Back to home">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </Link>
      <div className="discover-chrome__brand">
        <BrandLogo size="sm" showIcon link={false} />
        <span className="discover-chrome__label">Discover</span>
      </div>
      <Link href="/watchlist" className="discover-chrome__watchlist" aria-label="Watchlist">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </Link>
    </header>
  );
}

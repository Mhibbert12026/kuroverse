"use client";

import { UserMenu } from "./auth/UserMenu";
import { BrandLogo } from "./BrandLogo";
import { NotificationDropdown } from "./notifications/NotificationDropdown";
import { useAuth } from "@/app/providers/AuthProvider";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Discover", href: "/discover" },
  { label: "Trending", href: "/#trending-anime" },
  { label: "Communities", href: "/#communities" },
  { label: "Watchlists", href: "/watchlist" },
];

export function TopNav() {
  const { openAuth, user } = useAuth();

  return (
    <header className="top-nav fixed inset-x-0 top-0 z-50 border-b border-white/6 bg-[rgba(2,2,8,0.85)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent-orange/40 to-transparent" />
      <nav className="top-nav__inner mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-[var(--kv-page-px)] sm:gap-4 lg:px-8">
        <BrandLogo showIcon link size="md" className="shrink-0" />

        <ul className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="relative rounded-lg px-3.5 py-2 text-sm font-medium text-white/60 transition-all duration-200 hover:text-white after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-gradient-to-r after:from-accent-orange after:to-accent-pink after:transition-all after:duration-300 hover:after:w-3/4 hover:bg-white/5"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden flex-1 items-center justify-end lg:flex lg:max-w-xs xl:max-w-sm">
          <div className="relative w-full">
            <svg
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              type="search"
              placeholder="Search anime, communities..."
              className="h-10 w-full rounded-full border border-white/8 bg-white/5 pl-10 pr-4 text-sm text-white placeholder:text-white/35 transition-all duration-300 focus:border-accent-orange/40 focus:bg-white/8 focus:outline-none focus:ring-2 focus:ring-accent-orange/15 focus:shadow-[0_0_20px_rgba(255,90,31,0.15)]"
            />
          </div>
        </div>

        <a
          href="/discover"
          aria-label="Search anime"
          className="top-nav__search flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/70 transition-all duration-200 hover:border-accent-orange/35 hover:bg-white/5 hover:text-white md:hidden"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </a>

        <div className="flex items-center gap-2 sm:gap-3">
          <NotificationDropdown />
          <div className={user ? "flex" : "hidden sm:flex"}>
            <UserMenu />
          </div>
          {!user ? (
            <button
              type="button"
              onClick={() => openAuth("sign-in")}
              className="top-nav__sign-in flex h-11 min-w-[4.5rem] items-center justify-center rounded-full border border-white/12 px-3 text-sm font-semibold text-white/85 transition-all duration-200 hover:border-accent-orange/40 hover:bg-white/5 sm:hidden"
            >
              Join
            </button>
          ) : null}
        </div>
      </nav>
    </header>
  );
}

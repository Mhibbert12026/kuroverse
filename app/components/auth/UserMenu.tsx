"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signOutAction } from "@/lib/auth/actions";
import { useAuth } from "@/app/providers/AuthProvider";
import { ProfileAvatar } from "@/app/components/profile/ProfileAvatar";

export function UserMenu() {
  const { user, profile, openAuth } = useAuth();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!user) {
    return (
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => openAuth("sign-in")}
          className="hidden rounded-full border border-white/12 px-4 py-2 text-sm font-medium text-white/75 transition-all duration-200 hover:border-white/25 hover:bg-white/5 sm:block"
        >
          Log in
        </button>
        <button
          type="button"
          onClick={() => openAuth("sign-up")}
          className="rounded-full bg-gradient-to-r from-accent-orange to-accent-pink px-4 py-2 text-sm font-semibold text-white shadow-[0_0_24px_rgba(255,90,31,0.35)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_32px_rgba(255,90,31,0.5)]"
        >
          Join Free
        </button>
      </div>
    );
  }

  const label = profile?.display_name ?? user.email?.split("@")[0] ?? "Member";
  const handle = profile?.username ? `@${profile.username}` : user.email;
  const avatar = profile?.avatar_url ?? user.user_metadata?.avatar_url ?? user.user_metadata?.picture;

  return (
    <div className="auth-user-menu" ref={rootRef}>
      <button
        type="button"
        className="auth-user-menu__trigger auth-user-menu__trigger--signed-in"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <ProfileAvatar
          src={avatar}
          name={label}
          size="sm"
          ring="neon"
          className="auth-user-menu__avatar-wrap"
        />
        <span className="auth-user-menu__label hidden max-w-[7rem] truncate sm:inline md:max-w-[9rem]">
          {label}
        </span>
        <svg className="h-4 w-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open ? (
        <div className="auth-user-menu__dropdown" role="menu">
          <div className="auth-user-menu__identity">
            <p className="auth-user-menu__name">{label}</p>
            <p className="auth-user-menu__handle">{handle}</p>
          </div>
          <div className="auth-user-menu__divider" />
          <Link
            href={profile?.username ? `/u/${profile.username}` : "/profile"}
            className="auth-user-menu__item"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            View profile
          </Link>
          <Link
            href="/watchlist"
            className="auth-user-menu__item"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            My watchlist
          </Link>
          <a href="/#communities" className="auth-user-menu__item" role="menuitem" onClick={() => setOpen(false)}>
            Communities
          </a>
          {profile?.is_moderator ? (
            <Link
              href="/admin/seed"
              className="auth-user-menu__item"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              Content seeding
            </Link>
          ) : null}
          <div className="auth-user-menu__divider" />
          <form action={signOutAction}>
            <button type="submit" className="auth-user-menu__item auth-user-menu__item--danger" role="menuitem">
              Sign out
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}

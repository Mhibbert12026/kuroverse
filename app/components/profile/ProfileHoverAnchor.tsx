"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import type { ProfileCardData } from "@/lib/profile/card";
import { ProfileHoverCard } from "./ProfileHoverCard";

const cardCache = new Map<string, ProfileCardData>();

type ProfileHoverAnchorProps = {
  children: ReactNode;
  userId?: string;
  username?: string | null;
  className?: string;
  disabled?: boolean;
};

function cacheKey(userId?: string, username?: string | null): string | null {
  if (username) return `u:${username.toLowerCase()}`;
  if (userId) return `id:${userId}`;
  return null;
}

export function ProfileHoverAnchor({
  children,
  userId,
  username,
  className = "",
  disabled = false,
}: ProfileHoverAnchorProps) {
  const tooltipId = useId();
  const anchorRef = useRef<HTMLSpanElement>(null);
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(false);
  const [card, setCard] = useState<ProfileCardData | null>(null);
  const [position, setPosition] = useState<CSSProperties>({});
  const [mounted, setMounted] = useState(false);

  const key = cacheKey(userId, username);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = useCallback(() => {
    const el = anchorRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const isMobile = window.innerWidth < 768;
    const cardWidth = isMobile ? Math.min(320, window.innerWidth - 24) : 300;
    const gap = 10;

    let left = rect.left + rect.width / 2 - cardWidth / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - cardWidth - 12));

    let top = rect.bottom + gap;
    const estimatedHeight = 280;

    if (top + estimatedHeight > window.innerHeight - 12) {
      top = rect.top - estimatedHeight - gap;
    }
    if (top < 12) top = rect.bottom + gap;

    setPosition({
      position: "fixed",
      top,
      left,
      width: cardWidth,
      zIndex: 70,
    });
  }, []);

  const fetchCard = useCallback(async () => {
    if (!key) return null;
    const cached = cardCache.get(key);
    if (cached) return cached;

    const params = username
      ? `username=${encodeURIComponent(username)}`
      : userId
        ? `id=${encodeURIComponent(userId)}`
        : null;
    if (!params) return null;

    const res = await fetch(`/api/profile/card?${params}`);
    if (!res.ok) return null;
    const data = (await res.json()) as ProfileCardData;
    cardCache.set(key, data);
    return data;
  }, [key, userId, username]);

  const show = useCallback(() => {
    if (disabled || !key) return;
    if (hideTimer.current) clearTimeout(hideTimer.current);
    showTimer.current = setTimeout(() => {
      void fetchCard().then((data) => {
        if (!data) return;
        setCard(data);
        setOpen(true);
        updatePosition();
      });
    }, 320);
  }, [disabled, key, fetchCard, updatePosition]);

  const hide = useCallback(() => {
    if (showTimer.current) clearTimeout(showTimer.current);
    hideTimer.current = setTimeout(() => setOpen(false), 120);
  }, []);

  const toggleTouch = useCallback(() => {
    if (disabled || !key) return;
    if (open) {
      setOpen(false);
      return;
    }
    void fetchCard().then((data) => {
      if (!data) return;
      setCard(data);
      setOpen(true);
      updatePosition();
    });
  }, [disabled, key, open, fetchCard, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const onScroll = () => updatePosition();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [open, updatePosition]);

  if (!key) {
    return <span className={className}>{children}</span>;
  }

  return (
    <>
      <span
        ref={anchorRef}
        className={`profile-hover-anchor ${className}`.trim()}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onClick={(e: MouseEvent) => {
          if (window.matchMedia("(hover: none)").matches) {
            e.preventDefault();
            toggleTouch();
          }
        }}
        aria-describedby={open ? tooltipId : undefined}
      >
        {children}
      </span>
      {mounted && open && card
        ? createPortal(
            <div
              id={tooltipId}
              onMouseEnter={() => {
                if (hideTimer.current) clearTimeout(hideTimer.current);
              }}
              onMouseLeave={hide}
            >
              <ProfileHoverCard data={card} style={position} />
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

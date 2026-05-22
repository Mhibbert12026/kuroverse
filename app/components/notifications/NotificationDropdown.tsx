"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProfileAvatar } from "@/app/components/profile/ProfileAvatar";
import { ProfileHoverAnchor } from "@/app/components/profile/ProfileHoverAnchor";
import { useAuth } from "@/app/providers/AuthProvider";
import { formatNotificationTime } from "@/lib/notifications/format";
import type { NotificationItem, NotificationType, NotificationsPayload } from "@/lib/notifications/types";

const TYPE_LABELS: Record<NotificationType, string> = {
  reply: "Reply",
  like: "Like",
  follow: "Follow",
  community_post: "Community",
  watchlist_update: "Watchlist",
};

function NotificationTypeIcon({ type }: { type: NotificationType }) {
  const common = {
    className: "notification-item__type-icon-svg",
    fill: "none" as const,
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 1.75,
    "aria-hidden": true,
  };

  switch (type) {
    case "reply":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      );
    case "like":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    case "follow":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      );
    case "community_post":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case "watchlist_update":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5h14v14H5zM9 5v14M5 9h4M5 13h4" />
        </svg>
      );
    default:
      return null;
  }
}

function actorLabel(item: NotificationItem): string {
  if (item.actor?.displayName) return item.actor.displayName;
  if (item.actor?.username) return `@${item.actor.username}`;
  return "KuroVerse";
}

export function NotificationDropdown() {
  const { user, openAuth } = useAuth();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<NotificationsPayload>({ items: [], unreadCount: 0 });

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch("/api/notifications?limit=40", { cache: "no-store" });
      if (!res.ok) {
        if (res.status === 401) {
          setData({ items: [], unreadCount: 0 });
        }
        return;
      }
      const payload = (await res.json()) as NotificationsPayload;
      setData(payload);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setData({ items: [], unreadCount: 0 });
      return;
    }
    void fetchNotifications();
  }, [user, fetchNotifications]);

  useEffect(() => {
    if (!open || !user) return;
    void fetchNotifications();
    const interval = window.setInterval(() => void fetchNotifications(), 45_000);
    return () => window.clearInterval(interval);
  }, [open, user, fetchNotifications]);

  useEffect(() => {
    const onPointer = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    if (window.matchMedia("(max-width: 767px)").matches) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const markRead = async (ids?: string[], all = false) => {
    const res = await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(all ? { all: true } : { ids }),
    });
    if (!res.ok) return;
    const result = (await res.json()) as { ok: boolean; unreadCount?: number };
    if (result.ok) {
      setData((prev) => ({
        unreadCount: result.unreadCount ?? 0,
        items: all
          ? prev.items.map((item) => ({ ...item, readAt: item.readAt ?? new Date().toISOString() }))
          : prev.items.map((item) =>
              ids?.includes(item.id)
                ? { ...item, readAt: item.readAt ?? new Date().toISOString() }
                : item,
            ),
      }));
    }
  };

  const handleItemClick = (item: NotificationItem) => {
    if (!item.readAt) {
      void markRead([item.id]);
    }
    setOpen(false);
  };

  const unreadBadge = data.unreadCount > 99 ? "99+" : String(data.unreadCount);

  if (!user) {
    return (
      <button
        type="button"
        className="notification-bell"
        aria-label="Notifications"
        onClick={() => openAuth("sign-in")}
      >
        <svg className="notification-bell__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.454 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>
      </button>
    );
  }

  return (
    <div className="notification-dropdown" ref={rootRef}>
      <button
        type="button"
        className="notification-bell"
        aria-label="Notifications"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((v) => !v)}
      >
        <svg className="notification-bell__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.454 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>
        {data.unreadCount > 0 ? (
          <span className="notification-bell__badge" aria-hidden>
            {unreadBadge}
          </span>
        ) : null}
      </button>

      {open ? (
        <>
          <button
            type="button"
            className="notification-backdrop"
            aria-label="Close notifications"
            onClick={() => setOpen(false)}
          />
          <div className="notification-panel" role="dialog" aria-label="Notifications">
            <header className="notification-panel__header">
              <div>
                <h2 className="notification-panel__title">Notifications</h2>
                <p className="notification-panel__subtitle">
                  {data.unreadCount > 0
                    ? `${data.unreadCount} unread`
                    : "You're all caught up"}
                </p>
              </div>
              {data.unreadCount > 0 ? (
                <button
                  type="button"
                  className="notification-panel__mark-all"
                  onClick={() => void markRead(undefined, true)}
                >
                  Mark all read
                </button>
              ) : null}
            </header>

            <div className="notification-panel__list">
              {loading && data.items.length === 0 ? (
                <p className="notification-panel__empty">Loading…</p>
              ) : null}

              {!loading && data.items.length === 0 ? (
                <div className="notification-panel__empty">
                  <p>No notifications yet.</p>
                  <p className="notification-panel__empty-hint">
                    Likes, replies, follows, and community posts show up here.
                  </p>
                </div>
              ) : null}

              <ul className="notification-list">
                {data.items.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={`notification-item${item.readAt ? "" : " notification-item--unread"}`}
                      onClick={() => handleItemClick(item)}
                    >
                      <ProfileHoverAnchor
                        userId={item.actor?.id}
                        username={item.actor?.username}
                        className="notification-item__avatar-wrap"
                        disabled={!item.actor?.id}
                      >
                        <ProfileAvatar
                          src={item.actor?.avatarUrl ?? null}
                          name={actorLabel(item)}
                          size="sm"
                          className="notification-item__avatar"
                        />
                        <span
                          className={`notification-item__type-icon notification-item__type-icon--${item.type}`}
                          title={TYPE_LABELS[item.type]}
                        >
                          <NotificationTypeIcon type={item.type} />
                        </span>
                      </ProfileHoverAnchor>
                      <div className="notification-item__body">
                        <p className="notification-item__title">{item.title}</p>
                        {item.body ? (
                          <p className="notification-item__text">{item.body}</p>
                        ) : null}
                        <p className="notification-item__time">
                          {formatNotificationTime(item.createdAt)}
                        </p>
                      </div>
                      {!item.readAt ? (
                        <span className="notification-item__dot" aria-hidden />
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import {
  WATCHLIST_STATUSES,
  WATCHLIST_STATUS_LABELS,
} from "@/lib/watchlist/constants";
import type { WatchlistStatus } from "@/lib/watchlist/types";

type WatchlistStatusMenuProps = {
  currentStatus: WatchlistStatus | null;
  onSelect: (status: WatchlistStatus) => void;
  onRemove?: () => void;
  disabled?: boolean;
  align?: "left" | "right";
  triggerClassName?: string;
};

export function WatchlistStatusMenu({
  currentStatus,
  onSelect,
  onRemove,
  disabled,
  align = "right",
  triggerClassName = "watchlist-menu__trigger",
}: WatchlistStatusMenuProps) {
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

  return (
    <div className="watchlist-menu" ref={rootRef}>
      <button
        type="button"
        className={triggerClassName}
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
      >
        {currentStatus ? WATCHLIST_STATUS_LABELS[currentStatus] : "Add to list"}
        <svg className="h-3.5 w-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open ? (
        <ul
          className={`watchlist-menu__dropdown watchlist-menu__dropdown--${align}`}
          role="listbox"
        >
          {WATCHLIST_STATUSES.map((status) => (
            <li key={status} role="option" aria-selected={currentStatus === status}>
              <button
                type="button"
                className={`watchlist-menu__option ${currentStatus === status ? "watchlist-menu__option--active" : ""}`}
                onClick={() => {
                  onSelect(status);
                  setOpen(false);
                }}
              >
                {WATCHLIST_STATUS_LABELS[status]}
              </button>
            </li>
          ))}
          {onRemove ? (
            <>
              <li className="watchlist-menu__divider" role="separator" />
              <li role="option">
                <button
                  type="button"
                  className="watchlist-menu__option watchlist-menu__option--danger"
                  onClick={() => {
                    onRemove();
                    setOpen(false);
                  }}
                >
                  Remove from watchlist
                </button>
              </li>
            </>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}

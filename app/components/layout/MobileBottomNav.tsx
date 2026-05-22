"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { isMobileNavActive, MOBILE_NAV_ITEMS } from "@/lib/navigation/mobile-nav";

function NavIcon({ id }: { id: string }) {
  const common = {
    className: "mobile-bottom-nav__icon",
    fill: "none" as const,
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 1.75,
    "aria-hidden": true,
  };

  switch (id) {
    case "home":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5L12 4l9 6.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z" />
        </svg>
      );
    case "discover":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M4 7h4M16 7h4M4 17h4M16 17h4" />
        </svg>
      );
    case "trending":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-10" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5h7v7" />
        </svg>
      );
    case "communities":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      );
    case "watchlist":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5h14v14H5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5v14M5 9h4M5 13h4" />
        </svg>
      );
    default:
      return null;
  }
}

type MobileBottomNavProps = {
  immersive?: boolean;
};

export function MobileBottomNav({ immersive = false }: MobileBottomNavProps) {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  return (
    <nav
      className={`mobile-bottom-nav${immersive ? " mobile-bottom-nav--immersive" : ""}`}
      aria-label="Primary"
    >
      <ul className="mobile-bottom-nav__list">
        {MOBILE_NAV_ITEMS.map((item) => {
          const active = isMobileNavActive(pathname, hash, item);
          return (
            <li key={item.id} className="mobile-bottom-nav__item">
              <Link
                href={item.href}
                className={`mobile-bottom-nav__link${active ? " mobile-bottom-nav__link--active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <span className="mobile-bottom-nav__icon-wrap">
                  <NavIcon id={item.id} />
                </span>
                <span className="mobile-bottom-nav__label">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

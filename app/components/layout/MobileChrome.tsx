"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { MobileBottomNav } from "./MobileBottomNav";

const IMMERSIVE_PREFIXES = ["/discover"];

export function MobileChrome() {
  const pathname = usePathname();
  const immersive = IMMERSIVE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("kv-mobile-shell");
    root.dataset.kvShell = immersive ? "immersive" : "default";
    return () => {
      root.classList.remove("kv-mobile-shell");
      delete root.dataset.kvShell;
    };
  }, [immersive]);

  return <MobileBottomNav immersive={immersive} />;
}

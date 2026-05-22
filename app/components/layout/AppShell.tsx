import type { ReactNode } from "react";
import { TopNav } from "@/app/components/TopNav";
import { BrandLogo } from "@/app/components/BrandLogo";
import { PLATFORM_NAME } from "@/lib/brand";

type AppShellProps = {
  children: ReactNode;
  /** Extra classes on the outer shell */
  className?: string;
  /** Main content max width token */
  mainMax?: "default" | "narrow" | "wide" | "full";
  /** Show site footer (hidden on small screens when false) */
  footer?: boolean;
  /** Ambient gradient orbs behind content */
  ambience?: "home" | "community" | "profile" | "none";
  /** Tighter top padding for full-bleed hub layouts */
  mainClassName?: string;
};

const mainMaxClass: Record<NonNullable<AppShellProps["mainMax"]>, string> = {
  default: "max-w-[1600px]",
  narrow: "max-w-2xl lg:max-w-3xl",
  wide: "max-w-[1600px]",
  full: "max-w-none",
};

function AmbientOrbs({ variant }: { variant: NonNullable<AppShellProps["ambience"]> }) {
  if (variant === "none") return null;

  const orange =
    variant === "community" ? "bg-accent-orange/8" : "bg-accent-orange/10";
  const purple =
    variant === "community" ? "bg-accent-purple/8" : "bg-accent-purple/10";

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div
        className={`absolute -left-48 top-0 h-[500px] w-[500px] rounded-full blur-[140px] ${orange}`}
      />
      <div
        className={`absolute -right-48 top-1/4 h-[400px] w-[400px] rounded-full blur-[120px] ${purple}`}
      />
      {variant === "home" ? (
        <>
          <div className="absolute bottom-0 left-1/2 h-[300px] w-[800px] -translate-x-1/2 rounded-full bg-accent-pink/6 blur-[100px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,2,8,0.4)_100%)]" />
        </>
      ) : null}
    </div>
  );
}

export function AppShell({
  children,
  className = "",
  mainMax = "default",
  footer = false,
  ambience = "none",
  mainClassName = "",
}: AppShellProps) {
  return (
    <div className={`app-shell film-grain relative min-h-screen bg-background ${className}`}>
      <AmbientOrbs variant={ambience} />
      <TopNav />
      <main
        className={`app-shell__main relative z-10 mx-auto w-full px-[var(--kv-page-px)] ${mainMaxClass[mainMax]} ${mainClassName}`}
      >
        {children}
      </main>
      {footer ? (
        <footer className="app-shell__footer relative z-10 border-t border-white/6 bg-black/40 py-8 backdrop-blur-sm sm:py-10">
          <div className="app-shell__footer-inner mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-4 px-[var(--kv-page-px)] sm:flex-row">
            <BrandLogo size="sm" />
            <p className="text-center text-xs text-white/35 sm:text-left">
              © 2026 {PLATFORM_NAME}. Anime data via AniList. Not affiliated with any studio.
            </p>
            <div className="flex gap-6 text-xs text-white/35">
              <a href="#" className="transition-colors duration-200 hover:text-accent-orange">
                Terms
              </a>
              <a href="#" className="transition-colors duration-200 hover:text-accent-orange">
                Privacy
              </a>
              <a href="#" className="transition-colors duration-200 hover:text-accent-orange">
                Support
              </a>
            </div>
          </div>
        </footer>
      ) : null}
    </div>
  );
}

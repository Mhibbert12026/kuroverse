/** Platform branding — single source of truth for KuroVerse. */

export const PLATFORM_NAME = "KuroVerse";
export const PLATFORM_TAGLINE = "Anime Social Platform";
export const PLATFORM_TITLE = `${PLATFORM_NAME} — ${PLATFORM_TAGLINE}`;
export const PLATFORM_TITLE_SUFFIX = ` · ${PLATFORM_NAME}`;
export const PLATFORM_PLUS = `${PLATFORM_NAME}+`;
export const WATCHLIST_STORAGE_KEY = "kuroverse-watchlist";
/** @deprecated Migrated on read; remove after a few releases */
export const WATCHLIST_STORAGE_KEY_LEGACY = "aniwave-watchlist";

export function pageTitle(segment: string): string {
  return `${segment}${PLATFORM_TITLE_SUFFIX}`;
}

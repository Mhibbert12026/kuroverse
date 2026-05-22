/** Paths that require a signed-in Supabase session. */
export const PROTECTED_PATH_PREFIXES = ["/watchlist", "/profile"] as const;

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function authRequiredRedirect(nextPath: string): string {
  const next = nextPath.startsWith("/") ? nextPath : `/${nextPath}`;
  return `/?auth=required&next=${encodeURIComponent(next)}`;
}

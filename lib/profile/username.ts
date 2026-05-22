const RESERVED = new Set([
  "admin",
  "api",
  "auth",
  "help",
  "home",
  "login",
  "logout",
  "me",
  "profile",
  "settings",
  "signin",
  "signup",
  "support",
  "u",
  "user",
  "users",
  "www",
]);

export function normalizeUsername(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 24);
}

export function validateUsername(username: string): string | null {
  if (!username) return "Username is required.";
  if (username.length < 3) return "Username must be at least 3 characters.";
  if (username.length > 24) return "Username must be 24 characters or fewer.";
  if (!/^[a-z0-9_]+$/.test(username)) {
    return "Use only lowercase letters, numbers, and underscores.";
  }
  if (RESERVED.has(username)) return "That username is reserved.";
  return null;
}

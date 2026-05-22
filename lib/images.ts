/**
 * Illustrated anime artwork only — local SVG scenes + stylized avatars.
 * No cosplay, live-action, or photographic sources.
 */

export type SceneId =
  | "hero"
  | "trend-jjk"
  | "trend-demon-slayer"
  | "trend-one-piece"
  | "trend-solo-leveling"
  | "trend-frieren"
  | "trend-chainsaw-man"
  | "comm-naruto"
  | "comm-bleach"
  | "comm-demon-slayer"
  | "comm-one-piece"
  | "comm-jjk"
  | "clip-solo-leveling"
  | "clip-frieren"
  | "clip-chainsaw-man"
  | "clip-jjk"
  | "clip-spy-family"
  | "rec-demon-slayer"
  | "rec-frieren"
  | "rec-solo-leveling"
  | "rec-vinland-saga";

export type AvatarId =
  | "shadow-monarch"
  | "mage-archive"
  | "devil-hunter"
  | "cursed-energy"
  | "forger-family";

const SCENES: Record<SceneId, string> = {
  hero: "/art/scenes/hero.svg",
  "trend-jjk": "/art/scenes/trend-jjk.svg",
  "trend-demon-slayer": "/art/scenes/trend-demon-slayer.svg",
  "trend-one-piece": "/art/scenes/trend-one-piece.svg",
  "trend-solo-leveling": "/art/scenes/trend-solo-leveling.svg",
  "trend-frieren": "/art/scenes/trend-frieren.svg",
  "trend-chainsaw-man": "/art/scenes/trend-chainsaw-man.svg",
  "comm-naruto": "/art/scenes/comm-naruto.svg",
  "comm-bleach": "/art/scenes/comm-bleach.svg",
  "comm-demon-slayer": "/art/scenes/comm-demon-slayer.svg",
  "comm-one-piece": "/art/scenes/comm-one-piece.svg",
  "comm-jjk": "/art/scenes/comm-jjk.svg",
  "clip-solo-leveling": "/art/scenes/clip-solo-leveling.svg",
  "clip-frieren": "/art/scenes/clip-frieren.svg",
  "clip-chainsaw-man": "/art/scenes/clip-chainsaw-man.svg",
  "clip-jjk": "/art/scenes/clip-jjk.svg",
  "clip-spy-family": "/art/scenes/clip-spy-family.svg",
  "rec-demon-slayer": "/art/scenes/rec-demon-slayer.svg",
  "rec-frieren": "/art/scenes/rec-frieren.svg",
  "rec-solo-leveling": "/art/scenes/rec-solo-leveling.svg",
  "rec-vinland-saga": "/art/scenes/rec-vinland-saga.svg",
};

const AVATARS: Record<AvatarId, string> = {
  "shadow-monarch": "/art/avatars/shadow-monarch.svg",
  "mage-archive": "/art/avatars/mage-archive.svg",
  "devil-hunter": "/art/avatars/devil-hunter.svg",
  "cursed-energy": "/art/avatars/cursed-energy.svg",
  "forger-family": "/art/avatars/forger-family.svg",
};

/** Cinematic illustrated anime scene (local SVG). */
export function sceneArt(id: SceneId): string {
  return SCENES[id];
}

/** Stylized illustrated character avatar (local SVG). */
export function animeAvatar(id: AvatarId): string {
  return AVATARS[id];
}

export const heroImage = sceneArt("hero");

/** Maps creator display names to avatar assets. */
export function avatarForCreator(creator: string): string {
  const map: Record<string, AvatarId> = {
    ShadowMonarch: "shadow-monarch",
    MageArchive: "mage-archive",
    DevilHunterTV: "devil-hunter",
    CursedEnergy: "cursed-energy",
    ForgerFamily: "forger-family",
  };
  const id = map[creator];
  return id ? animeAvatar(id) : animeAvatar("shadow-monarch");
}

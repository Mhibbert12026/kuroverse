import type { CommunityAccent } from "@/lib/communities/types";

export const accentBorder: Record<CommunityAccent, string> = {
  orange: "border-accent-orange/30 hover:border-accent-orange/50 hover:shadow-[0_0_40px_rgba(255,90,31,0.2)]",
  cyan: "border-accent-cyan/30 hover:border-accent-cyan/50 hover:shadow-[0_0_40px_rgba(6,182,212,0.2)]",
  emerald: "border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-[0_0_40px_rgba(16,185,129,0.2)]",
  gold: "border-accent-gold/30 hover:border-accent-gold/50 hover:shadow-[0_0_40px_rgba(245,158,11,0.2)]",
  purple: "border-accent-purple/30 hover:border-accent-purple/50 hover:shadow-[0_0_40px_rgba(147,51,234,0.25)]",
};

export const accentBadge: Record<CommunityAccent, string> = {
  orange: "bg-accent-orange/20 text-accent-orange",
  cyan: "bg-accent-cyan/20 text-accent-cyan",
  emerald: "bg-emerald-500/20 text-emerald-400",
  gold: "bg-accent-gold/20 text-accent-gold",
  purple: "bg-accent-purple/20 text-accent-purple",
};

export const accentGlow: Record<CommunityAccent, string> = {
  orange: "anime-card-glow-orange",
  cyan: "anime-card-glow-cyan",
  emerald: "anime-card-glow-emerald",
  gold: "anime-card-glow-gold",
  purple: "anime-card-glow-purple",
};

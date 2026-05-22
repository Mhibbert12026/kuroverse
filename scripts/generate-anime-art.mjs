import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = join(import.meta.dirname, "..", "public", "art");

const palettes = {
  hero: { sky: ["#0c0618", "#1a0e3a", "#3d1d6e"], accent: "#7c3aed", glow: "#a78bfa", ground: "#12081f" },
  "trend-jjk": { sky: ["#050510", "#1e1040", "#4c1d95"], accent: "#6366f1", glow: "#818cf8", ground: "#0a0614" },
  "trend-demon-slayer": { sky: ["#041210", "#0d3d32", "#1a6b5a"], accent: "#34d399", glow: "#6ee7b7", ground: "#061210" },
  "trend-one-piece": { sky: ["#0a1628", "#1e3a5f", "#2563eb"], accent: "#f59e0b", glow: "#fcd34d", ground: "#0c1a2e" },
  "trend-solo-leveling": { sky: ["#030712", "#1e1b4b", "#312e81"], accent: "#3b82f6", glow: "#93c5fd", ground: "#080816" },
  "trend-frieren": { sky: ["#1a1025", "#4a3f6b", "#9d8ec4"], accent: "#f9a8d4", glow: "#fce7f3", ground: "#1e1528" },
  "trend-chainsaw-man": { sky: ["#1a0505", "#7f1d1d", "#991b1b"], accent: "#ef4444", glow: "#fca5a5", ground: "#140606" },
  "comm-naruto": { sky: ["#1c1008", "#c2410c", "#f97316"], accent: "#fb923c", glow: "#fdba74", ground: "#1a0f06" },
  "comm-bleach": { sky: ["#0a0a12", "#1e293b", "#475569"], accent: "#f97316", glow: "#fdba74", ground: "#0f0f18" },
  "comm-demon-slayer": { sky: ["#052e2b", "#0f766e", "#14b8a6"], accent: "#2dd4bf", glow: "#99f6e4", ground: "#041816" },
  "comm-one-piece": { sky: ["#0c1929", "#0369a1", "#0ea5e9"], accent: "#eab308", glow: "#fde047", ground: "#0a1520" },
  "comm-jjk": { sky: ["#0f0a1a", "#4c1d95", "#7e22ce"], accent: "#a855f7", glow: "#d8b4fe", ground: "#0c0814" },
  "clip-solo-leveling": { sky: ["#020617", "#1e3a8a", "#4338ca"], accent: "#60a5fa", glow: "#bfdbfe", ground: "#060818" },
  "clip-frieren": { sky: ["#2e1065", "#6b21a8", "#c4b5fd"], accent: "#e9d5ff", glow: "#f5f3ff", ground: "#1e1033" },
  "clip-chainsaw-man": { sky: ["#450a0a", "#b91c1c", "#f87171"], accent: "#fecaca", glow: "#fff1f2", ground: "#1c0505" },
  "clip-jjk": { sky: ["#0c0a1f", "#3730a3", "#6366f1"], accent: "#818cf8", glow: "#c7d2fe", ground: "#08061a" },
  "clip-spy-family": { sky: ["#1f1230", "#be185d", "#ec4899"], accent: "#f9a8d4", glow: "#fce7f3", ground: "#180c22" },
  "rec-demon-slayer": { sky: ["#042f2e", "#115e59", "#0d9488"], accent: "#5eead4", glow: "#ccfbf1", ground: "#031a18" },
  "rec-frieren": { sky: ["#312e81", "#6366f1", "#a5b4fc"], accent: "#ddd6fe", glow: "#ede9fe", ground: "#1e1b4b" },
  "rec-solo-leveling": { sky: ["#0f172a", "#1d4ed8", "#3b82f6"], accent: "#93c5fd", glow: "#dbeafe", ground: "#0c1222" },
  "rec-vinland-saga": { sky: ["#1c1917", "#44403c", "#78716c"], accent: "#a8a29e", glow: "#e7e5e4", ground: "#0c0a09" },
};

const avatars = {
  "shadow-monarch": { hair: "#1e3a8a", skin: "#c4b5fd", accent: "#3b82f6", eye: "#93c5fd" },
  "mage-archive": { hair: "#f9a8d4", skin: "#fce7f3", accent: "#a855f7", eye: "#e9d5ff" },
  "devil-hunter": { hair: "#ef4444", skin: "#fecaca", accent: "#b91c1c", eye: "#fca5a5" },
  "cursed-energy": { hair: "#f5f5f5", skin: "#e0e7ff", accent: "#6366f1", eye: "#818cf8" },
  "forger-family": { hair: "#f472b6", skin: "#fce7f3", accent: "#ec4899", eye: "#fbcfe8" },
};

function sceneSvg(id, w, h) {
  const p = palettes[id];
  const cx = w * 0.5;
  const charX = w * 0.52;
  const moonX = w * 0.78;
  const moonY = h * 0.18;
  const moonR = Math.min(w, h) * 0.09;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" fill="none">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${p.sky[0]}"/>
      <stop offset="45%" stop-color="${p.sky[1]}"/>
      <stop offset="100%" stop-color="${p.sky[2]}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="70%" r="55%">
      <stop offset="0%" stop-color="${p.glow}" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="${p.accent}" stop-opacity="0"/>
    </radialGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="8"/></filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#sky)"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  <!-- stars -->
  ${Array.from({ length: 28 }, (_, i) => {
    const x = ((i * 47 + id.length * 13) % 97) / 100 * w;
    const y = ((i * 31 + 7) % 55) / 100 * h * 0.55;
    const r = (i % 3) * 0.4 + 0.6;
    const o = 0.25 + (i % 5) * 0.12;
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="#fff" opacity="${o}"/>`;
  }).join("")}
  <!-- moon / energy orb -->
  <circle cx="${moonX}" cy="${moonY}" r="${moonR * 1.8}" fill="${p.accent}" opacity="0.15" filter="url(#blur)"/>
  <circle cx="${moonX}" cy="${moonY}" r="${moonR}" fill="${p.glow}" opacity="0.9"/>
  <!-- distant mountains -->
  <path d="M0 ${h * 0.62} L${w * 0.2} ${h * 0.48} L${w * 0.38} ${h * 0.58} L${w * 0.55} ${h * 0.42} L${w * 0.72} ${h * 0.55} L${w} ${h * 0.5} L${w} ${h} L0 ${h}Z" fill="${p.ground}" opacity="0.85"/>
  <!-- city / forest silhouette -->
  <path d="M0 ${h * 0.72} ${buildSkyline(id, w, h)} L${w} ${h * 0.72} L${w} ${h} L0 ${h}Z" fill="#000" opacity="0.55"/>
  <!-- speed lines -->
  <g opacity="0.12" stroke="${p.glow}" stroke-width="1.5">
    <line x1="0" y1="${h * 0.35}" x2="${w * 0.35}" y2="${h * 0.38}"/>
    <line x1="0" y1="${h * 0.42}" x2="${w * 0.28}" y2="${h * 0.44}"/>
    <line x1="${w}" y1="${h * 0.3}" x2="${w * 0.65}" y2="${h * 0.33}"/>
  </g>
  <!-- character silhouette -->
  <g transform="translate(${charX - 40} ${h * 0.28})">
    <ellipse cx="40" cy="95" rx="55" ry="18" fill="${p.accent}" opacity="0.35" filter="url(#blur)"/>
    ${characterPaths(id, p)}
  </g>
  <!-- foreground cinematic bars -->
  <rect y="${h - 4}" width="${w}" height="4" fill="${p.accent}" opacity="0.6"/>
  <rect width="${w}" height="3" fill="${p.accent}" opacity="0.35"/>
</svg>`;
}

function buildSkyline(id, w, h) {
  const base = h * 0.72;
  const blocks = [];
  for (let i = 0; i < 12; i++) {
    const x = (i / 12) * w;
    const bw = w / 14;
    const bh = 15 + ((i * 17 + id.length) % 40);
    blocks.push(`L${x + bw} ${base - bh}`);
  }
  return blocks.join(" ");
}

function characterPaths(id, p) {
  const eye = `<circle cx="34" cy="40" r="2.5" fill="${p.glow}"/><circle cx="46" cy="40" r="2.5" fill="${p.glow}"/>`;
  const variants = {
    hero: `<path d="M40 18 C58 2 78 18 70 40 C82 48 88 62 80 78 L84 125 L-4 125 L0 78 C-8 62 0 48 12 40 C4 18 24 2 40 18Z" fill="#08040f"/>
      <path d="M22 16 C28 -4 52 -4 58 16 C50 6 30 6 22 16Z" fill="#140a22"/>
      ${eye}
      <path d="M78 50 L108 38 L114 98 L86 104Z" fill="${p.accent}" opacity="0.75"/>
      <circle cx="95" cy="55" r="18" fill="${p.glow}" opacity="0.2" filter="url(#blur)"/>`,
    "trend-jjk": `<path d="M38 20 C54 6 66 22 62 42 C74 50 78 64 72 80 L74 122 L6 122 L10 80 C4 64 10 50 20 42 C16 22 26 6 38 20Z" fill="#08040f"/>
      <path d="M26 18 C30 2 50 2 54 18 C48 10 32 10 26 18Z" fill="#0f0820"/>${eye}
      <path d="M70 48 L92 40 L96 88 L74 92Z" fill="${p.accent}" opacity="0.6"/>`,
    "trend-demon-slayer": `<path d="M36 24 C50 10 60 26 56 44 C66 52 70 66 64 82 L66 120 L8 120 L12 82 C6 66 12 52 22 44 C18 26 28 12 36 24Z" fill="#041210"/>
      <path d="M24 22 C28 8 46 8 50 22 C44 14 30 14 24 22Z" fill="#062018"/>
      <path d="M8 70 L28 55 L32 100 L12 105Z" fill="${p.accent}" opacity="0.5"/>${eye}`,
    "trend-one-piece": `<path d="M40 22 C56 8 64 24 60 42 C72 48 76 62 70 78 L72 118 L10 118 L14 78 C8 62 14 48 24 42 C20 24 30 10 40 22Z" fill="#0a1520"/>
      <path d="M30 12 C34 -2 54 6 58 22 C52 14 36 8 30 12Z" fill="#0c1a2e"/>
      <ellipse cx="52" cy="28" rx="14" ry="6" fill="${p.accent}" opacity="0.7"/>${eye}`,
    "trend-solo-leveling": `<path d="M38 18 C56 4 70 20 66 40 C78 48 82 64 76 82 L78 124 L2 124 L6 82 C0 64 6 48 18 40 C14 18 28 4 38 18Z" fill="#030712"/>
      ${eye}
      <path d="M0 60 L40 40 L44 110 L8 115Z" fill="${p.accent}" opacity="0.35"/>
      <path d="M60 55 L100 35 L104 105 L64 110Z" fill="${p.glow}" opacity="0.25"/>`,
    "trend-frieren": `<path d="M40 24 C52 12 58 28 54 46 C64 54 68 68 62 84 L64 118 L16 118 L18 84 C12 68 16 54 26 46 C22 28 30 14 40 24Z" fill="#1a1028"/>
      <path d="M28 20 C32 6 50 6 54 20 C48 14 34 14 28 20Z" fill="#2a1a3d"/>
      <path d="M20 50 L8 90 L32 95 L36 55Z" fill="${p.accent}" opacity="0.4"/>${eye}`,
    "trend-chainsaw-man": `<path d="M36 22 C52 8 62 24 58 42 C70 50 74 66 68 82 L70 120 L6 120 L10 82 C4 66 10 50 20 42 C16 24 26 10 36 22Z" fill="#140606"/>
      <path d="M50 30 L75 20 L80 50 L55 55Z" fill="${p.accent}" opacity="0.8"/>
      <path d="M10 65 L0 95 L20 100 L24 70Z" fill="${p.glow}" opacity="0.5"/>${eye}`,
    "comm-naruto": `<path d="M38 30 C52 18 58 34 54 50 C64 58 68 72 62 86 L64 110 L14 110 L16 86 C10 72 14 58 24 50 C20 34 28 22 38 30Z" fill="#1a0f06"/>
      <circle cx="40" cy="32" r="12" fill="${p.accent}" opacity="0.25"/>${eye}`,
    default: `<path d="M38 22 C52 8 62 20 58 38 C68 44 74 58 68 72 L70 118 L10 118 L12 72 C6 58 12 44 22 38 C18 20 28 8 38 22Z" fill="#0a0614"/>
      <path d="M28 20 C32 4 48 4 52 20 C46 12 34 12 28 20Z" fill="#12081f"/>${eye}`,
  };
  return variants[id] || variants.default;
}

function avatarSvg(id, colors) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${colors.accent}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#020208"/>
    </linearGradient>
  </defs>
  <rect width="80" height="80" rx="40" fill="url(#bg)"/>
  <circle cx="40" cy="40" r="36" fill="#0a0812" stroke="${colors.accent}" stroke-width="2" opacity="0.9"/>
  <!-- illustrated face -->
  <ellipse cx="40" cy="48" rx="18" ry="20" fill="${colors.skin}"/>
  <path d="M22 38 C28 18 52 18 58 38 C50 28 30 28 22 38Z" fill="${colors.hair}"/>
  <path d="M18 42 C20 55 30 62 40 62 C50 62 60 55 62 42" fill="${colors.hair}" opacity="0.85"/>
  <ellipse cx="33" cy="46" rx="3" ry="4" fill="${colors.eye}"/>
  <ellipse cx="47" cy="46" rx="3" ry="4" fill="${colors.eye}"/>
  <path d="M34 54 Q40 58 46 54" stroke="${colors.accent}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <circle cx="40" cy="30" r="2" fill="${colors.glow || colors.eye}" opacity="0.8"/>
</svg>`;
}

const scenes = [
  ["hero", 400, 560],
  ["trend-jjk", 320, 480],
  ["trend-demon-slayer", 320, 480],
  ["trend-one-piece", 320, 480],
  ["trend-solo-leveling", 320, 480],
  ["trend-frieren", 320, 480],
  ["trend-chainsaw-man", 320, 480],
  ["comm-naruto", 400, 280],
  ["comm-bleach", 400, 280],
  ["comm-demon-slayer", 400, 280],
  ["comm-one-piece", 400, 280],
  ["comm-jjk", 400, 280],
  ["clip-solo-leveling", 400, 600],
  ["clip-frieren", 400, 600],
  ["clip-chainsaw-man", 400, 600],
  ["clip-jjk", 400, 600],
  ["clip-spy-family", 400, 600],
  ["rec-demon-slayer", 600, 340],
  ["rec-frieren", 600, 340],
  ["rec-solo-leveling", 600, 340],
  ["rec-vinland-saga", 600, 340],
];

await mkdir(join(root, "scenes"), { recursive: true });
await mkdir(join(root, "avatars"), { recursive: true });

for (const [id, w, h] of scenes) {
  await writeFile(join(root, "scenes", `${id}.svg`), sceneSvg(id, w, h));
}

for (const [id, colors] of Object.entries(avatars)) {
  await writeFile(join(root, "avatars", `${id}.svg`), avatarSvg(id, colors));
}

console.log(`Generated ${scenes.length} scenes and ${Object.keys(avatars).length} avatars.`);

import type { CommunitySlug } from "./registry";
import type { CommunityThreadCategory } from "./types";

export type CommunityThreadTemplate = {
  category: CommunityThreadCategory;
  title: string;
  excerpt: string;
  pinned?: boolean;
  hot?: boolean;
  hasSpoilers?: boolean;
  spoilerScope?: string;
  episodeLabel?: string;
};

export const FEATURED_COMMUNITY_DISCUSSIONS: Record<
  CommunitySlug,
  CommunityThreadTemplate[]
> = {
  naruto: [
    {
      category: "trending",
      title: "Weekly Naruto discussion megathread",
      excerpt:
        "Shinobi rankings, Boruto discourse, and filler survival guides — one thread for the whole village.",
      pinned: true,
      hot: true,
    },
    {
      category: "episode",
      title: "Episode reaction: Pain arc rewatch broke me again",
      excerpt:
        "That rain scene + soundtrack combo. Who else paused it just to breathe?",
      episodeLabel: "Pain arc",
      hot: true,
    },
    {
      category: "theory",
      title: "Theory: Itachi's plan was visible in the chūnin exam backgrounds",
      excerpt:
        "Freeze-frame the stadium crowd in ep 30. I think Kishimoto left a clue years early.",
    },
    {
      category: "theory",
      title: "Akatsuki tier list — defend your pick with evidence",
      excerpt:
        "S-rank rogue bingo card inside. No 'because cool' answers.",
      hot: true,
    },
    {
      category: "episode",
      title: "Boruto episode live reaction thread",
      excerpt:
        "Timestamp your hype spikes. Anime-onlies welcome — spoiler tags in replies.",
      episodeLabel: "Boruto latest",
    },
    {
      category: "discussion",
      title: "Best arc to convert a friend who never watched?",
      excerpt: "Land vs. classic order debate — what's your hook episode?",
    },
    {
      category: "manga",
      title: "Manga readers — ask anything (spoiler-free lane)",
      excerpt: "Anime-only questions about pacing and canon only.",
    },
    {
      category: "trending",
      title: "Naruto run clips — Fan Edit Friday",
      excerpt: "Drop AMVs and parkour memes. Community vote for clip of the week.",
    },
  ],
  "one-piece": [
    {
      category: "trending",
      title: "Grand Line weekly megathread — Final Saga edition",
      excerpt:
        "Chapter theories, bounty predictions, and crew roster debates in one port of call.",
      pinned: true,
      hot: true,
    },
    {
      category: "theory",
      title: "Theory: Blackbeard's third devil fruit clue in Jaya",
      excerpt:
        "Re-read the sky island foreshadowing. Panel comparison thread inside.",
      hot: true,
    },
    {
      category: "episode",
      title: "Episode reaction: Gear 5 animation had me screaming",
      excerpt:
        "MAPPA/Ufotable discourse aside — that reveal landing was cinema.",
      episodeLabel: "Gear 5",
      hot: true,
    },
    {
      category: "manga",
      title: "Chapter discussion — FULL SPOILERS",
      excerpt:
        "Anime-onlies turn back. We're unpacking the latest chapter and endgame implications.",
      hasSpoilers: true,
      spoilerScope: "Manga latest",
    },
    {
      category: "theory",
      title: "Who's joining the final war? Fleet composition chart",
      excerpt: "Spreadsheet warriors assemble. Alliances and wild cards welcome.",
    },
    {
      category: "episode",
      title: "Egghead arc rewatch party — episode reactions",
      excerpt: "Sync watch tonight. Drop timestamps for peak panels.",
      episodeLabel: "Egghead",
    },
    {
      category: "discussion",
      title: "Fillers worth watching or straight manga route?",
      excerpt: "Friend wants the fastest path to Marineford-level hype.",
    },
    {
      category: "trending",
      title: "Bounty Friday — predict the next poster",
      excerpt: "Beli amounts only. Wrong takes encouraged.",
    },
  ],
  bleach: [
    {
      category: "trending",
      title: "TYBW watch party megathread",
      excerpt:
        "Thousand-Year Blood War episode reactions, Bankai reveals, and Soul Society lore.",
      pinned: true,
      hot: true,
    },
    {
      category: "episode",
      title: "Episode reaction: that Bankai reveal broke the timeline",
      excerpt:
        "Sound design + sakuga + Twitter meltdown. Share your reaction clips.",
      episodeLabel: "TYBW",
      hot: true,
    },
    {
      category: "theory",
      title: "Theory: Aizen's plan accounted for the original Gotei 13",
      excerpt:
        "TYBW flashbacks changed my read on the hypnosis arc. Fight me politely.",
    },
    {
      category: "theory",
      title: "Espada ranking vs. Sternritter — who wins?",
      excerpt: "Power scaling court is in session. Bring manga citations.",
      hot: true,
    },
    {
      category: "episode",
      title: "Classic Bleach nostalgia — episode 54 reactions",
      excerpt: "Soul Society arc rewatch crew checking in. Chad energy only.",
      episodeLabel: "Ep. 54",
    },
    {
      category: "discussion",
      title: "Skip filler list for TYBW newcomers?",
      excerpt: "Curated arc order for friends jumping in for the blood war.",
    },
    {
      category: "manga",
      title: "Manga ending discourse (respectful zone)",
      excerpt: "How we feel about the finale years later — no toxicity.",
    },
    {
      category: "trending",
      title: "Kubo art appreciation thread",
      excerpt: "Panel layouts and double spreads that still go hard.",
    },
  ],
  "jujutsu-kaisen": [
    {
      category: "trending",
      title: "JJK weekly discussion — cursed energy central",
      excerpt:
        "Gojo edits, domain battles, MAPPA sakuga, and manga chapter megathreads.",
      pinned: true,
      hot: true,
    },
    {
      category: "episode",
      title: "Episode reaction: domain expansion episode was insane",
      excerpt:
        "Frame-by-frame the animation at the climax. Who else rewatched three times?",
      episodeLabel: "Latest ep",
      hot: true,
    },
    {
      category: "theory",
      title: "Theory: Kenjaku's endgame ties to Heian-era sorcerers",
      excerpt:
        "Historical lore thread with chapter refs. Anime-onlies beware mild spoilers.",
    },
    {
      category: "theory",
      title: "Gojo vs Sukuna — who actually wins at full power?",
      excerpt:
        "Domain math, infinity rules, and cope copium in one thread.",
      hot: true,
    },
    {
      category: "manga",
      title: "Manga chapter megathread — SPOILERS",
      excerpt:
        "Full chapter breakdown. Use tags in replies for anime-only friends.",
      hasSpoilers: true,
      spoilerScope: "Manga latest",
    },
    {
      category: "episode",
      title: "Shibuya arc rewatch — live reaction timestamps",
      excerpt: "Weekly rewatch crew. Drop your peak suffering moments.",
      episodeLabel: "Shibuya",
    },
    {
      category: "discussion",
      title: "Best entry point for a friend — movie or Season 1?",
      excerpt: "Conversion strategies for JJK skeptics.",
    },
    {
      category: "trending",
      title: "Domain expansion sound design appreciation",
      excerpt: "Share clips where the audio made the scene legendary.",
    },
  ],
  "demon-slayer": [
    {
      category: "trending",
      title: "Hashira training arc megathread",
      excerpt: "Breathing styles, Ufotable worship, and Infinity Castle theories.",
      pinned: true,
      hot: true,
    },
    {
      category: "episode",
      title: "Episode reaction: Upper Moon fight sakuga",
      excerpt: "The frames at 14:22 — who has the breakdown thread?",
      episodeLabel: "Latest ep",
      hot: true,
    },
    {
      category: "theory",
      title: "Theory: Sun breathing connects to the first demon slayer",
      excerpt: "Manga readers only — lineage chart inside.",
    },
    {
      category: "theory",
      title: "Hashira tier list — defend with feats",
      excerpt: "No 'because favorite' votes. Evidence required.",
      hot: true,
    },
    {
      category: "episode",
      title: "Mugen Train rewatch reactions",
      excerpt: "Movie night thread. Tissues recommended.",
      episodeLabel: "Movie",
    },
    {
      category: "discussion",
      title: "Figure drops and merch alerts",
      excerpt: "Hashira nendoroids and statue pre-orders.",
    },
    {
      category: "manga",
      title: "Infinity Castle arc — spoiler discussion",
      excerpt: "Manga readers unpack the latest chapters.",
      hasSpoilers: true,
      spoilerScope: "Manga",
    },
    {
      category: "trending",
      title: "Nezuko moments compilation thread",
      excerpt: "Wholesome clips only. No debate, just vibes.",
    },
  ],
};

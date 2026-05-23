import type { SeedKind } from "./types";

export type TemplatePair = { title: string; body: string };

function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? "");
}

export function applyTemplate(
  pair: TemplatePair,
  vars: Record<string, string>,
): TemplatePair {
  return {
    title: fill(pair.title, vars),
    body: fill(pair.body, vars),
  };
}

const DISCUSSION_PROMPTS: TemplatePair[] = [
  {
    title: "Starter thread: what hooked you on {{anime}}?",
    body: "Drop the scene, OP, or character that made {{anime}} click for you. No manga spoilers — anime-only fans welcome.",
  },
  {
    title: "Rewatch club: does {{anime}} hit different on a second pass?",
    body: "Planning a rewatch of {{anime}} this week. What episodes are mandatory, and what filler can we skip without sin?",
  },
  {
    title: "{{community}} check-in — where is everyone in {{anime}}?",
    body: "Catch-up thread for {{community}}. Tell us your episode, your hot character, and one thing the dub/sub changed for you.",
  },
  {
    title: "Soundtrack appreciation post for {{anime}}",
    body: "Which OST or insert song from {{anime}} lives rent-free in your head? Link clips if you want — let's build a playlist.",
  },
  {
    title: "Fight choreography in {{anime}} — peak or mid?",
    body: "Compare your favorite sakuga moments in {{anime}}. Studio flex, sakuga twitter clips, and \"they were cooking\" timestamps encouraged.",
  },
];

const EPISODE_THREADS: TemplatePair[] = [
  {
    title: "Episode {{episode}} live reactions — {{anime}}",
    body: "Fresh episode chat for {{anime}} Ep. {{episode}}. React in real time, GIFs welcome. Mark manga spoilers clearly if you must.",
  },
  {
    title: "Ep. {{episode}} discussion: did the pacing land?",
    body: "Weekly watch thread for {{anime}} episode {{episode}}. What worked, what felt rushed, and did the ending stick the landing?",
  },
  {
    title: "{{anime}} Ep. {{episode}} — theory zone (anime-only)",
    body: "Episode {{episode}} just dropped. Anime-only theories here — save manga leaks for spoiler-tagged replies.",
  },
];

const HOT_TAKES: TemplatePair[] = [
  {
    title: "Hot take: {{anime}} is carried by its side cast",
    body: "Fight me respectfully. Which supporting character in {{anime}} is secretly the real protagonist energy?",
  },
  {
    title: "Unpopular opinion — {{anime}} vs the rest of {{genres}}",
    body: "Hot take hour: {{anime}} doesn't get enough credit in {{genres}} conversations. Change my mind with receipts, not insults.",
  },
  {
    title: "The {{anime}} fanbase is sleeping on this detail",
    body: "Drop a lore bit, visual metaphor, or adaptation choice in {{anime}} that deserves more hype. Keep it civil, keep it spicy.",
  },
  {
    title: "Controversial: skip the first arc of {{anime}}?",
    body: "Would you recommend a newcomer start {{anime}} at episode 1 or jump later? Defend your gateway episode.",
  },
];

const TRENDING_RECS: TemplatePair[] = [
  {
    title: "If you liked {{anime}}, queue these next",
    body: "Trending rec post: name 1–3 series with similar vibes to {{anime}} ({{genres}}). Explain the hook in one sentence each.",
  },
  {
    title: "Weekend binge pick: {{anime}} (+ friends)",
    body: "KuroVerse trending pick — {{anime}} is blowing up. What do you pair it with for a weekend marathon?",
  },
  {
    title: "{{anime}} is climbing the charts — why now?",
    body: "Something clicked for {{anime}} this week. Clips, memes, or a banger episode? Share why new fans should start now.",
  },
];

const FEATURED_DROPS: TemplatePair[] = [
  {
    title: "Featured today on KuroVerse: {{anime}}",
    body: "{{tagline}} Jump into {{community}} for today's spotlight — watch parties, rec threads, and fresh episode chat.",
  },
];

export const AI_SUMMARY_BODIES: string[] = [
  "{{anime}} fandom pulse: threads are buzzing about episode {{episode}} pacing, soundtrack moments, and which arc deserves a rewatch. {{rating}} average on AniList — {{status}}.",
  "Today's {{community}} vibe: fans are trading rewatch routes, debating adaptation choices, and hyping side characters. Perfect entry point if you're new to {{anime}}.",
  "Quick catch-up for {{anime}} — most active topics are live reactions, spoiler-tagged theories, and \"what do I watch after this\" lists. Drop your take below.",
];

export const TEMPLATE_SETS: Record<SeedKind, TemplatePair[]> = {
  discussion_prompt: DISCUSSION_PROMPTS,
  episode_thread: EPISODE_THREADS,
  hot_take: HOT_TAKES,
  trending_rec: TRENDING_RECS,
  featured_drop: FEATURED_DROPS,
  ai_summary: [
    {
      title: "Fandom briefing: {{anime}} ({{community}})",
      body: AI_SUMMARY_BODIES[0],
    },
  ],
};

export function pickTemplate(kind: SeedKind, seed: number): TemplatePair {
  const set = TEMPLATE_SETS[kind];
  return set[seed % set.length];
}

export const FEATURED_TAGLINES: string[] = [
  "Today's spotlight — the hub is heating up.",
  "Staff pick: dive into the community before the timeline moves on.",
  "Your daily dose of peak {{genres}} energy.",
  "Featured on KuroVerse — threads, reactions, and recs waiting.",
];

import type { SeedContext } from "./types";
import { contextVars } from "./context";
import { AI_SUMMARY_BODIES, applyTemplate } from "./templates";

async function fetchOpenAiSummary(ctx: SeedContext): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.85,
        max_tokens: 220,
        messages: [
          {
            role: "system",
            content:
              "You write short anime fandom community briefings for KuroVerse. Sound like Discord/Twitter anime fans — hype but not cringe. No manga spoilers. 2-3 sentences max.",
          },
          {
            role: "user",
            content: `Brief the ${ctx.communityTitle} hub on ${ctx.animeTitle} (${ctx.genres}). Status: ${ctx.status}. AniList score: ${ctx.rating}. Episode chatter around ep ${ctx.episode}.`,
          },
        ],
      }),
    });

    if (!res.ok) return null;

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = json.choices?.[0]?.message?.content?.trim();
    return text || null;
  } catch {
    return null;
  }
}

export async function buildAiSummary(
  ctx: SeedContext,
  useAi: boolean,
): Promise<{ title: string; body: string }> {
  const title = `Fandom briefing: ${ctx.animeTitle}`;
  const templateBody = AI_SUMMARY_BODIES[ctx.animeId % AI_SUMMARY_BODIES.length];
  const fallback = applyTemplate({ title, body: templateBody }, contextVars(ctx)).body;

  if (!useAi) {
    return { title, body: fallback };
  }

  const aiBody = await fetchOpenAiSummary(ctx);
  return { title, body: aiBody ?? fallback };
}

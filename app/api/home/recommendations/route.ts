import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/session";
import { getPersonalizedRecommendations } from "@/lib/home/personalized";
import { getRecommendationsFeedPage } from "@/lib/feeds/recommendations";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
  const user = await getUser();

  if (user) {
    const data = await getPersonalizedRecommendations(user.id, page);
    return NextResponse.json(data);
  }

  const fallback = await getRecommendationsFeedPage(page, 6);
  return NextResponse.json({
    items: fallback.items,
    page: fallback.page,
    hasMore: fallback.hasMore,
    label: "Top picks",
  });
}

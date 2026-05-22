import { NextResponse } from "next/server";
import { getRecommendationsFeedPage } from "@/lib/feeds/recommendations";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
  const data = await getRecommendationsFeedPage(page);
  return NextResponse.json(data);
}

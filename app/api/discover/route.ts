import { NextResponse } from "next/server";
import { getDiscoverFeedPage } from "@/lib/discover/feed";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);

  const data = await getDiscoverFeedPage(page);
  return NextResponse.json(data);
}

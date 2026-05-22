import { NextResponse } from "next/server";
import { getHomeClipsFeedPage } from "@/lib/feeds/clips";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
  const data = await getHomeClipsFeedPage(page);
  return NextResponse.json(data);
}

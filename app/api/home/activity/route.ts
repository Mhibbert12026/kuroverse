import { NextResponse } from "next/server";
import { getHomeActivityPage } from "@/lib/home/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);

  const data = await getHomeActivityPage(page);
  return NextResponse.json(data);
}

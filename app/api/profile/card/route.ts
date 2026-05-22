import { NextResponse } from "next/server";
import { getProfileCardByUserId, getProfileCardByUsername } from "@/lib/profile/card";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  const userId = searchParams.get("id");

  if (username) {
    const card = await getProfileCardByUsername(username);
    if (!card) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(card);
  }

  if (userId) {
    const card = await getProfileCardByUserId(userId);
    if (!card) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(card);
  }

  return NextResponse.json({ error: "Missing username or id" }, { status: 400 });
}

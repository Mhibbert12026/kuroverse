import { NextResponse } from "next/server";
import { getDailyFeatured } from "@/lib/seeding/featured";

export async function GET() {
  const featured = await getDailyFeatured();
  return NextResponse.json({ featured });
}

import { NextResponse } from "next/server";
import { getHomeLiveSnapshot } from "@/lib/home/queries";

export async function GET() {
  const data = await getHomeLiveSnapshot();
  return NextResponse.json(data);
}

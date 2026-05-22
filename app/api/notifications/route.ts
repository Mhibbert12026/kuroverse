import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/session";
import { getNotificationsForUser } from "@/lib/notifications/queries";
import { markNotificationsReadAction } from "@/lib/notifications/actions";

export async function GET(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ items: [], unreadCount: 0 }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(60, Math.max(1, Number(searchParams.get("limit") ?? 40) || 40));

  const payload = await getNotificationsForUser(user.id, limit);
  return NextResponse.json(payload);
}

export async function PATCH(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: { ids?: string[]; all?: boolean } = {};
  try {
    body = (await request.json()) as { ids?: string[]; all?: boolean };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const result = body.all
    ? await markNotificationsReadAction()
    : await markNotificationsReadAction(body.ids);

  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result);
}

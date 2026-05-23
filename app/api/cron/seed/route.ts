import { NextResponse } from "next/server";
import { getCronSecret } from "@/lib/supabase/admin";
import { runSeedEngine, shouldRunScheduledSeed } from "@/lib/seeding/runner";

export async function GET(request: Request) {
  const secret = getCronSecret();
  const auth = request.headers.get("authorization");
  const bearer = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!secret || bearer !== secret) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const due = await shouldRunScheduledSeed();
  if (!due) {
    return NextResponse.json({ ok: true, skipped: true, reason: "Not due yet" });
  }

  const result = await runSeedEngine({ triggeredBy: "cron", actorId: null, force: false });

  if (!result.ok) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result);
}

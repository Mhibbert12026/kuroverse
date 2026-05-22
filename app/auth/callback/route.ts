import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/auth/session";
import { getSiteUrl } from "@/lib/supabase/env";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const siteUrl = getSiteUrl();
  const redirectBase = siteUrl || origin;

  if (!code) {
    return NextResponse.redirect(`${redirectBase}/?auth=error`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${redirectBase}/?auth=error&message=link`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await ensureProfile(user);
  }

  return NextResponse.redirect(`${redirectBase}${next}`);
}

import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth/session";
import { requireUser } from "@/lib/auth/require-user";
import { needsProfileOnboarding } from "@/lib/auth/profile";

/** Authenticated entry point — forwards to public profile URL or home for onboarding. */
export default async function ProfilePage() {
  const user = await requireUser("/profile");
  const profile = await getProfile(user.id);

  if (profile?.username && !needsProfileOnboarding(profile)) {
    redirect(`/u/${profile.username}`);
  }

  redirect("/");
}

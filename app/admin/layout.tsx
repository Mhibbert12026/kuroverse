import { redirect } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/app/components/layout/AppShell";
import { isModerator } from "@/lib/seeding/admin";
import { getUser } from "@/lib/auth/session";
import { pageTitle } from "@/lib/brand";

export const metadata = {
  title: pageTitle("Moderator"),
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) redirect("/?auth=sign-in");

  const allowed = await isModerator(user.id, user.email);
  if (!allowed) redirect("/");

  return (
    <AppShell mainMax="narrow" mainClassName="lg:max-w-3xl">
      <nav className="admin-subnav" aria-label="Moderator">
        <Link href="/admin/seed" className="admin-subnav__link">
          Content seeding
        </Link>
        <Link href="/" className="admin-subnav__link admin-subnav__link--muted">
          ← Back to KuroVerse
        </Link>
      </nav>
      {children}
    </AppShell>
  );
}

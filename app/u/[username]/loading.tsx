import { AppShell } from "@/app/components/layout/AppShell";

export default function ProfileLoading() {
  return (
    <AppShell ambience="profile" mainMax="narrow" mainClassName="profile-page-main lg:max-w-4xl">
      <div className="profile-skeleton" aria-busy aria-label="Loading profile">
        <div className="profile-skeleton__hero" />
        <div className="profile-skeleton__stats" />
        <div className="profile-skeleton__line profile-skeleton__line--wide" />
        <div className="profile-skeleton__grid" />
        <div className="profile-skeleton__panel" />
      </div>
    </AppShell>
  );
}

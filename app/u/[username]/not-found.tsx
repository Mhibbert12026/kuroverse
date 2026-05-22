import Link from "next/link";
import { TopNav } from "@/app/components/TopNav";

export default function ProfileNotFound() {
  return (
    <div className="film-grain relative min-h-screen bg-background">
      <TopNav />
      <main className="relative z-10 mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 pt-20 text-center sm:pt-24">
        <p className="font-display text-2xl font-bold text-white sm:text-3xl">Profile not found</p>
        <p className="mt-3 text-sm text-white/50">
          That username does not exist or has not finished setup yet.
        </p>
        <Link
          href="/"
          className="mt-8 rounded-full bg-gradient-to-r from-accent-orange to-accent-pink px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(255,90,31,0.35)]"
        >
          Back to home
        </Link>
      </main>
    </div>
  );
}

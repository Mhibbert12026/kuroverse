import type { Metadata } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import { Suspense } from "react";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { AuthRedirectHandler } from "@/app/components/auth/AuthRedirectHandler";
import { MobileChrome } from "@/app/components/layout/MobileChrome";
import { getUser, ensureProfile, getProfile } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { PLATFORM_NAME, PLATFORM_TAGLINE, PLATFORM_TITLE } from "@/lib/brand";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: PLATFORM_TITLE,
    template: `%s · ${PLATFORM_NAME}`,
  },
  description: `${PLATFORM_NAME} — Discover trending anime clips, join fandom communities, and get personalized recommendations on ${PLATFORM_TAGLINE.toLowerCase()}.`,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let initialUser = null;
  let initialProfile = null;

  if (isSupabaseConfigured()) {
    const user = await getUser();
    if (user) {
      initialUser = user;
      initialProfile = (await getProfile(user.id)) ?? (await ensureProfile(user));
    }
  }

  return (
    <html lang="en" className={`${outfit.variable} ${spaceGrotesk.variable} h-full`}>
      <body className="min-h-full antialiased">
        <AuthProvider initialUser={initialUser} initialProfile={initialProfile}>
          <Suspense fallback={null}>
            <AuthRedirectHandler />
          </Suspense>
          {children}
          <MobileChrome />
        </AuthProvider>
      </body>
    </html>
  );
}

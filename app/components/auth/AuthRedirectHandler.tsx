"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";

/**
 * Opens the auth modal when middleware redirects with ?auth=required&next=...
 * and sends the user to `next` after a successful sign-in.
 */
export function AuthRedirectHandler() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { openAuth, user, authReady, returnTo, clearReturnTo } = useAuth();
  const handledRequired = useRef(false);
  const handledPostSignIn = useRef(false);

  useEffect(() => {
    const auth = params.get("auth");
    const next = params.get("next");

    if (auth === "error") {
      openAuth("sign-in");
      return;
    }

    if (auth === "required" && next && !handledRequired.current) {
      handledRequired.current = true;
      openAuth("sign-in", next);
      const url = new URL(window.location.href);
      url.searchParams.delete("auth");
      url.searchParams.delete("next");
      router.replace(url.pathname + (url.search || ""));
    }
  }, [params, openAuth, router]);

  useEffect(() => {
    if (!authReady || !user || handledPostSignIn.current) return;
    if (!returnTo?.startsWith("/")) return;

    handledPostSignIn.current = true;
    const target = returnTo;
    clearReturnTo();
    router.push(target);
    router.refresh();
  }, [authReady, user, returnTo, clearReturnTo, router]);

  useEffect(() => {
    if (!user) {
      handledPostSignIn.current = false;
    }
  }, [user]);

  useEffect(() => {
    handledRequired.current = false;
  }, [pathname]);

  return null;
}

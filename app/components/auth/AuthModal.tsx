"use client";

import { useEffect, useId, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getSiteUrl } from "@/lib/supabase/env";
import { PLATFORM_NAME } from "@/lib/brand";
import { useAuth } from "@/app/providers/AuthProvider";
import type { AuthView } from "@/lib/auth/types";

type Step = "form" | "success";

function authErrorMessage(code: string | null): string {
  switch (code) {
    case "email":
      return "That sign-in link expired or is invalid. Request a new magic link.";
    case "link":
      return "We could not complete sign-in from that link. Try again.";
    default:
      return "Something went wrong with sign-in. Please try again.";
  }
}

export function AuthModal() {
  const { authOpen, authView, closeAuth, openAuth } = useAuth();
  const searchParams = useSearchParams();
  const titleId = useId();
  const [view, setView] = useState<AuthView>(authView);
  const [step, setStep] = useState<Step>("form");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();
  const siteUrl = getSiteUrl();

  useEffect(() => {
    if (authOpen) setView(authView);
  }, [authOpen, authView]);

  useEffect(() => {
    if (!authOpen) {
      setStep("form");
      setEmail("");
      setError(null);
      return;
    }

    if (searchParams.get("auth") === "error") {
      setStep("form");
      setError(authErrorMessage(searchParams.get("message")));
    }
  }, [authOpen, searchParams]);

  useEffect(() => {
    if (!authOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [authOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && authOpen) closeAuth();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [authOpen, closeAuth]);

  const resetFeedback = () => setError(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFeedback();
    setBusy(true);

    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback?next=/`,
          shouldCreateUser: view === "sign-up",
        },
      });
      if (otpError) throw otpError;
      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleResend = async () => {
    resetFeedback();
    setBusy(true);
    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback?next=/`,
          shouldCreateUser: view === "sign-up",
        },
      });
      if (otpError) throw otpError;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not resend the link. Try again.");
    } finally {
      setBusy(false);
    }
  };

  if (!authOpen) return null;

  const isSuccess = step === "success";

  return (
    <div className="auth-modal" role="presentation" onClick={closeAuth}>
      <div
        className="auth-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="auth-modal__handle" aria-hidden />
        <button type="button" className="auth-modal__close" onClick={closeAuth} aria-label="Close">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="auth-modal__glow" aria-hidden />

        <header className="auth-modal__header">
          <p className="auth-modal__brand">{PLATFORM_NAME}</p>
          <h2 id={titleId} className="auth-modal__title">
            {isSuccess
              ? "Check your inbox"
              : view === "sign-in"
                ? "Welcome back"
                : "Join the fandom"}
          </h2>
          <p className="auth-modal__subtitle">
            {isSuccess
              ? `We sent a secure sign-in link to ${email}. Open it on this device to continue.`
              : view === "sign-in"
                ? "Enter your email and we'll send you a magic link to sign in."
                : "Enter your email and we'll send you a magic link to create your account."}
          </p>
        </header>

        {!isSuccess ? (
          <>
            <div className="auth-modal__tabs">
              <button
                type="button"
                className={`auth-modal__tab ${view === "sign-in" ? "auth-modal__tab--active" : ""}`}
                onClick={() => {
                  setView("sign-in");
                  resetFeedback();
                }}
              >
                Sign in
              </button>
              <button
                type="button"
                className={`auth-modal__tab ${view === "sign-up" ? "auth-modal__tab--active" : ""}`}
                onClick={() => {
                  setView("sign-up");
                  resetFeedback();
                }}
              >
                Sign up
              </button>
            </div>

            <form className="auth-modal__form" onSubmit={handleEmailSubmit}>
              <label className="auth-field">
                <span className="auth-field__label">Email</span>
                <input
                  type="email"
                  className="auth-field__input"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={busy}
                />
              </label>

              {error ? (
                <p className="auth-modal__feedback auth-modal__feedback--error" role="alert">
                  {error}
                </p>
              ) : null}

              <button type="submit" className="auth-modal__submit" disabled={busy}>
                {busy ? (
                  <span className="auth-modal__submit-inner">
                    <span className="auth-modal__spinner" aria-hidden />
                    Sending link…
                  </span>
                ) : (
                  "Send magic link"
                )}
              </button>
            </form>

            <p className="auth-modal__footer">
              {view === "sign-in" ? (
                <>
                  New to {PLATFORM_NAME}?{" "}
                  <button type="button" className="auth-modal__link" onClick={() => openAuth("sign-up")}>
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button type="button" className="auth-modal__link" onClick={() => openAuth("sign-in")}>
                    Sign in
                  </button>
                </>
              )}
            </p>
          </>
        ) : (
          <div className="auth-modal__form">
            <p className="auth-modal__feedback auth-modal__feedback--success" role="status">
              Magic link sent. The email may take a minute to arrive — check spam if you do not see it.
            </p>

            {error ? (
              <p className="auth-modal__feedback auth-modal__feedback--error" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="button"
              className="auth-modal__submit"
              disabled={busy}
              onClick={handleResend}
            >
              {busy ? (
                <span className="auth-modal__submit-inner">
                  <span className="auth-modal__spinner" aria-hidden />
                  Resending…
                </span>
              ) : (
                "Resend magic link"
              )}
            </button>

            <button
              type="button"
              className="auth-modal__link auth-modal__link--block"
              onClick={() => {
                setStep("form");
                resetFeedback();
              }}
            >
              Use a different email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

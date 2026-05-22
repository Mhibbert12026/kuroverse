"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseUrl } from "@/lib/supabase/env";
import { PLATFORM_NAME } from "@/lib/brand";
import { useAuth } from "@/app/providers/AuthProvider";
import { completeOnboardingAction } from "@/lib/profile/actions";
import { AVATAR_BUCKET, avatarObjectPath, publicAvatarUrl, validateAvatarFile } from "@/lib/profile/avatar";
import { normalizeUsername, validateUsername } from "@/lib/profile/username";
import { ProfileAvatar } from "./ProfileAvatar";

export function ProfileOnboardingModal() {
  const router = useRouter();
  const { user, profile, refreshProfile } = useAuth();
  const titleId = useId();
  const supabase = createClient();
  const supabaseUrl = getSupabaseUrl();

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [favoriteAnime, setFavoriteAnime] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatar_url ?? null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usernameHint, setUsernameHint] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.display_name ?? user?.email?.split("@")[0] ?? "");
    setAvatarPreview(profile.avatar_url);
  }, [profile, user?.email]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const checkUsername = useCallback(
    async (value: string) => {
      const normalized = normalizeUsername(value);
      const validation = validateUsername(normalized);
      if (validation) {
        setUsernameHint(validation);
        return;
      }
      const { data } = await supabase.from("profiles").select("id").eq("username", normalized).maybeSingle();
      if (data && data.id !== user?.id) {
        setUsernameHint("That username is taken.");
      } else {
        setUsernameHint(null);
      }
    },
    [supabase, user?.id],
  );

  useEffect(() => {
    if (!username) {
      setUsernameHint(null);
      return;
    }
    const timer = setTimeout(() => {
      void checkUsername(username);
    }, 400);
    return () => clearTimeout(timer);
  }, [username, checkUsername]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validation = validateAvatarFile(file);
    if (validation) {
      setError(validation);
      return;
    }
    setError(null);
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError(null);
    setBusy(true);

    try {
      let avatarUrl = profile?.avatar_url ?? null;

      if (avatarFile) {
        const path = avatarObjectPath(user.id, avatarFile);
        const { error: uploadError } = await supabase.storage.from(AVATAR_BUCKET).upload(path, avatarFile, {
          upsert: true,
          contentType: avatarFile.type,
        });
        if (uploadError) throw uploadError;
        avatarUrl = publicAvatarUrl(supabaseUrl, path);
      }

      const formData = new FormData();
      formData.set("username", username);
      formData.set("display_name", displayName);
      formData.set("bio", bio);
      formData.set("favorite_anime", favoriteAnime);
      if (avatarUrl) formData.set("avatar_url", avatarUrl);

      const result = await completeOnboardingAction(formData);
      if (!result.ok) throw new Error(result.error ?? "Could not save profile.");

      await refreshProfile();
      router.push(`/u/${normalizeUsername(username)}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const displayLabel = displayName || user?.email?.split("@")[0] || "Member";

  return (
    <div className="auth-modal profile-onboarding" role="presentation">
      <div
        className="auth-modal__dialog profile-onboarding__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="auth-modal__handle" aria-hidden />
        <div className="auth-modal__glow" aria-hidden />

        <header className="auth-modal__header">
          <p className="auth-modal__brand">{PLATFORM_NAME}</p>
          <h2 id={titleId} className="auth-modal__title">
            Claim your profile
          </h2>
          <p className="auth-modal__subtitle">
            Pick a username and personalize your fandom card. You can change these later on your profile.
          </p>
        </header>

        <form className="auth-modal__form profile-onboarding__form" onSubmit={handleSubmit}>
          <div className="profile-onboarding__avatar-row">
            <ProfileAvatar src={avatarPreview} name={displayLabel} size="lg" />
            <label className="profile-onboarding__upload">
              <span className="profile-onboarding__upload-btn">Upload avatar</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                onChange={handleAvatarChange}
                disabled={busy}
              />
            </label>
          </div>

          <label className="auth-field">
            <span className="auth-field__label">Username</span>
            <div className="profile-field-prefix">
              <span className="profile-field-prefix__at">@</span>
              <input
                type="text"
                className="auth-field__input profile-field-prefix__input"
                placeholder="shadow_monarch"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                disabled={busy}
                aria-describedby={usernameHint ? "username-hint" : undefined}
              />
            </div>
            {usernameHint ? (
              <span id="username-hint" className="profile-field-hint profile-field-hint--warn">
                {usernameHint}
              </span>
            ) : username ? (
              <span className="profile-field-hint">kuroverse.app/u/{normalizeUsername(username)}</span>
            ) : null}
          </label>

          <label className="auth-field">
            <span className="auth-field__label">Display name</span>
            <input
              type="text"
              className="auth-field__input"
              placeholder="How fans see you"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              autoComplete="name"
              disabled={busy}
            />
          </label>

          <label className="auth-field">
            <span className="auth-field__label">Favorite anime</span>
            <input
              type="text"
              className="auth-field__input"
              placeholder="e.g. Jujutsu Kaisen"
              value={favoriteAnime}
              onChange={(e) => setFavoriteAnime(e.target.value)}
              disabled={busy}
            />
          </label>

          <label className="auth-field">
            <span className="auth-field__label">Bio</span>
            <textarea
              className="auth-field__input profile-field-textarea"
              placeholder="Drop your hottest take in 280 characters…"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={280}
              rows={3}
              disabled={busy}
            />
          </label>

          {error ? (
            <p className="auth-modal__feedback auth-modal__feedback--error" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="auth-modal__submit"
            disabled={busy || Boolean(usernameHint) || !username.trim()}
          >
            {busy ? (
              <span className="auth-modal__submit-inner">
                <span className="auth-modal__spinner" aria-hidden />
                Saving profile…
              </span>
            ) : (
              "Enter KuroVerse"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

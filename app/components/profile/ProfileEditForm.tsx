"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseUrl } from "@/lib/supabase/env";
import { useAuth } from "@/app/providers/AuthProvider";
import type { UserProfile } from "@/lib/auth/types";
import { updateProfileAction } from "@/lib/profile/actions";
import { AVATAR_BUCKET, avatarObjectPath, publicAvatarUrl, validateAvatarFile } from "@/lib/profile/avatar";
import { ProfileAvatar } from "./ProfileAvatar";

type ProfileEditFormProps = {
  profile: UserProfile;
  onSaved?: () => void;
};

export function ProfileEditForm({ profile, onSaved }: ProfileEditFormProps) {
  const { user, refreshProfile } = useAuth();
  const supabase = createClient();
  const supabaseUrl = getSupabaseUrl();

  const [displayName, setDisplayName] = useState(profile.display_name ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [favoriteAnime, setFavoriteAnime] = useState(profile.favorite_anime ?? "");
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar_url);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validation = validateAvatarFile(file);
    if (validation) {
      setError(validation);
      return;
    }
    setError(null);
    setSuccess(false);
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setBusy(true);
    setError(null);
    setSuccess(false);

    try {
      let avatarUrl = profile.avatar_url;

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
      formData.set("display_name", displayName);
      formData.set("bio", bio);
      formData.set("favorite_anime", favoriteAnime);
      if (avatarUrl) formData.set("avatar_url", avatarUrl);

      const result = await updateProfileAction(formData);
      if (!result.ok) throw new Error(result.error ?? "Could not update profile.");

      await refreshProfile();
      setSuccess(true);
      setAvatarFile(null);
      onSaved?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="profile-edit" onSubmit={handleSubmit}>
      <div className="profile-onboarding__avatar-row">
        <ProfileAvatar src={avatarPreview} name={displayName || profile.username || "Member"} size="lg" />
        <label className="profile-onboarding__upload">
          <span className="profile-onboarding__upload-btn">Change avatar</span>
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
        <span className="auth-field__label">Display name</span>
        <input
          type="text"
          className="auth-field__input"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          disabled={busy}
        />
      </label>

      <label className="auth-field">
        <span className="auth-field__label">Favorite anime</span>
        <input
          type="text"
          className="auth-field__input"
          value={favoriteAnime}
          onChange={(e) => setFavoriteAnime(e.target.value)}
          disabled={busy}
        />
      </label>

      <label className="auth-field">
        <span className="auth-field__label">Bio</span>
        <textarea
          className="auth-field__input profile-field-textarea"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={280}
          rows={4}
          disabled={busy}
        />
      </label>

      {error ? (
        <p className="auth-modal__feedback auth-modal__feedback--error" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="auth-modal__feedback auth-modal__feedback--success" role="status">
          Profile updated.
        </p>
      ) : null}

      <button type="submit" className="auth-modal__submit" disabled={busy}>
        {busy ? (
          <span className="auth-modal__submit-inner">
            <span className="auth-modal__spinner" aria-hidden />
            Saving…
          </span>
        ) : (
          "Save changes"
        )}
      </button>
    </form>
  );
}

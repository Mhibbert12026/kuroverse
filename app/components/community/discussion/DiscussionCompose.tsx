"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import { createCommunityPostAction } from "@/lib/community-posts/actions";
import {
  COMPOSABLE_POST_CATEGORIES,
  POST_IMAGE_BUCKET,
} from "@/lib/community-posts/constants";
import {
  postImageObjectPath,
  publicPostImageUrl,
  validatePostImageFile,
} from "@/lib/community-posts/image";
import type { ComposablePostCategory } from "@/lib/community-posts/types";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseUrl, isSupabaseConfigured } from "@/lib/supabase/env";
import type { CommunitySlug } from "@/lib/communities/registry";

type DiscussionComposeProps = {
  communitySlug: CommunitySlug | string;
  communityTitle: string;
};

export function DiscussionCompose({ communitySlug, communityTitle }: DiscussionComposeProps) {
  const router = useRouter();
  const { user, openAuth, configured } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [expanded, setExpanded] = useState(false);
  const [category, setCategory] = useState<ComposablePostCategory>("discussion");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [hasSpoilers, setHasSpoilers] = useState(false);
  const [spoilerScope, setSpoilerScope] = useState("");
  const [episodeLabel, setEpisodeLabel] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const supabase = useMemo(
    () => (configured && isSupabaseConfigured() ? createClient() : null),
    [configured],
  );
  const supabaseUrl = useMemo(() => {
    try {
      return isSupabaseConfigured() ? getSupabaseUrl() : "";
    } catch {
      return "";
    }
  }, []);

  const resetForm = () => {
    setTitle("");
    setBody("");
    setHasSpoilers(false);
    setSpoilerScope("");
    setEpisodeLabel("");
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleImagePick = (file: File | undefined) => {
    if (!file) return;
    const validation = validatePostImageFile(file);
    if (validation) {
      setError(validation);
      return;
    }
    setError(null);
    setImageFile(file);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!configured) {
      setError("Community posts require Supabase to be configured.");
      return;
    }
    if (!user) {
      openAuth("sign-in", `/communities/${communitySlug}`);
      return;
    }
    if (!supabase) return;

    setError(null);
    startTransition(async () => {
      try {
        let imageUrl: string | null = null;

        if (imageFile) {
          const path = postImageObjectPath(user.id, imageFile);
          const { error: uploadError } = await supabase.storage
            .from(POST_IMAGE_BUCKET)
            .upload(path, imageFile, {
              upsert: false,
              contentType: imageFile.type,
            });
          if (uploadError) throw uploadError;
          imageUrl = publicPostImageUrl(supabaseUrl, path);
        }

        const formData = new FormData();
        formData.set("community_slug", communitySlug);
        formData.set("category", category);
        formData.set("title", title);
        formData.set("body", body);
        formData.set("has_spoilers", hasSpoilers ? "true" : "false");
        if (hasSpoilers) formData.set("spoiler_scope", spoilerScope);
        if (category === "episode") formData.set("episode_label", episodeLabel);
        if (imageUrl) formData.set("image_url", imageUrl);

        const result = await createCommunityPostAction(formData);
        if (!result.ok) throw new Error(result.error ?? "Could not create post.");

        resetForm();
        setExpanded(false);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  };

  if (!expanded) {
    return (
      <button
        type="button"
        className="feed-compose feed-compose--collapsed"
        onClick={() => {
          if (!user) {
            openAuth("sign-in", `/communities/${communitySlug}`);
            return;
          }
          setExpanded(true);
        }}
      >
        <span className="feed-compose__collapsed-text">
          Share your {communityTitle} take, theory, or episode reaction…
        </span>
        <span className="hub-btn hub-btn--primary text-xs shrink-0">New post</span>
      </button>
    );
  }

  return (
    <form className="feed-compose feed-compose--active" onSubmit={handleSubmit}>
      <div className="feed-compose__header">
        <p className="feed-compose__label">Create a post</p>
        <button
          type="button"
          className="feed-compose__collapse"
          onClick={() => setExpanded(false)}
        >
          Collapse
        </button>
      </div>

      <div className="feed-compose__types" role="radiogroup" aria-label="Post type">
        {COMPOSABLE_POST_CATEGORIES.map((opt) => (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={category === opt.id}
            className={`feed-compose__type ${category === opt.id ? "feed-compose__type--active" : ""}`}
            onClick={() => setCategory(opt.id)}
          >
            <span className="feed-compose__type-label">{opt.label}</span>
            <span className="feed-compose__type-desc">{opt.description}</span>
          </button>
        ))}
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
        className="feed-compose__title"
        maxLength={200}
        required
      />

      <textarea
        rows={4}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={`What’s on your mind in ${communityTitle}?`}
        className="feed-compose__input feed-compose__input--editable"
        maxLength={4000}
        required
      />

      {category === "episode" && (
        <label className="feed-compose__field">
          <span className="feed-compose__field-label">Episode label</span>
          <input
            type="text"
            value={episodeLabel}
            onChange={(e) => setEpisodeLabel(e.target.value)}
            placeholder="e.g. Episode 12 · Season 2"
            className="feed-compose__title"
            maxLength={48}
          />
        </label>
      )}

      <div className="feed-compose__toggles">
        <button
          type="button"
          className={`feed-compose__tag ${hasSpoilers ? "feed-compose__tag--active" : ""}`}
          onClick={() => setHasSpoilers((v) => !v)}
          aria-pressed={hasSpoilers}
        >
          {hasSpoilers ? "✓ Spoiler tag" : "+ Spoiler tag"}
        </button>
        <button
          type="button"
          className="feed-compose__tag"
          onClick={() => fileRef.current?.click()}
        >
          + Image
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          onChange={(e) => handleImagePick(e.target.files?.[0])}
        />
      </div>

      {hasSpoilers && (
        <label className="feed-compose__field">
          <span className="feed-compose__field-label">Spoiler scope (optional)</span>
          <input
            type="text"
            value={spoilerScope}
            onChange={(e) => setSpoilerScope(e.target.value)}
            placeholder="e.g. Manga Ch. 250+ or latest episode"
            className="feed-compose__title"
            maxLength={80}
          />
        </label>
      )}

      {imagePreview && (
        <div className="feed-compose__preview">
          <div className="feed-compose__preview-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagePreview} alt="Upload preview" className="h-full w-full object-cover" />
          </div>
          <button
            type="button"
            className="feed-compose__remove-image"
            onClick={() => {
              setImageFile(null);
              if (imagePreview) URL.revokeObjectURL(imagePreview);
              setImagePreview(null);
              if (fileRef.current) fileRef.current.value = "";
            }}
          >
            Remove image
          </button>
        </div>
      )}

      {error && <p className="feed-compose__error">{error}</p>}

      <div className="feed-compose__footer">
        <p className="feed-compose__hint">Posts are public in this community</p>
        <button type="submit" className="hub-btn hub-btn--primary text-xs" disabled={pending}>
          {pending ? "Posting…" : "Publish post"}
        </button>
      </div>
    </form>
  );
}

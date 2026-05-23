export type UserProfile = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  favorite_anime: string | null;
  onboarding_completed: boolean;
  is_moderator?: boolean;
  created_at: string;
  updated_at: string;
};

export type AuthView = "sign-in" | "sign-up";

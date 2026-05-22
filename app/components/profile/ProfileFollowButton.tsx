"use client";

import { useEffect, useState, useTransition } from "react";
import { isFollowingUserAction, toggleFollowAction } from "@/lib/follows/actions";
import { useAuth } from "@/app/providers/AuthProvider";

type ProfileFollowButtonProps = {
  targetUserId: string;
};

export function ProfileFollowButton({ targetUserId }: ProfileFollowButtonProps) {
  const { user, openAuth } = useAuth();
  const [following, setFollowing] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!user || user.id === targetUserId) return;
    void isFollowingUserAction(targetUserId).then(setFollowing);
  }, [user, targetUserId]);

  if (!user || user.id === targetUserId) return null;

  const handleClick = () => {
    startTransition(async () => {
      const result = await toggleFollowAction(targetUserId);
      if (!result.ok) {
        if (result.error.includes("Sign in")) openAuth("sign-in");
        return;
      }
      setFollowing(result.following);
    });
  };

  return (
    <button
      type="button"
      className={`profile-follow-btn${following ? " profile-follow-btn--active" : ""}`}
      disabled={pending}
      onClick={handleClick}
    >
      {pending ? "…" : following ? "Following" : "Follow"}
    </button>
  );
}

type ProfileAvatarProps = {
  src: string | null;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  /** Neon ring for nav / hover cards */
  ring?: "none" | "neon" | "subtle";
};

const sizeClass: Record<NonNullable<ProfileAvatarProps["size"]>, string> = {
  sm: "profile-avatar--sm",
  md: "profile-avatar--md",
  lg: "profile-avatar--lg",
  xl: "profile-avatar--xl",
};

const ringClass = {
  none: "",
  neon: "profile-avatar--ring-neon",
  subtle: "profile-avatar--ring-subtle",
} as const;

export function ProfileAvatar({
  src,
  name,
  size = "md",
  className = "",
  ring = "none",
}: ProfileAvatarProps) {
  const initial = name.charAt(0).toUpperCase() || "?";

  return (
    <span
      className={`profile-avatar ${sizeClass[size]} ${ringClass[ring]} ${className}`.trim()}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="profile-avatar__img" />
      ) : (
        <span className="profile-avatar__initial" aria-hidden>
          {initial}
        </span>
      )}
    </span>
  );
}

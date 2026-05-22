import Link from "next/link";
import { PLATFORM_NAME } from "@/lib/brand";

type BrandLogoProps = {
  /** Include mark + wordmark */
  showIcon?: boolean;
  /** Link wordmark to home */
  link?: boolean;
  /** Logo text size */
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-xl",
};

const iconSizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-10 w-10 text-base",
};

function Wordmark({ size = "md", className = "" }: { size?: BrandLogoProps["size"]; className?: string }) {
  return (
    <span
      className={`font-display font-bold tracking-tight ${sizeClasses[size]} ${className}`}
    >
      Kuro<span className="text-accent-orange">Verse</span>
    </span>
  );
}

export function BrandLogo({
  showIcon = false,
  link = false,
  size = "md",
  className = "",
}: BrandLogoProps) {
  const content = (
    <>
      {showIcon && (
        <span
          className={`relative flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-orange via-accent-pink to-accent-purple font-display font-bold text-white shadow-[0_0_20px_rgba(255,90,31,0.4)] ${iconSizeClasses[size]} ${link ? "transition-shadow duration-300 group-hover:shadow-[0_0_28px_rgba(255,90,31,0.55)]" : ""}`}
          aria-hidden
        >
          K
          {link && (
            <span className="absolute -inset-1 rounded-xl bg-gradient-to-br from-accent-orange to-accent-purple opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-70" />
          )}
        </span>
      )}
      <Wordmark size={size} />
    </>
  );

  const wrapClass = `group inline-flex items-center gap-2.5 ${className}`;

  if (link) {
    return (
      <Link
        href="/"
        className={`${wrapClass} transition-transform duration-300 hover:scale-[1.02]`}
        aria-label={`${PLATFORM_NAME} home`}
      >
        {content}
      </Link>
    );
  }

  return <span className={wrapClass}>{content}</span>;
}

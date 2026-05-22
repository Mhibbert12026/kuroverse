import Link from "next/link";
import type { ComponentProps } from "react";

type AnimeCardLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  animeId: number;
};

/** Wraps card UI with navigation to the anime detail page. */
export function AnimeCardLink({
  animeId,
  className,
  children,
  ...props
}: AnimeCardLinkProps) {
  return (
    <Link
      href={`/anime/${animeId}`}
      className={className}
      scroll
      {...props}
    >
      {children}
    </Link>
  );
}

import Link from "next/link";
import type { ComponentProps } from "react";

type CommunityCardLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  slug: string;
};

export function CommunityCardLink({ slug, className, children, ...props }: CommunityCardLinkProps) {
  return (
    <Link href={`/communities/${slug}`} className={className} scroll {...props}>
      {children}
    </Link>
  );
}

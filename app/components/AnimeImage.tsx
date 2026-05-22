import Image, { type ImageProps } from "next/image";

/** Local SVGs skip optimization; remote covers (e.g. AniList CDN) use Next/Image. */
export function AnimeImage({ src, ...props }: ImageProps) {
  const srcString = typeof src === "string" ? src : "";
  const isLocal = srcString.startsWith("/");

  return <Image src={src} unoptimized={isLocal} {...props} />;
}

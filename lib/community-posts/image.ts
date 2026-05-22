import { MAX_POST_IMAGE_BYTES, POST_IMAGE_BUCKET } from "./constants";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export function validatePostImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type)) {
    return "Use a JPEG, PNG, WebP, or GIF image.";
  }
  if (file.size > MAX_POST_IMAGE_BYTES) return "Image must be 5 MB or smaller.";
  return null;
}

export function postImageObjectPath(userId: string, file: File): string {
  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : file.type === "image/gif"
          ? "gif"
          : "jpg";
  const id = crypto.randomUUID();
  return `${userId}/${id}.${ext}`;
}

export function publicPostImageUrl(supabaseUrl: string, path: string): string {
  return `${supabaseUrl}/storage/v1/object/public/${POST_IMAGE_BUCKET}/${path}`;
}

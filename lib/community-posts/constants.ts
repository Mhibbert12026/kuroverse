import type { ComposablePostCategory } from "./types";

export const COMPOSABLE_POST_CATEGORIES: {
  id: ComposablePostCategory;
  label: string;
  description: string;
}[] = [
  {
    id: "discussion",
    label: "Discussion",
    description: "General takes, questions, and megathreads",
  },
  {
    id: "episode",
    label: "Episode reaction",
    description: "Live watches, sakuga, and episode feels",
  },
  {
    id: "theory",
    label: "Fan theory",
    description: "Evidence boards and predictions",
  },
];

export const POST_IMAGE_BUCKET = "post-images";
export const MAX_POST_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_POST_TITLE = 200;
export const MAX_POST_BODY = 4000;
export const MAX_COMMENT_BODY = 1200;

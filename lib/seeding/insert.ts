import { createAdminClient } from "@/lib/supabase/admin";
import type { GeneratedSeedPost } from "./types";

export async function insertSeedPosts(
  posts: GeneratedSeedPost[],
  seedUserId: string,
  batchId: string,
): Promise<{ created: number; errors: string[] }> {
  const supabase = createAdminClient();
  let created = 0;
  const errors: string[] = [];

  for (const post of posts) {
    const { error } = await supabase.rpc("insert_seed_community_post", {
      p_user_id: seedUserId,
      p_community_slug: post.communitySlug,
      p_category: post.category,
      p_title: post.title,
      p_body: post.body,
      p_seed_kind: post.kind,
      p_anime_id: post.animeId,
      p_episode_label: post.episodeLabel ?? null,
      p_has_spoilers: post.hasSpoilers ?? false,
      p_spoiler_scope: post.spoilerScope ?? null,
      p_seed_batch_id: batchId,
    });

    if (error) {
      errors.push(error.message);
    } else {
      created++;
    }
  }

  return { created, errors };
}

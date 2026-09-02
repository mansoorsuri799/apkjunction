import type { WPPost } from "@/types/wordpress";

export interface PostRatingData {
  value: number;
  count: number;
}

function hashSlug(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash + slug.charCodeAt(i) * (i + 1)) % 9973;
  }
  return hash;
}

/**
 * Automatic per-post rating — no WordPress fields required.
 * Stable for a given slug so it does not change between builds.
 */
export function getPostRating(post: WPPost): PostRatingData {
  const hash = hashSlug(post.slug);

  // 4.3 – 4.9 in 0.1 steps
  const value = Math.round((4.3 + (hash % 7) * 0.1) * 10) / 10;

  // Stable review count in a broad public range
  const count = 80_000 + (hash % 420_000);

  return { value, count };
}

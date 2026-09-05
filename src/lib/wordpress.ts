import type { WPCategory, WPPost } from "@/types/wordpress";
import { BRAND, getCmsApiUrl, getCmsOrigin } from "@/lib/brand";
import { fixContentUrls as fixContentUrlsWithOrigin } from "@/lib/wordpress-utils";

/** Posts assigned here when WordPress does not yet have the parent tree. */
export const PINNED_CATEGORY_POSTS: Record<string, string[]> = {
  "casino-games": ["188-pk-game"],
};

export {
  cleanExcerpt,
  getFeaturedImage,
  getPostCategories,
  stripHtml,
} from "@/lib/wordpress-utils";

const WP_API_URL = getCmsApiUrl();

const DEFAULT_REVALIDATE = 3600;
const POST_REVALIDATE = 60;
const SKIP_SLUGS = new Set(["hello-world"]);

function isPublishedPost(post: WPPost): boolean {
  return !post.status || post.status === "publish";
}

async function wpFetch<T>(
  path: string,
  options?: { revalidate?: number | false }
): Promise<T> {
  const url = `${WP_API_URL}${path}`;
  const revalidate = options?.revalidate ?? DEFAULT_REVALIDATE;

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": BRAND.userAgent,
    },
    next:
      revalidate === false
        ? { revalidate: 0 }
        : { revalidate, tags: ["wordpress"] },
  });

  if (!response.ok) {
    throw new Error(
      `WordPress API error: ${response.status} ${response.statusText} (${url})`
    );
  }

  return response.json() as Promise<T>;
}

export function getWordPressOrigin(): string {
  try {
    return new URL(WP_API_URL).origin;
  } catch {
    return getCmsOrigin();
  }
}

export function fixContentUrls(html: string): string {
  return fixContentUrlsWithOrigin(html, getWordPressOrigin());
}

export async function getPosts(
  params: Record<string, string | number> = {}
): Promise<WPPost[]> {
  const searchParams = new URLSearchParams({
    _embed: "1",
    per_page: "10",
    status: "publish",
    ...Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    ),
  });

  const posts = await wpFetch<WPPost[]>(`/wp/v2/posts?${searchParams}`);
  return posts.filter(
    (post) => isPublishedPost(post) && !SKIP_SLUGS.has(post.slug)
  );
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  if (SKIP_SLUGS.has(slug)) {
    return null;
  }

  const posts = await wpFetch<WPPost[]>(
    `/wp/v2/posts?slug=${encodeURIComponent(slug)}&status=publish&_embed=1`,
    { revalidate: POST_REVALIDATE }
  );
  const post = posts[0];
  if (!post || !isPublishedPost(post)) {
    return null;
  }
  return post;
}

export async function getAllPostSlugs(): Promise<string[]> {
  const slugs: string[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    try {
      const posts = await wpFetch<{ slug: string }[]>(
        `/wp/v2/posts?per_page=100&page=${page}&status=publish&_fields=slug`
      );

      if (posts.length === 0) {
        hasMore = false;
      } else {
        slugs.push(
          ...posts.map((p) => p.slug).filter((slug) => !SKIP_SLUGS.has(slug))
        );
        page++;
      }
    } catch {
      hasMore = false;
    }
  }

  return slugs;
}

/** All published posts with embedded media (for image sitemaps). */
export async function getAllPostsWithMedia(): Promise<WPPost[]> {
  const all: WPPost[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    try {
      const posts = await wpFetch<WPPost[]>(
        `/wp/v2/posts?per_page=100&page=${page}&_embed=1`
      );

      if (posts.length === 0) {
        hasMore = false;
      } else {
        all.push(
          ...posts.filter(
            (post) => isPublishedPost(post) && !SKIP_SLUGS.has(post.slug)
          )
        );
        page++;
        if (posts.length < 100) hasMore = false;
      }
    } catch {
      hasMore = false;
    }
  }

  return all;
}

export async function getCategories(): Promise<WPCategory[]> {
  return wpFetch<WPCategory[]>(
    "/wp/v2/categories?per_page=100&hide_empty=false"
  );
}

export async function getCategoryBySlug(slug: string): Promise<WPCategory | null> {
  const categories = await wpFetch<WPCategory[]>(
    `/wp/v2/categories?slug=${encodeURIComponent(slug)}&hide_empty=false`
  );
  return categories[0] ?? null;
}

export async function getPostsByCategory(categoryId: number): Promise<WPPost[]> {
  return getPosts({ categories: categoryId, per_page: 20 });
}

export async function mergePinnedCategoryPosts(
  wpSlug: string,
  posts: WPPost[]
): Promise<WPPost[]> {
  const pinnedSlugs = PINNED_CATEGORY_POSTS[wpSlug] ?? [];
  if (pinnedSlugs.length === 0) return posts;

  const seen = new Set(posts.map((post) => post.slug));
  const extras = await Promise.all(
    pinnedSlugs
      .filter((slug) => !seen.has(slug))
      .map((slug) => getPostBySlug(slug))
  );

  return [...extras.filter((post): post is WPPost => post !== null), ...posts];
}

/** Posts for homepage category rows, keyed by category slug. */
export async function getCategoryRowPosts(
  slugs: string[]
): Promise<Record<string, WPPost[]>> {
  const empty = Object.fromEntries(slugs.map((slug) => [slug, [] as WPPost[]]));

  try {
    const [categories, latest] = await Promise.all([
      getCategories(),
      getPosts({ per_page: 100 }),
    ]);

    const bySlug = new Map(categories.map((category) => [category.slug, category]));
    const grouped: Record<string, WPPost[]> = { ...empty };

    for (const slug of slugs) {
      const category = bySlug.get(slug);
      if (!category) continue;
      grouped[slug] = latest.filter((post) => post.categories.includes(category.id));
    }

    const needsFullFetch = slugs.filter((slug) => {
      const category = bySlug.get(slug);
      return Boolean(category && category.count > grouped[slug].length);
    });

    if (needsFullFetch.length > 0) {
      const extras = await Promise.all(
        needsFullFetch.map(async (slug) => {
          const category = bySlug.get(slug);
          if (!category) return [slug, grouped[slug]] as const;
          try {
            return [slug, await getPosts({ categories: category.id, per_page: 16 })] as const;
          } catch {
            return [slug, grouped[slug]] as const;
          }
        })
      );
      for (const [slug, posts] of extras) {
        grouped[slug] = posts;
      }
    }

    for (const slug of slugs) {
      grouped[slug] = await mergePinnedCategoryPosts(slug, grouped[slug] ?? []);
    }

    return grouped;
  } catch (error) {
    console.error("[categories] Row posts failed:", error);
    return empty;
  }
}

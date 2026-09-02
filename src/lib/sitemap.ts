import { getSiteUrl } from "@/lib/seo";
import {
  getAllPostSlugs,
  getAllPostsWithMedia,
  getCategories,
} from "@/lib/wordpress";
import { getFeaturedImage } from "@/lib/wordpress-utils";

export function getSitemapBaseUrl(): string {
  return getSiteUrl().replace(/\/$/, "");
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Google requires W3C Datetime for <lastmod>.
 * WordPress REST dates are often `YYYY-MM-DDTHH:mm:ss` with no timezone — GSC flags those as invalid.
 * Prefer date-only `YYYY-MM-DD` (valid and unambiguous).
 */
export function formatSitemapLastmod(value?: string | Date | null): string {
  if (!value) {
    return new Date().toISOString().slice(0, 10);
  }

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      return new Date().toISOString().slice(0, 10);
    }
    return value.toISOString().slice(0, 10);
  }

  const trimmed = value.trim();
  const dateOnly = trimmed.match(/^(\d{4}-\d{2}-\d{2})/);
  if (dateOnly) {
    return dateOnly[1];
  }

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }

  return new Date().toISOString().slice(0, 10);
}

export function xmlResponse(body: string, revalidate = 60): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate}`,
    },
  });
}

/** Collect image URLs from post content HTML. */
export function extractContentImageUrls(html: string): string[] {
  const urls = new Set<string>();
  const regex = /<img[^>]+src=["']([^"']+)["']/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    const src = match[1]?.trim();
    if (src && /^https?:\/\//i.test(src)) {
      urls.add(src);
    }
  }
  return Array.from(urls);
}

export async function buildPagesSitemapEntries() {
  const siteUrl = getSitemapBaseUrl();
  const now = formatSitemapLastmod(new Date());

  const staticRoutes = [
    { loc: siteUrl, lastmod: now, changefreq: "daily", priority: "1.0" },
    { loc: `${siteUrl}/blog`, lastmod: now, changefreq: "daily", priority: "0.9" },
    { loc: `${siteUrl}/about-us`, lastmod: now, changefreq: "monthly", priority: "0.7" },
    { loc: `${siteUrl}/who-we-are`, lastmod: now, changefreq: "monthly", priority: "0.6" },
    { loc: `${siteUrl}/contact-us`, lastmod: now, changefreq: "monthly", priority: "0.7" },
    { loc: `${siteUrl}/privacy-policy`, lastmod: now, changefreq: "yearly", priority: "0.4" },
    { loc: `${siteUrl}/disclaimer`, lastmod: now, changefreq: "yearly", priority: "0.4" },
    {
      loc: `${siteUrl}/responsible-gaming`,
      lastmod: now,
      changefreq: "yearly",
      priority: "0.5",
    },
  ];

  try {
    const [slugs, categories] = await Promise.all([
      getAllPostSlugs(),
      getCategories(),
    ]);

    const postRoutes = slugs.map((slug) => ({
      loc: `${siteUrl}/${slug}`,
      lastmod: now,
      changefreq: "weekly",
      priority: "0.8",
    }));

    const categoryRoutes = categories
      .filter((cat) => cat.slug !== "uncategorized")
      .map((cat) => ({
        loc: `${siteUrl}/category/${cat.slug}`,
        lastmod: now,
        changefreq: "weekly",
        priority: "0.6",
      }));

    return [...staticRoutes, ...postRoutes, ...categoryRoutes];
  } catch {
    return staticRoutes;
  }
}

export type ImageSitemapEntry = {
  loc: string;
  images: Array<{ loc: string }>;
};

/** Serve WordPress media via the public site domain for image sitemap / SEO. */
export function toPublicMediaUrl(url: string, siteUrl: string): string {
  try {
    const parsed = new URL(url);
    if (!parsed.pathname.startsWith("/wp-content/")) return url;
    return `${siteUrl.replace(/\/$/, "")}${parsed.pathname}`;
  } catch {
    return url;
  }
}

export async function buildImageSitemapEntries(): Promise<ImageSitemapEntry[]> {
  const siteUrl = getSitemapBaseUrl();

  try {
    const posts = await getAllPostsWithMedia();

    return posts
      .map((post) => {
        const featured = getFeaturedImage(post);
        const contentImages = extractContentImageUrls(post.content.rendered);

        const images: ImageSitemapEntry["images"] = [];
        const seen = new Set<string>();

        const pushImage = (rawUrl: string) => {
          const loc = toPublicMediaUrl(rawUrl, siteUrl);
          if (seen.has(loc)) return;
          seen.add(loc);
          images.push({ loc });
        };

        if (featured?.url) pushImage(featured.url);
        for (const url of contentImages) pushImage(url);

        if (images.length === 0) return null;

        return {
          loc: `${siteUrl}/${post.slug}`,
          images,
        };
      })
      .filter((entry): entry is ImageSitemapEntry => entry !== null);
  } catch {
    return [];
  }
}

export function renderUrlset(
  entries: Array<{
    loc: string;
    lastmod: string;
    changefreq: string;
    priority: string;
  }>
): string {
  const urls = entries
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${escapeXml(entry.lastmod)}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export function renderImageUrlset(entries: ImageSitemapEntry[]): string {
  // Minimal Google image sitemap format — only required tags (no lastmod/title/caption).
  const urls = entries
    .map((entry) => {
      const images = entry.images
        .map(
          (image) => `    <image:image>
      <image:loc>${escapeXml(image.loc)}</image:loc>
    </image:image>`
        )
        .join("\n");

      return `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
${images}
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;
}

export function renderSitemapIndex(
  sitemaps: Array<{ loc: string; lastmod: string }>
): string {
  const items = sitemaps
    .map(
      (sitemap) => `  <sitemap>
    <loc>${escapeXml(sitemap.loc)}</loc>
    <lastmod>${escapeXml(sitemap.lastmod)}</lastmod>
  </sitemap>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</sitemapindex>`;
}

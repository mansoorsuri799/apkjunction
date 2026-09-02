import type { WPCategory, WPPost } from "@/types/wordpress";

/** Decode common HTML entities (e.g. &amp; → &, &#8230; → …). */
export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, n: string) =>
      String.fromCharCode(Number(n))
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, h: string) =>
      String.fromCharCode(parseInt(h, 16))
    )
    .replace(/&hellip;/g, "…")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    // &amp; last so sequences like &amp;lt; decode correctly
    .replace(/&amp;/g, "&");
}

/** Strip HTML tags and decode entities from WordPress rendered fields. */
export function stripHtml(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]*>/g, "")).trim();
}

/**
 * Clean WordPress auto-excerpts: decode entities and drop a truncated
 * trailing sentence (e.g. "… attractions of CX777 is…").
 */
export function cleanExcerpt(html: string): string {
  let text = stripHtml(html).replace(/\s+/g, " ").trim();
  if (!text) return "";

  const hadEllipsis = /…$/.test(text) || /\.\.\.$/.test(text);
  if (hadEllipsis) {
    text = text.replace(/…$/, "").replace(/\.\.\.$/, "").trim();
    const sentences = text.split(/(?<=[.!?])\s+/);
    if (sentences.length > 1 && !/[.!?]$/.test(sentences[sentences.length - 1]!)) {
      sentences.pop();
      text = sentences.join(" ");
    }
  }

  return text.trim();
}

export function getFeaturedImage(post: WPPost): {
  url: string;
  alt: string;
  width?: number;
  height?: number;
} | null {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  if (!media?.source_url) return null;

  return {
    url: media.source_url,
    alt: media.alt_text || stripHtml(post.title.rendered),
    width: media.media_details?.width,
    height: media.media_details?.height,
  };
}

export function getPostCategories(post: WPPost): WPCategory[] {
  return post._embedded?.["wp:term"]?.[0] ?? [];
}

/** Rewrite relative WordPress URLs in content to absolute URLs */
export function fixContentUrls(html: string, origin: string): string {
  if (!origin) return html;

  return html
    .replace(/(src|href|srcset)="\/wp-content/g, `$1="${origin}/wp-content`)
    .replace(/(src|href|srcset)='\/wp-content/g, `$1='${origin}/wp-content`)
    .replace(/url\(\/wp-content/g, `url(${origin}/wp-content`)
    .replace(/,\/wp-content/g, `,${origin}/wp-content`);
}

import {
  buildImageSitemapEntries,
  renderImageUrlset,
} from "@/lib/sitemap";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** Google image sitemap → /image-sitemap.xml */
export async function GET() {
  const entries = await buildImageSitemapEntries();
  const body = renderImageUrlset(entries);

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // Always serve a fresh sitemap to Google (avoid stale lastmod errors).
      "Cache-Control": "no-store, must-revalidate",
    },
  });
}

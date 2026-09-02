import {
  buildPagesSitemapEntries,
  renderUrlset,
  xmlResponse,
} from "@/lib/sitemap";

export const revalidate = 60;

/** Pages / posts / categories sitemap → /sitemap.xml */
export async function GET() {
  const entries = await buildPagesSitemapEntries();
  return xmlResponse(renderUrlset(entries));
}

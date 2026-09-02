import {
  formatSitemapLastmod,
  getSitemapBaseUrl,
  renderSitemapIndex,
  xmlResponse,
} from "@/lib/sitemap";

export const revalidate = 60;

/** Main sitemap index → /sitemap-index.xml */
export async function GET() {
  const siteUrl = getSitemapBaseUrl();
  const lastmod = formatSitemapLastmod(new Date());

  const xml = renderSitemapIndex([
    { loc: `${siteUrl}/sitemap.xml`, lastmod },
    { loc: `${siteUrl}/image-sitemap.xml`, lastmod },
  ]);

  return xmlResponse(xml);
}

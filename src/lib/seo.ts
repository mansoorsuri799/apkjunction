import type { Metadata } from "next";
import type { WPPost } from "@/types/wordpress";
import {
  BRAND,
  getBrandDescription,
  getBrandDomain,
  getBrandName,
  getBrandTitle,
  getBrandUrl,
  getCmsApiUrl,
  getCmsOrigin,
} from "@/lib/brand";
import {
  cleanExcerpt,
  getFeaturedImage,
  stripHtml,
} from "@/lib/wordpress-utils";

const SITE_URL = getBrandUrl();
const SITE_NAME = getBrandName();
const SITE_TITLE = getBrandTitle();
const SITE_DESCRIPTION = getBrandDescription();

export const siteIcons: Metadata["icons"] = {
  icon: [
    { url: "/favicon.ico", sizes: "any" },
    { url: "/favicon/favicon.svg", type: "image/svg+xml" },
    { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
  ],
  apple: "/favicon/apple-touch-icon.png",
  shortcut: "/favicon.ico",
};

export const siteManifest = "/favicon/site.webmanifest";

export function buildPostMetadata(post: WPPost, path: string): Metadata {
  const title =
    post.rank_math?.title ||
    stripHtml(post.title.rendered) ||
    SITE_NAME;
  const description =
    post.rank_math?.description ||
    cleanExcerpt(post.excerpt.rendered) ||
    undefined;

  const featured = getFeaturedImage(post);
  const canonical = `${SITE_URL.replace(/\/$/, "")}${path}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: BRAND.locale.replace("-", "_"),
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modified,
      ...(featured && {
        images: [{ url: featured.url, alt: featured.alt }],
      }),
    },
    twitter: {
      card: featured ? "summary_large_image" : "summary",
      title,
      description,
      ...(featured && { images: [featured.url] }),
    },
  };
}

export function buildSiteMetadata(
  title: string,
  description: string,
  path = "/"
): Metadata {
  const canonical = `${SITE_URL.replace(/\/$/, "")}${path}`;

  return {
    title,
    description,
    alternates: { canonical },
    icons: siteIcons,
    manifest: siteManifest,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: BRAND.locale.replace("-", "_"),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function getSiteName(): string {
  return SITE_NAME;
}

export function getSiteDomain(): string {
  return getBrandDomain();
}

export function getSiteTitle(): string {
  return SITE_TITLE;
}

export function getSiteDescription(): string {
  return SITE_DESCRIPTION;
}

export function getSiteUrl(): string {
  return SITE_URL;
}

export function getWordPressMediaOrigin(): string {
  try {
    return new URL(getCmsApiUrl()).origin;
  } catch {
    return getCmsOrigin();
  }
}

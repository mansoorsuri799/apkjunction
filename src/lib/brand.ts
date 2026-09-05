export const BRAND = {
  name: "APK Junction",
  shortName: "APK Junction",
  domain: "apkjunction.com.pk",
  url: "https://apkjunction.com.pk",
  wwwUrl: "https://www.apkjunction.com.pk",
  cmsHost: "dilpazeer.apkjunction.com.pk",
  cmsOrigin: "https://dilpazeer.apkjunction.com.pk",
  cmsApi: "https://dilpazeer.apkjunction.com.pk/wp-json",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@apkjunction.com.pk",
  title: "APK Junction | Android Apps and Games Guides for Pakistan",
  description:
    "APK Junction publishes editorial APK guides for Pakistani Android users. Browse apps and games — install steps, permissions, and risk flags — before you sideload.",
  locale: "en-PK",
  language: "English",
  region: "Pakistan",
  userAgent: "APKJunction-NextJS/1.0",
  foundingLocation: "Pakistan",
} as const;

function looksLikeEmail(value: string | undefined): boolean {
  return Boolean(value && value.includes("@"));
}

export function getBrandName(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_NAME?.trim();
  if (!fromEnv || looksLikeEmail(fromEnv)) {
    return BRAND.name;
  }
  return fromEnv;
}

export function getBrandDomain(): string {
  return BRAND.domain;
}

export function getBrandUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? BRAND.url;
}

export function getBrandTitle(): string {
  return process.env.NEXT_PUBLIC_SITE_TITLE ?? BRAND.title;
}

export function getBrandDescription(): string {
  return process.env.NEXT_PUBLIC_SITE_DESCRIPTION ?? BRAND.description;
}

export function getCmsApiUrl(): string {
  return process.env.WORDPRESS_API_URL?.replace(/\/$/, "") || BRAND.cmsApi;
}

export function getCmsOrigin(): string {
  try {
    return new URL(getCmsApiUrl()).origin;
  } catch {
    return BRAND.cmsOrigin;
  }
}

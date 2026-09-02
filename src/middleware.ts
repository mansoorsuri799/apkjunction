import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Known tech-fingerprint / site-analyzer bots and scanners.
 * Browser extensions (e.g. Wappalyzer in Chrome) run locally and cannot be
 * fully blocked — this stops remote crawlers and CLI tools.
 */
const BLOCKED_UA_PATTERNS = [
  /wappalyzer/i,
  /builtwith/i,
  /whatruns/i,
  /whatweb/i,
  /webtech/i,
  /w3af/i,
  /nikto/i,
  /nmap/i,
  /nuclei/i,
  /httpx/i,
  /httprobe/i,
  /retire\.js/i,
  /stackshare/i,
  /similartech/i,
  /netcraft/i,
  /ptengine/i,
  /detectify/i,
  /sucuri/i,
  /sitechecker/i,
  /seositecheckup/i,
  /siteanalyzer/i,
  /website\-tech/i,
  /technology.?lookup/i,
  /tech.?lookup/i,
  /fingerprint/i,
];

/** Paths that should never be blocked (SEO + health). */
const ALLOW_PATHS = [/^\/robots\.txt$/i, /^\/sitemap/i, /^\/favicon/i];

function isBlockedUserAgent(ua: string): boolean {
  if (!ua || ua === "-") return false;
  // Don't block empty short browsers; only known scanners
  return BLOCKED_UA_PATTERNS.some((pattern) => pattern.test(ua));
}

function isAllowedPath(pathname: string): boolean {
  return ALLOW_PATHS.some((pattern) => pattern.test(pathname));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ua = request.headers.get("user-agent") ?? "";

  if (!isAllowedPath(pathname) && isBlockedUserAgent(ua)) {
    return new NextResponse(null, {
      status: 403,
      statusText: "Forbidden",
      headers: {
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }

  const response = NextResponse.next();

  // Reduce fingerprinting via response headers
  response.headers.delete("x-powered-by");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  // Discourage embedding of tech-detection via cross-origin probes
  response.headers.set("X-DNS-Prefetch-Control", "off");

  return response;
}

export const config = {
  matcher: [
    /*
     * Run on all paths except Next.js internals and static files we must serve.
     */
    "/((?!_next/static|_next/image|.*\\.(?:ico|png|jpg|jpeg|gif|webp|svg|woff2?)$).*)",
  ],
};

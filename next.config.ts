import type { NextConfig } from "next";

const wordpressUrl =
  process.env.WORDPRESS_API_URL?.replace(/\/$/, "") ||
  "https://ams.apkjunction.com.pk/wp-json";
let wordpressHostname = "ams.apkjunction.com.pk";

try {
  wordpressHostname = new URL(wordpressUrl).hostname;
} catch {
  wordpressHostname = "ams.apkjunction.com.pk";
}

const nextConfig: NextConfig = {
  // Hide "X-Powered-By: Next.js"
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: wordpressHostname,
        pathname: "/wp-content/**",
      },
      {
        protocol: "http",
        hostname: wordpressHostname,
        pathname: "/wp-content/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/wp-content/:path*",
        destination: `https://${wordpressHostname}/wp-content/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // Reduce cross-site tech probing
          { key: "X-DNS-Prefetch-Control", value: "off" },
        ],
      },
    ];
  },
};

export default nextConfig;

# APK Junction (apkjunction.com.pk)

Next.js frontend for [apkjunction.com.pk](https://apkjunction.com.pk) — a headless WordPress site that publishes original APK install guides, wallet notes, and earning-game reviews for Pakistani Android users.

APK Junction is its own editorial brand. It is not a clone or doorway of another APK directory.

## Getting Started

Copy the environment template and set your values:

```bash
cp .env.example .env.local
```

Required variables:

- `NEXT_PUBLIC_SITE_URL` — `https://apkjunction.com.pk`
- `NEXT_PUBLIC_SITE_NAME` — `APK Junction`
- `WORDPRESS_API_URL` — `https://ams.apkjunction.com.pk/wp-json`
- `REVALIDATE_SECRET` — shared secret for on-demand cache revalidation

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to preview the site.

## WordPress Integration

WordPress theme files live in `wordpress/kadence-child-teenpatti/`. The standalone setup snippet is in `wordpress/apkjunction-headless.php`.

Ready-to-upload packages:

- `wordpress/apkjunction-ams-seo-mu-plugin.zip` — must-use SEO lock
- `wordpress/apkjunction-ams-seo-plugin.zip` — regular plugin + Next.js revalidate
- `wordpress/kadence-child-teenpatti.zip` — Kadence child theme

### Permanent AMS SEO lock (required on live CMS)

Child-theme code alone is easy to lose (theme switch / cache). Use the **must-use plugin** instead:

1. On AMS hosting, create `wp-content/mu-plugins/` if missing
2. Upload `wordpress/apkjunction-ams-seo-mu-plugin.zip` (or the raw `apkjunction-ams-seo.php`) into that folder
3. Purge LiteSpeed (and Cloudflare) cache
4. Confirm:
   - `curl -sI https://ams.apkjunction.com.pk/any-post/` → **301** to `https://apkjunction.com.pk/...`
   - `curl -s https://ams.apkjunction.com.pk/robots.txt` → `Disallow: /`

Optional ironclad layer: Cloudflare redirect rules — see `wordpress/mu-plugins/CLOUDFLARE-REDIRECT.txt`.

## Deploy

Build for production:

```bash
npm run build
npm start
```

Set all environment variables on your hosting platform (e.g. Vercel) before deploying.

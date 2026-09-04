<?php
/**
 * Plugin Name: APK Junction — AMS SEO Lock
 * Description: Permanent CMS-only lock for dilpazeer.apkjunction.com.pk. Redirects public HTML to apkjunction.com.pk, forces noindex, and blocks AMS robots/sitemaps. Survives theme changes (must-use plugin).
 * Version: 1.0.0
 * Author: APK Junction
 *
 * INSTALL (one-time on AMS hosting):
 * 1. Create folder:  wp-content/mu-plugins/
 * 2. Upload this file as:  wp-content/mu-plugins/apkjunction-ams-seo.php
 * 3. In Rank Math → Sitemap Settings → turn OFF "XML Sitemap" (or leave it; this plugin overrides robots.txt)
 * 4. LiteSpeed Cache → Purge All (and Cloudflare purge if used)
 * 5. Verify:
 *      curl -sI https://dilpazeer.apkjunction.com.pk/t88-game/
 *      # expect: 301 Location: https://apkjunction.com.pk/t88-game/
 *      curl -s https://dilpazeer.apkjunction.com.pk/robots.txt
 *      # expect: Disallow: /
 *
 * Keep working as usual:
 *   - https://dilpazeer.apkjunction.com.pk/wp-admin/
 *   - https://dilpazeer.apkjunction.com.pk/wp-json/
 *   - https://dilpazeer.apkjunction.com.pk/wp-content/uploads/...
 */

if (!defined('ABSPATH')) {
    exit;
}

define('APKJUNCTION_PUBLIC_ORIGIN', 'https://apkjunction.com.pk');

/**
 * Paths that must stay on AMS (admin, API, media, core assets).
 */
function apkjunction_ams_is_internal_request(): bool {
    if (is_admin() || wp_doing_ajax() || wp_doing_cron()) {
        return true;
    }
    if (defined('REST_REQUEST') && REST_REQUEST) {
        return true;
    }

    $uri = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '/';

    return (bool) preg_match(
        '#^/(wp-admin|wp-login\.php|wp-json|wp-cron\.php|xmlrpc\.php|wp-content|wp-includes)#i',
        $uri
    );
}

// ─── 1. 301 public HTML → main domain ───────────────────────────────────────

add_action('template_redirect', function () {
    if (apkjunction_ams_is_internal_request()) {
        return;
    }

    $uri = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '/';
    wp_redirect(APKJUNCTION_PUBLIC_ORIGIN . $uri, 301);
    exit;
}, 0);

// ─── 2. Force site "not public" (WordPress reading setting) ─────────────────

add_filter('pre_option_blog_public', '__return_zero');

// ─── 3. Headers + meta noindex (even if a page slips through) ───────────────

add_action('send_headers', function () {
    if (is_admin()) {
        return;
    }
    header('X-Robots-Tag: noindex, nofollow', true);
}, 0);

add_action('wp_head', function () {
    echo '<meta name="robots" content="noindex, nofollow">' . "\n";
}, 0);

// ─── 4. robots.txt — block entire AMS host ──────────────────────────────────

add_filter('robots_txt', function () {
    return "User-agent: *\nDisallow: /\n";
}, 999);

// ─── 5. Override Rank Math index/sitemap output ─────────────────────────────

add_filter('rank_math/frontend/robots', function () {
    return [
        'index'  => 'noindex',
        'follow' => 'nofollow',
    ];
}, 999);

add_filter('rank_math/sitemap/enable', '__return_false', 999);
add_filter('rank_math/sitemap/robots_txt', '__return_empty_string', 999);

// Kill Rank Math sitemap routes if somehow requested.
add_action('template_redirect', function () {
    $uri = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';
    if (preg_match('#sitemap.*\.xml#i', $uri)) {
        status_header(404);
        header('X-Robots-Tag: noindex, nofollow', true);
        exit;
    }
}, 1);

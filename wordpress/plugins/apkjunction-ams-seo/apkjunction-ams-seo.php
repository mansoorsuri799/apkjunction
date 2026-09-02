<?php
/**
 * Plugin Name: APK Junction — AMS SEO Lock
 * Description: Redirects public AMS pages to apkjunction.com.pk, forces noindex, blocks AMS sitemaps, and revalidates the Next.js site on publish/update.
 * Version: 1.1.0
 * Author: APK Junction
 * Requires at least: 5.8
 * Requires PHP: 7.4
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

add_action('template_redirect', function () {
    $uri = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';
    if (preg_match('#sitemap.*\.xml#i', $uri)) {
        status_header(404);
        header('X-Robots-Tag: noindex, nofollow', true);
        exit;
    }
}, 1);

// ─── 6. Revalidate Next.js whenever a post is published/updated ─────────────
// Lives in this plugin so cache clears even if the child theme is missing.

if (!defined('APKJUNCTION_REVALIDATE_URL')) {
    define('APKJUNCTION_REVALIDATE_URL', 'https://apkjunction.com.pk/api/revalidate');
}
if (!defined('APKJUNCTION_REVALIDATE_SECRET')) {
    define('APKJUNCTION_REVALIDATE_SECRET', 'your-random-secret-here'); // match REVALIDATE_SECRET on the Next.js host
}

function apkjunction_ams_send_revalidate($payload = []) {
    $response = wp_remote_post(
        add_query_arg('secret', APKJUNCTION_REVALIDATE_SECRET, APKJUNCTION_REVALIDATE_URL),
        [
            'timeout'  => 15,
            'blocking' => false,
            'headers'  => ['Content-Type' => 'application/json'],
            'body'     => wp_json_encode($payload),
        ]
    );

    if (is_wp_error($response)) {
        error_log('APK Junction revalidate failed: ' . $response->get_error_message());
    }
}

function apkjunction_ams_revalidate_nextjs($post_id, $post) {
    if (wp_is_post_revision($post_id) || $post->post_status !== 'publish') {
        return;
    }
    if (!in_array($post->post_type, ['post', 'page'], true)) {
        return;
    }

    $categories = [];
    if ($post->post_type === 'post') {
        $terms = get_the_terms($post_id, 'category');
        if (is_array($terms)) {
            foreach ($terms as $term) {
                $categories[] = $term->slug;
            }
        }
    }

    apkjunction_ams_send_revalidate([
        'slug'       => $post->post_name,
        'categories' => $categories,
    ]);
}

add_action('save_post', 'apkjunction_ams_revalidate_nextjs', 20, 2);
add_action('transition_post_status', function ($new_status, $old_status, $post) {
    if ($new_status === 'publish' && $old_status !== 'publish' && $post instanceof WP_Post) {
        apkjunction_ams_revalidate_nextjs($post->ID, $post);
    }
}, 20, 3);
add_action('deleted_post', function () {
    apkjunction_ams_send_revalidate([]);
});

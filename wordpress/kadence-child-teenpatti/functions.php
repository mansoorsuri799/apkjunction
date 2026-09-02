<?php
/**
 * Kadence Child Theme — APK Junction
 * Headless WordPress integration for Next.js frontend.
 */

if (!defined('ABSPATH')) {
    exit;
}

// Load parent theme styles.
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style(
        'kadence-parent-style',
        get_template_directory_uri() . '/style.css',
        [],
        wp_get_theme(get_template())->get('Version')
    );
});

// ─── 1. Expose Rank Math SEO fields to REST API ─────────────────────────────

add_action('rest_api_init', function () {
    register_rest_field('post', 'rank_math', [
        'get_callback' => function ($post) {
            $id = is_array($post) ? $post['id'] : $post->ID;
            return [
                'title'         => get_post_meta($id, 'rank_math_title', true),
                'description'   => get_post_meta($id, 'rank_math_description', true),
                'focus_keyword' => get_post_meta($id, 'rank_math_focus_keyword', true),
                'rich_snippet'  => get_post_meta($id, 'rank_math_rich_snippet', true),
            ];
        },
        'schema' => [
            'description' => 'Rank Math SEO metadata for headless frontend',
            'type'        => 'object',
        ],
    ]);
});

// ─── 2. Allow CORS for Next.js frontend ────────────────────────────────────

add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function ($value) {
        $allowed_origins = [
            'http://localhost:3000',
            'https://apkjunction.com.pk',
            'https://www.apkjunction.com.pk',
        ];

        $origin = get_http_origin();
        if ($origin && in_array($origin, $allowed_origins, true)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Access-Control-Allow-Methods: GET, OPTIONS');
            header('Access-Control-Allow-Credentials: true');
        }

        return $value;
    });
}, 15);

// ─── 3. Revalidate Next.js on publish/update ────────────────────────────────

define('APKJUNCTION_REVALIDATE_URL', 'https://apkjunction.com.pk/api/revalidate');
define('APKJUNCTION_REVALIDATE_SECRET', 'your-random-secret-here'); // match REVALIDATE_SECRET on the Next.js host

function apkjunction_send_revalidate($payload = []) {
    $response = wp_remote_post(
        add_query_arg('secret', APKJUNCTION_REVALIDATE_SECRET, APKJUNCTION_REVALIDATE_URL),
        [
            'timeout'  => 15,
            'blocking' => true,
            'headers'  => ['Content-Type' => 'application/json'],
            'body'     => wp_json_encode($payload),
        ]
    );

    if (is_wp_error($response)) {
        error_log('APK Junction revalidate failed: ' . $response->get_error_message());
        return;
    }

    $code = wp_remote_retrieve_response_code($response);
    if ($code < 200 || $code >= 300) {
        error_log('APK Junction revalidate HTTP ' . $code . ': ' . wp_remote_retrieve_body($response));
    }
}

function apkjunction_revalidate_nextjs($post_id, $post) {
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

    apkjunction_send_revalidate([
        'slug'       => $post->post_name,
        'categories' => $categories,
    ]);
}

add_action('save_post', 'apkjunction_revalidate_nextjs', 20, 2);
add_action('transition_post_status', function ($new_status, $old_status, $post) {
    if ($new_status === 'publish' && $old_status !== 'publish' && $post instanceof WP_Post) {
        apkjunction_revalidate_nextjs($post->ID, $post);
    }
}, 20, 3);
add_action('deleted_post', function () {
    apkjunction_send_revalidate([]);
});

// ─── 4. Redirect public WP frontend → apkjunction.com.pk ────────────────────
// Keep admin, REST API, and media on AMS; send HTML pages to the Next.js site.

add_action('template_redirect', function () {
    if (is_admin() || wp_doing_ajax() || wp_doing_cron()) {
        return;
    }
    if (defined('REST_REQUEST') && REST_REQUEST) {
        return;
    }

    $uri = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '/';

    if (preg_match('#^/(wp-admin|wp-login\.php|wp-json|wp-cron\.php|xmlrpc\.php|wp-content|wp-includes)#i', $uri)) {
        return;
    }

    wp_redirect('https://apkjunction.com.pk' . $uri, 301);
    exit;
});

// ─── 5. Block AMS from Google indexing ──────────────────────────────────────
// WordPress on ams.apkjunction.com.pk is CMS-only; public SEO lives on apkjunction.com.pk.

add_filter('pre_option_blog_public', '__return_zero');

add_action('send_headers', function () {
    if (is_admin()) {
        return;
    }
    header('X-Robots-Tag: noindex, nofollow', true);
});

add_action('wp_head', function () {
    echo '<meta name="robots" content="noindex, nofollow">' . "\n";
}, 1);

add_filter('robots_txt', function () {
    return "User-agent: *\nDisallow: /\n";
}, 99);

add_filter('rank_math/frontend/robots', function () {
    return [
        'index'  => 'noindex',
        'follow' => 'nofollow',
    ];
});

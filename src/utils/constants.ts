export const HTTP_STATUS = {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
} as const;

export const MAX_LOG_QUERY_LENGTH = 30;

export const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
export const DEFAULT_MATCH_THRESHOLD = 0.5;
export const DEFAULT_INSTANCE_ID = 'adamic-blog-search';
export const HTML_CSP = "default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://static.cloudflareinsights.com; frame-src https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://adamic.tech; img-src 'self' data: https://adamic.tech; connect-src 'self' https://cloudflareinsights.com; manifest-src 'self' https://adamic.tech";
export const ICON_PATHS: Set<string> = new Set([
    '/favicon.ico',
    '/apple-touch-icon.png',
    '/apple-touch-icon-precomposed.png',
]);

export const WEB_MANIFEST: string = JSON.stringify({
    id: '/?v=2',
    name: 'Adamic AI Documentation Search',
    short_name: 'Adamic Search',
    description: 'AI-powered search for MCP servers and Cloudflare management tools documentation',
    icons: [
        {
            src: 'https://adamic.tech/assets/images/favicons/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
        },
        {
            src: 'https://adamic.tech/assets/images/favicons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
        },
    ],
    theme_color: '#1d4ed8',
    background_color: '#111827',
    display: 'standalone',
    start_url: '/',
    scope: '/',
    lang: 'en',
    categories: ['developer', 'documentation', 'tools'],
    orientation: 'any',
    dir: 'ltr',
    prefer_related_applications: false,
});

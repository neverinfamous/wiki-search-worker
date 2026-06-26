import { Env } from '../types.js';

export const SECURITY_HEADERS: Record<string, string> = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'none'",
};

const parsedOriginsCache = new Map<string, string[]>();

export function resolveAllowedOrigin(origin?: string | null, allowedOriginsRaw?: string): string | null {
    if (!allowedOriginsRaw) return null;
    
    let allowedOrigins = parsedOriginsCache.get(allowedOriginsRaw);
    if (!allowedOrigins) {
        allowedOrigins = allowedOriginsRaw.split(',').map((s) => s.trim());
        parsedOriginsCache.set(allowedOriginsRaw, allowedOrigins);
    }
    
    if (allowedOrigins.includes('*') || (origin && allowedOrigins.includes(origin))) {
        return origin || '*';
    }
    return null;
}

export function applyCorsHeaders(
    headers: Headers,
    origin?: string | null,
    allowedOriginsRaw?: string,
): Headers {
    const allowedOrigin = resolveAllowedOrigin(origin, allowedOriginsRaw);
    if (allowedOrigin) {
        headers.set('Access-Control-Allow-Origin', allowedOrigin);
    }
    
    headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return headers;
}

export function handleCORS(request: Request, env: Env): Response {
    const origin = request.headers.get('Origin');
    const headers = new Headers(SECURITY_HEADERS);
    headers.set('Access-Control-Max-Age', '86400'); // 24 hours

    return new Response(null, {
        status: 204,
        headers: applyCorsHeaders(headers, origin, env.ALLOWED_ORIGINS),
    });
}

export function jsonResponse(
    data: unknown,
    status = 200,
    additionalHeaders?: Record<string, string>,
    origin?: string | null,
    allowedOriginsRaw?: string,
): Response {
    const headers = new Headers(SECURITY_HEADERS);
    headers.set('Content-Type', 'application/json');
    
    if (additionalHeaders) {
        for (const [key, value] of Object.entries(additionalHeaders)) {
            headers.set(key, value);
        }
    }

    return new Response(JSON.stringify(data), {
        status,
        headers: applyCorsHeaders(headers, origin, allowedOriginsRaw),
    });
}

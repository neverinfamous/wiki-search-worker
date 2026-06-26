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
    headers: Record<string, string>,
    origin?: string | null,
    allowedOriginsRaw?: string,
): Record<string, string> {
    const allowedOrigin = resolveAllowedOrigin(origin, allowedOriginsRaw);
    if (allowedOrigin) {
        headers['Access-Control-Allow-Origin'] = allowedOrigin;
    }
    
    headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type';
    
    return headers;
}

export function handleCORS(request: Request, env: Env): Response {
    const origin = request.headers.get('Origin');
    const headers: Record<string, string> = {
        'Access-Control-Max-Age': '86400', // 24 hours
        ...SECURITY_HEADERS,
    };

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
    const headers: Record<string, string> = Object.assign(
        { 'Content-Type': 'application/json' },
        SECURITY_HEADERS,
        additionalHeaders
    );

    return new Response(JSON.stringify(data), {
        status,
        headers: applyCorsHeaders(headers, origin, allowedOriginsRaw),
    });
}

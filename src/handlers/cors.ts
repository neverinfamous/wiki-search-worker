import { Env } from '../types.js';

export const SECURITY_HEADERS: Record<string, string> = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'none'",
};

export function resolveAllowedOrigin(origin?: string | null, allowedOriginsRaw?: string): string | null {
    const allowedOrigins = allowedOriginsRaw
        ? allowedOriginsRaw.split(',').map((s) => s.trim())
        : [];
    
    if (allowedOrigins.includes('*') || (origin && allowedOrigins.includes(origin))) {
        return origin || '*';
    }
    return null;
}

export function handleCORS(request: Request, env: Env): Response {
    const origin = request.headers.get('Origin');
    const allowedOrigin = resolveAllowedOrigin(origin, env.ALLOWED_ORIGINS);

    const headers: Record<string, string> = {
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400', // 24 hours
        ...SECURITY_HEADERS,
    };

    if (allowedOrigin) {
        headers['Access-Control-Allow-Origin'] = allowedOrigin;
    }

    return new Response(null, {
        status: 204,
        headers,
    });
}

export function jsonResponse(
    data: unknown,
    status = 200,
    additionalHeaders?: Record<string, string>,
    origin?: string | null,
    allowedOriginsRaw?: string,
): Response {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...SECURITY_HEADERS,
        ...additionalHeaders,
    };

    const allowedOrigin = resolveAllowedOrigin(origin, allowedOriginsRaw);
    if (allowedOrigin) {
        headers['Access-Control-Allow-Origin'] = allowedOrigin;
    }
    
    headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type';

    return new Response(JSON.stringify(data), {
        status,
        headers,
    });
}

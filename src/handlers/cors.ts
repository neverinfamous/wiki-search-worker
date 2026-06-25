import { Env } from '../types.js';

export function handleCORS(request: Request, env: Env): Response {
    const origin = request.headers.get('Origin');
    const allowedOriginsRaw = env.ALLOWED_ORIGINS;
    const allowedOrigins = allowedOriginsRaw
        ? allowedOriginsRaw.split(',').map((s) => s.trim())
        : [];

    const headers: Record<string, string> = {
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400', // 24 hours
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Content-Security-Policy': "default-src 'none'",
    };

    if (allowedOrigins.includes('*') || (origin && allowedOrigins.includes(origin))) {
        headers['Access-Control-Allow-Origin'] = origin || '*';
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
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Content-Security-Policy': "default-src 'none'",
        ...additionalHeaders,
    };

    const allowedOrigins = allowedOriginsRaw
        ? allowedOriginsRaw.split(',').map((s) => s.trim())
        : [];
    if (allowedOrigins.includes('*') || (origin && allowedOrigins.includes(origin))) {
        headers['Access-Control-Allow-Origin'] = origin || '*';
    }
    headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type';

    return new Response(JSON.stringify(data), {
        status,
        headers,
    });
}

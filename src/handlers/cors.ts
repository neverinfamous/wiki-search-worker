import { Env } from '../types.js';

export function handleCORS(request: Request, env: Env): Response {
    const origin = request.headers.get('Origin');
    const allowedOrigins = env.ALLOWED_ORIGINS?.split(',') || ['*'];

    const headers: Record<string, string> = {
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400', // 24 hours
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
        ...additionalHeaders,
    };

    const allowedOrigins = allowedOriginsRaw?.split(',') || ['*'];
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

import { Env } from './types.js';
import { handleCORS, jsonResponse, SECURITY_HEADERS } from './handlers/cors.js';
import { handleSearch } from './handlers/search.js';
import { renderTemplate } from './ui/template.js';
import { logger } from './utils/logger.js';
import { AppError } from './utils/errors.js';
import { HTTP_STATUS, HTML_CSP, ICON_PATHS } from './utils/constants.js';
import pkg from '../package.json';

const VERSION = pkg.version;

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        if (request.method === 'OPTIONS') {
            return handleCORS(request, env);
        }

        const url = new URL(request.url);
        const path = url.pathname;

        try {
            if (path === '/') {
                return new Response(renderTemplate(env.TURNSTILE_SITE_KEY), {
                    headers: {
                        'Content-Type': 'text/html; charset=utf-8',
                        'Content-Security-Policy': HTML_CSP,
                        'X-Content-Type-Options': SECURITY_HEADERS['X-Content-Type-Options'],
                        'X-Frame-Options': SECURITY_HEADERS['X-Frame-Options'],
                        'Referrer-Policy': SECURITY_HEADERS['Referrer-Policy'],
                    },
                });
            }

            if (ICON_PATHS.includes(path)) {
                return Response.redirect(`https://adamic.tech/assets/images/favicons${path}`, 301);
            }

            if (path === '/health') {
                return jsonResponse(
                    {
                        status: 'healthy',
                        service: 'MCP Servers & Cloudflare Managers Documentation Search',
                        version: VERSION,
                        projects: [
                            'MySQL MCP',
                            'SQLite MCP',
                            'PostgreSQL MCP',
                            'Memory Journal MCP',
                            'D1 Manager',
                            'DO Manager',
                            'KV Manager',
                            'R2 Manager',
                        ],
                        endpoints: {
                            search: '/api/search (POST)',
                            health: '/health (GET)',
                        },
                    },
                    HTTP_STATUS.OK,
                    { 'X-Robots-Tag': 'noindex, nofollow' },
                    request.headers.get('Origin'),
                    env.ALLOWED_ORIGINS,
                );
            }

            if (path === '/api/search') {
                if (request.method === 'POST') {
                    return await handleSearch(request, env);
                } else if (request.method === 'GET') {
                    return jsonResponse(
                        {
                            error: 'Method not allowed',
                            message: 'This endpoint requires POST method with JSON body',
                        },
                        HTTP_STATUS.METHOD_NOT_ALLOWED,
                        { 'X-Robots-Tag': 'noindex, nofollow' },
                        request.headers.get('Origin'),
                        env.ALLOWED_ORIGINS,
                    );
                }
            }

            return jsonResponse(
                { error: 'Endpoint not found' },
                HTTP_STATUS.NOT_FOUND,
                undefined,
                request.headers.get('Origin'),
                env.ALLOWED_ORIGINS,
            );
        } catch (error) {
            if (error instanceof AppError) {
                logger.error('router', 'Worker error', { error: error.message, context: error.context });
                return jsonResponse(
                    {
                        success: false,
                        error: error.message,
                    },
                    error.statusCode,
                    undefined,
                    request.headers.get('Origin'),
                    env.ALLOWED_ORIGINS,
                );
            }

            const msg = error instanceof Error ? error.message : 'Internal server error';
            logger.error('router', 'Worker error', { error: msg });
            return jsonResponse(
                {
                    success: false,
                    error: 'An internal server error occurred',
                },
                HTTP_STATUS.INTERNAL_SERVER_ERROR,
                undefined,
                request.headers.get('Origin'),
                env.ALLOWED_ORIGINS,
            );
        }
    },
};

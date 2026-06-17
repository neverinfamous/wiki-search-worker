import { Env } from './types.js';
import { handleCORS, jsonResponse } from './handlers/cors.js';
import { handleSearch } from './handlers/search.js';
import { HTML_CONTENT } from './ui/template.js';
import { logger } from './utils/logger.js';

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        if (request.method === 'OPTIONS') {
            return handleCORS(request, env);
        }

        const url = new URL(request.url);
        const path = url.pathname;

        try {
            if (path === '/') {
                return new Response(HTML_CONTENT, {
                    headers: {
                        'Content-Type': 'text/html; charset=utf-8',
                    },
                });
            }

            if (path === '/favicon.ico') {
                return Response.redirect('https://adamic.tech/assets/images/favicons/favicon.ico', 301);
            }

            if (path === '/health') {
                return jsonResponse(
                    {
                        status: 'healthy',
                        service: 'MCP Servers & Cloudflare Managers Documentation Search',
                        version: '1.1.7',
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
                    200,
                    undefined,
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
                        405,
                        { 'X-Robots-Tag': 'noindex, nofollow' },
                        request.headers.get('Origin'),
                        env.ALLOWED_ORIGINS,
                    );
                }
            }

            return jsonResponse(
                { error: 'Endpoint not found' },
                404,
                undefined,
                request.headers.get('Origin'),
                env.ALLOWED_ORIGINS,
            );
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Internal server error';
            logger.error('router', 'Worker error', { error: msg });
            return jsonResponse(
                {
                    success: false,
                    error: msg,
                },
                500,
                undefined,
                request.headers.get('Origin'),
                env.ALLOWED_ORIGINS,
            );
        }
    },
};

import { Env } from '../types.js';
import { jsonResponse } from './cors.js';
import { SearchRequestSchema, isSpecificQuery } from '../schema/search.js';
import { logger } from '../utils/logger.js';
import { AiSearchError, ValidationError } from '../utils/errors.js';

interface SearchResponse {
    success: boolean;
    data?: unknown;
    error?: string;
    mode: string;
    timestamp: string;
}

export async function handleSearch(request: Request, env: Env): Promise<Response> {
    try {
        logger.info('api', `Search request received: ${request.url}`);

        let rawBody: unknown;
        try {
            rawBody = await request.json();
        } catch {
            throw new ValidationError('Invalid JSON payload');
        }

        const parseResult = SearchRequestSchema.safeParse(rawBody);

        if (!parseResult.success) {
            throw new ValidationError(`Validation failed: ${parseResult.error.message}`);
        }

        const body = parseResult.data;
        const truncatedQuery = body.query.length > 30 ? body.query.substring(0, 30) + '...' : body.query;
        logger.info('api', `Search query`, { query: truncatedQuery, mode: body.mode });

        const mode = body.mode;
        const maxResults = body.max_results;
        const shouldRewrite = body.rewrite ?? !isSpecificQuery(body.query);

        const aiSearch = env.WIKI_SEARCH;
        const searchOptions = {
            instance_ids: ['blog-index'],
            retrieval: {
                max_num_results: maxResults,
                match_threshold: 0.5,
            },
            query_rewrite: {
                enabled: shouldRewrite,
            },
        };
        const messages: Array<{ role: 'user'; content: string }> = [
            { role: 'user', content: body.query },
        ];

        let result: unknown;
        const startTime = Date.now();

        try {
            if (mode === 'ai') {
                result = await aiSearch.chatCompletions({
                    messages,
                    ai_search_options: searchOptions,
                });
            } else {
                result = await aiSearch.search({
                    messages,
                    ai_search_options: searchOptions,
                });
            }
        } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            throw new AiSearchError(`AI Search failed: ${msg}`);
        }

        const responseTime = Date.now() - startTime;

        const searchResult = result as { chunks?: unknown[] };
        const resultCount = searchResult.chunks?.length ?? 0;

        logger.info('api', 'Search completed', {
            query: body.query,
            mode,
            resultCount,
            responseTime: `${String(responseTime)}ms`,
        });

        const response: SearchResponse = {
            success: true,
            data: result,
            mode,
            timestamp: new Date().toISOString(),
        };

        return jsonResponse(
            response,
            200,
            { 'X-Response-Time': `${String(responseTime)}ms` },
            request.headers.get('Origin'),
            env.ALLOWED_ORIGINS,
        );
    } catch (error) {
        if (error instanceof ValidationError) {
            logger.warn('api', 'Validation error', {
                message: error.message,
                context: error.context,
            });
            return jsonResponse(
                {
                    success: false,
                    error: 'Invalid request: check query, mode, and max_results fields.',
                    mode: 'unknown',
                    timestamp: new Date().toISOString(),
                },
                error.statusCode,
                undefined,
                request.headers.get('Origin'),
                env.ALLOWED_ORIGINS,
            );
        }

        const msg = error instanceof Error ? error.message : 'Search failed';
        logger.error('api', 'Search error', {
            error: msg,
            stack: error instanceof Error ? error.stack : undefined,
            url: request.url,
        });

        return jsonResponse(
            {
                success: false,
                error: 'An internal server error occurred processing the search',
                mode: 'unknown',
                timestamp: new Date().toISOString(),
            },
            500,
            undefined,
            request.headers.get('Origin'),
            env.ALLOWED_ORIGINS,
        );
    }
}

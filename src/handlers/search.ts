import { Env } from '../types.js';
import { jsonResponse } from './cors.js';
import {
    SearchRequestSchema,
    isSpecificQuery,
    TurnstileResponseSchema,
} from '../schema/search.js';
import { logger } from '../utils/logger.js';
import { AiSearchError, ValidationError, AppError } from '../utils/errors.js';
import { HTTP_STATUS, MAX_LOG_QUERY_LENGTH, TURNSTILE_VERIFY_URL, DEFAULT_MATCH_THRESHOLD, DEFAULT_INSTANCE_ID } from '../utils/constants.js';

interface SearchResponse {
    success: boolean;
    data?: unknown;
    error?: string;
    mode: string;
    timestamp: string;
}

async function checkRateLimit(rateLimiter: Env['RATE_LIMITER'], ip: string): Promise<boolean> {
    if (!rateLimiter) {
        logger.error('api', 'RATE_LIMITER binding is missing. Failing closed.');
        throw new AppError('Rate limiting configuration error', 'INTERNAL_ERROR', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
    try {
        const { success } = await rateLimiter.limit({ key: ip });
        return success;
    } catch (error) {
        logger.error('api', 'Rate limiter error, failing closed', { error: String(error) });
        return false;
    }
}

async function verifyTurnstile(token: string | undefined, ip: string, secretKey?: string): Promise<void> {
    if (!secretKey) {
        logger.error('api', 'TURNSTILE_SECRET_KEY is missing. Failing closed.');
        throw new AppError('Security configuration error', 'INTERNAL_ERROR', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
    if (!token) {
        throw new ValidationError('Turnstile validation is required');
    }
    const params = new URLSearchParams();
    params.append('secret', secretKey);
    params.append('response', token);
    params.append('remoteip', ip);

    const result = await fetch(TURNSTILE_VERIFY_URL, {
        body: params,
        method: 'POST',
    });

    let outcomeRaw: unknown;
    try {
        outcomeRaw = await result.json();
    } catch {
        throw new ValidationError('Turnstile validation failed: Invalid response from Cloudflare');
    }

    const parseOutcome = TurnstileResponseSchema.safeParse(outcomeRaw);

    if (!parseOutcome.success || !parseOutcome.data.success) {
        throw new ValidationError('Turnstile validation failed');
    }

    const hostname = parseOutcome.data.hostname;
    if (hostname && hostname !== 'adamic.tech' && !hostname.endsWith('.adamic.tech')) {
        logger.warn('api', 'Turnstile token generated for invalid hostname', { hostname });
        throw new ValidationError('Turnstile validation failed: Invalid origin');
    }
}

export async function handleSearch(request: Request, env: Env): Promise<Response> {
    try {
        logger.info('api', `Search request received: ${request.url}`);

        const contentType = request.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new ValidationError('Unsupported Media Type: Content-Type must be application/json');
        }

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
        const truncatedQuery =
            body.query.length > MAX_LOG_QUERY_LENGTH ? body.query.substring(0, MAX_LOG_QUERY_LENGTH) + '...' : body.query;
        logger.info('api', `Search query`, { query: truncatedQuery, mode: body.mode });

        const ip = request.headers.get('cf-connecting-ip');
        if (!ip) {
            throw new ValidationError('Client IP is required for rate limiting');
        }
        const isRateLimitOk = await checkRateLimit(env.RATE_LIMITER, ip);
        
        if (!isRateLimitOk) {
            return jsonResponse(
                {
                    success: false,
                    error: 'Too many requests. Please try again later.',
                    mode: body.mode,
                    timestamp: new Date().toISOString(),
                },
                HTTP_STATUS.TOO_MANY_REQUESTS,
                undefined,
                request.headers.get('Origin'),
                env.ALLOWED_ORIGINS,
            );
        }

        await verifyTurnstile(body.turnstileToken, ip, env.TURNSTILE_SECRET_KEY);

        const mode = body.mode;
        const maxResults = body.max_results;
        const shouldRewrite = body.rewrite ?? !isSpecificQuery(body.query);

        const aiSearch = env.WIKI_SEARCH;
        const searchOptions = {
            instance_ids: [env.WIKI_SEARCH_INSTANCE_ID || DEFAULT_INSTANCE_ID],
            retrieval: {
                max_num_results: maxResults,
                match_threshold: DEFAULT_MATCH_THRESHOLD,
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

        const chunks = (result as Record<string, unknown> | null)?.chunks;
        const resultCount = Array.isArray(chunks) ? chunks.length : 0;

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
            HTTP_STATUS.OK,
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
            throw error;
        }

        const msg = error instanceof Error ? error.message : String(error);
        logger.error('api', 'Search error', {
            error: msg,
            stack: error instanceof Error ? error.stack : undefined,
            url: request.url,
        });

        throw error instanceof AppError ? error : new AppError(msg, 'INTERNAL_ERROR', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
}

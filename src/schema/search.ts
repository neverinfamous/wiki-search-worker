import { z } from 'zod';

export type SearchRequest = {
    query: string;
    mode: 'ai' | 'search';
    max_results: number;
    rewrite?: boolean;
    wiki?: string;
    turnstileToken: string;
};

export const SearchRequestSchema: z.ZodType<SearchRequest> = z
    .object({
        query: z
            .string()
            .min(3, 'Query must be at least 3 characters long')
            .max(500, 'Query must be less than 500 characters'),
        mode: z.enum(['ai', 'search']).optional().default('ai'),
        max_results: z.number().int().min(1).max(50).optional().default(5),
        rewrite: z.boolean().optional(),
        wiki: z.string().optional(),
        turnstileToken: z.string(),
    })
    .strict();

const SPECIFIC_QUERY_PATTERN = /(?:^how (?:do|to) i)|(?:\w+_\w+)|(?:`[^`]+`)|(?:"[^"]+")|(?:\b(?:install|configure|setup|create|delete|list|get)\b)/i;

/**
 * Determines if a query is specific enough to skip LLM query rewriting.
 * Specific queries (tool names, quoted terms, code patterns) typically
 * don't benefit from rewriting and can save ~100-200ms inference time.
 */
export function isSpecificQuery(query: string): boolean {
    return SPECIFIC_QUERY_PATTERN.test(query);
}

export type TurnstileResponse = {
    success: boolean;
    'error-codes'?: string[];
    challenge_ts?: string;
    hostname?: string;
};

export const TurnstileResponseSchema: z.ZodType<TurnstileResponse> = z.object({
    success: z.boolean(),
    'error-codes': z.array(z.string()).optional(),
    challenge_ts: z.string().optional(),
    hostname: z.string().optional(),
}).loose();

export type AiSearchResponse = {
    chunks?: Record<string, unknown>[];
};

export const AiSearchResponseSchema: z.ZodType<AiSearchResponse> = z.object({
    chunks: z.array(z.record(z.string(), z.unknown())).optional(),
}).loose();

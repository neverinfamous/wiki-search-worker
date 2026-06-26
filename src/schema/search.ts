import { z } from 'zod';

export const SearchRequestSchema = z
    .object({
        query: z
            .string()
            .min(3, 'Query must be at least 3 characters long')
            .max(500, 'Query must be less than 500 characters'),
        mode: z.enum(['ai', 'search']).optional().default('ai'),
        max_results: z.number().int().min(1).max(50).optional().default(5),
        rewrite: z.boolean().optional(),
        turnstileToken: z.string().optional(),
    })
    .strict();

export type SearchRequest = z.infer<typeof SearchRequestSchema>;

const SPECIFIC_QUERY_PATTERN = /(?:^how (?:do|to) i)|(?:\w+_\w+)|(?:`[^`]+`)|(?:"[^"]+")|(?:\b(?:install|configure|setup|create|delete|list|get)\b)/i;

/**
 * Determines if a query is specific enough to skip LLM query rewriting.
 * Specific queries (tool names, quoted terms, code patterns) typically
 * don't benefit from rewriting and can save ~100-200ms inference time.
 */
export function isSpecificQuery(query: string): boolean {
    return SPECIFIC_QUERY_PATTERN.test(query);
}

export const TurnstileResponseSchema = z.object({
    success: z.boolean(),
    'error-codes': z.array(z.string()).optional(),
    challenge_ts: z.string().optional(),
    hostname: z.string().optional(),
}).loose();

export type TurnstileResponse = z.infer<typeof TurnstileResponseSchema>;

export const AiSearchResponseSchema = z.object({
    chunks: z.array(z.record(z.string(), z.unknown())).optional(),
}).loose();

export type AiSearchResponse = z.infer<typeof AiSearchResponseSchema>;

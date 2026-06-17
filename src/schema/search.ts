import { z } from 'zod';

export const SearchRequestSchema = z.object({
    query: z
        .string()
        .min(3, 'Query must be at least 3 characters long')
        .max(500, 'Query must be less than 500 characters'),
    mode: z.enum(['ai', 'search']).optional().default('ai'),
    max_results: z.number().int().min(1).max(50).optional().default(5),
    rewrite: z.boolean().optional(),
}).strict();

export type SearchRequest = z.infer<typeof SearchRequestSchema>;

/**
 * Determines if a query is specific enough to skip LLM query rewriting.
 * Specific queries (tool names, quoted terms, code patterns) typically
 * don't benefit from rewriting and can save ~100-200ms inference time.
 */
export function isSpecificQuery(query: string): boolean {
    const specificPatterns = [
        /^how (do|to) i/i, // Clear how-to questions
        /\w+_\w+/, // Tool names (snake_case patterns)
        /`[^`]+`/, // Code backticks
        /"[^"]+"/, // Quoted exact terms
        /\b(install|configure|setup|create|delete|list|get)\b/i, // Action verbs
    ];
    return specificPatterns.some((p) => p.test(query));
}

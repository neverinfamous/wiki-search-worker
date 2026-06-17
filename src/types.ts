export interface AiSearchBinding {
    chatCompletions(options: Record<string, unknown>): Promise<unknown>;
    search(options: Record<string, unknown>): Promise<unknown>;
}

// Ensure the Env interface matches what wrangler provides
export interface Env {
    AI: unknown;
    WIKI_SEARCH: AiSearchBinding;
    ALLOWED_ORIGINS?: string;
    TURNSTILE_SITE_KEY?: string;
    TURNSTILE_SECRET_KEY?: string;
    RATE_LIMITER?: { limit: (options: { key: string }) => Promise<{ success: boolean }> };
}

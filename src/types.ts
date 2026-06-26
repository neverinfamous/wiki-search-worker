export interface AiSearchBinding {
    chatCompletions(options: {
        messages: Array<{ role: string; content: string }>;
        ai_search_options?: Record<string, unknown>;
    }): Promise<{ chunks?: Array<Record<string, unknown>> } & Record<string, unknown>>;
    search(options: {
        messages: Array<{ role: string; content: string }>;
        ai_search_options?: Record<string, unknown>;
    }): Promise<{ chunks?: Array<Record<string, unknown>> } & Record<string, unknown>>;
}

// Ensure the Env interface matches what wrangler provides
export interface Env {
    WIKI_SEARCH: AiSearchBinding;
    WIKI_SEARCH_INSTANCE_ID?: string;
    ALLOWED_ORIGINS?: string;
    TURNSTILE_SITE_KEY?: string;
    TURNSTILE_SECRET_KEY?: string;
    RATE_LIMITER?: { limit: (options: { key: string }) => Promise<{ success: boolean }> };
}

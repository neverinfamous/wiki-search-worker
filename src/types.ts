export interface AiSearchBinding {
    chatCompletions(options: Record<string, unknown>): Promise<Record<string, unknown>>;
    search(options: Record<string, unknown>): Promise<Record<string, unknown>>;
}

export interface Env {
    WIKI_SEARCH: AiSearchBinding;
    WIKI_SEARCH_INSTANCE_ID?: string;
    ALLOWED_ORIGINS?: string;
    TURNSTILE_SITE_KEY?: string;
    TURNSTILE_SECRET_KEY?: string;
    RATE_LIMITER?: { limit: (options: { key: string }) => Promise<{ success: boolean }> };
}

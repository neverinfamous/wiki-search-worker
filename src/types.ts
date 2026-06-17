export interface AiSearchBinding {
    chatCompletions(options: Record<string, unknown>): Promise<unknown>;
    search(options: Record<string, unknown>): Promise<unknown>;
}

// Ensure the Env interface matches what wrangler provides
export interface Env {
    AI: unknown;
    WIKI_SEARCH: AiSearchBinding;
    ALLOWED_ORIGINS?: string;
}

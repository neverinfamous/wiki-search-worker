/**
 * Typed error classes for the Wiki Search Worker
 */

export class AppError extends Error {
    constructor(
        public readonly message: string,
        public readonly code: string,
        public readonly statusCode: number,
        public readonly context?: Record<string, unknown>
    ) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class ValidationError extends AppError {
    constructor(message: string, context?: Record<string, unknown>) {
        super(message, 'VALIDATION_ERROR', 400, context);
    }
}

export class AiSearchError extends AppError {
    constructor(message: string, context?: Record<string, unknown>) {
        super(message, 'AI_SEARCH_ERROR', 500, context);
    }
}

export class ConfigurationError extends AppError {
    constructor(message: string, context?: Record<string, unknown>) {
        super(message, 'CONFIGURATION_ERROR', 500, context);
    }
}

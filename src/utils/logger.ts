/**
 * Centralized structured logger
 */

export type LogLevel = 'INFO' | 'WARN' | 'ERROR';

export const logger = {
    info(module: string, message: string, context?: Record<string, unknown>): void {
        log('INFO', module, message, context);
    },
    warn(module: string, message: string, context?: Record<string, unknown>): void {
        log('WARN', module, message, context);
    },
    error(module: string, message: string, context?: Record<string, unknown>): void {
        log('ERROR', module, message, context);
    },
};

function log(level: LogLevel, module: string, message: string, context?: Record<string, unknown>) {
    const payload = context
        ? { timestamp: new Date().toISOString(), level, module, message, ...context }
        : { timestamp: new Date().toISOString(), level, module, message };

    if (level === 'ERROR') {
        console.error(JSON.stringify(payload));
    } else if (level === 'WARN') {
        console.warn(JSON.stringify(payload));
    } else {
        console.log(JSON.stringify(payload));
    }
}

/**
 * Contract for handling commands received from the server.
 */
export interface CommandHandler {
    execute(payload: unknown): void
}
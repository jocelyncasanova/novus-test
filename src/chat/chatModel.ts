/**
 * Claude model used by the Agent Chat dev proxy (vite.config.ts).
 *
 * Lives in its own dependency-free module so client code (Pendo trackAgent
 * `modelUsed`) and the server-side proxy share one source of truth.
 */
export const CHAT_MODEL = 'claude-opus-4-8'

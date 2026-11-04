/**
 * Pendo Track Agent helper — reports conversational AI agent interactions
 * via `window.pendo.trackAgent()`.
 *
 * The Pendo snippet is not guaranteed to be on the page (see PendoBridge.tsx),
 * so every call is a guarded no-op when `window.pendo.trackAgent` is absent,
 * and analytics failures are swallowed so they can never break the chat flow.
 */

/** Pendo agent ID for the Halo Assistant chat panel (src/chat/ChatPanel.tsx). */
export const HALO_ASSISTANT_AGENT_ID = 'kmMouNu357T3hKSg9pmG6C3SwR4'

export type TrackAgentEventType = 'prompt' | 'agent_response' | 'user_reaction'

export interface TrackAgentMetadata {
  agentId: string
  conversationId: string
  messageId: string
  /** Message text, or the reaction type for `user_reaction` events. */
  content: string
  modelUsed?: string
  suggestedPrompt?: boolean
  toolsUsed?: string[]
  fileUploaded?: boolean
}

declare global {
  interface Window {
    pendo?: {
      trackAgent?: (eventType: TrackAgentEventType, metadata: TrackAgentMetadata) => void
    }
  }
}

export function trackAgent(eventType: TrackAgentEventType, metadata: TrackAgentMetadata): void {
  try {
    window.pendo?.trackAgent?.(eventType, metadata)
  } catch {
    // Analytics must never interrupt the user-facing flow.
  }
}

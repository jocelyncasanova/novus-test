/**
 * Pendo Track Event helper.
 *
 * Thin, typed wrapper around the Pendo agent's `pendo.track()` call. The agent
 * attaches visitor + account automatically, so callers pass only event
 * properties (never visitorId / accountId).
 *
 * The agent may not be loaded (PendoBridge is currently a pass-through, ad
 * blockers, local dev), so the call is optional-chained and wrapped in
 * try/catch — a tracking failure must never break the product flow.
 *
 * Event names are passed verbatim: they must match the track type registered
 * in Pendo exactly (case-sensitive).
 */

export type PendoTrackValue = string | number | boolean | null | string[]

export type PendoTrackProperties = Record<string, PendoTrackValue>

type PendoAgent = {
  track?: (eventName: string, properties?: PendoTrackProperties) => void
}

declare global {
  interface Window {
    pendo?: PendoAgent
  }
}

export function trackPendoEvent(
  eventName: string,
  properties: PendoTrackProperties = {},
): void {
  try {
    window.pendo?.track?.(eventName, properties)
  } catch (err) {
    console.error(`[pendo] track failed for ${eventName}:`, err)
  }
}

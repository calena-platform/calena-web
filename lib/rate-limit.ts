// Naive per-IP, in-memory rate limit. Single-instance only (resets on deploy /
// cold start) — a deliberate v1 floor against casual abuse, not a hardened
// limiter. A shared store (KV/Redis) would replace this if the surface needs it.

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_HITS = 5; // requests per window per key

const hits = new Map<string, number[]>();

export function rateLimit(
  key: string,
  now: number = Date.now(),
): { allowed: boolean } {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_HITS) {
    hits.set(key, recent);
    return { allowed: false };
  }

  recent.push(now);
  hits.set(key, recent);
  return { allowed: true };
}

// Test helper — clears all counters.
export function __resetRateLimit() {
  hits.clear();
}

export const RATE_LIMIT = { WINDOW_MS, MAX_HITS } as const;

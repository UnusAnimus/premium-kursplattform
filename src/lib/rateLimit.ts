/**
 * Simple in-memory rate limiter.
 * Resets automatically when the sliding window expires.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// Module-level store – shared across requests within the same server process.
const store = new Map<string, RateLimitEntry>();

const RATE_LIMIT_MAX = 20;             // max requests per window
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

/**
 * Check whether a given key has exceeded the rate limit.
 * Returns `{ allowed: true }` when under the limit and increments the counter,
 * or `{ allowed: false, retryAfterMs: number }` when the limit is exceeded.
 */
export function checkRateLimit(key: string): { allowed: true } | { allowed: false; retryAfterMs: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now >= entry.resetAt) {
    // First request in a new window
    store.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, retryAfterMs: entry.resetAt - now };
  }

  entry.count += 1;
  return { allowed: true };
}

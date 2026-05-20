/**
 * Formats a duration in seconds to a human-readable string.
 * e.g. 75 → "1m 15s" | 3720 → "1h 2m" | 45 → "45s" | 0 → "0s"
 */
export function formatDurationSec(totalSec: number): string {
  const t = Math.max(0, Math.round(totalSec));
  if (t === 0) return "0s";

  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;

  if (h > 0) {
    // Only show minutes if non-zero; drop seconds at this scale
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  if (m > 0) {
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  }
  return `${s}s`;
}

/**
 * Formats a duration in milliseconds.
 */
export function formatDurationMs(totalMs: number): string {
  return formatDurationSec(Math.round(totalMs / 1000));
}

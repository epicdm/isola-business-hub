// Per-business escalation SLA. Pure client-side preference for the mock app —
// drives the countdown timer on the Command Center's Escalations track.
//
// Stored in localStorage under a single key. In real backend land this would
// live on the tenant settings record.

export const SLA_STORAGE_KEY = "isola.escalationSlaMinutes";

/** Allowed SLA presets, in minutes. UI is a Select. */
export const SLA_PRESETS = [
  { value: 15, label: "15 minutes", short: "15m" },
  { value: 30, label: "30 minutes", short: "30m" },
  { value: 60, label: "1 hour", short: "1h" },
  { value: 120, label: "2 hours", short: "2h" },
  { value: 240, label: "4 hours", short: "4h" },
] as const;

export const DEFAULT_SLA_MINUTES = 60;

/** Read the configured SLA in minutes, falling back to the default. */
export function readSlaMinutes(): number {
  if (typeof window === "undefined") return DEFAULT_SLA_MINUTES;
  try {
    const raw = window.localStorage.getItem(SLA_STORAGE_KEY);
    if (!raw) return DEFAULT_SLA_MINUTES;
    const n = parseInt(raw, 10);
    if (!Number.isFinite(n) || n <= 0) return DEFAULT_SLA_MINUTES;
    // Snap to a known preset so we don't drift on stale values.
    const allowed = SLA_PRESETS.map((p) => p.value);
    return allowed.includes(n as (typeof allowed)[number]) ? n : DEFAULT_SLA_MINUTES;
  } catch {
    return DEFAULT_SLA_MINUTES;
  }
}

export function saveSlaMinutes(minutes: number) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SLA_STORAGE_KEY, String(minutes));
    // Notify same-tab listeners — `storage` only fires across tabs.
    window.dispatchEvent(new Event("isola:sla-changed"));
  } catch {
    // ignore quota errors
  }
}

/** Human-readable short form, e.g. 60 → "1h", 30 → "30m". */
export function formatSlaShort(minutes: number): string {
  const preset = SLA_PRESETS.find((p) => p.value === minutes);
  if (preset) return preset.short;
  if (minutes >= 60 && minutes % 60 === 0) return `${minutes / 60}h`;
  return `${minutes}m`;
}

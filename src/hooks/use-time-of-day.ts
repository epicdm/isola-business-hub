"use client";

import { useEffect } from "react";

/**
 * Time-of-day buckets — drive the ambient hero tint and Ema's greeting.
 *
 * Buckets are intentionally chunky (not minute-precise) so the room feels
 * like it shifts with daylight without becoming distracting.
 */
export type TimeBucket = "morning" | "midday" | "evening" | "night";

export function bucketForHour(h: number): TimeBucket {
  if (h >= 5 && h < 11) return "morning";
  if (h >= 11 && h < 17) return "midday";
  if (h >= 17 && h < 21) return "evening";
  return "night";
}

/**
 * Sets `<html data-time="morning|midday|evening|night">` on mount and
 * re-evaluates every 10 minutes so the tint and greeting drift with the
 * actual clock without a page refresh. SSR-safe: skips when window is
 * undefined.
 */
export function useTimeOfDay() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const apply = () => {
      const b = bucketForHour(new Date().getHours());
      document.documentElement.dataset.time = b;
    };
    apply();
    const id = window.setInterval(apply, 10 * 60 * 1000);
    return () => window.clearInterval(id);
  }, []);
}

export function currentBucket(): TimeBucket {
  return bucketForHour(new Date().getHours());
}

import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { touchVisit, REBASE_AFTER_MIN } from "@/lib/home-data";

describe("touchVisit / baseline rebasing", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns no baseline on the very first visit and stamps current", () => {
    vi.setSystemTime(new Date("2026-01-01T10:00:00Z"));
    const res = touchVisit();
    expect(res).toEqual({ baseline: null, rebased: false });
    expect(window.localStorage.getItem("isola.currentVisitAt")).toBeTruthy();
    expect(window.localStorage.getItem("isola.lastVisitAt")).toBeNull();
  });

  it("does NOT rebase when the gap is shorter than REBASE_AFTER_MIN", () => {
    const t0 = new Date("2026-01-01T10:00:00Z").getTime();
    vi.setSystemTime(t0);
    touchVisit();

    // Move forward but stay UNDER the rebase threshold.
    vi.setSystemTime(t0 + (REBASE_AFTER_MIN - 1) * 60_000);
    const res = touchVisit();

    expect(res.rebased).toBe(false);
    // No baseline persisted yet because we never crossed the threshold.
    expect(window.localStorage.getItem("isola.lastVisitAt")).toBeNull();
  });

  it("rebases the baseline once inactivity reaches REBASE_AFTER_MIN", () => {
    const t0 = new Date("2026-01-01T10:00:00Z").getTime();
    vi.setSystemTime(t0);
    touchVisit();

    // Jump forward past the inactivity threshold.
    const tAway = t0 + (REBASE_AFTER_MIN + 5) * 60_000;
    vi.setSystemTime(tAway);
    const res = touchVisit();

    expect(res.rebased).toBe(true);
    expect(res.baseline).toBe(t0);
    expect(window.localStorage.getItem("isola.lastVisitAt")).toBe(String(t0));
    expect(window.localStorage.getItem("isola.currentVisitAt")).toBe(String(tAway));
  });

  it("keeps the same baseline across rapid in-session re-mounts", () => {
    const t0 = new Date("2026-01-01T10:00:00Z").getTime();
    vi.setSystemTime(t0);
    touchVisit();

    // First real "away" → baseline set to t0.
    vi.setSystemTime(t0 + (REBASE_AFTER_MIN + 1) * 60_000);
    const first = touchVisit();
    expect(first.rebased).toBe(true);
    expect(first.baseline).toBe(t0);

    // Quick navigation a minute later — baseline must NOT shift.
    vi.setSystemTime(t0 + (REBASE_AFTER_MIN + 2) * 60_000);
    const second = touchVisit();
    expect(second.rebased).toBe(false);
    expect(second.baseline).toBe(t0);
  });
});

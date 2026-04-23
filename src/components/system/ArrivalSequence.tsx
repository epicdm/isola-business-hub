"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EmaOrb } from "@/components/brand/IsolaBrand";

export const ARRIVAL_FLAG = "isola.hasArrived";
export const ARRIVAL_DONE_EVENT = "isola:arrival-done";

/**
 * First-login arrival sequence.
 *
 * Plays once per browser (gated by localStorage[ARRIVAL_FLAG]). The intro
 * lives on top of the dashboard so the home page can mount in the background
 * and quietly fade in as the orb shrinks toward the sidebar logo position.
 *
 * Flow:
 *   1. Full-screen dark veil + centered EmaOrb pulses ~1.4s.
 *   2. Caption fades in letter by letter.
 *   3. Orb scales down + translates to top-left (sidebar logo target).
 *   4. Veil fades out → home page is fully visible. Flag is set.
 *
 * Skippable with Esc or the "Skip intro" button. Total duration ~3.6s by
 * design — long enough to feel like a moment, short enough not to annoy on
 * subsequent fresh installs (which won't see it again anyway).
 */
export default function ArrivalSequence({
  /** Override for the "Replay arrival" menu item — forces playback. */
  force = false,
}: {
  force?: boolean;
}) {
  const [shouldPlay, setShouldPlay] = useState(false);
  const [phase, setPhase] = useState<"orb" | "caption" | "fly" | "done">("orb");
  const timersRef = useRef<number[]>([]);

  // Decide on mount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const arrived = window.localStorage.getItem(ARRIVAL_FLAG) === "true";
    if (force || !arrived) {
      setShouldPlay(true);
    }
  }, [force]);

  const finish = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ARRIVAL_FLAG, "true");
      window.dispatchEvent(new Event(ARRIVAL_DONE_EVENT));
    }
    setPhase("done");
    setShouldPlay(false);
  };

  // Schedule phase transitions whenever a fresh playback starts.
  useEffect(() => {
    if (!shouldPlay) return;
    setPhase("orb");
    const t = (ms: number, fn: () => void) => {
      const id = window.setTimeout(fn, ms);
      timersRef.current.push(id);
      return id;
    };
    t(450, () => setPhase("caption"));
    t(1700, () => setPhase("fly"));
    t(3400, finish);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldPlay]);

  if (!shouldPlay) return null;

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="arrival"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
        >
          {/* Soft aurora wash for atmosphere */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,oklch(0.7_0.22_295/0.18),transparent_70%),radial-gradient(ellipse_50%_45%_at_30%_70%,oklch(0.78_0.17_152/0.12),transparent_70%)]"
          />

          <button
            type="button"
            onClick={finish}
            className="absolute right-5 top-5 rounded-full border border-border/40 bg-card/40 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-md transition-colors hover:bg-card/70 hover:text-foreground"
          >
            Skip intro · Esc
          </button>

          {/* Orb — centered, then flies to sidebar logo position */}
          <motion.div
            initial={{ scale: 1, x: 0, y: 0, opacity: 0 }}
            animate={
              phase === "fly"
                ? {
                    scale: 0.25,
                    // Fly toward sidebar logo: ~40px from left, ~32px from top
                    // of viewport. We approximate from center.
                    x: typeof window !== "undefined" ? -window.innerWidth / 2 + 60 : -600,
                    y: typeof window !== "undefined" ? -window.innerHeight / 2 + 50 : -400,
                    opacity: 0,
                  }
                : { scale: 1, x: 0, y: 0, opacity: 1 }
            }
            transition={
              phase === "fly"
                ? { duration: 1.1, ease: [0.22, 1, 0.36, 1] }
                : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
            }
            className="relative z-10"
          >
            <EmaOrb size={120} pulse />
          </motion.div>

          {/* Caption — letter-by-letter reveal */}
          <div className="absolute top-[calc(50%+90px)] left-1/2 -translate-x-1/2">
            <AnimatePresence>
              {phase !== "fly" && (
                <motion.div
                  key="caption"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: phase === "caption" ? 1 : 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="font-display text-[11px] uppercase tracking-[0.32em] text-ema"
                >
                  {"Isola is coming online…".split("").map((ch, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.05 + i * 0.035,
                        duration: 0.25,
                      }}
                    >
                      {ch === " " ? "\u00A0" : ch}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Public helpers — used by the system menu's "Replay arrival" item.
// ---------------------------------------------------------------------------

export function clearArrivalFlag() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ARRIVAL_FLAG);
}

/**
 * Tells callers whether the arrival sequence is going to play on this mount.
 * Pages use this to gate "first-time" reveal animations (count-up, type-in)
 * so they only happen on a true first visit, not on every navigation.
 */
export function isFirstArrival(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(ARRIVAL_FLAG) !== "true";
}

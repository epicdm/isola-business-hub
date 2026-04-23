"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Activity } from "lucide-react";
import { isFirstArrival } from "@/components/system/ArrivalSequence";

type Props = {
  greeting: string;
  businessName: string;
  headline: string;
  /** Live counts to power the system-state strip. */
  stats: {
    messages: number;
    bookings: number;
    needsYou: number;
    autoPct: number;
  };
};

/**
 * The "arrival" moment after login. This is the single most-visible component
 * on the home page — it sets the mental model:
 *
 *   "I'm not on a screen. I'm at the head of an operating system that's
 *    already running my business."
 *
 * On a true first arrival (gated by isFirstArrival()), the four stat numbers
 * count up from 0 and the headline types in character-by-character. On every
 * subsequent navigation, values render instantly so the page feels snappy.
 */
export default function ExecutiveHeader({
  greeting,
  businessName,
  headline,
  stats,
}: Props) {
  // Live clock — shown subtly as part of the "operations room" feel.
  const [clock, setClock] = useState<string>("");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(
        d.toLocaleTimeString(undefined, {
          hour: "numeric",
          minute: "2-digit",
        }),
      );
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  // First-arrival reveal flags — captured once on mount so navigation back to
  // home doesn't re-trigger the count-up.
  const animateRef = useRef<boolean | null>(null);
  if (animateRef.current === null) {
    animateRef.current = typeof window !== "undefined" && isFirstArrival();
  }
  const animate = animateRef.current ?? false;

  return (
    <motion.header
      data-executive-header
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-card px-6 py-8 shadow-elegant sm:px-10 sm:py-10"
    >
      {/* Signature ambient glow — subtle, not flashy. Reinforces "alive system". */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_70%_at_85%_0%,oklch(0.78_0.17_152/0.18),transparent_60%),radial-gradient(ellipse_55%_60%_at_5%_100%,oklch(0.72_0.19_30/0.12),transparent_65%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-30"
      />

      {/* Eyebrow row */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/70 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
          </span>
          <span className="font-semibold text-foreground/80">{businessName}</span>
          <span className="text-muted-foreground/60">· Operating system live</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Activity className="h-3 w-3" />
          <span>{clock}</span>
        </div>
      </div>

      {/* Greeting + headline */}
      <div className="mt-5 max-w-3xl">
        <p className="text-sm font-medium text-muted-foreground">{greeting}</p>
        <h1 className="mt-2 font-display text-2xl font-semibold leading-[1.15] tracking-tight sm:text-[34px]">
          {animate ? <TypeIn text={headline} /> : headline}
        </h1>
      </div>

      {/* System-state strip */}
      <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border/40 bg-border/40 sm:grid-cols-4">
        <Stat label="Conversations · 24h" value={stats.messages} tone="aqua" animate={animate} />
        <Stat label="Bookings · 24h" value={stats.bookings} tone="primary" animate={animate} />
        <Stat label="Auto-resolved" value={stats.autoPct} suffix="%" tone="violet" animate={animate} />
        <Stat
          label="Needs you"
          value={stats.needsYou}
          tone={stats.needsYou > 0 ? "ema" : "muted"}
          animate={animate}
        />
      </div>
    </motion.header>
  );
}

function Stat({
  label,
  value,
  suffix,
  tone,
  animate,
}: {
  label: string;
  value: number;
  suffix?: string;
  tone: "aqua" | "primary" | "violet" | "ema" | "muted";
  animate: boolean;
}) {
  const toneClass =
    tone === "aqua"
      ? "text-aqua"
      : tone === "primary"
        ? "text-primary"
        : tone === "violet"
          ? "text-violet"
          : tone === "ema"
            ? "text-ema"
            : "text-muted-foreground";

  const display = useCountUp(value, animate ? 600 : 0);

  return (
    <div className="bg-card/70 px-5 py-4">
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
      <div
        className={`mt-1 font-display text-2xl font-semibold leading-none tabular-nums ${toneClass}`}
      >
        {display}
        {suffix ?? ""}
      </div>
    </div>
  );
}

/**
 * Count up from 0 to `target` over `durationMs` using an ease-out curve.
 * When `durationMs` is 0 (post-arrival visits) we render the final value
 * immediately so the page feels snappy on every navigation.
 */
function useCountUp(target: number, durationMs: number): number {
  const [v, setV] = useState(durationMs === 0 ? target : 0);
  useEffect(() => {
    if (durationMs === 0) {
      setV(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setV(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return v;
}

/**
 * Type-in effect for the headline. Reveals one character every ~30ms after
 * a short initial delay so the orb intro can land first.
 */
function TypeIn({ text }: { text: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    const start = performance.now() + 200;
    let raf = 0;
    const tick = (now: number) => {
      if (now < start) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const i = Math.min(text.length, Math.floor((now - start) / 28));
      setN(i);
      if (i < text.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text]);
  return (
    <>
      {text.slice(0, n)}
      <span className="ml-0.5 inline-block h-[0.9em] w-[2px] -mb-1 animate-pulse bg-foreground/60 align-baseline" />
    </>
  );
}

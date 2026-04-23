"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Activity } from "lucide-react";

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
 * Visual hierarchy:
 *   • Eyebrow: business name + live indicator (system is on)
 *   • Greeting (small): warm, time-aware
 *   • Headline (huge): one-sentence narrative of today
 *   • System-state strip: hairline-divided counts that ground the narrative
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
          {headline}
        </h1>
      </div>

      {/* System-state strip */}
      <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border/40 bg-border/40 sm:grid-cols-4">
        <Stat label="Conversations · 24h" value={stats.messages} tone="aqua" />
        <Stat label="Bookings · 24h" value={stats.bookings} tone="primary" />
        <Stat label="Auto-resolved" value={`${stats.autoPct}%`} tone="violet" />
        <Stat
          label="Needs you"
          value={stats.needsYou}
          tone={stats.needsYou > 0 ? "ema" : "muted"}
        />
      </div>
    </motion.header>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | string;
  tone: "aqua" | "primary" | "violet" | "ema" | "muted";
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

  return (
    <div className="bg-card/70 px-5 py-4">
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
      <div
        className={`mt-1 font-display text-2xl font-semibold leading-none tabular-nums ${toneClass}`}
      >
        {value}
      </div>
    </div>
  );
}

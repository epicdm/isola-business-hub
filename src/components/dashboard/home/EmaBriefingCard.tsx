"use client";

import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import type { EmaBriefing } from "@/lib/home-data";

type Props = {
  briefing: EmaBriefing;
};

/**
 * Ema's chief-of-staff briefing. This is the second-most important block on
 * the home page (after the executive header). It positions Ema as a layer
 * that observes everything and reports what matters — not as a chatbot.
 *
 * Visual signature:
 *   • Coral aurora orb — Ema's signature identity
 *   • Hand-written-feeling natural-language paragraph
 *   • Three crisp observation bullets
 *   • One single recommended next action (high signal, low noise)
 */
export default function EmaBriefingCard({ briefing }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Ema briefing"
      className="relative overflow-hidden rounded-2xl border border-ema/30 bg-card/60 p-6 shadow-card sm:p-7"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_55%_at_0%_0%,oklch(0.72_0.19_30/0.18),transparent_65%)]"
      />

      {/* Header row — Ema identity + eyebrow */}
      <div className="flex items-start gap-4">
        <EmaOrb />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-ema">
            <Sparkles className="h-3 w-3" />
            Ema · Chief of staff briefing
          </div>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            {briefing.greeting}
          </p>
        </div>
      </div>

      {/* The briefing prose */}
      <p className="mt-5 font-display text-lg font-medium leading-snug text-foreground/95 sm:text-xl">
        {briefing.headline}
      </p>

      {/* Observations */}
      {briefing.bullets.length > 0 && (
        <ul className="mt-5 space-y-2.5">
          {briefing.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/80">
              <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-ema/70" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Recommendation */}
      {briefing.recommendation && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/40 bg-background/40 p-4">
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ema/20 text-ema">
              <Sparkles className="h-3 w-3" />
            </div>
            <p className="text-sm text-foreground/90">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ema">
                Recommended
              </span>
              <br />
              {briefing.recommendation.text}
            </p>
          </div>
          {briefing.recommendation.cta && (
            <Link
              to={briefing.recommendation.cta.to}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ema px-3.5 py-2 text-xs font-semibold text-ema-foreground transition-transform hover:-translate-y-0.5"
            >
              {briefing.recommendation.cta.label}
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      )}
    </motion.section>
  );
}

function EmaOrb() {
  return (
    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
      <span className="absolute inset-0 rounded-full aurora-ring opacity-80" />
      <span className="absolute inset-[2px] rounded-full bg-card" />
      <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-gradient-ema text-ema-foreground shadow-ema">
        <Sparkles className="h-3 w-3" />
      </span>
    </div>
  );
}

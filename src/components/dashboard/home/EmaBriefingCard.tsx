"use client";

import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Coffee,
} from "lucide-react";
import type { EmaBriefing, EmaInsight } from "@/lib/home-data";

type Props = {
  briefing: EmaBriefing;
};

/**
 * Ema's chief-of-staff briefing — restructured as a DECISION layer.
 *
 * Old version: greeting + headline + bullets + recommendation.
 * New version: greeting + headline + (Win | Risk) + Recommendation w/ reason
 * + "what can wait" reassurance.
 *
 * The four blocks below correspond to the four questions an executive
 * actually asks first thing in the morning:
 *   1. What's working?           → Win
 *   2. What could go wrong?      → Risk
 *   3. What should I do first?   → Recommendation (with WHY)
 *   4. What can I safely ignore? → Can wait
 *
 * The recommendation is the largest, highest-contrast block — it's the
 * single most important statement on the entire home page.
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

      {/* Header — Ema identity */}
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

      {/* The headline — one-sentence executive summary */}
      <p className="mt-5 font-display text-lg font-medium leading-snug text-foreground/95 sm:text-xl">
        {briefing.headline}
      </p>

      {/* Win + Risk grid — interpretation, not just data */}
      {(briefing.win || briefing.risk) && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {briefing.win && (
            <InsightBlock
              label="Biggest win"
              tone="success"
              icon={TrendingUp}
              insight={briefing.win}
            />
          )}
          {briefing.risk && (
            <InsightBlock
              label="Biggest risk"
              tone="ema"
              icon={AlertTriangle}
              insight={briefing.risk}
            />
          )}
        </div>
      )}

      {/* Recommendation — the most important statement on the page */}
      {briefing.recommendation && (
        <div className="relative mt-5 overflow-hidden rounded-xl border border-ema/40 bg-gradient-to-br from-ema/10 via-card/60 to-card/60 p-4 shadow-ema sm:p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ema/20 text-ema">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ema">
                Ema recommends
              </div>
              <p className="mt-1 font-display text-base font-semibold leading-snug text-foreground sm:text-lg">
                {briefing.recommendation.text}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground/70">Because </span>
                {briefing.recommendation.reason}
              </p>
            </div>
            {briefing.recommendation.cta && (
              <Link
                to={briefing.recommendation.cta.to}
                search={{ from: "ema-recommendation" } as never}
                className="hidden shrink-0 items-center gap-1.5 self-center rounded-full bg-ema px-3.5 py-2 text-xs font-semibold text-ema-foreground transition-transform hover:-translate-y-0.5 sm:inline-flex"
              >
                {briefing.recommendation.cta.label}
                <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
          {briefing.recommendation.cta && (
            <Link
              to={briefing.recommendation.cta.to}
              search={{ from: "ema-recommendation" } as never}
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-ema px-3.5 py-2 text-xs font-semibold text-ema-foreground transition-transform hover:-translate-y-0.5 sm:hidden"
            >
              {briefing.recommendation.cta.label}
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      )}

      {/* Can wait — explicit reassurance reduces noise */}
      {briefing.canWait && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-border/30 bg-background/30 px-3 py-2 text-xs text-muted-foreground">
          <Coffee className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground/70" />
          <span>
            <span className="font-semibold text-foreground/70">Safe to ignore. </span>
            {briefing.canWait}
          </span>
        </div>
      )}
    </motion.section>
  );
}

function InsightBlock({
  label,
  tone,
  icon: Icon,
  insight,
}: {
  label: string;
  tone: "success" | "ema";
  icon: typeof TrendingUp;
  insight: EmaInsight;
}) {
  const toneClasses =
    tone === "success"
      ? "border-success/30 bg-success/5"
      : "border-ema/30 bg-ema/5";
  const iconTone =
    tone === "success" ? "bg-success/15 text-success" : "bg-ema/15 text-ema";
  const labelTone = tone === "success" ? "text-success" : "text-ema";

  return (
    <div className={`rounded-xl border px-4 py-3 ${toneClasses}`}>
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${iconTone}`}
        >
          <Icon className="h-2.5 w-2.5" />
        </span>
        <span
          className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${labelTone}`}
        >
          {label}
        </span>
      </div>
      <p className="mt-2 text-sm font-medium leading-snug text-foreground">
        {insight.text}
      </p>
      {insight.driver && (
        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
          {insight.driver}
        </p>
      )}
      {insight.cta && (
        <Link
          to={insight.cta.to}
          search={{ from: tone === "success" ? "ema-win" : "ema-risk" } as never}
          className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-foreground/80 hover:text-foreground hover:underline"
        >
          {insight.cta.label} <ArrowRight className="h-2.5 w-2.5" />
        </Link>
      )}
    </div>
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

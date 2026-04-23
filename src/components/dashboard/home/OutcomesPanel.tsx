"use client";

import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarCheck,
  MessageSquare,
  Sparkles,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import Sparkline from "@/components/dashboard/Sparkline";
import type { DailyOutcomes } from "@/lib/home-data";
import { cn } from "@/lib/utils";

type Props = {
  outcomes: DailyOutcomes;
};

/**
 * Today's outcomes — comparative, not just descriptive.
 *
 * Each tile pairs the headline number with a delta-vs-yesterday badge so the
 * owner sees movement (improving / declining / steady) at a glance, plus a
 * one-line driver explaining WHY the metric moved. This converts the panel
 * from a static scoreboard into an interpretive layer.
 */
export default function OutcomesPanel({ outcomes }: Props) {
  const d = outcomes.deltas;

  // Driver explanations — explicit causal context per tile.
  const bookingsDriver =
    d.bookingsPct >= 15
      ? `Up ${d.bookingsPct}% — demand is accelerating`
      : d.bookingsPct <= -15
        ? `Down ${Math.abs(d.bookingsPct)}% — slower than yesterday`
        : `Steady vs yesterday (${outcomes.yesterday.bookings})`;

  const autoDriver =
    d.autoPctDelta >= 5
      ? `Up ${d.autoPctDelta} pts — fewer escalations needed`
      : d.autoPctDelta <= -5
        ? `Down ${Math.abs(d.autoPctDelta)} pts — escalations climbing`
        : `Holding steady at ~${outcomes.autoPct}%`;

  const revenueDriver =
    d.revenuePct >= 15
      ? `+${d.revenuePct}% vs yesterday`
      : d.revenuePct <= -15
        ? `${d.revenuePct}% vs yesterday`
        : `From ${outcomes.bookings} confirmed booking${outcomes.bookings === 1 ? "" : "s"}`;

  const responseDriver =
    d.responseDeltaSec < 0
      ? `${Math.abs(d.responseDeltaSec)}s faster than yesterday`
      : d.responseDeltaSec > 0
        ? `${d.responseDeltaSec}s slower than yesterday`
        : "No change vs yesterday";

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Today's outcomes"
      className="overflow-hidden rounded-2xl border border-aqua/20 bg-card/50 shadow-card"
    >
      <header className="flex items-center justify-between border-b border-border/30 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-aqua/15 text-aqua">
            <TrendingUp className="h-3.5 w-3.5" />
          </span>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-aqua">
              Today's outcomes
            </div>
            <h2 className="font-display text-base font-semibold leading-tight">
              vs yesterday · same window
            </h2>
          </div>
        </div>
        <Link
          to="/dashboard/insights"
          className="inline-flex items-center gap-1 text-xs font-semibold text-aqua hover:underline"
        >
          Full insights <ArrowRight className="h-3 w-3" />
        </Link>
      </header>

      <div className="grid gap-px bg-border/40 sm:grid-cols-4">
        <Tile
          icon={CalendarCheck}
          label="Bookings"
          value={String(outcomes.bookings)}
          deltaPct={d.bookingsPct}
          driver={bookingsDriver}
          tone="primary"
        />
        <Tile
          icon={Sparkles}
          label="Auto-resolution"
          value={`${outcomes.autoPct}%`}
          deltaPct={d.autoPctDelta}
          deltaUnit="pts"
          driver={autoDriver}
          tone="violet"
        />
        <Tile
          icon={MessageSquare}
          label="Revenue influenced"
          value={`EC$${outcomes.revenueInfluenced.toLocaleString()}`}
          deltaPct={d.revenuePct}
          driver={revenueDriver}
          tone="aqua"
        />
        <Tile
          icon={Clock}
          label="Avg response"
          value={`${outcomes.avgResponseSec}s`}
          /* For response time, lower is better — invert the sign so green = improvement. */
          deltaPct={
            d.responseDeltaSec === 0 ? 0 : d.responseDeltaSec < 0 ? 1 : -1
          }
          driver={responseDriver}
          tone="muted"
          hideDeltaNumber
        />
      </div>

      {/* Hourly rhythm */}
      <div className="border-t border-border/30 px-5 py-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Volume · last 12 hours
          </span>
          <span className="text-[10px] tabular-nums text-muted-foreground">
            peak {Math.max(...outcomes.hourlyVolume)} / hr
          </span>
        </div>
        <Sparkline
          values={outcomes.hourlyVolume}
          variant="bars"
          height={42}
          className="h-10 w-full"
          fill="var(--color-aqua)"
          stroke="var(--color-aqua)"
        />
      </div>
    </motion.section>
  );
}

function Tile({
  icon: Icon,
  label,
  value,
  deltaPct,
  deltaUnit = "%",
  driver,
  tone,
  hideDeltaNumber = false,
}: {
  icon: typeof MessageSquare;
  label: string;
  value: string;
  deltaPct: number;
  deltaUnit?: string;
  driver: string;
  tone: "primary" | "violet" | "aqua" | "muted";
  hideDeltaNumber?: boolean;
}) {
  const toneClass =
    tone === "primary"
      ? "text-primary"
      : tone === "violet"
        ? "text-violet"
        : tone === "aqua"
          ? "text-aqua"
          : "text-foreground";

  const direction =
    deltaPct > 0 ? "up" : deltaPct < 0 ? "down" : "flat";
  const DeltaIcon =
    direction === "up" ? TrendingUp : direction === "down" ? TrendingDown : Minus;
  const deltaTone =
    direction === "up"
      ? "text-success bg-success/10"
      : direction === "down"
        ? "text-ema bg-ema/10"
        : "text-muted-foreground bg-muted/40";

  return (
    <div className="bg-card/70 px-5 py-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <Icon className="h-3 w-3" /> {label}
        </div>
        {direction !== "flat" && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
              deltaTone,
            )}
          >
            <DeltaIcon className="h-2.5 w-2.5" />
            {!hideDeltaNumber && (
              <>
                {deltaPct > 0 ? "+" : ""}
                {deltaPct}
                {deltaUnit}
              </>
            )}
          </span>
        )}
      </div>
      <div
        className={`mt-1 font-display text-2xl font-semibold leading-none tabular-nums ${toneClass}`}
      >
        {value}
      </div>
      <div className="mt-1 text-[11px] leading-snug text-muted-foreground">
        {driver}
      </div>
    </div>
  );
}

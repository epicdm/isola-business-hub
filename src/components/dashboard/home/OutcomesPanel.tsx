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
} from "lucide-react";
import Sparkline from "@/components/dashboard/Sparkline";
import type { DailyOutcomes } from "@/lib/home-data";

type Props = {
  outcomes: DailyOutcomes;
};

/**
 * Today's outcomes — what the system PRODUCED, not just what it did.
 *
 * The home page already has counters at the top. This panel earns its space
 * by adding three things:
 *   1. Outcome framing (revenue influenced, response time)
 *   2. The hourly volume sparkline (rhythm of the day)
 *   3. A clear bridge to the deeper insights page
 */
export default function OutcomesPanel({ outcomes }: Props) {
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
              What the system produced
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
          sub="confirmed in 24h"
          tone="primary"
        />
        <Tile
          icon={Sparkles}
          label="Auto-replies"
          value={String(outcomes.autoResolved + outcomes.bookings)}
          sub={`${outcomes.autoPct}% no-touch`}
          tone="violet"
        />
        <Tile
          icon={MessageSquare}
          label="Revenue influenced"
          value={`EC$${outcomes.revenueInfluenced.toLocaleString()}`}
          sub="from auto-bookings"
          tone="aqua"
        />
        <Tile
          icon={Clock}
          label="Avg response"
          value={`${outcomes.avgResponseSec}s`}
          sub="across all channels"
          tone="muted"
        />
      </div>

      {/* Hourly rhythm — the "is the floor active right now?" signal */}
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
  sub,
  tone,
}: {
  icon: typeof MessageSquare;
  label: string;
  value: string;
  sub: string;
  tone: "primary" | "violet" | "aqua" | "muted";
}) {
  const toneClass =
    tone === "primary"
      ? "text-primary"
      : tone === "violet"
        ? "text-violet"
        : tone === "aqua"
          ? "text-aqua"
          : "text-foreground";
  return (
    <div className="bg-card/70 px-5 py-4">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div
        className={`mt-1 font-display text-2xl font-semibold leading-none tabular-nums ${toneClass}`}
      >
        {value}
      </div>
      <div className="mt-1 text-[11px] text-muted-foreground">{sub}</div>
    </div>
  );
}

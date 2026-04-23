"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  MessageSquare,
  CalendarCheck,
  Clock,
  Zap,
  Timer,
} from "lucide-react";
import Sparkline from "./Sparkline";
import { cn } from "@/lib/utils";
import type { Agent, AgentActivityEntry } from "@/lib/mock-data";

/** A single escalated conversation with an SLA deadline (epoch ms). */
export type EscalationItem = {
  id: string;
  customer: string;
  /** Epoch ms — when the 1h reply window expires. */
  deadlineAt: number;
};

type Props = {
  agent: Agent;
  activity: AgentActivityEntry[];
  pendingDrafts: number;
  /** Open escalations with deadlines — drives the live countdown UI. */
  escalationItems: EscalationItem[];
  /** Configured per-business SLA in minutes. Surfaced in the accent label. */
  slaMinutes: number;
  onReviewDrafts?: () => void;
  onJumpEscalations?: () => void;
};

/**
 * CommandCenter — the signature first-screen "AI command center" for the
 * agent workspace. Three colour-coded tracks make AI vs human vs escalation
 * activity instantly distinguishable, with a 24h metrics strip + sparkline.
 *
 * Track palette (intentional):
 *   • Aurora violet  → AI activity (autonomous)
 *   • WhatsApp green → Human actions (drafts awaiting approval)
 *   • Sunset coral   → Escalations (needs you now)
 */
export default function CommandCenter({
  agent,
  activity,
  pendingDrafts,
  escalationItems,
  slaMinutes,
  onReviewDrafts,
  onJumpEscalations,
}: Props) {
  const escalations = escalationItems.length;

  // Live "now" tick — re-renders every 30s so countdowns stay accurate
  // without wasting frames. The Countdown subcomponent reads this prop.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  // Soonest-due first — frames the urgency for the operator. Items "due soon"
  // = within the configured SLA window itself (not a fixed hour) so the
  // urgency tier scales with the business's reply-time policy.
  const sortedEsc = [...escalationItems].sort((a, b) => a.deadlineAt - b.deadlineAt);
  const soonest = sortedEsc[0];
  const soonestRemaining = soonest ? soonest.deadlineAt - now : 0;
  const dueSoon = sortedEsc.filter(
    (e) => e.deadlineAt - now <= slaMinutes * 60_000,
  ).length;
  const slaShort =
    slaMinutes >= 60 && slaMinutes % 60 === 0 ? `${slaMinutes / 60}h` : `${slaMinutes}m`;

  // ---- 24h slice -----------------------------------------------------------
  const last24 = activity.slice(0, 24);
  const messages = last24.length;
  const bookings = last24.filter((a) => a.outcome === "booked").length;
  const answered = last24.filter((a) => a.outcome === "answered").length;
  const autoPct = messages
    ? Math.round(((answered + bookings) / messages) * 100)
    : 100;

  // Build a per-hour volume sparkline (12 buckets).
  const buckets = Array.from({ length: 12 }, (_, i) => {
    const slice = activity.slice(i * 2, i * 2 + 2);
    return slice.length;
  });

  const recentAi = activity
    .filter((a) => a.outcome !== "escalated")
    .slice(0, 3);

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Command center"
      className="relative"
    >
      {/* Eyebrow */}
      <div className="mb-3 flex items-end justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Command center
          </div>
          <h2 className="mt-1 font-display text-xl font-semibold leading-tight">
            What {agent.name.split(" ")[0]} is doing right now
          </h2>
        </div>
        <div className="hidden items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:flex">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
          </span>
          Live · last 24h
        </div>
      </div>

      {/* TRACKS — 3 columns, distinct accent per surface */}
      <div className="grid gap-3 lg:grid-cols-3">
        {/* AI activity (autonomous) */}
        <TrackCard
          tone="ai"
          icon={Sparkles}
          eyebrow="AI activity"
          title="Autonomous"
          metric={messages}
          metricLabel="handled"
          accent={`${autoPct}% no-touch`}
        >
          <ul className="mt-3 space-y-1.5">
            {recentAi.length === 0 && (
              <li className="text-xs text-muted-foreground">Quiet hour. No new AI activity.</li>
            )}
            {recentAi.map((a) => (
              <li key={a.id} className="flex items-center gap-2 text-xs">
                <span
                  className={cn(
                    "inline-flex h-1.5 w-1.5 shrink-0 rounded-full",
                    a.outcome === "booked" ? "bg-success" : "bg-violet",
                  )}
                />
                <span className="min-w-0 flex-1 truncate text-foreground/90">
                  {a.preview}
                </span>
                <span className="shrink-0 text-muted-foreground">{a.time}</span>
              </li>
            ))}
          </ul>
        </TrackCard>

        {/* Human queue (probation drafts) */}
        <TrackCard
          tone="human"
          icon={ShieldCheck}
          eyebrow="Needs your touch"
          title="Drafts to approve"
          metric={pendingDrafts}
          metricLabel={pendingDrafts === 1 ? "draft" : "drafts"}
          accent={pendingDrafts === 0 ? "All clear" : "Tap to review"}
          ctaLabel={pendingDrafts > 0 ? "Review drafts" : undefined}
          onCta={onReviewDrafts}
        >
          <p className="mt-3 text-xs text-muted-foreground">
            {pendingDrafts === 0
              ? "Nothing pending. Every recent reply went out automatically."
              : `${agent.name.split(" ")[0]} held back ${pendingDrafts} repl${pendingDrafts === 1 ? "y" : "ies"} for your judgment. Approving teaches future replies.`}
          </p>
        </TrackCard>

        {/* Escalations (needs you NOW) — with live countdown timers */}
        <TrackCard
          tone="escalation"
          icon={AlertTriangle}
          eyebrow="Escalations"
          title={escalations > 0 ? "Needs you now" : "All handled"}
          metric={escalations}
          metricLabel={escalations === 1 ? "open" : "open"}
          accent={
            escalations === 0
              ? "0 unresolved"
              : dueSoon > 0
                ? `${dueSoon} due < ${slaShort}`
                : `${slaShort} SLA`
          }
          ctaLabel={escalations > 0 ? "Open" : undefined}
          onCta={onJumpEscalations}
          pulse={soonest ? soonestRemaining <= urgentThresholdMs(slaMinutes) : false}
        >
          {escalations === 0 ? (
            <p className="mt-3 text-xs text-muted-foreground">
              No customers waiting on a human reply. Great signal.
            </p>
          ) : (
            <ul className="mt-3 space-y-1.5">
              {sortedEsc.slice(0, 3).map((e) => {
                const remaining = e.deadlineAt - now;
                const urgentMs = urgentThresholdMs(slaMinutes);
                return (
                  <li
                    key={e.id}
                    className="flex items-center gap-2 rounded-md border border-ema/15 bg-ema/5 px-2 py-1.5 text-xs"
                  >
                    <Timer
                      className={cn(
                        "h-3 w-3 shrink-0",
                        remaining <= 0
                          ? "text-destructive"
                          : remaining <= urgentMs
                            ? "text-ema"
                            : "text-muted-foreground",
                      )}
                    />
                    <span className="min-w-0 flex-1 truncate text-foreground/90">
                      {e.customer}
                    </span>
                    <Countdown
                      deadlineAt={e.deadlineAt}
                      now={now}
                      urgentMs={urgentMs}
                    />
                  </li>
                );
              })}
              {sortedEsc.length > 3 && (
                <li className="pl-1 text-[11px] text-muted-foreground">
                  +{sortedEsc.length - 3} more waiting
                </li>
              )}
            </ul>
          )}
        </TrackCard>
      </div>

      {/* 24h METRICS STRIP — passive info, hairline-divided */}
      <div className="mt-3 overflow-hidden rounded-2xl border border-border/40 bg-gradient-card backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-border/30 px-5 py-3">
          <div className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-aqua" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Last 24 hours · at a glance
            </span>
          </div>
          <Link
            to="/dashboard/insights"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-aqua"
          >
            Full insights <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid divide-y divide-border/30 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
          <Metric
            icon={MessageSquare}
            label="Messages"
            value={messages}
            sub={`${autoPct}% auto-resolved`}
          />
          <Metric
            icon={CalendarCheck}
            label="Bookings"
            value={bookings}
            sub="confirmed in 24h"
          />
          <Metric
            icon={Sparkles}
            label="Auto-replies"
            value={answered + bookings}
            sub="no human touch"
          />
          <MetricSpark
            icon={Clock}
            label="Volume"
            sub="hourly trend"
            values={buckets}
          />
        </div>
      </div>
    </motion.section>
  );
}

// ---------- subcomponents ----------------------------------------------------

type TrackTone = "ai" | "human" | "escalation";

type TrackProps = {
  tone: TrackTone;
  icon: typeof Sparkles;
  eyebrow: string;
  title: string;
  metric: number;
  metricLabel: string;
  accent: string;
  ctaLabel?: string;
  onCta?: () => void;
  /** When true, the accent chip pulses to flag urgency (e.g. SLA <15min). */
  pulse?: boolean;
  children?: React.ReactNode;
};

function TrackCard({
  tone,
  icon: Icon,
  eyebrow,
  title,
  metric,
  metricLabel,
  accent,
  ctaLabel,
  onCta,
  pulse,
  children,
}: TrackProps) {
  // Tone-specific styling — the visual signal that separates AI/human/escalation.
  const styles =
    tone === "ai"
      ? {
          ring: "border-violet/30",
          glow: "bg-[radial-gradient(ellipse_70%_60%_at_15%_0%,oklch(0.7_0.22_295/0.18),transparent_70%)]",
          chipBg: "bg-violet/15 text-violet",
          accentText: "text-violet",
          number: "text-gradient-aurora",
        }
      : tone === "human"
        ? {
            ring: "border-primary/30",
            glow: "bg-[radial-gradient(ellipse_70%_60%_at_15%_0%,oklch(0.78_0.17_152/0.18),transparent_70%)]",
            chipBg: "bg-primary/15 text-primary",
            accentText: "text-primary",
            number: "text-gradient-primary",
          }
        : {
            ring: "border-ema/30",
            glow: "bg-[radial-gradient(ellipse_70%_60%_at_15%_0%,oklch(0.72_0.19_30/0.22),transparent_70%)]",
            chipBg: "bg-ema/15 text-ema",
            accentText: "text-ema",
            number: "text-gradient-ema",
          };

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border bg-card/50 p-5 backdrop-blur-sm transition-all hover:bg-card/70 hover:shadow-elegant",
        styles.ring,
      )}
    >
      <div aria-hidden className={cn("absolute inset-0 -z-10", styles.glow)} />

      <div className="flex items-center justify-between">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em]",
            styles.chipBg,
          )}
        >
          <Icon className="h-3 w-3" /> {eyebrow}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.14em]",
            styles.accentText,
            pulse && "animate-pulse",
          )}
        >
          {pulse && (
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ema/70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ema" />
            </span>
          )}
          {accent}
        </span>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className={cn("font-display text-5xl font-bold leading-none tabular-nums", styles.number)}>
          {metric}
        </span>
        <span className="text-xs text-muted-foreground">{metricLabel}</span>
      </div>
      <div className="mt-1 text-sm font-medium">{title}</div>

      {children}

      {ctaLabel && (
        <button
          type="button"
          onClick={onCta}
          className={cn(
            "mt-4 inline-flex w-fit items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-80",
            styles.accentText,
          )}
        >
          {ctaLabel} <ArrowUpRight className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Sparkles;
  label: string;
  value: number;
  sub: string;
}) {
  return (
    <div className="px-5 py-4">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="mt-1.5 font-display text-2xl font-bold tabular-nums">{value}</div>
      <div className="mt-0.5 text-[11px] text-muted-foreground">{sub}</div>
    </div>
  );
}

function MetricSpark({
  icon: Icon,
  label,
  sub,
  values,
}: {
  icon: typeof Sparkles;
  label: string;
  sub: string;
  values: number[];
}) {
  return (
    <div className="px-5 py-4">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="mt-2 h-9 w-full">
        <Sparkline
          values={values}
          variant="bars"
          height={36}
          className="h-9 w-full"
          fill="var(--color-aqua)"
          stroke="var(--color-aqua)"
        />
      </div>
      <div className="mt-0.5 text-[11px] text-muted-foreground">{sub}</div>
    </div>
  );
}

/**
 * Urgency threshold scales with the SLA so it stays meaningful at every
 * window — 25% of the SLA, clamped to [2min, 30min]. With a 1h SLA this
 * yields the previous 15-minute warning; with 30m it gives ~7m; with 4h
 * it caps at 30m so we don't scream too early.
 */
function urgentThresholdMs(slaMinutes: number): number {
  const ms = slaMinutes * 60_000 * 0.25;
  return Math.min(Math.max(ms, 2 * 60_000), 30 * 60_000);
}

/**
 * Countdown — renders the time remaining until `deadlineAt`. Switches to
 * mm:ss inside the urgency window, otherwise Xm. Past-due → "OVERDUE".
 * The `now` prop is owned by the parent so all timers tick in sync.
 */
function Countdown({
  deadlineAt,
  now,
  urgentMs,
}: {
  deadlineAt: number;
  now: number;
  urgentMs: number;
}) {
  const remainingMs = deadlineAt - now;
  const overdue = remainingMs <= 0;
  const urgent = !overdue && remainingMs <= urgentMs;

  let display: string;
  if (overdue) {
    display = "OVERDUE";
  } else if (urgent) {
    const totalSec = Math.floor(remainingMs / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    display = `${m}:${s.toString().padStart(2, "0")}`;
  } else {
    display = `${Math.ceil(remainingMs / 60_000)}m`;
  }

  return (
    <span
      className={cn(
        "shrink-0 font-mono text-[11px] font-semibold tabular-nums",
        overdue
          ? "rounded-sm bg-destructive/15 px-1.5 py-0.5 text-destructive"
          : urgent
            ? "text-ema"
            : "text-muted-foreground",
      )}
      aria-label={overdue ? "Reply window expired" : `${display} until SLA`}
    >
      {display}
    </span>
  );
}

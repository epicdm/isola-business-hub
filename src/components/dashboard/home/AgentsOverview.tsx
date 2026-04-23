"use client";

import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarCheck,
  MessageSquare,
  AlertTriangle,
  Plus,
  Users2,
  Trophy,
  Flame,
  TrendingUp,
  PauseCircle,
  GraduationCap,
  Activity,
} from "lucide-react";
import { agentStatusMeta } from "@/lib/mock-data";
import type { AgentSnapshot, AgentTag } from "@/lib/home-data";
import { cn } from "@/lib/utils";

type Props = {
  snapshots: AgentSnapshot[];
};

const tagMeta: Record<
  AgentTag,
  { label: string; icon: typeof Trophy; tone: string }
> = {
  best_performer: {
    label: "Top performer",
    icon: Trophy,
    tone: "border-success/40 bg-success/10 text-success",
  },
  rising_escalations: {
    label: "Rising escalations",
    icon: Flame,
    tone: "border-ema/40 bg-ema/10 text-ema",
  },
  overloaded: {
    label: "Overloaded",
    icon: Activity,
    tone: "border-warning/40 bg-warning/10 text-warning",
  },
  strong_conversion: {
    label: "Strong conversion",
    icon: TrendingUp,
    tone: "border-primary/40 bg-primary/10 text-primary",
  },
  off_duty: {
    label: "Off duty",
    icon: PauseCircle,
    tone: "border-muted/60 bg-muted/40 text-muted-foreground",
  },
  in_training: {
    label: "In training",
    icon: GraduationCap,
    tone: "border-violet/40 bg-violet/10 text-violet",
  },
};

/**
 * Agents overview — strategic, not just descriptive.
 *
 * Each card now shows the owner WHO they should be paying attention to and
 * WHY. The strategic tags (top performer, overloaded, rising escalations,
 * strong conversion) and the one-line note act like an automatic shift report:
 * "Solène is driving 60% of bookings, Jules is overloaded, Marcus is paused."
 */
export default function AgentsOverview({ snapshots }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Your agents"
      className="space-y-3"
    >
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            <Users2 className="mr-1.5 inline h-3 w-3" />
            Your AI team
          </div>
          <h2 className="mt-1 font-display text-xl font-semibold leading-tight">
            {snapshots.length} agent{snapshots.length === 1 ? "" : "s"} on the floor
          </h2>
        </div>
        <Link
          to="/dashboard/team"
          className="hidden items-center gap-1 text-xs font-semibold text-primary hover:underline sm:inline-flex"
        >
          Roster <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {snapshots.map((s) => {
          const meta = agentStatusMeta[s.agent.status];
          const initials = s.agent.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2);
          const primaryTag = s.tags[0];
          return (
            <Link
              key={s.agent.id}
              to="/dashboard/agent/$agentId"
              params={{ agentId: s.agent.id }}
              className="group block focus:outline-none"
            >
              <article className="relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-border/40 bg-card/60 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow group-focus-visible:ring-2 group-focus-visible:ring-primary/40">
                {/* Strategic tag rail along the top edge — high-signal alert that
                    something interesting about this agent deserves attention. */}
                {primaryTag && (
                  <span
                    aria-hidden
                    className={cn(
                      "absolute left-0 right-0 top-0 h-0.5",
                      primaryTag === "best_performer"
                        ? "bg-success"
                        : primaryTag === "rising_escalations"
                          ? "bg-ema"
                          : primaryTag === "overloaded"
                            ? "bg-warning"
                            : primaryTag === "strong_conversion"
                              ? "bg-primary"
                              : primaryTag === "in_training"
                                ? "bg-violet"
                                : "bg-muted",
                    )}
                  />
                )}

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-aurora text-[11px] font-semibold text-foreground shadow-glow">
                      <span className="absolute inset-[2px] flex items-center justify-center rounded-[10px] bg-card text-foreground">
                        {initials}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold leading-tight">
                        {s.agent.name}
                      </div>
                      <div className="mt-0.5 truncate text-[10px] uppercase tracking-wider text-muted-foreground">
                        {s.agent.templateLabel} · {s.agent.scheduleLabel}
                      </div>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                      meta.pillClass,
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", meta.dotClass)} />
                    {meta.label}
                  </span>
                </div>

                {/* Strategic tags row — why this agent matters today */}
                {s.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {s.tags.map((t) => {
                      const tm = tagMeta[t];
                      const TIcon = tm.icon;
                      return (
                        <span
                          key={t}
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                            tm.tone,
                          )}
                        >
                          <TIcon className="h-2.5 w-2.5" />
                          {tm.label}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Strategic one-liner — the operator's takeaway */}
                {s.note && (
                  <p className="text-[11px] leading-snug text-foreground/75">
                    {s.note}
                  </p>
                )}

                {/* Three micro-counters — outcomes, not raw motion */}
                <div className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-border/40 bg-border/40">
                  <Counter
                    icon={MessageSquare}
                    label="Msgs"
                    value={s.messagesToday}
                  />
                  <Counter
                    icon={CalendarCheck}
                    label="Booked"
                    value={s.bookingsToday}
                    tone="primary"
                  />
                  <Counter
                    icon={AlertTriangle}
                    label="Esc."
                    value={s.escalationsToday}
                    tone={s.escalationsToday > 0 ? "ema" : "muted"}
                  />
                </div>

                <div className="mt-auto flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>
                    <span className="font-semibold text-foreground">{s.autoPct}%</span>{" "}
                    auto-resolved
                  </span>
                  <span className="text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Open workspace →
                  </span>
                </div>
              </article>
            </Link>
          );
        })}

        {/* Hire CTA — keeps the section forward-looking */}
        <Link to="/dashboard/agents/new" className="block focus:outline-none">
          <div className="flex h-full min-h-[180px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border/60 bg-card/20 p-4 text-center transition-all hover:border-primary/40 hover:bg-primary/5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Plus className="h-4 w-4" />
            </div>
            <div className="text-sm font-medium">Hire another agent</div>
            <div className="text-[11px] text-muted-foreground">
              Sales, support, concierge — pick a role.
            </div>
          </div>
        </Link>
      </div>
    </motion.section>
  );
}

function Counter({
  icon: Icon,
  label,
  value,
  tone = "default",
}: {
  icon: typeof MessageSquare;
  label: string;
  value: number;
  tone?: "default" | "primary" | "ema" | "muted";
}) {
  const toneClass =
    tone === "primary"
      ? "text-primary"
      : tone === "ema"
        ? "text-ema"
        : tone === "muted"
          ? "text-muted-foreground"
          : "text-foreground";
  return (
    <div className="flex items-center gap-2 bg-card/70 px-2.5 py-2">
      <Icon className="h-3 w-3 text-muted-foreground" />
      <div className="min-w-0 leading-tight">
        <div className={cn("text-sm font-semibold tabular-nums", toneClass)}>
          {value}
        </div>
        <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
      </div>
    </div>
  );
}

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
} from "lucide-react";
import { agentStatusMeta } from "@/lib/mock-data";
import type { AgentSnapshot } from "@/lib/home-data";
import { cn } from "@/lib/utils";

type Props = {
  snapshots: AgentSnapshot[];
};

/**
 * Agents overview — makes the multi-agent model visible without overwhelming.
 *
 * Each card answers four questions in one glance:
 *   1. Who is this agent?    → name + role
 *   2. Are they on duty?     → status pill + dot
 *   3. What did they do?     → 3 micro-counters
 *   4. Where do I open them? → entire card is a link
 *
 * Designed to scale gracefully: 1 agent feels deliberate, 6+ feels like a roster.
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
          return (
            <Link
              key={s.agent.id}
              to="/dashboard/agent/$agentId"
              params={{ agentId: s.agent.id }}
              className="group block focus:outline-none"
            >
              <article className="relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-border/40 bg-card/60 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow group-focus-visible:ring-2 group-focus-visible:ring-primary/40">
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

"use client";

import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ShieldCheck,
  BookOpen,
  PauseCircle,
  ArrowRight,
  Clock,
  TimerReset,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AttentionItem } from "@/lib/home-data";

type Props = {
  items: AttentionItem[];
  slaMinutes: number;
};

const kindIcon = {
  escalation: AlertTriangle,
  draft: ShieldCheck,
  follow_up: TimerReset,
  knowledge_gap: BookOpen,
  agent_paused: PauseCircle,
} as const;

const kindLabel = {
  escalation: "Escalation",
  draft: "Approval",
  follow_up: "Follow-up",
  knowledge_gap: "Knowledge",
  agent_paused: "Agent off",
} as const;

/**
 * "What needs human attention" queue — the operational decision list.
 *
 * Hierarchy:
 *   • Severity-driven left rail (ema for high, warning for medium, muted for low)
 *   • Compact two-line content: title + why
 *   • Clear age + agent provenance
 *   • Single decisive CTA per row
 *
 * The list deliberately stops at 6 — it should feel like a focused agenda,
 * not an inbox. "View all" deep-links to the existing inbox/drafts.
 */
export default function AttentionQueue({ items, slaMinutes }: Props) {
  const top = items.slice(0, 6);
  const overflow = Math.max(0, items.length - top.length);

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Needs your attention"
      className="overflow-hidden rounded-2xl border border-border/40 bg-card/50 shadow-card"
    >
      <header className="flex items-center justify-between border-b border-border/30 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-ema/15 text-ema">
            <AlertTriangle className="h-3.5 w-3.5" />
          </span>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Needs you now
            </div>
            <h2 className="font-display text-base font-semibold leading-tight">
              {items.length === 0
                ? "All clear — the floor is calm"
                : `${items.length} item${items.length === 1 ? "" : "s"} on your desk`}
            </h2>
          </div>
        </div>
        <span className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:inline">
          {slaMinutes}m reply SLA
        </span>
      </header>

      {items.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-muted-foreground">
          Every conversation is handled. Every draft approved. The system is
          running on rails.
        </div>
      ) : (
        <ul className="divide-y divide-border/30">
          {top.map((item) => {
            const Icon = kindIcon[item.kind];
            const sevTone =
              item.severity === "high"
                ? "border-ema/70 bg-ema/10"
                : item.severity === "medium"
                  ? "border-warning/60 bg-warning/5"
                  : "border-border/30 bg-transparent";
            const sevText =
              item.severity === "high"
                ? "text-ema"
                : item.severity === "medium"
                  ? "text-warning"
                  : "text-muted-foreground";
            const overSla =
              item.kind === "escalation" && item.ageMin >= slaMinutes;

            return (
              <li
                key={item.id}
                className={cn(
                  "group relative flex items-start gap-4 px-5 py-4 transition-colors hover:bg-accent/40",
                )}
              >
                <span
                  className={cn(
                    "absolute inset-y-2 left-0 w-[3px] rounded-r-full",
                    item.severity === "high"
                      ? "bg-ema"
                      : item.severity === "medium"
                        ? "bg-warning"
                        : "bg-border",
                  )}
                />
                <div
                  className={cn(
                    "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
                    sevTone,
                    sevText,
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em]">
                    <span className={sevText}>{kindLabel[item.kind]}</span>
                    <span className="text-muted-foreground/50">·</span>
                    <span className="rounded bg-muted/40 px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground">
                      {item.area}
                    </span>
                    <span className="text-muted-foreground/50">·</span>
                    <span className="text-muted-foreground">
                      {item.agentName}
                    </span>
                    <span className="text-muted-foreground/50">·</span>
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-2.5 w-2.5" />
                      {formatAge(item.ageMin)}
                    </span>
                    {overSla && (
                      <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-destructive/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-destructive">
                        SLA breach
                      </span>
                    )}
                  </div>
                  <div className="mt-1 truncate text-sm font-medium text-foreground">
                    {item.title}
                  </div>
                  <div className="mt-0.5 truncate text-xs text-muted-foreground">
                    {item.why}
                  </div>
                  <div className="mt-1.5 flex items-start gap-1.5 text-[11px] leading-snug text-foreground/70">
                    <span className="mt-[3px] inline-block h-1 w-1 shrink-0 rounded-full bg-ema/60" />
                    <span>
                      <span className="font-semibold text-ema/90">If ignored: </span>
                      {item.riskIfIgnored}
                    </span>
                  </div>
                </div>
                <Link
                  to={item.cta.to}
                  params={item.cta.params as never}
                  className="hidden shrink-0 items-center gap-1 self-center rounded-full border border-border/50 bg-background/40 px-3 py-1.5 text-[11px] font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary sm:inline-flex"
                >
                  {item.cta.label}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {overflow > 0 && (
        <footer className="flex items-center justify-between border-t border-border/30 px-5 py-3 text-xs text-muted-foreground">
          <span>+{overflow} more queued</span>
          <Link
            to="/dashboard/inbox"
            className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
          >
            Open full queue <ArrowRight className="h-3 w-3" />
          </Link>
        </footer>
      )}
    </motion.section>
  );
}

function formatAge(min: number): string {
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

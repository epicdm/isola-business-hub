"use client";

import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  Inbox,
  ShieldCheck,
  CalendarCheck,
  Send,
  AlertTriangle,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Action = {
  to: string;
  label: string;
  hint: string;
  /** Optional live count — when present, the action becomes state-aware. */
  count?: number;
  icon: LucideIcon;
  tone: "primary" | "violet" | "aqua" | "ema";
  /** Highest-priority actions get a leading accent rail. */
  priority?: boolean;
};

type Props = {
  /** Live operational state — drives counts and priority. */
  state: {
    openEscalations: number;
    pendingDrafts: number;
    bookingsNeedingConfirmation: number;
  };
};

/**
 * Operational launcher — control, not navigation.
 *
 * Each action is paired with a live count and the most-urgent ones are
 * promoted with a rail accent. This converts the bar from a row of generic
 * shortcuts into an executive control panel: the owner sees how much work
 * sits behind each button before clicking.
 */
export default function QuickActions({ state }: Props) {
  const actions: Action[] = [
    {
      to: "/dashboard/inbox",
      label: state.openEscalations > 0 ? "Triage escalations" : "Open inbox",
      hint:
        state.openEscalations > 0
          ? "Owner judgment required"
          : "Live conversations",
      count: state.openEscalations,
      icon: state.openEscalations > 0 ? AlertTriangle : Inbox,
      tone: state.openEscalations > 0 ? "ema" : "primary",
      priority: state.openEscalations > 0,
    },
    {
      to: "/dashboard/drafts",
      label: "Approve drafts",
      hint: state.pendingDrafts > 0 ? "Held for your review" : "Teach the team",
      count: state.pendingDrafts,
      icon: ShieldCheck,
      tone: "violet",
      priority: state.pendingDrafts >= 3,
    },
    {
      to: "/dashboard/bookings",
      label: "Confirm bookings",
      hint:
        state.bookingsNeedingConfirmation > 0
          ? "Awaiting deposit / approval"
          : "Today's calendar",
      count: state.bookingsNeedingConfirmation,
      icon: CalendarCheck,
      tone: "aqua",
      priority: state.bookingsNeedingConfirmation >= 2,
    },
    {
      to: "/dashboard/outbound",
      label: "Launch campaign",
      hint: "Reminders, recovery, follow-up",
      icon: Send,
      tone: "ema",
    },
    {
      to: "/dashboard/ema",
      label: "Ask Ema",
      hint: "Strategic chat",
      icon: Sparkles,
      tone: "ema",
    },
  ];

  const toneMap = {
    primary: "text-primary group-hover:bg-primary/10 group-hover:border-primary/40",
    violet: "text-violet group-hover:bg-violet/10 group-hover:border-violet/40",
    aqua: "text-aqua group-hover:bg-aqua/10 group-hover:border-aqua/40",
    ema: "text-ema group-hover:bg-ema/10 group-hover:border-ema/40",
  } as const;

  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Operational controls"
      className="rounded-2xl border border-border/40 bg-card/40 p-3 shadow-card"
    >
      <div className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        Take action
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.to}
              to={a.to}
              className={cn(
                "group relative flex items-center gap-3 overflow-hidden rounded-xl border bg-background/40 px-3 py-2.5 transition-all hover:-translate-y-0.5",
                a.priority
                  ? "border-ema/40 bg-ema/[0.04]"
                  : "border-border/30",
              )}
            >
              {a.priority && (
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-[3px] bg-ema"
                />
              )}
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/40 bg-background/60 transition-colors",
                  toneMap[a.tone],
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-xs font-semibold text-foreground">
                    {a.label}
                  </span>
                  {a.count !== undefined && a.count > 0 && (
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold tabular-nums",
                        a.priority
                          ? "bg-ema text-ema-foreground"
                          : "bg-muted text-foreground",
                      )}
                    >
                      {a.count}
                    </span>
                  )}
                </div>
                <div className="truncate text-[10px] text-muted-foreground">
                  {a.hint}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </motion.section>
  );
}

"use client";

import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  Inbox,
  ShieldCheck,
  CalendarCheck,
  Send,
  BarChart3,
  Users2,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

type Action = {
  to: string;
  label: string;
  hint: string;
  icon: LucideIcon;
  tone: "primary" | "violet" | "aqua" | "ema";
};

const actions: Action[] = [
  {
    to: "/dashboard/inbox",
    label: "Open inbox",
    hint: "Live conversations",
    icon: Inbox,
    tone: "primary",
  },
  {
    to: "/dashboard/drafts",
    label: "Approve drafts",
    hint: "Teach the team",
    icon: ShieldCheck,
    tone: "violet",
  },
  {
    to: "/dashboard/bookings",
    label: "Bookings",
    hint: "Today's calendar",
    icon: CalendarCheck,
    tone: "aqua",
  },
  {
    to: "/dashboard/outbound",
    label: "Launch campaign",
    hint: "Outbound voice / text",
    icon: Send,
    tone: "ema",
  },
  {
    to: "/dashboard/insights",
    label: "Insights",
    hint: "Weekly performance",
    icon: BarChart3,
    tone: "aqua",
  },
  {
    to: "/dashboard/team",
    label: "Manage agents",
    hint: "Roster & roles",
    icon: Users2,
    tone: "primary",
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

/**
 * Operational launcher — high-confidence shortcuts. Designed as a single
 * compact strip, NOT a card grid: it should read as a control bar, not
 * decorative chips.
 */
export default function QuickActions() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Quick actions"
      className="rounded-2xl border border-border/40 bg-card/40 p-3 shadow-card"
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.to}
              to={a.to}
              className="group flex items-center gap-3 rounded-xl border border-border/30 bg-background/40 px-3 py-2.5 transition-all hover:-translate-y-0.5"
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/40 bg-background/60 transition-colors ${toneMap[a.tone]}`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <div className="truncate text-xs font-semibold text-foreground">
                  {a.label}
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

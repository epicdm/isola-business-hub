"use client";

import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  Sparkles,
  CalendarCheck,
  MessageSquare,
  AlertTriangle,
  Phone,
  PhoneCall,
  Instagram,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import type { AgentActivityEntry, AgentChannel } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Props = {
  activity: AgentActivityEntry[];
};

const channelIcon: Record<AgentChannel, typeof Phone> = {
  whatsapp: Phone,
  voice: PhoneCall,
  instagram: Instagram,
  messenger: MessageCircle,
};

const outcomeMeta = {
  booked: {
    icon: CalendarCheck,
    label: "Booked",
    tone: "text-primary",
    bg: "bg-primary/10",
  },
  answered: {
    icon: MessageSquare,
    label: "Answered",
    tone: "text-violet",
    bg: "bg-violet/10",
  },
  escalated: {
    icon: AlertTriangle,
    label: "Escalated",
    tone: "text-ema",
    bg: "bg-ema/10",
  },
} as const;

/**
 * Autonomous activity timeline — the "machine is working" proof.
 *
 * This is intentionally compact and rhythmic: an unbroken column of micro-events
 * that read like an air-traffic-control feed. Outcomes (booked / answered /
 * escalated) carry distinct colour tracks so the eye can scan it in <2s.
 *
 * The feed shows real things that happened in the last 24h, not raw motion —
 * each line is one resolved customer interaction.
 */
export default function AutonomousFeed({ activity }: Props) {
  const items = activity.slice(0, 10);

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Autonomous AI activity"
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-violet/20 bg-card/50 shadow-card"
    >
      <header className="flex items-center justify-between border-b border-border/30 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-violet/15 text-violet">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-violet">
              Autonomous · live
            </div>
            <h2 className="font-display text-base font-semibold leading-tight">
              The system is working
            </h2>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet/70 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet" />
          </span>
          Last 24h
        </span>
      </header>

      <ol className="relative flex-1 divide-y divide-border/20">
        {items.length === 0 && (
          <li className="px-5 py-10 text-center text-sm text-muted-foreground">
            Quiet hour. Nothing autonomous to report.
          </li>
        )}
        {items.map((a) => {
          const Icon = channelIcon[a.channel];
          const meta = outcomeMeta[a.outcome];
          const OIcon = meta.icon;
          return (
            <li key={a.id} className="group flex items-center gap-3 px-5 py-2.5">
              {/* channel chip */}
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border/40 bg-background/60 text-muted-foreground">
                <Icon className="h-3 w-3" />
              </span>
              {/* outcome chip */}
              <span
                className={cn(
                  "flex h-6 shrink-0 items-center gap-1 rounded-md px-1.5 text-[10px] font-semibold uppercase tracking-wider",
                  meta.bg,
                  meta.tone,
                )}
              >
                <OIcon className="h-2.5 w-2.5" />
                {meta.label}
              </span>
              {/* preview */}
              <p className="min-w-0 flex-1 truncate text-xs text-foreground/85">
                <span className="font-medium text-foreground">{a.customer}</span>
                <span className="mx-1.5 text-muted-foreground/60">·</span>
                {a.preview}
              </p>
              <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
                {a.time}
              </span>
            </li>
          );
        })}
      </ol>

      <footer className="flex items-center justify-between border-t border-border/30 px-5 py-3 text-xs">
        <span className="text-muted-foreground">
          Every line above happened without owner intervention.
        </span>
        <Link
          to="/dashboard/inbox"
          className="inline-flex items-center gap-1 font-semibold text-violet hover:underline"
        >
          Open inbox <ArrowRight className="h-3 w-3" />
        </Link>
      </footer>
    </motion.section>
  );
}

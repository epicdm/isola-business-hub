"use client";

import { motion } from "framer-motion";
import {
  Phone,
  PhoneCall,
  Instagram,
  MessageCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CalendarCheck,
} from "lucide-react";
import { labelForChannel, type ChannelSlice } from "@/lib/home-data";
import type { AgentChannel } from "@/lib/mock-data";

type Props = {
  channels: ChannelSlice[];
  pendingDrafts: number;
  bookingsToday: number;
  openEscalations: number;
};

const channelIcon: Record<AgentChannel, typeof Phone> = {
  whatsapp: Phone,
  voice: PhoneCall,
  instagram: Instagram,
  messenger: MessageCircle,
};

/**
 * System flow — visualizes Isola as a set of moving parts:
 *
 *   [Channels in]  →  [Ema + Agents]  →  [Outcomes / approvals out]
 *
 * This is the section that most directly answers
 *   "Where is work coming from, and where is it going?"
 *
 * Visual approach: a left column of channel meters (volume bars), a centre
 * conduit (the AI layer), and a right column of outcome chips. No charts,
 * no decoration — the layout itself IS the diagram.
 */
export default function SystemFlowPanel({
  channels,
  pendingDrafts,
  bookingsToday,
  openEscalations,
}: Props) {
  const maxCount = Math.max(...channels.map((c) => c.count), 1);

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      aria-label="System flow"
      className="overflow-hidden rounded-2xl border border-border/40 bg-card/50 p-5 shadow-card"
    >
      <header className="mb-5 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            System map
          </div>
          <h2 className="font-display text-base font-semibold leading-tight">
            Where work is flowing
          </h2>
        </div>
      </header>

      <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr]">
        {/* IN — channel meters */}
        <div className="space-y-2.5">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Channels in
          </div>
          {channels.map((c) => {
            const Icon = channelIcon[c.channel as AgentChannel] ?? Phone;
            const w = Math.max(4, (c.count / maxCount) * 100);
            return (
              <div key={c.channel} className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border/40 bg-background/40 text-muted-foreground">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-foreground">
                      {labelForChannel(c.channel)}
                    </span>
                    <span className="tabular-nums text-muted-foreground">
                      {c.count}
                      <span className="ml-1 text-muted-foreground/60">
                        · {c.pct}%
                      </span>
                    </span>
                  </div>
                  <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-border/40">
                    <div
                      className="h-full rounded-full bg-gradient-aqua"
                      style={{ width: `${w}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CENTRE — the AI conduit */}
        <div className="relative flex flex-col items-center justify-center gap-3 px-2">
          <div className="hidden h-px w-full bg-gradient-to-r from-transparent via-violet/40 to-transparent lg:block" />
          <div className="relative flex flex-col items-center gap-2 rounded-2xl border border-violet/30 bg-violet/5 px-5 py-4 text-center shadow-violet">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-aurora">
              <Sparkles className="h-4 w-4 text-foreground" />
            </span>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet">
              Ema + agents
            </div>
            <div className="text-[11px] text-muted-foreground">
              Routing, replying, booking,
              <br />
              escalating, learning.
            </div>
          </div>
          <div className="hidden h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent lg:block" />
        </div>

        {/* OUT — outcomes */}
        <div className="space-y-2.5">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Flowing out
          </div>
          <FlowChip
            icon={CalendarCheck}
            label="Bookings"
            value={bookingsToday}
            tone="primary"
          />
          <FlowChip
            icon={ShieldCheck}
            label="Drafts to approve"
            value={pendingDrafts}
            tone="violet"
          />
          <FlowChip
            icon={ArrowRight}
            label="Escalated to owner"
            value={openEscalations}
            tone={openEscalations > 0 ? "ema" : "muted"}
          />
        </div>
      </div>
    </motion.section>
  );
}

function FlowChip({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Sparkles;
  label: string;
  value: number;
  tone: "primary" | "violet" | "ema" | "muted";
}) {
  const toneClass =
    tone === "primary"
      ? "border-primary/30 bg-primary/5 text-primary"
      : tone === "violet"
        ? "border-violet/30 bg-violet/5 text-violet"
        : tone === "ema"
          ? "border-ema/40 bg-ema/5 text-ema"
          : "border-border/40 bg-background/40 text-muted-foreground";
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 ${toneClass}`}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-xs font-medium text-foreground/90">{label}</span>
      </div>
      <span className="text-sm font-semibold tabular-nums">{value}</span>
    </div>
  );
}

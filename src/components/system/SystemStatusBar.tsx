"use client";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  CalendarClock,
  CircleDot,
  MessageSquare,
  Phone,
  Instagram,
  MessageCircle,
  PauseOctagon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { agents, type AgentChannel } from "@/lib/mock-data";
import { getAllActivity, getAttentionQueue } from "@/lib/home-data";
import {
  formatSlaShort,
  readSlaMinutes,
} from "@/lib/escalation-sla";
import { DND_EVENT, readDnd } from "@/lib/system-flags";

const channelIcon: Record<AgentChannel, typeof MessageSquare> = {
  whatsapp: MessageSquare,
  voice: Phone,
  instagram: Instagram,
  messenger: MessageCircle,
};

const MOCK_MODE_KEY = "isola.mockMode";

export default function SystemStatusBar() {
  const navigate = useNavigate();
  const [now, setNow] = useState<Date | null>(null);
  const [sla, setSla] = useState(60);
  const [dnd, setDnd] = useState(false);

  // Hydration-safe clock — only ticks on the client to avoid SSR mismatch.
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    setSla(readSlaMinutes());
    setDnd(readDnd());
    const onSla = () => setSla(readSlaMinutes());
    const onDnd = () => setDnd(readDnd());
    window.addEventListener("isola:sla-changed", onSla);
    window.addEventListener("storage", onSla);
    window.addEventListener(DND_EVENT, onDnd);
    window.addEventListener("storage", onDnd);
    return () => {
      window.removeEventListener("isola:sla-changed", onSla);
      window.removeEventListener("storage", onSla);
      window.removeEventListener(DND_EVENT, onDnd);
      window.removeEventListener("storage", onDnd);
    };
  }, []);

  const attention = useMemo(() => getAttentionQueue(sla), [sla]);
  const escalations = attention.filter((a) => a.severity === "high").length;

  const activeAgents = agents.filter((a) => a.status !== "paused").length;

  // Status text — DnD wins, then escalations, then nominal.
  const statusLabel = dnd
    ? "Do Not Disturb"
    : escalations > 0
      ? `${escalations} escalation${escalations === 1 ? "" : "s"}`
      : "All systems nominal";
  const statusTone = dnd
    ? "text-warning"
    : escalations > 0
      ? "text-ema"
      : "text-success";
  const dotClass = dnd
    ? "bg-warning"
    : escalations > 0
      ? "bg-ema animate-pulse"
      : "bg-success animate-pulse";

  const clockText = now
    ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
    : "--:--";

  const onAgentsClick = () => {
    const mode =
      typeof window !== "undefined" && window.localStorage.getItem(MOCK_MODE_KEY) === "team"
        ? "team"
        : "solo";
    if (mode === "solo" && agents[0]) {
      navigate({ to: "/dashboard/agent/$agentId", params: { agentId: agents[0].id } });
    } else {
      navigate({ to: "/dashboard/team" });
    }
  };

  return (
    <div className="sticky top-0 z-40 flex h-9 items-center gap-3 border-b border-border/30 bg-sidebar/80 px-4 backdrop-blur-xl text-[10px] uppercase tracking-[0.16em] text-muted-foreground before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/20 before:to-transparent relative">
      {/* Status segment */}
      <button
        type="button"
        onClick={() => {
          // Best UX: take owner to home where AttentionQueue lives.
          navigate({ to: "/dashboard/home" });
        }}
        title="Open attention queue"
        className={`flex items-center gap-2 transition-colors hover:text-foreground ${statusTone}`}
      >
        {dnd ? (
          <PauseOctagon className="h-3 w-3" />
        ) : (
          <span className="relative flex h-2 w-2">
            <span className={`absolute inset-0 rounded-full ${dotClass}`} />
          </span>
        )}
        <span className="font-semibold">{statusLabel}</span>
      </button>

      <span className="hidden h-3 w-px bg-border/40 sm:block" />

      {/* Ambient ticker — center. Hidden below md so the labels keep priority. */}
      <div className="hidden min-w-0 flex-1 px-4 text-[11px] md:flex">
        <AmbientTicker dnd={dnd} />
      </div>

      {/* Spacer for mobile so right cluster pushes to the edge when ticker is hidden */}
      <div className="flex-1 md:hidden" />

      {/* Right cluster */}
      <div className="flex items-center gap-3 tracking-[0.12em]">
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="hidden items-center gap-1.5 transition-colors hover:text-foreground sm:flex"
              title="Today's date"
            >
              <CalendarClock className="h-3 w-3" />
              <span className="tabular-nums">{clockText}</span>
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            sideOffset={6}
            className="w-auto rounded-xl border-border/40 bg-card/95 p-3 text-xs"
          >
            <div className="font-display text-sm font-semibold">
              {now?.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" }) ?? ""}
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </div>
          </PopoverContent>
        </Popover>

        <span className="hidden h-3 w-px bg-border/60 sm:block" />

        <button
          type="button"
          onClick={() => navigate({ to: "/dashboard/settings" })}
          className="hidden items-center gap-1.5 transition-colors hover:text-foreground sm:flex"
          title="Edit SLA in settings"
        >
          <Activity className="h-3 w-3" />
          <span>SLA: <span className="tabular-nums normal-case tracking-normal text-foreground/80">{formatSlaShort(sla)}</span></span>
        </button>

        <span className="hidden h-3 w-px bg-border/60 sm:block" />

        <button
          type="button"
          onClick={onAgentsClick}
          className="flex items-center gap-1.5 transition-colors hover:text-foreground"
          title="Open agents"
        >
          <CircleDot className={`h-2 w-2 ${dnd ? "text-warning" : "text-success"}`} fill="currentColor" />
          <span className="tabular-nums normal-case tracking-normal text-foreground/80">
            {activeAgents}/{agents.length}
          </span>
          <span>agents on</span>
        </button>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Ambient ticker — cycles through the most recent activity, pauses on hover.
// -----------------------------------------------------------------------------

function AmbientTicker({ dnd }: { dnd: boolean }) {
  const navigate = useNavigate();
  const [hovering, setHovering] = useState(false);
  const [idx, setIdx] = useState(0);

  // Stable list — recomputed once at mount (mock data, deterministic).
  const events = useMemo(() => getAllActivity(5), []);

  useEffect(() => {
    if (hovering || events.length === 0) return;
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % events.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, [hovering, events.length]);

  const cur = events[idx];

  // Activity ids look like "{agentId}-act-{n}" — split to recover the agent.
  const agentNameFor = (entryId: string) => {
    const agentId = entryId.split("-act-")[0];
    return agents.find((a) => a.id === agentId)?.name ?? agents[0]?.name ?? "agent";
  };

  if (dnd || events.length === 0 || !cur) {
    return (
      <div className="min-w-0 flex-1 truncate text-center text-foreground/60 normal-case tracking-normal">
        {dnd ? "Quiet mode — agents paused." : "Quiet moment. All agents standing by."}
      </div>
    );
  }

  const Icon = channelIcon[cur.channel] ?? MessageSquare;
  const preview =
    cur.preview.length > 60 ? `${cur.preview.slice(0, 60).trimEnd()}…` : cur.preview;
  const agentName = agentNameFor(cur.id);

  return (
    <button
      type="button"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={() => navigate({ to: "/dashboard/inbox" })}
      className="group min-w-0 flex-1 overflow-hidden text-left"
      title="Open inbox"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={cur.id + idx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center gap-2 truncate normal-case tracking-normal"
        >
          <Icon className="h-3 w-3 shrink-0 text-primary/70" />
          <span className="truncate text-foreground/80 group-hover:text-foreground">
            <span className="font-semibold text-foreground">{cur.customer}</span>
            <span className="mx-1.5 text-muted-foreground/60">·</span>
            <span>{preview}</span>
            <span className="mx-1.5 text-muted-foreground/60">·</span>
            <span className="text-muted-foreground">{agentName}</span>
          </span>
        </motion.div>
      </AnimatePresence>
    </button>
  );
}

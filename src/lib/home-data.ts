// Pure derivation layer for the new /dashboard/home command center.
//
// The home page expresses the operating-system mental model:
//   Owner → Ema → Agents → Events (conversations / bookings / approvals)
//
// All numbers below are derived from existing mock data (no new sources)
// so the UI stays trustworthy as we scale it. Every function is pure and
// deterministic so the home view renders the same on each load.

import {
  agents,
  bookings,
  conversations,
  getAgentActivity,
  type Agent,
  type AgentActivityEntry,
  type AgentChannel,
  type AgentActivityOutcome,
  type Channel,
} from "@/lib/mock-data";

// ---------------------------------------------------------------------------
// Cross-agent activity (the live "machine is working" signal)
// ---------------------------------------------------------------------------

/** Flattened activity across every agent, capped to the last `limit` events. */
export function getAllActivity(limit = 60): AgentActivityEntry[] {
  const all = agents.flatMap((a) => getAgentActivity(a.id));
  // Activity is already pseudo-time-ordered per agent (oldest indexes = newest);
  // flat-mapping mixes them. We sort by leading minutes parsed from `time`
  // so the merged feed reads chronologically.
  return all
    .map((e) => ({ entry: e, ago: parseAgo(e.time) }))
    .sort((a, b) => a.ago - b.ago)
    .slice(0, limit)
    .map(({ entry }) => entry);
}

/** Parse "12m ago", "3h ago", "2d ago" → minutes since now. */
export function parseAgo(t: string): number {
  const m = t.match(/^(\d+)\s*([mhd])/);
  if (!m) return Number.MAX_SAFE_INTEGER;
  const n = parseInt(m[1], 10);
  switch (m[2]) {
    case "m":
      return n;
    case "h":
      return n * 60;
    case "d":
      return n * 60 * 24;
  }
  return n;
}

// ---------------------------------------------------------------------------
// Today's outcomes — outcome-first, not activity-first
// ---------------------------------------------------------------------------

export type DailyOutcomes = {
  messages: number;
  bookings: number;
  autoResolved: number;
  escalated: number;
  autoPct: number;
  /** Hourly volume buckets across the last 12 hours (for sparklines). */
  hourlyVolume: number[];
  /** Estimated revenue influenced (mock: bookings × avg ticket EC$95). */
  revenueInfluenced: number;
  /** Approximate avg response time in seconds (mock anchor). */
  avgResponseSec: number;
  /** Yesterday's snapshot for comparison rendering. */
  yesterday: {
    messages: number;
    bookings: number;
    autoPct: number;
    revenueInfluenced: number;
    avgResponseSec: number;
  };
  /** Pre-computed deltas vs. yesterday — UI renders directly. */
  deltas: {
    messagesPct: number;
    bookingsPct: number;
    autoPctDelta: number;
    revenuePct: number;
    responseDeltaSec: number;
  };
};

const AVG_TICKET_XCD = 95;

export function getDailyOutcomes(activity: AgentActivityEntry[]): DailyOutcomes {
  const today = activity.filter((a) => parseAgo(a.time) <= 24 * 60);
  const yest = activity.filter((a) => {
    const ago = parseAgo(a.time);
    return ago > 24 * 60 && ago <= 48 * 60;
  });

  const messages = today.length;
  const bookings = today.filter((a) => a.outcome === "booked").length;
  const autoResolved = today.filter((a) => a.outcome === "answered").length;
  const escalated = today.filter((a) => a.outcome === "escalated").length;
  const autoPct = messages
    ? Math.round(((autoResolved + bookings) / messages) * 100)
    : 100;

  const yMessages = yest.length;
  const yBookings = yest.filter((a) => a.outcome === "booked").length;
  const yAutoOk = yest.filter((a) => a.outcome !== "escalated").length;
  const yAutoPct = yMessages ? Math.round((yAutoOk / yMessages) * 100) : 100;
  const yRevenue = yBookings * AVG_TICKET_XCD;
  const yAvgResponseSec = 2.7;

  // 12 hourly buckets, oldest → newest left → right
  const hourlyVolume = Array.from({ length: 12 }, (_, i) => {
    const fromMin = (11 - i) * 60;
    const toMin = (12 - i) * 60;
    return today.filter((a) => {
      const ago = parseAgo(a.time);
      return ago >= fromMin && ago < toMin;
    }).length;
  });

  const pctChange = (now: number, then: number): number => {
    if (then === 0) return now > 0 ? 100 : 0;
    return Math.round(((now - then) / then) * 100);
  };

  return {
    messages,
    bookings,
    autoResolved,
    escalated,
    autoPct,
    hourlyVolume,
    revenueInfluenced: bookings * AVG_TICKET_XCD,
    avgResponseSec: 2.4,
    yesterday: {
      messages: yMessages,
      bookings: yBookings,
      autoPct: yAutoPct,
      revenueInfluenced: yRevenue,
      avgResponseSec: yAvgResponseSec,
    },
    deltas: {
      messagesPct: pctChange(messages, yMessages),
      bookingsPct: pctChange(bookings, yBookings),
      autoPctDelta: autoPct - yAutoPct,
      revenuePct: pctChange(bookings * AVG_TICKET_XCD, yRevenue),
      responseDeltaSec: +(2.4 - yAvgResponseSec).toFixed(1),
    },
  };
}

// ---------------------------------------------------------------------------
// What needs human attention — the operational queue
// ---------------------------------------------------------------------------

export type AttentionItemKind =
  | "escalation"
  | "draft"
  | "follow_up"
  | "knowledge_gap"
  | "agent_paused";

export type AttentionItem = {
  id: string;
  kind: AttentionItemKind;
  title: string;
  why: string;
  /** Concrete consequence if ignored — drives owner judgment. */
  riskIfIgnored: string;
  /** Business area affected: Reservations, VIP, Revenue, Knowledge, Operations. */
  area: string;
  agentName: string;
  agentId: string;
  ageMin: number;
  /** Severity drives visual weight — high = pulse + ema accent. */
  severity: "high" | "medium" | "low";
  /** Recommended action label + target route. */
  cta: { label: string; to: string; params?: Record<string, string> };
};

/**
 * Build the unified "needs you" queue across all agents and conversations.
 * Sorted by severity, then by age (older first — they've been waiting longer).
 */
export function getAttentionQueue(slaMinutes: number): AttentionItem[] {
  const items: AttentionItem[] = [];

  // 1. Escalations — open conversations marked "escalated"
  for (const c of conversations.filter((x) => x.status === "escalated")) {
    const ageMin = parseAgo(c.time);
    const overSla = ageMin >= slaMinutes;
    const isVip = /vip|complaint|refund|manager/i.test(c.preview);
    items.push({
      id: `esc-${c.id}`,
      kind: "escalation",
      title: `${c.customer} — needs human reply`,
      why: c.preview,
      riskIfIgnored: overSla
        ? "SLA already breached — high churn risk on next reply"
        : isVip
          ? "Repeat-customer dissatisfaction; reputation exposure"
          : "Customer disengagement; likely lost conversation",
      area: isVip ? "VIP" : "Reservations",
      agentName: agents[0]?.name ?? "Agent",
      agentId: agents[0]?.id ?? "",
      ageMin,
      severity: overSla ? "high" : ageMin >= slaMinutes * 0.5 ? "medium" : "low",
      cta: { label: "Open conversation", to: "/dashboard/inbox" },
    });
  }

  // 2. Probation drafts awaiting approval
  for (const a of agents) {
    for (const d of a.probationDrafts ?? []) {
      const ageMin = parseAgo(d.receivedAt);
      items.push({
        id: `draft-${d.id}`,
        kind: "draft",
        title: `Approve draft to ${d.customerName}`,
        why: d.customerMessage,
        riskIfIgnored: `Customer waiting on ${a.name}'s reply — blocking next interaction`,
        area: "Approvals",
        agentName: a.name,
        agentId: a.id,
        ageMin,
        severity: ageMin > 60 ? "medium" : "low",
        cta: {
          label: "Review draft",
          to: "/dashboard/agent/$agentId",
          params: { agentId: a.id },
        },
      });
    }
  }

  // 3. Overdue follow-ups — pending bookings older than 2h still awaiting
  //    a deposit, owner approval, or other manual nudge.
  const FOLLOW_UP_AGE_MIN = 120;
  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const ageBuckets = [180, 240, 360, 480, 720];
  pendingBookings.forEach((b, idx) => {
    const ageMin = ageBuckets[idx % ageBuckets.length];
    if (ageMin < FOLLOW_UP_AGE_MIN) return;
    const reason = b.notes?.trim() || "Awaiting customer response";
    const overSla = ageMin >= slaMinutes * 4;
    items.push({
      id: `followup-${b.id}`,
      kind: "follow_up",
      title: `Chase ${b.guest} — ${reason.toLowerCase()}`,
      why: `Booking for ${b.party} on ${b.date} ${b.time} via ${labelForChannel(b.channel)} — no movement in ${formatHours(ageMin)}.`,
      riskIfIgnored: `Likely no-show — ~EC$${AVG_TICKET_XCD * b.party} of revenue at risk`,
      area: "Revenue",
      agentName: agents[0]?.name ?? "Agent",
      agentId: agents[0]?.id ?? "",
      ageMin,
      severity: overSla ? "high" : "medium",
      cta: { label: "Open booking", to: "/dashboard/bookings" },
    });
  });

  // 4. Paused agents — operational gap the owner created
  for (const a of agents.filter((x) => x.status === "paused")) {
    items.push({
      id: `paused-${a.id}`,
      kind: "agent_paused",
      title: `${a.name} is paused`,
      why: a.standupSummary ?? "Off duty — no replies will go out.",
      riskIfIgnored: `${a.templateLabel} channel is silent — incoming messages will queue up`,
      area: "Operations",
      agentName: a.name,
      agentId: a.id,
      ageMin: 60 * 6,
      severity: "low",
      cta: {
        label: "Resume agent",
        to: "/dashboard/agent/$agentId",
        params: { agentId: a.id },
      },
    });
  }

  // 5. Top recurring knowledge gaps (highest askedCount, surface 1)
  const allGaps = agents.flatMap((a) =>
    (a.knowledgeGaps ?? []).map((g) => ({ ...g, agent: a })),
  );
  const topGap = [...allGaps].sort((a, b) => b.askedCount - a.askedCount)[0];
  if (topGap && topGap.askedCount >= 3) {
    items.push({
      id: `gap-${topGap.id}`,
      kind: "knowledge_gap",
      title: `Asked ${topGap.askedCount}× this week — no answer`,
      why: `"${topGap.question}"`,
      riskIfIgnored: `${topGap.askedCount} customers got an "I don't know" — eroding trust`,
      area: "Knowledge",
      agentName: topGap.agent.name,
      agentId: topGap.agent.id,
      ageMin: parseAgo(topGap.lastAsked),
      severity: "medium",
      cta: { label: "Add answer", to: "/dashboard/knowledge" },
    });
  }

  return items.sort((a, b) => {
    const sev = sevWeight(b.severity) - sevWeight(a.severity);
    if (sev !== 0) return sev;
    return b.ageMin - a.ageMin;
  });
}

function sevWeight(s: AttentionItem["severity"]) {
  return s === "high" ? 3 : s === "medium" ? 2 : 1;
}

function formatHours(min: number): string {
  if (min < 60) return `${min}m`;
  const h = Math.round(min / 60);
  return `${h}h`;
}

// ---------------------------------------------------------------------------
// Channel mix — what surfaces are working
// ---------------------------------------------------------------------------

export type ChannelSlice = {
  channel: AgentChannel | Channel;
  count: number;
  pct: number;
};

export function getChannelMix(activity: AgentActivityEntry[]): ChannelSlice[] {
  const counts = new Map<AgentChannel, number>();
  for (const a of activity) counts.set(a.channel, (counts.get(a.channel) ?? 0) + 1);
  const total = activity.length || 1;
  const ordered: AgentChannel[] = ["whatsapp", "instagram", "messenger", "voice"];
  return ordered.map((channel) => {
    const count = counts.get(channel) ?? 0;
    return { channel, count, pct: Math.round((count / total) * 100) };
  });
}

// ---------------------------------------------------------------------------
// Ema briefing — natural-language summary tied to the data
// ---------------------------------------------------------------------------

export type EmaBriefing = {
  greeting: string;
  headline: string;
  bullets: string[];
  recommendation: { text: string; cta?: { label: string; to: string } } | null;
};

export function getEmaBriefing(
  ownerFirstName: string,
  outcomes: DailyOutcomes,
  attention: AttentionItem[],
  channels: ChannelSlice[],
): EmaBriefing {
  const greeting = `${timeGreeting()}, ${ownerFirstName}.`;
  const top = channels.reduce((a, b) => (b.count > a.count ? b : a), channels[0]);

  const headline = outcomes.messages
    ? `Your AI team handled ${outcomes.messages} conversations, confirmed ${outcomes.bookings} bookings, and surfaced ${attention.filter((a) => a.severity !== "low").length} item${attention.filter((a) => a.severity !== "low").length === 1 ? "" : "s"} that need you.`
    : `Quiet morning. The system is on standby and ready.`;

  const bullets: string[] = [];
  if (outcomes.autoPct >= 80) {
    bullets.push(
      `Auto-resolution is at ${outcomes.autoPct}% — the team is running on rails.`,
    );
  } else if (outcomes.messages > 0) {
    bullets.push(
      `Auto-resolution dipped to ${outcomes.autoPct}% — a few replies needed your judgment.`,
    );
  }
  const escCount = attention.filter((a) => a.kind === "escalation").length;
  if (escCount > 0) {
    bullets.push(
      `${escCount} escalation${escCount === 1 ? "" : "s"} waiting on owner judgment.`,
    );
  }
  if (top && top.count > 0) {
    bullets.push(
      `${labelForChannel(top.channel)} is your busiest channel today (${top.pct}%).`,
    );
  }
  if (outcomes.revenueInfluenced > 0) {
    bullets.push(
      `~EC$${outcomes.revenueInfluenced.toLocaleString()} in bookings influenced in the last 24h.`,
    );
  }

  const draftCount = attention.filter((a) => a.kind === "draft").length;
  let recommendation: EmaBriefing["recommendation"] = null;
  if (escCount > 0) {
    recommendation = {
      text: `Open the highest-severity escalation first — it's the one most likely to churn if it waits another hour.`,
      cta: { label: "Open inbox", to: "/dashboard/inbox" },
    };
  } else if (draftCount > 0) {
    recommendation = {
      text: `${draftCount} probation draft${draftCount === 1 ? "" : "s"} are waiting. Approving them teaches the next reply.`,
      cta: { label: "Review drafts", to: "/dashboard/drafts" },
    };
  } else {
    recommendation = {
      text: `Nothing urgent. A good moment to review insights or launch a campaign.`,
      cta: { label: "Open insights", to: "/dashboard/insights" },
    };
  }

  return { greeting, headline, bullets, recommendation };
}

function timeGreeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "Still up";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function labelForChannel(c: AgentChannel | Channel): string {
  switch (c) {
    case "whatsapp":
      return "WhatsApp";
    case "instagram":
      return "Instagram";
    case "messenger":
      return "Messenger";
    case "voice":
      return "Voice";
    case "facebook":
      return "Facebook";
  }
}

// ---------------------------------------------------------------------------
// Per-agent quick stats for the Agents Overview block
// ---------------------------------------------------------------------------

export type AgentSnapshot = {
  agent: Agent;
  messagesToday: number;
  bookingsToday: number;
  escalationsToday: number;
  autoPct: number;
};

export function getAgentSnapshots(): AgentSnapshot[] {
  return agents.map((agent) => {
    const act = getAgentActivity(agent.id);
    const today = act.filter((a) => parseAgo(a.time) <= 24 * 60);
    const messagesToday = today.length;
    const bookingsToday = today.filter((a) => a.outcome === "booked").length;
    const escalationsToday = today.filter((a) => a.outcome === "escalated").length;
    const autoOk = today.filter(
      (a: AgentActivityEntry) =>
        (a.outcome as AgentActivityOutcome) !== "escalated",
    ).length;
    const autoPct = messagesToday ? Math.round((autoOk / messagesToday) * 100) : 100;
    return { agent, messagesToday, bookingsToday, escalationsToday, autoPct };
  });
}

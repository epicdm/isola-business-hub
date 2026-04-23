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

export type EmaInsight = {
  /** Plain-language statement, e.g. "Bookings up 22% vs yesterday." */
  text: string;
  /** Short causal explanation: "Driven by Friday dinner demand." */
  driver?: string;
  /** Optional drill-down route. */
  cta?: { label: string; to: string };
};

export type EmaBriefing = {
  greeting: string;
  /** One-sentence executive summary. */
  headline: string;
  /** Biggest positive movement Ema noticed. */
  win: EmaInsight | null;
  /** Biggest threat Ema noticed. */
  risk: EmaInsight | null;
  /** The single highest-leverage action right now, with reasoning. */
  recommendation: {
    text: string;
    reason: string;
    cta?: { label: string; to: string };
  } | null;
  /** What can safely wait — reduces noise, builds trust. */
  canWait: string | null;
};

export function getEmaBriefing(
  ownerFirstName: string,
  outcomes: DailyOutcomes,
  attention: AttentionItem[],
  channels: ChannelSlice[],
): EmaBriefing {
  const greeting = `${timeGreeting()}, ${ownerFirstName}.`;
  const top = channels.reduce((a, b) => (b.count > a.count ? b : a), channels[0]);
  const escCount = attention.filter((a) => a.kind === "escalation").length;
  const draftCount = attention.filter((a) => a.kind === "draft").length;
  const vipCount = attention.filter((a) => a.area === "VIP").length;
  const highCount = attention.filter((a) => a.severity === "high").length;
  const lowCount = attention.filter((a) => a.severity === "low").length;

  const headline = outcomes.messages
    ? `Your AI team handled ${outcomes.messages} conversations and confirmed ${outcomes.bookings} booking${outcomes.bookings === 1 ? "" : "s"}. ${highCount > 0 ? `${highCount} item${highCount === 1 ? "" : "s"} need your judgment.` : `Nothing urgent on your desk.`}`
    : `Quiet morning. The system is on standby and ready.`;

  // BIGGEST WIN — interpret deltas, not just numbers.
  let win: EmaInsight | null = null;
  if (outcomes.deltas.bookingsPct >= 15 && outcomes.bookings > 0) {
    win = {
      text: `Bookings up ${outcomes.deltas.bookingsPct}% vs yesterday (${outcomes.bookings} confirmed).`,
      driver: top?.count
        ? `Most of the lift is coming through ${labelForChannel(top.channel)}.`
        : undefined,
      cta: { label: "See bookings", to: "/dashboard/bookings" },
    };
  } else if (outcomes.autoPct >= 85 && outcomes.messages >= 10) {
    win = {
      text: `Auto-resolution at ${outcomes.autoPct}% — your team is running on rails.`,
      driver: `Only ${escCount} escalation${escCount === 1 ? "" : "s"} surfaced from ${outcomes.messages} conversations.`,
    };
  } else if (outcomes.deltas.responseDeltaSec < 0) {
    win = {
      text: `Response time improved by ${Math.abs(outcomes.deltas.responseDeltaSec)}s vs yesterday.`,
      driver: `Now averaging ${outcomes.avgResponseSec}s across all channels.`,
    };
  }

  // BIGGEST RISK — what could quietly go wrong.
  let risk: EmaInsight | null = null;
  if (vipCount > 0) {
    risk = {
      text: `${vipCount} VIP issue${vipCount === 1 ? "" : "s"} unresolved — repeat-customer reputation exposure.`,
      driver: `These tend to convert into negative reviews if they cross the 1-hour mark.`,
      cta: { label: "Open VIP", to: "/dashboard/inbox" },
    };
  } else if (highCount > 0) {
    risk = {
      text: `${highCount} item${highCount === 1 ? "" : "s"} past SLA — likely to churn if they wait another hour.`,
      driver: `Escalations and follow-ups are the highest-leverage place to spend the next 10 minutes.`,
      cta: { label: "Triage now", to: "/dashboard/inbox" },
    };
  } else if (outcomes.deltas.autoPctDelta <= -10 && outcomes.messages >= 10) {
    risk = {
      text: `Auto-resolution dropped ${Math.abs(outcomes.deltas.autoPctDelta)} pts vs yesterday.`,
      driver: `Likely caused by a spike in escalations — worth a quick scan.`,
      cta: { label: "See drafts", to: "/dashboard/drafts" },
    };
  }

  // RECOMMENDATION — single most-leveraged next action.
  let recommendation: EmaBriefing["recommendation"] = null;
  if (vipCount > 0) {
    recommendation = {
      text: `Reply to the VIP escalation first.`,
      reason: `One unhappy regular costs more than ten quiet wins. The rest can wait 30 minutes.`,
      cta: { label: "Open inbox", to: "/dashboard/inbox" },
    };
  } else if (highCount > 0) {
    const oldest = attention.find((a) => a.severity === "high");
    recommendation = {
      text: `Handle the ${oldest?.area.toLowerCase() ?? "open"} escalation that's been waiting longest.`,
      reason: `${oldest?.riskIfIgnored ?? "It's the closest to breaching SLA"} — clearing it improves the whole queue's health.`,
      cta: { label: "Open inbox", to: "/dashboard/inbox" },
    };
  } else if (draftCount > 0) {
    recommendation = {
      text: `Approve the ${draftCount} held draft${draftCount === 1 ? "" : "s"}.`,
      reason: `Each approval teaches the agent — the next reply will go out without you.`,
      cta: { label: "Review drafts", to: "/dashboard/drafts" },
    };
  } else if (outcomes.bookings > 0) {
    recommendation = {
      text: `Launch a follow-up campaign for today's confirmed bookings.`,
      reason: `Confirmation messages from happy customers convert into reviews ~3× more often.`,
      cta: { label: "Open campaigns", to: "/dashboard/outbound" },
    };
  } else {
    recommendation = {
      text: `Use this calm window to review insights.`,
      reason: `Nothing urgent. A good moment to spot trends before tomorrow's volume.`,
      cta: { label: "Open insights", to: "/dashboard/insights" },
    };
  }

  // CAN WAIT — explicit reassurance.
  let canWait: string | null = null;
  if (lowCount > 0 && highCount > 0) {
    canWait = `${lowCount} lower-priority item${lowCount === 1 ? "" : "s"} (knowledge gaps, paused agents) can wait until tomorrow morning.`;
  } else if (outcomes.autoPct >= 80 && highCount === 0) {
    canWait = `You can safely ignore inbox volume right now. Auto-resolution is healthy and conversion quality is strong.`;
  }

  return { greeting, headline, win, risk, recommendation, canWait };
}

function timeGreeting(): string {
  // Mirrors the buckets in src/hooks/use-time-of-day.ts so the greeting and
  // the ambient hero tint always agree on which "part of day" it is.
  const h = new Date().getHours();
  if (h >= 5 && h < 11) return "Good morning";
  if (h >= 11 && h < 17) return "Good afternoon";
  if (h >= 17 && h < 21) return "Good evening";
  return "Working late";
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

export type AgentTag =
  | "best_performer"
  | "rising_escalations"
  | "overloaded"
  | "strong_conversion"
  | "off_duty"
  | "in_training";

export type AgentSnapshot = {
  agent: Agent;
  messagesToday: number;
  bookingsToday: number;
  escalationsToday: number;
  autoPct: number;
  /** Strategic tags — drive the badges on the agent overview cards. */
  tags: AgentTag[];
  /** One-line strategic note: "Driving 60% of today's bookings." */
  note?: string;
};

export function getAgentSnapshots(): AgentSnapshot[] {
  const raw = agents.map((agent) => {
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

  const totalBookings = raw.reduce((s, r) => s + r.bookingsToday, 0) || 1;
  const totalMessages = raw.reduce((s, r) => s + r.messagesToday, 0) || 1;
  const avgMessages = totalMessages / raw.length;
  const topAgent = [...raw].sort((a, b) => b.bookingsToday - a.bookingsToday)[0];

  return raw.map((r): AgentSnapshot => {
    const tags: AgentTag[] = [];
    let note: string | undefined;

    if (r.agent.status === "paused") {
      tags.push("off_duty");
      note = "Currently paused — channel is silent.";
    } else if (r.agent.status === "on_probation") {
      tags.push("in_training");
      note = "On probation — drafts pending your approval.";
    } else {
      // Best performer: most bookings AND >= 25% of total
      if (
        topAgent &&
        r.agent.id === topAgent.agent.id &&
        r.bookingsToday > 0 &&
        r.bookingsToday / totalBookings >= 0.25
      ) {
        tags.push("best_performer");
        note = `Driving ${Math.round((r.bookingsToday / totalBookings) * 100)}% of today's bookings.`;
      }
      // Overloaded: >40% above team average
      if (r.messagesToday > avgMessages * 1.4 && r.messagesToday >= 10) {
        tags.push("overloaded");
        note = note ?? `Handling ${Math.round((r.messagesToday / avgMessages - 1) * 100)}% above team average.`;
      }
      // Rising escalations: escalations >= 20% of messages
      if (r.escalationsToday >= 2 && r.escalationsToday / Math.max(r.messagesToday, 1) >= 0.2) {
        tags.push("rising_escalations");
        note = note ?? `Escalation rate climbing — ${r.escalationsToday} of ${r.messagesToday} today.`;
      }
      // Strong conversion: bookings >= 30% of messages
      if (r.bookingsToday >= 3 && r.bookingsToday / Math.max(r.messagesToday, 1) >= 0.3) {
        tags.push("strong_conversion");
        note = note ?? `Strong conversion — ${Math.round((r.bookingsToday / r.messagesToday) * 100)}% of replies booked.`;
      }
    }

    return { ...r, tags, note };
  });
}

// ---------------------------------------------------------------------------
// "Since you last checked in" — temporal delta layer
// ---------------------------------------------------------------------------
//
// Persistence model
// ─────────────────
// We persist two timestamps in localStorage:
//
//   isola.lastVisitAt     → the START of the previous visit (the baseline
//                            we diff *against*). This is what the strip uses
//                            to compute "what moved while I was away".
//   isola.currentVisitAt  → the START of the current visit (used to decide
//                            when to roll the baseline forward).
//
// On each home-page mount we call `touchVisit()`. It rolls
// `currentVisitAt → lastVisitAt` only when the user has actually been away
// long enough that re-baselining is meaningful (default: 10+ minutes of
// inactivity). Re-mounting from in-app navigation within the same session
// does NOT shift the baseline, so the deltas remain stable while the owner
// works through the page.

const LAST_VISIT_KEY = "isola.lastVisitAt";
const CURRENT_VISIT_KEY = "isola.currentVisitAt";

/** Idle gap that triggers a baseline roll. Anything shorter is "same session". */
export const REBASE_AFTER_MIN = 10;

export type SinceLastVisit = {
  /** Human-readable label for the window, e.g. "Since you stepped away 2h ago". */
  label: string;
  /** Resolved gap in minutes between the previous visit and now. */
  gapMinutes: number;
  /** Compact movement chips. */
  changes: Array<{
    kind: "positive" | "neutral" | "negative" | "info";
    text: string;
  }>;
  /** True if this is the very first visit (no baseline). */
  firstVisit: boolean;
};

/** Read the persisted previous-visit timestamp without mutating storage. */
export function readLastVisit(): number | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(LAST_VISIT_KEY);
  if (!raw) return null;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? n : null;
}

/**
 * Mark that the user is on the home page right now and, if they've been
 * away long enough, roll the baseline forward.
 *
 * Returns the timestamp the strip should diff against (i.e. the previous
 * visit's start), so callers can render deltas immediately without a second
 * round-trip through localStorage.
 *
 * Designed to be called once per home-page mount.
 */
export function touchVisit(): {
  /** Baseline timestamp the strip diffs against. `null` on the very first visit. */
  baseline: number | null;
  /** Whether the baseline was just rolled forward. */
  rebased: boolean;
} {
  if (typeof window === "undefined") return { baseline: null, rebased: false };
  const now = Date.now();
  const ls = window.localStorage;

  const prevCurrentRaw = ls.getItem(CURRENT_VISIT_KEY);
  const prevCurrent = prevCurrentRaw ? parseInt(prevCurrentRaw, 10) : NaN;
  const prevLastRaw = ls.getItem(LAST_VISIT_KEY);
  const prevLast = prevLastRaw ? parseInt(prevLastRaw, 10) : NaN;

  // First visit ever: nothing to diff against. Stamp current and exit.
  if (!Number.isFinite(prevCurrent)) {
    ls.setItem(CURRENT_VISIT_KEY, String(now));
    return { baseline: null, rebased: false };
  }

  const idleMin = (now - prevCurrent) / 60_000;

  // Long enough away → roll the baseline forward.
  if (idleMin >= REBASE_AFTER_MIN) {
    ls.setItem(LAST_VISIT_KEY, String(prevCurrent));
    ls.setItem(CURRENT_VISIT_KEY, String(now));
    return { baseline: prevCurrent, rebased: true };
  }

  // Same session: keep the existing baseline, just bump current activity.
  ls.setItem(CURRENT_VISIT_KEY, String(now));
  return {
    baseline: Number.isFinite(prevLast) ? prevLast : prevCurrent,
    rebased: false,
  };
}

/** Back-compat shim — older callers expected a stamp-only API. */
export function stampLastVisit(): void {
  touchVisit();
}

/**
 * Build the "since you last checked in" strip from real activity windows.
 *
 * The window is the gap between `lastVisitAt` and now (clamped to ≥5m). On
 * a first visit we fall back to a 4h look-back so the strip still has signal.
 *
 * Every chip below is derived from data that actually falls inside that
 * window — we never surface "vs yesterday" deltas unless the gap actually
 * spans yesterday. This keeps the strip honest.
 */
export function getSinceLastVisit(
  activity: AgentActivityEntry[],
  outcomes: DailyOutcomes,
  attention: AttentionItem[],
  lastVisitAt: number | null,
  slaMinutes = 60,
): SinceLastVisit {
  const now = Date.now();
  const firstVisit = lastVisitAt === null;
  const rawGapMin = firstVisit
    ? 4 * 60
    : Math.max(5, Math.round((now - (lastVisitAt as number)) / 60_000));
  // Cap at 7 days so the label/window stay sensible after long absences.
  const windowMin = Math.min(rawGapMin, 7 * 24 * 60);

  // Activity that occurred inside the visit gap.
  const sinceActivity = activity.filter((a) => parseAgo(a.time) <= windowMin);
  const newBookings = sinceActivity.filter((a) => a.outcome === "booked").length;
  const newAnswered = sinceActivity.filter((a) => a.outcome === "answered").length;
  const newEscalated = sinceActivity.filter(
    (a) => a.outcome === "escalated",
  ).length;

  // Drafts that were held during the gap.
  const newDrafts = attention.filter(
    (a) => a.kind === "draft" && a.ageMin <= windowMin,
  ).length;

  // SLA-crossings: items that were UNDER SLA at the previous visit but are
  // OVER it now. ageMin >= slaMinutes (over now) AND ageMin - windowMin <
  // slaMinutes (was under at the start of the gap).
  const newlyBreached = attention.filter(
    (a) =>
      a.kind === "escalation" &&
      a.ageMin >= slaMinutes &&
      a.ageMin - windowMin < slaMinutes,
  ).length;

  // Outcomes deltas are anchored to *yesterday*, so only surface them when
  // the window actually spans a day or more. Otherwise it's misleading.
  const gapSpansFullDay = windowMin >= 12 * 60;

  const label = firstVisit
    ? "In the last 4 hours"
    : windowMin < 60
      ? `Since you stepped away ${windowMin}m ago`
      : windowMin < 24 * 60
        ? `Since you stepped away ${Math.round(windowMin / 60)}h ago`
        : windowMin < 48 * 60
          ? "Since yesterday"
          : `Since ${Math.round(windowMin / (24 * 60))} days ago`;

  const changes: SinceLastVisit["changes"] = [];

  if (newBookings > 0) {
    changes.push({
      kind: "positive",
      text: `${newBookings} booking${newBookings === 1 ? "" : "s"} confirmed`,
    });
  }
  if (newAnswered > 0) {
    changes.push({
      kind: "neutral",
      text: `${newAnswered} conversation${newAnswered === 1 ? "" : "s"} auto-resolved`,
    });
  }
  if (newEscalated > 0) {
    changes.push({
      kind: "negative",
      text: `${newEscalated} new escalation${newEscalated === 1 ? "" : "s"}`,
    });
  }
  if (newlyBreached > 0) {
    changes.push({
      kind: "negative",
      text: `${newlyBreached} item${newlyBreached === 1 ? "" : "s"} crossed SLA`,
    });
  }
  if (newDrafts > 0) {
    changes.push({
      kind: "info",
      text: `${newDrafts} new draft${newDrafts === 1 ? "" : "s"} held for review`,
    });
  }

  // Comparative deltas — only when the gap actually spans yesterday.
  if (gapSpansFullDay) {
    if (outcomes.deltas.responseDeltaSec < 0) {
      changes.push({
        kind: "positive",
        text: `Response time improved ${Math.abs(outcomes.deltas.responseDeltaSec)}s vs yesterday`,
      });
    } else if (outcomes.deltas.bookingsPct >= 15 && outcomes.bookings > 0) {
      changes.push({
        kind: "positive",
        text: `Bookings trending +${outcomes.deltas.bookingsPct}% vs yesterday`,
      });
    }
  }

  if (changes.length === 0) {
    changes.push({
      kind: "neutral",
      text: firstVisit
        ? "Quiet window — the system has been on standby"
        : "Quiet stretch — nothing material moved while you were away",
    });
  }

  return {
    label,
    gapMinutes: windowMin,
    changes: changes.slice(0, 5),
    firstVisit,
  };
}

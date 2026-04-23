"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layout";
import ExecutiveHeader from "@/components/dashboard/home/ExecutiveHeader";
import EmaBriefingCard from "@/components/dashboard/home/EmaBriefingCard";
import AttentionQueue from "@/components/dashboard/home/AttentionQueue";
import AutonomousFeed from "@/components/dashboard/home/AutonomousFeed";
import AgentsOverview from "@/components/dashboard/home/AgentsOverview";
import OutcomesPanel from "@/components/dashboard/home/OutcomesPanel";
import SystemFlowPanel from "@/components/dashboard/home/SystemFlowPanel";
import QuickActions from "@/components/dashboard/home/QuickActions";
import {
  getAllActivity,
  getDailyOutcomes,
  getAttentionQueue,
  getChannelMix,
  getEmaBriefing,
  getAgentSnapshots,
} from "@/lib/home-data";
import { readSlaMinutes } from "@/lib/escalation-sla";
import { accountDefaults } from "@/lib/mock-data";
import { readProfile } from "@/lib/profile";

/**
 * /dashboard/home — Isola business command center.
 *
 * This page is the new default destination after login. It expresses the
 * operating-system mental model on one screen:
 *
 *   Owner (you)
 *     → Ema (briefing)
 *       → Agents (working the floor)
 *         → Events (conversations, bookings, escalations, approvals)
 *
 * Layout rhythm (top → bottom, importance-weighted):
 *   1. Executive header   — arrival moment, system-state strip
 *   2. Ema briefing       — natural-language summary + recommendation
 *   3. Needs you / feed   — split: human queue + autonomous proof
 *   4. Outcomes           — what was produced (revenue, response time)
 *   5. System flow        — channels in → AI → outcomes out
 *   6. Agents overview    — the team roster
 *   7. Quick actions      — control bar
 *
 * We deliberately do NOT mirror the old "agent workspace" layout — the home
 * sits ABOVE individual agents. Drill into a specific agent only via the
 * Agents Overview block.
 */
export default function HomePage() {
  // SLA preference is owned client-side (see /src/lib/escalation-sla.ts)
  const [slaMinutes, setSlaMinutes] = useState<number>(60);
  useEffect(() => {
    setSlaMinutes(readSlaMinutes());
    const sync = () => setSlaMinutes(readSlaMinutes());
    window.addEventListener("isola:sla-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("isola:sla-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // Owner identity — header greets by first name.
  const [ownerFirstName, setOwnerFirstName] = useState<string>("");
  const [businessName, setBusinessName] = useState<string>(
    accountDefaults.businessName,
  );
  useEffect(() => {
    const p = readProfile();
    const full = p.contactName?.trim() || accountDefaults.ownerName;
    setOwnerFirstName(full.split(" ")[0] || "there");
    setBusinessName(p.businessName?.trim() || accountDefaults.businessName);
  }, []);

  // All derived data is memoized — pure functions over deterministic mock data.
  const activity = useMemo(() => getAllActivity(60), []);
  const outcomes = useMemo(() => getDailyOutcomes(activity), [activity]);
  const attention = useMemo(() => getAttentionQueue(slaMinutes), [slaMinutes]);
  const channels = useMemo(() => getChannelMix(activity), [activity]);
  const snapshots = useMemo(() => getAgentSnapshots(), []);
  const briefing = useMemo(
    () => getEmaBriefing(ownerFirstName || "there", outcomes, attention, channels),
    [ownerFirstName, outcomes, attention, channels],
  );

  const openEscalations = attention.filter((a) => a.kind === "escalation").length;
  const pendingDrafts = attention.filter((a) => a.kind === "draft").length;

  return (
    <DashboardLayout currentPath="/dashboard/home">
      <div className="mx-auto max-w-7xl space-y-6 p-5 sm:p-7 lg:p-8">
        {/* 1. Arrival */}
        <ExecutiveHeader
          greeting={briefing.greeting}
          businessName={businessName}
          headline={briefing.headline}
          stats={{
            messages: outcomes.messages,
            bookings: outcomes.bookings,
            needsYou: attention.length,
            autoPct: outcomes.autoPct,
          }}
        />

        {/* 2. Ema briefing — full-width strategic narrative */}
        <EmaBriefingCard briefing={briefing} />

        {/* 3. Operational dual-pane: human queue (left) + autonomous proof (right).
             Stacked on tablet, side-by-side from lg up. The left pane is what
             demands action; the right pane is what reassures. */}
        <div className="grid gap-5 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <AttentionQueue items={attention} slaMinutes={slaMinutes} />
          </div>
          <div className="lg:col-span-2">
            <AutonomousFeed activity={activity} />
          </div>
        </div>

        {/* 4. Outcomes — what the system produced */}
        <OutcomesPanel outcomes={outcomes} />

        {/* 5. System flow — channels → AI → outcomes */}
        <SystemFlowPanel
          channels={channels}
          pendingDrafts={pendingDrafts}
          bookingsToday={outcomes.bookings}
          openEscalations={openEscalations}
        />

        {/* 6. Agents — your team on the floor */}
        <AgentsOverview snapshots={snapshots} />

        {/* 7. Operational launcher */}
        <QuickActions />
      </div>
    </DashboardLayout>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layout";
import ExecutiveHeader from "@/components/dashboard/home/ExecutiveHeader";
import SinceLastVisit from "@/components/dashboard/home/SinceLastVisit";
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
  getSinceLastVisit,
  readLastVisit,
  stampLastVisit,
} from "@/lib/home-data";
import { readSlaMinutes } from "@/lib/escalation-sla";
import { accountDefaults, bookings as allBookings } from "@/lib/mock-data";
import { readProfile } from "@/lib/profile";

/**
 * /dashboard/home — Isola business command center.
 *
 * The page expresses the operating-system mental model on one screen:
 *
 *   Owner (you)
 *     → Ema (briefing & decisions)
 *       → Agents (working the floor, with strategic tags)
 *         → Events (conversations, bookings, escalations, approvals)
 *
 * Layout rhythm (top → bottom, importance-weighted):
 *   1. Executive header        — arrival moment, system-state strip
 *   2. Since you last visited  — temporal delta strip (movement signal)
 *   3. Ema decision briefing   — win / risk / recommendation / can-wait
 *   4. Needs you / feed        — split: human queue + autonomous proof
 *   5. Outcomes (comparative)  — vs yesterday, with drivers
 *   6. System flow             — channels in → AI → outcomes out
 *   7. Agents overview         — strategic tags + one-line operator note
 *   8. Quick actions           — live-state operational launcher
 */
export default function HomePage() {
  // SLA preference (see /src/lib/escalation-sla.ts)
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

  // "Since you last visited" — read the timestamp on first render, then stamp
  // the visit so subsequent navigations within the session don't re-trigger.
  const [lastVisitAt, setLastVisitAt] = useState<number | null>(null);
  useEffect(() => {
    setLastVisitAt(readLastVisit());
    stampLastVisit();
  }, []);

  // Pure derivations.
  const activity = useMemo(() => getAllActivity(60), []);
  const outcomes = useMemo(() => getDailyOutcomes(activity), [activity]);
  const attention = useMemo(() => getAttentionQueue(slaMinutes), [slaMinutes]);
  const channels = useMemo(() => getChannelMix(activity), [activity]);
  const snapshots = useMemo(() => getAgentSnapshots(), []);
  const briefing = useMemo(
    () => getEmaBriefing(ownerFirstName || "there", outcomes, attention, channels),
    [ownerFirstName, outcomes, attention, channels],
  );
  const sinceLastVisit = useMemo(
    () => getSinceLastVisit(activity, outcomes, attention, lastVisitAt),
    [activity, outcomes, attention, lastVisitAt],
  );

  const openEscalations = attention.filter((a) => a.kind === "escalation").length;
  const pendingDrafts = attention.filter((a) => a.kind === "draft").length;
  const bookingsNeedingConfirmation = allBookings.filter(
    (b) => b.status === "pending",
  ).length;

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

        {/* 2. Movement — what changed while the owner was away */}
        <SinceLastVisit data={sinceLastVisit} />

        {/* 3. Ema decision briefing — win / risk / recommendation / can-wait */}
        <EmaBriefingCard briefing={briefing} />

        {/* 4. Operational dual-pane: human queue (left) + autonomous proof (right). */}
        <div className="grid gap-5 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <AttentionQueue items={attention} slaMinutes={slaMinutes} />
          </div>
          <div className="lg:col-span-2">
            <AutonomousFeed activity={activity} />
          </div>
        </div>

        {/* 5. Outcomes — comparative, with drivers */}
        <OutcomesPanel outcomes={outcomes} />

        {/* 6. System flow — channels → AI → outcomes */}
        <SystemFlowPanel
          channels={channels}
          pendingDrafts={pendingDrafts}
          bookingsToday={outcomes.bookings}
          openEscalations={openEscalations}
        />

        {/* 7. Agents — your team on the floor (strategic tags) */}
        <AgentsOverview snapshots={snapshots} />

        {/* 8. Operational launcher — live-state controls */}
        <QuickActions
          state={{
            openEscalations,
            pendingDrafts,
            bookingsNeedingConfirmation,
          }}
        />
      </div>
    </DashboardLayout>
  );
}


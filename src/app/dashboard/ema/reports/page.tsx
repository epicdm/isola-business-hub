"use client";

import { useState } from "react";
import {
  Sparkles,
  FileText,
  Download,
  TrendingUp,
  Calendar,
  Megaphone,
  MessageSquare,
  AlertCircle,
  DollarSign,
  ChevronDown,
} from "lucide-react";
import DashboardLayout from "../../layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { emaReports } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Filter = "all" | "daily" | "weekly" | "campaign";

const filters: Array<{ key: Filter; label: string; icon: typeof Calendar }> = [
  { key: "all", label: "All", icon: FileText },
  { key: "daily", label: "Daily", icon: Calendar },
  { key: "weekly", label: "Weekly", icon: TrendingUp },
  { key: "campaign", label: "Campaigns", icon: Megaphone },
];

const typeMeta = {
  daily: { label: "Daily digest", icon: Calendar, color: "text-primary bg-primary/15" },
  weekly: { label: "Weekly recap", icon: TrendingUp, color: "text-chart-2 bg-chart-2/15" },
  campaign: { label: "Campaign", icon: Megaphone, color: "text-ema bg-ema/15" },
};

// Top topics chip pool — purely visual, deterministic per id.
function topicsFor(id: string): string[] {
  const pool = [
    "reservations", "menu questions", "hours", "directions", "private dinners",
    "vegetarian options", "dietary restrictions", "anniversary", "birthday",
    "deposits", "tour groups", "kids menu", "VIP table", "wine list",
  ];
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const out: string[] = [];
  while (out.length < 5) {
    h = (h * 1664525 + 1013904223) >>> 0;
    const t = pool[h % pool.length];
    if (!out.includes(t)) out.push(t);
  }
  return out;
}

// Anomalies — derived from metrics. Returns 0-2 short strings.
function anomaliesFor(r: (typeof emaReports)[number]): string[] {
  const out: string[] = [];
  if (r.metrics.escalations >= 2) {
    out.push(`${r.metrics.escalations} escalations still open`);
  }
  if (r.metrics.bookings === 0) {
    out.push("No bookings captured");
  }
  if (r.type === "campaign" && r.metrics.messages > 50 && r.metrics.bookings / r.metrics.messages < 0.2) {
    out.push("Conversion below benchmark");
  }
  return out;
}

export default function EmaReportsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = emaReports.filter((r) => filter === "all" || r.type === filter);

  return (
    <DashboardLayout currentPath="/dashboard/ema/reports">
      <div className="px-6 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-ema shadow-ema">
              <FileText className="h-5 w-5 text-ema-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold leading-tight">Reports</h1>
              <p className="text-sm text-muted-foreground">Every digest, recap, and campaign Ema has sent.</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-3.5 w-3.5" /> Export all
          </Button>
        </div>

        {/* Filter chips */}
        <div className="mb-6 flex flex-wrap gap-2">
          {filters.map((f) => {
            const count = f.key === "all" ? emaReports.length : emaReports.filter((r) => r.type === f.key).length;
            const active = filter === f.key;
            const Icon = f.icon;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "border-primary/40 bg-primary/15 text-primary"
                    : "border-border/60 bg-card/40 text-muted-foreground hover:bg-accent"
                }`}
              >
                <Icon className="h-3 w-3" />
                {f.label}
                <span className="opacity-60">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Report cards — single column, expand inline */}
        <div className="space-y-3">
          {visible.length === 0 && (
            <div className="py-16 text-center text-sm text-muted-foreground">
              No reports match this filter yet.
            </div>
          )}
          {visible.map((r) => {
            const meta = typeMeta[r.type];
            const TypeIcon = meta.icon;
            const expanded = openId === r.id;
            const isWeekly = r.type === "weekly";
            const topics = topicsFor(r.id);
            const anomalies = anomaliesFor(r);
            return (
              <Card
                key={r.id}
                className={cn(
                  "overflow-hidden bg-card/60 transition-all",
                  isWeekly ? "border-2 border-chart-2/30" : "border border-border/40",
                  expanded && "shadow-ema",
                )}
              >
                {/* Collapsed/header row */}
                <button
                  onClick={() => setOpenId(expanded ? null : r.id)}
                  aria-expanded={expanded}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-accent/20"
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${meta.color}`}>
                    <TypeIcon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="border-border/60 bg-background/40 text-[10px] uppercase tracking-wider text-muted-foreground"
                      >
                        {meta.label}
                      </Badge>
                      {isWeekly && (
                        <Badge className="bg-chart-2/15 text-[10px] uppercase tracking-wider text-chart-2 hover:bg-chart-2/20">
                          Weekly
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">{r.date}</span>
                    </div>
                    <div className="mt-1 flex items-baseline gap-2">
                      <h3 className="font-display text-base font-semibold">{r.title}</h3>
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{r.summary}</p>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                      expanded && "rotate-180",
                    )}
                  />
                </button>

                {/* Expanded body */}
                {expanded && (
                  <div className="space-y-4 border-t border-border/40 px-5 py-5">
                    {/* Ema's voice block — canonical digest body */}
                    <div className="rounded-lg border border-ema/20 bg-ema/5 p-4 text-sm leading-relaxed">
                      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-ema">
                        <Sparkles className="h-3 w-3" /> Ema's summary
                      </div>
                      <DigestBody report={r} />
                    </div>

                    {/* Stat breakdown row */}
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      <Stat icon={MessageSquare} label="Messages" value={r.metrics.messages.toString()} />
                      <Stat icon={Calendar} label="Bookings" value={r.metrics.bookings.toString()} />
                      <Stat icon={AlertCircle} label="Escalations" value={r.metrics.escalations.toString()} />
                      <Stat icon={DollarSign} label="Revenue" value={`EC$${r.metrics.revenue.toLocaleString()}`} />
                    </div>

                    {/* Anomalies */}
                    {anomalies.length > 0 && (
                      <div>
                        <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Anomalies
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {anomalies.map((a, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 rounded-full border border-destructive/30 bg-destructive/10 px-2.5 py-0.5 text-[11px] font-medium text-destructive"
                            >
                              <AlertCircle className="h-2.5 w-2.5" />
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Top topics */}
                    <div>
                      <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Top conversation topics
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {topics.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-border/60 bg-background/40 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Highlights */}
                    {r.highlights.length > 0 && (
                      <div>
                        <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Highlights
                        </div>
                        <ul className="space-y-1.5">
                          {r.highlights.map((h, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ema" />
                              <span className="text-muted-foreground">{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex justify-end gap-2 border-t border-border/40 pt-3">
                      <Button variant="outline" size="sm">
                        <Download className="h-3.5 w-3.5" /> Download PDF
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MessageSquare;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border/40 bg-background/40 p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="mt-1 font-display text-lg font-bold">{value}</div>
    </div>
  );
}

// Builds the canonical digest body string with light markdown rendering for **bold**.
function DigestBody({ report: r }: { report: (typeof emaReports)[number] }) {
  const aiHandled = Math.max(0, Math.round(r.metrics.messages * 0.85));
  const humanHandled = Math.max(0, r.metrics.messages - aiHandled);
  const paid = Math.round(r.metrics.bookings * 0.6);
  const topics = topicsFor(r.id);
  const topTopic = topics[0];
  const topTopicCount = 3 + (r.metrics.messages % 7);

  let anomalyLine = "Everything's on track.";
  if (r.metrics.escalations >= 2) {
    anomalyLine = `⚠️ You've got ${r.metrics.escalations} escalations older than 24h — oldest is from Marcus Phillip.`;
  } else if (r.metrics.bookings === 0) {
    anomalyLine = `⚠️ Bookings down 100% vs last week.`;
  }

  const lines: Array<{ t: string }> = [
    { t: `📅 ${r.date} — here's your day.` },
    { t: "" },
    { t: `💬 **${r.metrics.messages}** messages handled (**${aiHandled}** by AI, **${humanHandled}** by you)` },
    { t: `📅 **${r.metrics.bookings}** bookings captured` },
    { t: `⚠️ **${r.metrics.escalations}** conversations still waiting for you` },
    { t: `💰 **EC$${r.metrics.revenue.toLocaleString()}** in payment links sent (**${paid}** paid)` },
    { t: "" },
    { t: `**Top topic:** '${topTopic}' (${topTopicCount} mentions)` },
    { t: "" },
    { t: anomalyLine },
    { t: "" },
    { t: "Need the long version? Reply 'details'." },
  ];

  return (
    <div className="space-y-1">
      {lines.map((line, i) =>
        line.t === "" ? (
          <div key={i} className="h-1" />
        ) : (
          <p key={i} dangerouslySetInnerHTML={{ __html: renderBold(line.t) }} />
        ),
      )}
    </div>
  );
}

function renderBold(s: string): string {
  return s.replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground">$1</strong>');
}

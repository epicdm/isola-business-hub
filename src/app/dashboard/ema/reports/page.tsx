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
} from "lucide-react";
import DashboardLayout from "../../layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { emaReports } from "@/lib/mock-data";

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

export default function EmaReportsPage() {
  const [filter, setFilter] = useState<Filter>("all");

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

        {/* Report cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {visible.length === 0 && (
            <div className="col-span-full py-16 text-center text-sm text-muted-foreground">
              No reports match this filter yet.
            </div>
          )}
          {visible.map((r) => {
            const meta = typeMeta[r.type];
            const TypeIcon = meta.icon;
            return (
              <Card
                key={r.id}
                className="group flex flex-col gap-4 border-border/40 bg-card/60 p-6 transition-all hover:border-ema/30 hover:shadow-ema"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${meta.color}`}>
                      <TypeIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-1 border-border/60 bg-background/40 text-[10px] uppercase tracking-wider text-muted-foreground">
                        {meta.label}
                      </Badge>
                      <div className="text-xs text-muted-foreground">{r.date}</div>
                    </div>
                  </div>
                  <Sparkles className="h-3.5 w-3.5 shrink-0 text-ema opacity-50 transition-opacity group-hover:opacity-100" />
                </div>

                <div>
                  <h3 className="font-display text-lg font-semibold">{r.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{r.summary}</p>
                </div>

                {/* Metric strip */}
                <div className="grid grid-cols-4 gap-2 rounded-lg border border-border/40 bg-background/40 p-3">
                  <Metric icon={MessageSquare} label="Msgs" value={r.metrics.messages.toString()} />
                  <Metric icon={Calendar} label="Bookings" value={r.metrics.bookings.toString()} />
                  <Metric icon={DollarSign} label="Revenue" value={`EC$${r.metrics.revenue.toLocaleString()}`} />
                  <Metric icon={AlertCircle} label="Escal." value={r.metrics.escalations.toString()} />
                </div>

                {/* Highlights */}
                <ul className="space-y-1.5 text-sm">
                  {r.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ema" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex items-center justify-between border-t border-border/40 pt-3">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    View full report
                  </Button>
                  <button className="text-muted-foreground transition-colors hover:text-foreground">
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MessageSquare;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        <Icon className="h-2.5 w-2.5" />
        {label}
      </div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}

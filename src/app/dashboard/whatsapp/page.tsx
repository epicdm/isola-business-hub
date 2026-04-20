"use client";

import { Phone, CheckCircle2, ShieldCheck, Activity, FileText, RefreshCw, Plus } from "lucide-react";
import DashboardLayout from "../layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { whatsappStatus, whatsappTemplates } from "@/lib/mock-data";

export default function WhatsAppPage() {
  return (
    <DashboardLayout currentPath="/dashboard/whatsapp">
      <div className="px-6 py-8 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
              <Phone className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold leading-tight">WhatsApp Business</h1>
              <p className="text-sm text-muted-foreground">
                Number, verification status, and message templates.
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-3.5 w-3.5" /> Sync now
          </Button>
        </div>

        {/* Number card */}
        <Card className="mb-6 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-2xl font-bold tabular-nums">
                    {whatsappStatus.number}
                  </span>
                  {whatsappStatus.verified && (
                    <CheckCircle2 className="h-5 w-5 text-primary" aria-label="Verified" />
                  )}
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {whatsappStatus.displayName} · {whatsappStatus.verifiedTier}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/15 text-primary hover:bg-primary/20">
                <Activity className="h-3 w-3" /> Connected
              </Badge>
              <Button variant="outline" size="sm">
                Manage number
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats grid */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Quality rating"
            value={whatsappStatus.qualityRating}
            sub="Last 24h"
            icon={ShieldCheck}
            tone="success"
          />
          <StatCard
            label="Messaging tier"
            value="Tier 3"
            sub={whatsappStatus.messagingLimit.split(" · ")[1]}
            icon={Activity}
          />
          <StatCard
            label="Conversations 24h"
            value={whatsappStatus.conversations24h.toLocaleString()}
            sub="+12% vs yesterday"
            icon={Phone}
          />
          <StatCard
            label="Webhook"
            value={whatsappStatus.webhookHealthy ? "Healthy" : "Degraded"}
            sub={`Synced ${whatsappStatus.lastSync}`}
            icon={CheckCircle2}
            tone={whatsappStatus.webhookHealthy ? "success" : "warning"}
          />
        </div>

        {/* Templates */}
        <Card className="border-border/40 bg-card/40 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <h2 className="font-display text-lg font-semibold">Message templates</h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {whatsappStatus.templatesApproved} approved · {whatsappStatus.templatesPending} pending review
              </p>
            </div>
            <Button size="sm" variant="outline">
              <Plus className="h-3.5 w-3.5" /> New template
            </Button>
          </div>
          <div className="overflow-hidden rounded-lg border border-border/40">
            <div className="grid grid-cols-[1fr_120px_80px_120px] gap-3 border-b border-border/40 bg-background/40 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Name</span>
              <span>Category</span>
              <span>Lang</span>
              <span>Status</span>
            </div>
            {whatsappTemplates.map((t) => (
              <div
                key={t.id}
                className="grid grid-cols-[1fr_120px_80px_120px] items-center gap-3 border-b border-border/30 px-4 py-3 last:border-0 hover:bg-accent/30"
              >
                <code className="text-sm font-medium">{t.name}</code>
                <span className="text-xs text-muted-foreground">{t.category}</span>
                <span className="text-xs uppercase text-muted-foreground">{t.language}</span>
                <Badge
                  variant="outline"
                  className={`w-fit text-[10px] ${
                    t.status === "approved"
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-warning/40 bg-warning/10 text-warning"
                  }`}
                >
                  {t.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  icon: typeof Activity;
  tone?: "success" | "warning";
}) {
  const toneClass =
    tone === "success" ? "text-primary" : tone === "warning" ? "text-warning" : "text-foreground";
  return (
    <Card className="border-border/40 bg-card/40 p-4">
      <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className={`h-3.5 w-3.5 ${toneClass}`} />
        {label}
      </div>
      <div className={`font-display text-xl font-bold ${toneClass}`}>{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
    </Card>
  );
}

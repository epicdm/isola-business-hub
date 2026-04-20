"use client";

import { CreditCard, Check, Download, TrendingUp, Sparkles, Users, MessageCircle } from "lucide-react";
import DashboardLayout from "../layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { billingPlan, invoices } from "@/lib/mock-data";

export default function BillingPage() {
  return (
    <DashboardLayout currentPath="/dashboard/billing">
      <div className="px-6 py-8 lg:px-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
            <CreditCard className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold leading-tight">Billing</h1>
            <p className="text-sm text-muted-foreground">
              Plan, usage, and invoices.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            {/* Current plan */}
            <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Badge className="bg-primary/20 text-primary hover:bg-primary/25">
                      Current plan
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Renews {billingPlan.renewsOn}
                    </span>
                  </div>
                  <h2 className="font-display text-3xl font-bold">{billingPlan.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    <span className="font-display text-xl font-bold text-foreground">
                      ${billingPlan.price}
                    </span>{" "}
                    {billingPlan.currency} / {billingPlan.interval}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="sm" variant="outline">
                    Manage plan
                  </Button>
                  <Button size="sm" variant="ghost" className="text-muted-foreground">
                    Cancel
                  </Button>
                </div>
              </div>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {billingPlan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </Card>

            {/* Usage */}
            <Card className="border-border/40 bg-card/40 p-6">
              <h2 className="mb-4 font-display text-lg font-semibold">Usage this period</h2>
              <div className="space-y-4">
                <UsageBar
                  icon={MessageCircle}
                  label="Conversations"
                  used={billingPlan.usage.conversations.used}
                  limit={billingPlan.usage.conversations.limit}
                />
                <UsageBar
                  icon={Sparkles}
                  label="AI messages"
                  used={billingPlan.usage.aiMessages.used}
                  limit={billingPlan.usage.aiMessages.limit}
                />
                <UsageBar
                  icon={Users}
                  label="Team seats"
                  used={billingPlan.usage.seats.used}
                  limit={billingPlan.usage.seats.limit}
                />
              </div>
            </Card>

            {/* Invoices */}
            <Card className="border-border/40 bg-card/40 p-6">
              <h2 className="mb-4 font-display text-lg font-semibold">Invoices</h2>
              <div className="overflow-hidden rounded-lg border border-border/40">
                <div className="grid grid-cols-[140px_1fr_100px_100px_60px] gap-3 border-b border-border/40 bg-background/40 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <span>Invoice</span>
                  <span>Period</span>
                  <span className="text-right">Amount</span>
                  <span>Status</span>
                  <span></span>
                </div>
                {invoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="grid grid-cols-[140px_1fr_100px_100px_60px] items-center gap-3 border-b border-border/30 px-4 py-3 last:border-0 hover:bg-accent/30"
                  >
                    <code className="text-xs font-medium">{inv.id}</code>
                    <div>
                      <div className="text-sm">{inv.period}</div>
                      <div className="text-xs text-muted-foreground">{inv.date}</div>
                    </div>
                    <div className="text-right text-sm font-semibold tabular-nums">
                      ${inv.amount}
                    </div>
                    <Badge
                      variant="outline"
                      className="w-fit border-primary/40 bg-primary/10 text-[10px] text-primary"
                    >
                      {inv.status}
                    </Badge>
                    <button className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <Card className="border-border/40 bg-card/40 p-5">
              <h3 className="mb-3 font-display text-base font-semibold">Payment method</h3>
              <div className="flex items-center gap-3 rounded-md border border-border/40 bg-background/40 p-3">
                <div className="flex h-8 w-12 items-center justify-center rounded bg-gradient-to-br from-primary/30 to-primary/10 text-[10px] font-bold text-primary">
                  VISA
                </div>
                <div>
                  <div className="text-sm font-medium">•••• 4242</div>
                  <div className="text-xs text-muted-foreground">Exp 09/2028</div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-3 w-full">
                Update card
              </Button>
            </Card>

            <Card className="border-ema/30 bg-ema/5 p-5">
              <div className="mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-ema" />
                <h3 className="font-display text-sm font-semibold">Upgrade to Scale</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Unlimited AI messages, white-label branding, and a dedicated success manager.
              </p>
              <div className="mt-3 font-display text-2xl font-bold">
                $799<span className="text-sm font-normal text-muted-foreground">/mo</span>
              </div>
              <Button size="sm" className="mt-3 w-full bg-gradient-ema text-ema-foreground hover:opacity-90">
                See Scale plan
              </Button>
            </Card>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}

function UsageBar({
  icon: Icon,
  label,
  used,
  limit,
}: {
  icon: typeof Sparkles;
  label: string;
  used: number;
  limit: number;
}) {
  const pct = Math.min(100, (used / limit) * 100);
  const danger = pct > 80;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-muted-foreground">
          <Icon className="h-3.5 w-3.5" /> {label}
        </span>
        <span className="tabular-nums">
          <span className="font-semibold">{used.toLocaleString()}</span>{" "}
          <span className="text-muted-foreground">/ {limit.toLocaleString()}</span>
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted/50">
        <div
          className={`h-full rounded-full transition-all ${
            danger ? "bg-warning" : "bg-gradient-to-r from-primary to-primary-glow"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

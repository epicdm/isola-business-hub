"use client";

import { CreditCard, Download, ArrowUpRight, ArrowDownRight, PhoneCall, Sparkles, Plus } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { invoices, voiceUsage } from "@/lib/mock-data";

function nextInvoiceDate() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function BillingPage() {
  const usagePct = Math.min(100, (voiceUsage.used / voiceUsage.limit) * 100);
  const showTopup = usagePct > 70;

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
              Subscription, voice minutes, and invoices.
            </p>
          </div>
        </div>

        {/* Current plan */}
        <Card className="mb-6 border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Badge className="mb-2 bg-primary/20 text-primary hover:bg-primary/25">
                Current plan
              </Badge>
              <div className="flex items-baseline gap-2">
                <h2 className="font-display text-3xl font-bold">Pro</h2>
                <span className="text-sm text-muted-foreground">tier</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                <span className="font-display text-2xl font-bold text-foreground">EC$249</span>
                <span className="ml-1">/ month</span>
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Next invoice: <span className="text-foreground">{nextInvoiceDate()}</span>
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
              <Button
                size="sm"
                className="bg-gradient-primary text-primary-foreground hover:opacity-90"
                onClick={() => toast.success("Upgrade flow — coming soon")}
              >
                <ArrowUpRight className="h-3.5 w-3.5" /> Upgrade to Business
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.message("Downgrade requested. We'll confirm by email.")}
              >
                <ArrowDownRight className="h-3.5 w-3.5" /> Downgrade to Starter
              </Button>
            </div>
          </div>
        </Card>

        {/* Voice minutes */}
        <Card className="mb-6 border-border/40 bg-card/40 p-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <PhoneCall className="h-4 w-4 text-primary" />
              <h2 className="font-display text-lg font-semibold">Voice minutes</h2>
            </div>
            {showTopup && (
              <Button
                size="sm"
                variant="outline"
                className="border-warning/40 text-warning hover:bg-warning/10"
                onClick={() => toast.success(`Top-up added: +${voiceUsage.topupMinutes} min`)}
              >
                <Plus className="h-3.5 w-3.5" /> Buy top-up · EC${voiceUsage.topupPriceEC}
              </Button>
            )}
          </div>
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-sm">
              <span className="font-display text-2xl font-bold tabular-nums">
                {voiceUsage.used}
              </span>{" "}
              <span className="text-muted-foreground">/ {voiceUsage.limit} minutes used this month</span>
            </span>
            <span className="text-xs text-muted-foreground">
              Resets in 11 days
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted/50">
            <div
              className={`h-full rounded-full transition-all ${
                usagePct > 90
                  ? "bg-destructive"
                  : usagePct > 70
                  ? "bg-warning"
                  : "bg-gradient-to-r from-primary to-primary-glow"
              }`}
              style={{ width: `${usagePct}%` }}
            />
          </div>
          {showTopup && (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-warning">
              <Sparkles className="h-3 w-3" />
              You're past 70% — a top-up keeps Ema and your AI receptionist online without interruption.
            </p>
          )}
        </Card>

        {/* Invoices */}
        <Card className="border-border/40 bg-card/40 p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">Past invoices</h2>
          <div className="overflow-hidden rounded-lg border border-border/40">
            <div className="grid grid-cols-[140px_1fr_140px_120px_60px] gap-3 border-b border-border/40 bg-background/40 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Invoice</span>
              <span>Date</span>
              <span className="text-right">Amount</span>
              <span>Status</span>
              <span></span>
            </div>
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="grid grid-cols-[140px_1fr_140px_120px_60px] items-center gap-3 border-b border-border/30 px-4 py-3 last:border-0 hover:bg-accent/30"
              >
                <code className="text-xs font-medium">{inv.id}</code>
                <div className="text-sm">{inv.date}</div>
                <div className="text-right font-display text-sm font-semibold tabular-nums">
                  EC${inv.amount}
                </div>
                <Badge
                  variant="outline"
                  className="w-fit border-primary/40 bg-primary/10 text-[10px] capitalize text-primary"
                >
                  {inv.status}
                </Badge>
                <button
                  type="button"
                  onClick={() =>
                    toast.success(`Downloading ${inv.id}.pdf`, { description: "Mock — no real file." })
                  }
                  className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label={`Download ${inv.id}`}
                >
                  <Download className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            All invoices are paid via the card on file ending in 4242. Update your payment method in{" "}
            <a className="text-primary hover:underline" href="/dashboard/settings">
              Settings
            </a>
            .
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
}

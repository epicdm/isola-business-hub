"use client";

import {
  Plug,
  Check,
  ArrowUpRight,
  type LucideIcon,
  Inbox,
  CreditCard,
  Database,
  Calendar,
  HardDrive,
  Phone as PhoneIcon,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { integrationGrid, tenantTier, type IntegrationCardKind } from "@/lib/turn10-data";
import { cn } from "@/lib/utils";

const KIND_ICON: Record<IntegrationCardKind, LucideIcon> = {
  meta: PhoneIcon,
  odoo: Database,
  fiserv: CreditCard,
  reloadly: PhoneIcon,
  gcal: Calendar,
  uploadthing: HardDrive,
  stripe: CreditCard,
  chatwoot: Inbox,
};

const KIND_BG: Record<IntegrationCardKind, string> = {
  meta: "bg-gradient-to-br from-emerald-500 via-sky-500 to-pink-500",
  odoo: "bg-purple-600",
  fiserv: "bg-orange-500",
  reloadly: "bg-gradient-to-br from-pink-500 to-violet-600",
  gcal: "bg-sky-500",
  uploadthing: "bg-rose-500",
  stripe: "bg-violet-600",
  chatwoot: "bg-emerald-600",
};

export default function IntegrationsPage() {
  return (
    <DashboardLayout currentPath="/dashboard/integrations">
      <div className="px-6 py-8 lg:px-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
            <Plug className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold leading-tight">Integrations</h1>
            <p className="text-sm text-muted-foreground">
              The full Isola stack. Each connection is owned by EPIC — no third-party reseller.
            </p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {integrationGrid.map((card) => {
            const Icon = KIND_ICON[card.id];
            const locked = card.tierGate === "pro" && tenantTier === "starter";
            return (
              <Card
                key={card.id}
                className={cn(
                  "relative rounded-xl border-border/40 bg-card/40 p-6 transition-all hover:bg-card/60",
                  locked && "overflow-hidden",
                )}
              >
                {locked && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-card/80 backdrop-blur">
                    <Lock className="h-6 w-6 text-muted-foreground" />
                    <p className="text-sm font-medium">Upgrade to Pro to connect {card.name}</p>
                    <Button size="sm">Upgrade</Button>
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-md", KIND_BG[card.id])}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display text-base font-semibold leading-tight">{card.name}</h3>
                        <p className="mt-0.5 text-xs text-muted-foreground">{card.desc}</p>
                      </div>
                      <Badge className="bg-primary/15 text-primary hover:bg-primary/20">
                        <Check className="h-3 w-3" /> {card.status === "operational" ? "Operational" : "Connected"}
                      </Badge>
                    </div>
                    <div className="mt-2 text-[11px] text-muted-foreground">{card.account}</div>
                  </div>
                </div>

                {card.details.length > 0 && (
                  <div className="mt-4 space-y-1.5 rounded-md border border-border/40 bg-background/40 p-3">
                    {card.details.map((d) => (
                      <div key={d.label} className="flex flex-wrap items-baseline justify-between gap-2 text-xs">
                        <span className="text-muted-foreground">{d.label}</span>
                        <span className="font-medium">{d.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {card.stats.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-4 text-xs">
                    {card.stats.map((s) => (
                      <div key={s.label}>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
                        <div className="font-semibold">{s.value}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-2">
                  {card.actions.map((a, i) => {
                    const isAnchor = !!a.href;
                    return (
                      <Button
                        key={i}
                        size="sm"
                        variant={a.primary ? "default" : "outline"}
                        asChild={isAnchor}
                        onClick={() => !isAnchor && toast.success(`${a.label} — coming soon`)}
                      >
                        {isAnchor ? (
                          <a href={a.href} target={a.external ? "_blank" : undefined} rel="noreferrer">
                            {a.label}
                            {a.external && <ArrowUpRight className="h-3 w-3" />}
                          </a>
                        ) : (
                          <span>{a.label}</span>
                        )}
                      </Button>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Need a custom integration? Email{" "}
          <a className="text-primary hover:underline" href="mailto:hello@epic.dm">hello@epic.dm</a>{" "}
          — we ship one-off connectors on the Business plan.
        </p>
      </div>
    </DashboardLayout>
  );
}

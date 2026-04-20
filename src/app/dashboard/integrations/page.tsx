"use client";

import {
  Plug,
  Check,
  ArrowUpRight,
  Inbox,
  Phone,
  CreditCard,
  Calendar,
  Database,
  Instagram,
  Facebook,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { integrationCards, type IntegrationStatus } from "@/lib/mock-data";

const ICONS: Record<string, LucideIcon> = {
  chatwoot: Inbox,
  wa: Phone,
  stripe: CreditCard,
  gcal: Calendar,
  odoo: Database,
  instagram: Instagram,
  facebook: Facebook,
  messenger: MessageCircle,
};

function StatusPill({ status }: { status: IntegrationStatus }) {
  if (status === "connected") {
    return (
      <Badge className="bg-primary/15 text-primary hover:bg-primary/20">
        <Check className="h-3 w-3" /> Connected
      </Badge>
    );
  }
  if (status === "available") {
    return (
      <Badge variant="outline" className="border-border/60 text-muted-foreground">
        <span className="h-2 w-2 rounded-full border border-muted-foreground/60" />
        Not connected
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="border-border/60 text-muted-foreground">
      Phase 2
    </Badge>
  );
}

export default function IntegrationsPage() {
  const connectedCount = integrationCards.filter((i) => i.status === "connected").length;

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
              {connectedCount} connected · {integrationCards.length - connectedCount} available
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {integrationCards.map((item) => {
            const Icon = ICONS[item.id] ?? Plug;
            const isConnected = item.status === "connected";
            const isPhase2 = item.status === "phase2";
            return (
              <Card
                key={item.id}
                className={`border-border/40 bg-card/40 p-5 transition-all hover:bg-card/60 ${
                  isConnected ? "border-primary/30" : ""
                }`}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-lg ${
                      isConnected
                        ? "bg-primary/15 text-primary"
                        : "bg-accent/60 text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <StatusPill status={item.status} />
                </div>
                <h3 className="font-display text-base font-semibold">{item.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
                <div className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground/70">
                  {item.category}
                </div>
                {isConnected ? (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                  >
                    <a
                      href={item.actionHref}
                      target={item.actionHref.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                    >
                      {item.action}
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </Button>
                ) : isPhase2 ? (
                  <Button size="sm" variant="outline" className="mt-4 w-full" disabled>
                    Coming soon
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="mt-4 w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
                    onClick={() =>
                      toast.success(`Redirecting to ${item.name}…`, {
                        description: "Mock OAuth flow.",
                      })
                    }
                  >
                    Connect
                    <ArrowUpRight className="h-3 w-3" />
                  </Button>
                )}
              </Card>
            );
          })}
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Need a custom integration? Email{" "}
          <a className="text-primary hover:underline" href="mailto:hello@epic.dm">
            hello@epic.dm
          </a>{" "}
          — we ship one-off connectors on the Business plan.
        </p>
      </div>
    </DashboardLayout>
  );
}

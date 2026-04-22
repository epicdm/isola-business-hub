"use client";

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bot,
  Plus,
  Phone,
  PhoneCall,
  Instagram,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  PauseCircle,
  AlertTriangle,
} from "lucide-react";
import DashboardLayout from "../layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  agents as seedAgents,
  type Agent,
  type AgentChannel,
  type AgentStatus,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const channelIcon: Record<AgentChannel, typeof Phone> = {
  whatsapp: Phone,
  voice: PhoneCall,
  instagram: Instagram,
  messenger: MessageCircle,
};

const channelLabel: Record<AgentChannel, string> = {
  whatsapp: "WhatsApp",
  voice: "Voice",
  instagram: "Instagram",
  messenger: "Messenger",
};

const statusMeta: Record<AgentStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  active: { label: "On Shift", color: "border-success/30 bg-success/10 text-success", icon: CheckCircle2 },
  on_shift: { label: "On Shift", color: "border-success/30 bg-success/10 text-success", icon: CheckCircle2 },
  paused: { label: "Paused", color: "border-warning/30 bg-warning/10 text-warning", icon: PauseCircle },
  on_probation: { label: "On Probation", color: "border-amber-400/40 bg-amber-400/10 text-amber-500", icon: AlertTriangle },
  error: { label: "Needs Attention", color: "border-destructive/30 bg-destructive/10 text-destructive", icon: AlertTriangle },
};

export default function AgentsPage() {
  const [agents] = useState<Agent[]>(seedAgents);

  return (
    <DashboardLayout currentPath="/dashboard/agents">
      <div className="px-6 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold leading-tight">Your AI agents</h1>
              <p className="text-sm text-muted-foreground">
                Each agent has its own personality, channels, and rules. Mix and match them across your business.
              </p>
            </div>
          </div>
          <Button asChild className="bg-gradient-primary text-primary-foreground hover:opacity-90">
            <Link to="/dashboard/agents/new">
              <Plus className="h-4 w-4" /> Add agent
            </Link>
          </Button>
        </div>

        {/* Stats strip */}
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Active agents", value: agents.filter((a) => a.status === "active").length },
            { label: "Messages handled this week", value: agents.reduce((s, a) => s + a.messagesThisWeek, 0).toLocaleString() },
            { label: "Channels covered", value: new Set(agents.flatMap((a) => a.channels)).size },
          ].map((s) => (
            <Card key={s.label} className="border-border/40 bg-card/40 p-4">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</div>
              <div className="mt-1 font-display text-2xl font-bold">{s.value}</div>
            </Card>
          ))}
        </div>

        {/* Agent cards */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {agents.map((agent) => {
            const StatusIcon = statusMeta[agent.status].icon;
            return (
              <Link
                key={agent.id}
                to="/dashboard/agents/$id"
                params={{ id: agent.id }}
                className="group block focus:outline-none"
              >
                <Card className="flex h-full flex-col gap-4 border-border/40 bg-card/60 p-5 transition-all hover:border-primary/30 hover:shadow-glow group-focus-visible:ring-2 group-focus-visible:ring-primary/40">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-ema text-base font-semibold text-primary-foreground shadow-glow">
                        {agent.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-display text-base font-semibold leading-tight">{agent.name}</div>
                        <Badge
                          variant="outline"
                          className="mt-1 border-border/60 bg-background/40 text-[10px] uppercase tracking-wider text-muted-foreground"
                        >
                          {agent.templateLabel}
                        </Badge>
                      </div>
                    </div>
                    <Badge variant="outline" className={cn("gap-1", statusMeta[agent.status].color)}>
                      <StatusIcon className="h-3 w-3" />
                      {statusMeta[agent.status].label}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground">{agent.scheduleLabel}</p>

                  {/* Channels row */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Channels</span>
                    <div className="flex gap-1">
                      {agent.channels.map((c) => {
                        const Icon = channelIcon[c];
                        return (
                          <span
                            key={c}
                            title={channelLabel[c]}
                            className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/40"
                          >
                            <Icon className="h-3 w-3 text-muted-foreground" />
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-border/40 pt-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Sparkles className="h-3 w-3 text-primary" />
                      <span className="font-semibold text-foreground">{agent.messagesThisWeek}</span> messages this week
                    </div>
                    <span className="text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Configure →
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}

          {/* Add new tile */}
          <Link
            to="/dashboard/agents/new"
            className="block focus:outline-none"
          >
            <Card className="flex h-full min-h-[220px] flex-col items-center justify-center gap-2 border-2 border-dashed border-border/60 bg-card/20 p-5 text-center transition-all hover:border-primary/40 hover:bg-primary/5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Plus className="h-5 w-5" />
              </div>
              <div className="font-medium">Add another agent</div>
              <div className="text-xs text-muted-foreground">Pick a template — receptionist, sales, support, more.</div>
            </Card>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}

"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Sparkline from "./Sparkline";
import { agentStatusMeta, type Agent } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Props = {
  agent: Agent;
  onToggleShift?: (next: boolean) => void;
};

export default function AgentHeroHeader({ agent, onToggleShift }: Props) {
  const meta = agentStatusMeta[agent.status];
  const onShift = agent.status === "on_shift" || agent.status === "active";
  const probation = agent.status === "on_probation";
  const initials = agent.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const budget = agent.budget;
  const budgetPct = budget ? Math.min(100, Math.round((budget.spent / budget.cap) * 100)) : 0;
  const kpi = agent.heroKPI;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Card
        className={cn(
          "relative overflow-hidden border p-6",
          probation
            ? "border-amber-400/30 bg-gradient-to-br from-card via-card to-amber-400/5"
            : "border-border/40 bg-gradient-to-br from-card to-primary/5",
        )}
      >
        <div className="grid gap-6 md:grid-cols-[auto_1fr_auto]">
          {/* Avatar + identity */}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-ema text-xl font-bold text-primary-foreground shadow-glow">
              {initials}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl font-bold leading-tight">{agent.name}</h1>
                <Badge
                  variant="outline"
                  className="border-border/60 bg-background/40 text-[10px] uppercase tracking-wider text-muted-foreground"
                >
                  {agent.templateLabel}
                </Badge>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <Badge variant="outline" className={cn("gap-1 text-xs", meta.pillClass)}>
                  {meta.emoji && <span>{meta.emoji}</span>}
                  {meta.label}
                </Badge>
                <span className="text-xs text-muted-foreground">{agent.scheduleLabel}</span>
              </div>
            </div>
          </div>

          {/* Hero KPI */}
          {kpi && (
            <div className="flex flex-col justify-center border-l border-border/30 px-0 md:px-6">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {kpi.label}
              </div>
              <div className="mt-1 flex items-end gap-3">
                <div className="font-display text-4xl font-bold leading-none">{kpi.value}</div>
                <div className="h-10 w-32">
                  <Sparkline values={kpi.trend} height={40} className="h-10 w-full" />
                </div>
              </div>
            </div>
          )}

          {/* Pause/resume toggle */}
          <div className="flex items-center gap-3 self-start rounded-lg border border-border/60 bg-card/40 px-4 py-2.5">
            <div className="text-sm">
              <div className="font-medium">{onShift ? "On shift" : probation ? "Learning" : "Paused"}</div>
              <div className="text-[10px] text-muted-foreground">
                {probation ? "Approve drafts to teach" : onShift ? "Toggle to pause" : "Toggle to resume"}
              </div>
            </div>
            <Switch
              checked={onShift}
              disabled={probation}
              onCheckedChange={(v) => onToggleShift?.(v)}
              aria-label="Toggle shift"
            />
          </div>
        </div>

        {/* Budget bar */}
        {budget && (
          <div className="mt-6 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Monthly budget</span>
                <span className="font-medium tabular-nums">
                  {budget.currency}
                  {budget.spent} <span className="text-muted-foreground">/ {budget.currency}{budget.cap}</span>
                </span>
              </div>
              <Progress value={budgetPct} className="h-1.5" />
            </div>
            <div className="text-[11px] text-muted-foreground sm:pl-4">
              {budgetPct}% used · resets May 1
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}

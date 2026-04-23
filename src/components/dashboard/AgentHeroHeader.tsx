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
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card
        className={cn(
          "relative overflow-hidden border p-7 grain shadow-elegant",
          probation
            ? "border-amber-400/30"
            : "border-border/40",
        )}
      >
        {/* Ambient gradient backdrop */}
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 -z-10 opacity-90",
            probation
              ? "bg-[radial-gradient(ellipse_60%_50%_at_85%_0%,oklch(0.82_0.17_80/0.18),transparent_70%),linear-gradient(180deg,oklch(0.22_0.02_168),oklch(0.18_0.02_168))]"
              : "bg-[radial-gradient(ellipse_60%_50%_at_85%_0%,oklch(0.78_0.17_152/0.18),transparent_70%),radial-gradient(ellipse_50%_40%_at_15%_100%,oklch(0.72_0.19_30/0.1),transparent_70%),linear-gradient(180deg,oklch(0.22_0.02_168),oklch(0.18_0.02_168))]",
          )}
        />

        <div className="grid gap-6 md:grid-cols-[auto_1fr_auto]">
          {/* Avatar + identity */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="absolute -inset-1 rounded-2xl bg-gradient-aurora opacity-40 blur-md" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-ema text-xl font-bold text-primary-foreground shadow-glow">
                {initials}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {agent.templateLabel}
              </div>
              <h1 className="mt-1 font-display text-3xl font-bold leading-tight">{agent.name}</h1>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline" className={cn("gap-1 text-xs", meta.pillClass)}>
                  {meta.emoji && <span>{meta.emoji}</span>}
                  {meta.label}
                </Badge>
                <span className="text-xs text-muted-foreground">{agent.scheduleLabel}</span>
              </div>
            </div>
          </div>

          {/* Hero KPI — sharper, more editorial */}
          {kpi && (
            <div className="flex flex-col justify-center md:border-l md:border-border/30 md:pl-6">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {kpi.label}
              </div>
              <div className="mt-1.5 flex items-end gap-4">
                <div className="font-display text-5xl font-bold leading-none tabular-nums text-gradient-primary">
                  {kpi.value}
                </div>
                <div className="h-12 w-36">
                  <Sparkline values={kpi.trend} height={48} className="h-12 w-full" />
                </div>
              </div>
            </div>
          )}

          {/* Pause/resume — sharper toggle */}
          <div className="flex items-center gap-3 self-start rounded-xl border border-border/50 bg-background/40 px-4 py-3 backdrop-blur">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  onShift ? "bg-success animate-pulse" : probation ? "bg-warning" : "bg-muted-foreground/50",
                )}
              />
              <div className="text-sm">
                <div className="font-medium leading-none">
                  {onShift ? "On shift" : probation ? "Learning" : "Paused"}
                </div>
                <div className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {probation ? "Approve drafts to teach" : onShift ? "Toggle to pause" : "Toggle to resume"}
                </div>
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
          <div className="mt-6 grid gap-3 border-t border-border/30 pt-5 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Monthly budget
                </span>
                <span className="font-medium tabular-nums">
                  {budget.currency}
                  {budget.spent}{" "}
                  <span className="text-muted-foreground">/ {budget.currency}{budget.cap}</span>
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

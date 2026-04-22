"use client";

import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  Plus,
  ArrowRight,
  MessageSquare,
  Sun,
} from "lucide-react";
import DashboardLayout from "../layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Sparkline from "@/components/dashboard/Sparkline";
import { agents, agentStatusMeta } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function TeamPage() {
  return (
    <DashboardLayout currentPath="/dashboard/team">
      <div className="mx-auto max-w-6xl space-y-8 p-6 lg:p-8">
        {/* Header */}
        <div>
          <p className="text-sm text-muted-foreground">Your team</p>
          <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl">
            {agents.length} agent{agents.length === 1 ? "" : "s"} on the floor
          </h1>
        </div>

        {/* Today's standup */}
        <Card className="border-ema/30 bg-gradient-to-br from-card to-ema/5 p-6 shadow-ema">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-ema">
              <Sun className="h-4 w-4 text-ema-foreground" />
            </div>
            <h2 className="font-display text-lg font-semibold">Today's standup</h2>
            <Badge variant="outline" className="border-ema/30 bg-ema/10 text-[10px] text-ema">
              End of day
            </Badge>
          </div>
          <ul className="space-y-3">
            {agents.map((a) => {
              const meta = agentStatusMeta[a.status];
              return (
                <li key={a.id} className="flex items-start gap-3 rounded-lg border border-border/40 bg-background/40 px-3 py-2.5">
                  <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", meta.dotClass)} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold">{a.name}</span>
                      <Badge variant="outline" className={cn("text-[10px] uppercase tracking-wider", meta.pillClass)}>
                        {meta.emoji && <span className="mr-1">{meta.emoji}</span>}
                        {meta.label}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {a.standupSummary ?? "No summary today."}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>

        {/* Agent grid */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {agents.map((a, i) => {
            const meta = agentStatusMeta[a.status];
            const initials = a.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2);
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.35 }}
              >
                <Link
                  to="/dashboard/agent/$agentId"
                  params={{ agentId: a.id }}
                  className="group block focus:outline-none"
                >
                  <Card className="flex h-full flex-col gap-4 border-border/40 bg-card/60 p-5 transition-all hover:border-primary/40 hover:shadow-glow group-focus-visible:ring-2 group-focus-visible:ring-primary/40">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-ema text-base font-semibold text-primary-foreground shadow-glow">
                          {initials}
                        </div>
                        <div>
                          <div className="font-display text-base font-semibold leading-tight">{a.name}</div>
                          <Badge
                            variant="outline"
                            className="mt-1 border-border/60 bg-background/40 text-[10px] uppercase tracking-wider text-muted-foreground"
                          >
                            {a.templateLabel}
                          </Badge>
                        </div>
                      </div>
                      <Badge variant="outline" className={cn("shrink-0 gap-1", meta.pillClass)}>
                        {meta.emoji && <span>{meta.emoji}</span>}
                        {meta.label}
                      </Badge>
                    </div>

                    {a.heroKPI && (
                      <div className="rounded-lg border border-border/30 bg-background/40 p-3">
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {a.heroKPI.label}
                        </div>
                        <div className="mt-0.5 flex items-end gap-3">
                          <div className="font-display text-2xl font-bold leading-none">
                            {a.heroKPI.value}
                          </div>
                          <div className="h-8 flex-1">
                            <Sparkline values={a.heroKPI.trend} height={32} className="h-8 w-full" />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-auto flex items-center justify-between border-t border-border/30 pt-3 text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MessageSquare className="h-3 w-3" />
                        <span className="font-semibold text-foreground">{a.messagesToday ?? 0}</span> today
                      </div>
                      <span className="text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        Open workspace →
                      </span>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}

          {/* Hire CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: agents.length * 0.07, duration: 0.35 }}
          >
            <Link to="/dashboard/agents/new" className="block focus:outline-none">
              <Card className="flex h-full min-h-[220px] flex-col items-center justify-center gap-3 border-2 border-dashed border-border/60 bg-card/20 p-5 text-center transition-all hover:border-primary/40 hover:bg-primary/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">Hire another agent</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    Pick a role — receptionist, sales, booking, support, concierge.
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Start hiring <ArrowRight className="h-3 w-3" />
                </Button>
              </Card>
            </Link>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}

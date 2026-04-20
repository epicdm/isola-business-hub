"use client";

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Check, Sparkles, Phone, PhoneCall, Instagram, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../../layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  agentTemplates,
  type AgentTemplateKey,
  type AgentChannel,
  type AgentSchedule,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const channelOptions: Array<{ id: AgentChannel; label: string; icon: typeof Phone }> = [
  { id: "whatsapp", label: "WhatsApp", icon: Phone },
  { id: "voice", label: "Voice", icon: PhoneCall },
  { id: "instagram", label: "Instagram", icon: Instagram },
  { id: "messenger", label: "Messenger", icon: MessageCircle },
];

const scheduleOptions: Array<{ id: AgentSchedule; label: string; desc: string }> = [
  { id: "always", label: "Always on", desc: "24/7 — handles every message" },
  { id: "business", label: "Business hours only", desc: "Active during your published hours" },
  { id: "after", label: "After hours only", desc: "Active when you're closed" },
  { id: "custom", label: "Custom schedule", desc: "Define a weekly grid (set up later)" },
];

export default function NewAgentPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [template, setTemplate] = useState<AgentTemplateKey | null>(null);
  const [name, setName] = useState("");
  const [channels, setChannels] = useState<Set<AgentChannel>>(new Set(["whatsapp"]));
  const [schedule, setSchedule] = useState<AgentSchedule>("always");

  const tpl = agentTemplates.find((t) => t.key === template);

  const goNext = () => {
    if (step === 1 && !template) {
      toast.error("Pick a template to continue");
      return;
    }
    if (step === 2) {
      if (!name.trim()) {
        toast.error("Give your agent a name");
        return;
      }
      if (channels.size === 0) {
        toast.error("Pick at least one channel");
        return;
      }
    }
    setStep((s) => (s + 1) as 1 | 2 | 3);
  };

  const create = () => {
    toast.success("Agent created", { description: `${name} is ready to configure.` });
    // Send to a real seeded agent so the detail page renders something
    navigate({ to: "/dashboard/agents/$id", params: { id: "ag-receptionist" } });
  };

  const toggleChannel = (id: AgentChannel) => {
    setChannels((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <DashboardLayout currentPath="/dashboard/agents">
      <div className="mx-auto max-w-4xl px-6 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate({ to: "/dashboard/agents" })}
            className="mb-3 flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="h-3 w-3" /> Back to agents
          </button>
          <h1 className="font-display text-2xl font-bold leading-tight">Create a new agent</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick a template, configure the basics, then refine the details once it's live.
          </p>

          {/* Step indicator */}
          <div className="mt-6 flex items-center gap-3">
            {[1, 2, 3].map((n, i) => (
              <div key={n} className="flex flex-1 items-center gap-2">
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                    step > n
                      ? "border-success/40 bg-success/15 text-success"
                      : step === n
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/60 bg-card text-muted-foreground",
                  )}
                >
                  {step > n ? <Check className="h-3.5 w-3.5" /> : n}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    step === n ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {["Template", "Basics", "Review"][i]}
                </span>
                {n < 3 && <div className="h-px flex-1 bg-border/60" />}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1 — template */}
        {step === 1 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {agentTemplates.map((t) => {
              const active = template === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTemplate(t.key)}
                  className={cn(
                    "rounded-xl border p-5 text-left transition-all hover:border-primary/40 hover:bg-primary/5",
                    active
                      ? "border-primary bg-primary/10 shadow-glow"
                      : "border-border/40 bg-card/40",
                  )}
                >
                  <div className="mb-3 text-3xl">{t.emoji}</div>
                  <div className="font-display text-base font-semibold">{t.label}</div>
                  <p className="mt-1 text-xs text-muted-foreground">{t.desc}</p>
                  {active && (
                    <Badge className="mt-3 bg-primary text-primary-foreground">
                      <Check className="h-3 w-3" /> Selected
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Step 2 — basics */}
        {step === 2 && tpl && (
          <Card className="space-y-6 border-border/40 bg-card/40 p-6">
            <div className="flex items-center gap-3 rounded-lg border border-border/40 bg-background/40 p-3">
              <div className="text-2xl">{tpl.emoji}</div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Template</div>
                <div className="font-medium">{tpl.label}</div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="agent-name">Agent name</Label>
              <Input
                id="agent-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Main Receptionist"
              />
              <p className="text-xs text-muted-foreground">
                Customers won't see this — it's how you'll find this agent in your dashboard.
              </p>
            </div>

            <div className="grid gap-3">
              <Label>Channels</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {channelOptions.map((c) => {
                  const Icon = c.icon;
                  const checked = channels.has(c.id);
                  return (
                    <label
                      key={c.id}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2.5 transition-colors",
                        checked
                          ? "border-primary/40 bg-primary/10"
                          : "border-border/60 bg-background/40 hover:bg-accent/30",
                      )}
                    >
                      <Checkbox checked={checked} onCheckedChange={() => toggleChannel(c.id)} />
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{c.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-3">
              <Label>When should this agent be active?</Label>
              <div className="grid gap-2">
                {scheduleOptions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSchedule(s.id)}
                    className={cn(
                      "flex items-start justify-between gap-3 rounded-md border px-3 py-2.5 text-left transition-colors",
                      schedule === s.id
                        ? "border-primary/40 bg-primary/10"
                        : "border-border/60 bg-background/40 hover:bg-accent/30",
                    )}
                  >
                    <div>
                      <div className="text-sm font-medium">{s.label}</div>
                      <div className="text-xs text-muted-foreground">{s.desc}</div>
                    </div>
                    {schedule === s.id && <Check className="mt-1 h-4 w-4 text-primary" />}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Step 3 — review */}
        {step === 3 && tpl && (
          <Card className="space-y-5 border-border/40 bg-card/40 p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              Ema will train this agent on your knowledge base, hours, and catalog.
            </div>

            <div className="grid gap-3 rounded-lg border border-border/40 bg-background/40 p-4">
              <ReviewRow label="Template" value={`${tpl.emoji} ${tpl.label}`} />
              <ReviewRow label="Name" value={name} />
              <ReviewRow
                label="Channels"
                value={Array.from(channels).map((c) => channelOptions.find((co) => co.id === c)!.label).join(", ")}
              />
              <ReviewRow
                label="Active"
                value={scheduleOptions.find((s) => s.id === schedule)!.label}
              />
            </div>
          </Card>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s))}
            disabled={step === 1}
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
          {step < 3 ? (
            <Button onClick={goNext} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
              Continue <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={create} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
              <Check className="h-4 w-4" /> Create agent
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/30 pb-2 last:border-0 last:pb-0">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium">{value}</span>
    </div>
  );
}

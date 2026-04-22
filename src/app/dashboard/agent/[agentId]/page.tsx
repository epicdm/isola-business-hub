"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Inbox as InboxIcon,
  Gamepad2,
  BookOpen,
  BarChart3,
  Settings as SettingsIcon,
  Send,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Lock,
  Plus,
  Trash2,
  Phone,
  PhoneCall,
  Instagram,
  MessageCircle,
  AlertTriangle,
  CalendarCheck,
  MessageSquare,
  ArrowUpRight,
  ShieldCheck,
  Wrench,
  Clock,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../../layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AgentHeroHeader from "@/components/dashboard/AgentHeroHeader";
import FirstWinOverlay, { pickIndustry } from "@/components/dashboard/FirstWinOverlay";
import ProbationDraftCard from "@/components/dashboard/ProbationDraftCard";
import Sparkline from "@/components/dashboard/Sparkline";
import {
  agents as seedAgents,
  conversations,
  getAgentActivity,
  tenantKnowledge,
  type Agent,
  type AgentChannel,
  type DraftCard,
  type KnowledgeEntry,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const channelIcon: Record<AgentChannel, typeof Phone> = {
  whatsapp: Phone,
  voice: PhoneCall,
  instagram: Instagram,
  messenger: MessageCircle,
};

const toneStops = ["Formal", "Friendly", "Casual"];

type PlaygroundMsg = { id: string; role: "user" | "agent"; text: string };

export default function AgentWorkspacePage() {
  const { agentId } = useParams({ from: "/dashboard/agent/$agentId" });
  const navigate = useNavigate();
  const original = useMemo(() => seedAgents.find((a) => a.id === agentId) ?? seedAgents[0], [agentId]);

  const [agent, setAgent] = useState<Agent>(original);
  const [drafts, setDrafts] = useState<DraftCard[]>(original.probationDrafts ?? []);
  const [agentKnowledge, setAgentKnowledge] = useState<KnowledgeEntry[]>(original.agentKnowledge ?? []);
  const [knowledgeGaps, setKnowledgeGaps] = useState(original.knowledgeGaps ?? []);
  const [newKTitle, setNewKTitle] = useState("");
  const [newKSnippet, setNewKSnippet] = useState("");
  const [newDraftTitle, setNewDraftTitle] = useState("");

  const draftsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAgent(original);
    setDrafts(original.probationDrafts ?? []);
    setAgentKnowledge(original.agentKnowledge ?? []);
    setKnowledgeGaps(original.knowledgeGaps ?? []);
  }, [original]);

  const onProbation = agent.status === "on_probation";
  const activity = useMemo(() => getAgentActivity(agent.id), [agent.id]);

  // Filter inbox conversations — fallback to all if none match.
  const agentConvs = useMemo(() => {
    const escalated = conversations.filter((c) => c.status === "escalated");
    const others = conversations.filter((c) => c.status !== "escalated");
    return [...escalated, ...others].slice(0, 6);
  }, []);

  const scrollToDrafts = () => {
    draftsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const approveDraft = (id: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
    toast.success("Approved & sent", { description: "I'll remember this style for next time." });
  };
  const correctDraft = (id: string, _newReply: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
    toast.success("Correction sent", { description: "Logged as a teaching example." });
  };
  const skipDraft = (id: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
    toast("Skipped", { description: "Hidden from queue." });
  };

  // Playground state
  const [playMessages, setPlayMessages] = useState<PlaygroundMsg[]>([
    { id: "p0", role: "agent", text: agent.welcome },
  ]);
  const [playInput, setPlayInput] = useState("");
  const [showTrace, setShowTrace] = useState(false);
  const [playTone, setPlayTone] = useState(agent.tone);

  const sendPlay = () => {
    if (!playInput.trim()) return;
    const userMsg: PlaygroundMsg = { id: `u${Date.now()}`, role: "user", text: playInput };
    setPlayMessages((prev) => [...prev, userMsg]);
    const reply = pickPlaygroundReply(playInput, playTone);
    setPlayInput("");
    setTimeout(() => {
      setPlayMessages((prev) => [...prev, { id: `a${Date.now()}`, role: "agent", text: reply }]);
    }, 500);
  };

  const addAgentKnowledge = () => {
    if (!newKTitle.trim() || !newKSnippet.trim()) return;
    setAgentKnowledge((prev) => [
      ...prev,
      { id: `ak${Date.now()}`, title: newKTitle.trim(), snippet: newKSnippet.trim() },
    ]);
    setNewKTitle("");
    setNewKSnippet("");
    toast.success("Added to agent knowledge");
  };
  const removeAgentKnowledge = (id: string) =>
    setAgentKnowledge((prev) => prev.filter((k) => k.id !== id));

  const addGapAsFAQ = (id: string) => {
    const gap = knowledgeGaps.find((g) => g.id === id);
    if (!gap) return;
    setKnowledgeGaps((prev) => prev.filter((g) => g.id !== id));
    setAgentKnowledge((prev) => [
      ...prev,
      { id: `ak${Date.now()}`, title: gap.question, snippet: "Add answer here…" },
    ]);
    toast.success("Added as FAQ", { description: gap.question });
  };

  const endProbation = () => {
    setAgent((a) => ({ ...a, status: "on_shift" }));
    toast.success(`${agent.name} is now on shift`, { description: "Learning period ended." });
  };

  // Activity counters
  const counters = useMemo(() => {
    const today = activity.slice(0, 12);
    return {
      messages: today.length,
      bookings: today.filter((a) => a.outcome === "booked").length,
      escalations: today.filter((a) => a.outcome === "escalated").length,
      autoResolved: today.filter((a) => a.outcome === "answered").length,
    };
  }, [activity]);

  const outcomes = useMemo(() => {
    const total = activity.length;
    const booked = activity.filter((a) => a.outcome === "booked").length;
    const answered = activity.filter((a) => a.outcome === "answered").length;
    const escalated = activity.filter((a) => a.outcome === "escalated").length;
    return { total, booked, answered, escalated };
  }, [activity]);

  return (
    <DashboardLayout currentPath={`/dashboard/agent/${agent.id}`}>
      <div className="mx-auto max-w-6xl space-y-6 p-6 lg:p-8">
        <AgentHeroHeader
          agent={agent}
          onToggleShift={(next) => {
            setAgent((a) => ({ ...a, status: next ? "on_shift" : "paused" }));
            toast.success(next ? `${agent.name} is on shift` : `${agent.name} paused`);
          }}
        />

        <Tabs defaultValue="inbox">
          <TabsList className="flex w-full flex-wrap justify-start gap-1 bg-muted/40 p-1">
            <TabsTrigger value="inbox" className="gap-1.5">
              <InboxIcon className="h-3.5 w-3.5" /> Inbox
            </TabsTrigger>
            <TabsTrigger value="playground" className="gap-1.5">
              <Gamepad2 className="h-3.5 w-3.5" /> Playground
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="gap-1.5">
              <BookOpen className="h-3.5 w-3.5" /> Knowledge
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-1.5">
              <BarChart3 className="h-3.5 w-3.5" /> Activity
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-1.5">
              <SettingsIcon className="h-3.5 w-3.5" /> Settings
            </TabsTrigger>
          </TabsList>

          {/* INBOX */}
          <TabsContent value="inbox" className="mt-6 space-y-5">
            {onProbation && drafts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 rounded-xl border border-amber-400/40 bg-amber-400/10 p-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-400/20 text-amber-500">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">
                    🟡 {agent.name} is on a learning period. {drafts.length} draft{drafts.length === 1 ? "" : "s"} need your approval.
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Approve to teach. Skip to dismiss. Each correction trains the next reply.
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={scrollToDrafts}>
                  Review
                </Button>
              </motion.div>
            )}

            {/* Live conversations */}
            <Card className="border-border/40 bg-card/40 p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">Active conversations</h2>
                <Link
                  to="/dashboard/inbox"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  Open full inbox <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
              <ul className="divide-y divide-border/40">
                {agentConvs.map((c) => {
                  const Icon = channelIcon[c.channel as AgentChannel] ?? Phone;
                  return (
                    <li key={c.id} className="flex items-center gap-3 py-3">
                      <div
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-lg",
                          c.status === "escalated"
                            ? "bg-warning/15 text-warning"
                            : "bg-primary/10 text-primary",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium">{c.customer}</span>
                          {c.status === "escalated" && (
                            <Badge variant="outline" className="border-warning/40 bg-warning/10 text-[10px] uppercase tracking-wider text-warning">
                              Escalated
                            </Badge>
                          )}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">{c.preview}</div>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">{c.time}</span>
                    </li>
                  );
                })}
              </ul>
            </Card>

            {/* Probation drafts */}
            {onProbation && (
              <div ref={draftsRef} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-semibold">
                    Drafts pending approval{" "}
                    <span className="text-muted-foreground">({drafts.length})</span>
                  </h2>
                </div>
                <AnimatePresence>
                  {drafts.length === 0 ? (
                    <Card className="border-success/30 bg-success/5 p-6 text-center text-sm text-muted-foreground">
                      🎉 All caught up — no drafts pending. Great teaching session.
                    </Card>
                  ) : (
                    drafts.map((d) => (
                      <ProbationDraftCard
                        key={d.id}
                        draft={d}
                        onApprove={approveDraft}
                        onCorrect={correctDraft}
                        onSkip={skipDraft}
                      />
                    ))
                  )}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>

          {/* PLAYGROUND */}
          <TabsContent value="playground" className="mt-6 space-y-5">
            <Card className="border-border/40 bg-card/40 p-5">
              <div className="mb-4 flex items-center gap-2">
                <Gamepad2 className="h-4 w-4 text-ema" />
                <h2 className="font-display text-lg font-semibold">Test a response</h2>
                <Badge variant="outline" className="border-ema/30 bg-ema/10 text-[10px] text-ema">
                  Sandbox · won't send to customers
                </Badge>
              </div>

              {/* Tone preview */}
              <div className="mb-4 grid gap-2 rounded-lg border border-border/40 bg-background/40 p-3">
                <div className="flex items-center justify-between text-xs">
                  <Label>Tone preview</Label>
                  <span className="font-medium text-primary">{toneStops[playTone]}</span>
                </div>
                <Slider
                  value={[playTone]}
                  min={0}
                  max={2}
                  step={1}
                  onValueChange={(v) => setPlayTone(v[0])}
                />
              </div>

              {/* Chat */}
              <div className="mb-3 flex h-72 flex-col gap-2 overflow-y-auto rounded-lg bg-muted/30 p-3">
                {playMessages.map((m) => (
                  <div
                    key={m.id}
                    className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm",
                        m.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-card text-foreground rounded-bl-sm border border-border/40",
                      )}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendPlay();
                }}
                className="flex items-center gap-2"
              >
                <Input
                  value={playInput}
                  onChange={(e) => setPlayInput(e.target.value)}
                  placeholder={`Pretend to be a customer messaging ${agent.name}…`}
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </Card>

            {/* Reasoning trace */}
            <Card className="border-border/40 bg-card/40 p-5">
              <button
                type="button"
                onClick={() => setShowTrace((v) => !v)}
                className="flex w-full items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-ema" />
                  <span className="font-display text-base font-semibold">Reasoning trace</span>
                  <Badge variant="outline" className="text-[10px] text-muted-foreground">
                    Last reply
                  </Badge>
                </div>
                {showTrace ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              <AnimatePresence>
                {showTrace && (
                  <motion.ol
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-2 text-xs"
                  >
                    {[
                      { step: "Intent", value: "booking_inquiry", conf: 0.92 },
                      { step: "Tool", value: "calendar.check_availability", conf: 0.88 },
                      { step: "Knowledge", value: "matched: 'Opening hours' · 'Cancellation policy'", conf: 0.81 },
                      { step: "Tone", value: toneStops[playTone].toLowerCase(), conf: 1 },
                      { step: "Final reply", value: "drafted (94 tokens)", conf: 0.87 },
                    ].map((row, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 rounded-md border border-border/30 bg-background/40 px-3 py-2"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                          {i + 1}
                        </span>
                        <div className="flex-1">
                          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            {row.step}
                          </div>
                          <div className="font-mono text-foreground">{row.value}</div>
                        </div>
                        <span className="shrink-0 text-muted-foreground tabular-nums">
                          {Math.round(row.conf * 100)}%
                        </span>
                      </li>
                    ))}
                  </motion.ol>
                )}
              </AnimatePresence>
            </Card>
          </TabsContent>

          {/* KNOWLEDGE */}
          <TabsContent value="knowledge" className="mt-6 space-y-5">
            {/* Tenant knowledge */}
            <Card className="border-border/40 bg-card/40 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-display text-lg font-semibold">Tenant knowledge</h2>
                <Badge variant="outline" className="text-[10px] text-muted-foreground">
                  Shared · read-only
                </Badge>
              </div>
              <ul className="divide-y divide-border/40">
                {tenantKnowledge.map((k) => (
                  <li key={k.id} className="py-3">
                    <div className="text-sm font-medium">{k.title}</div>
                    <div className="text-xs text-muted-foreground">{k.snippet}</div>
                  </li>
                ))}
              </ul>
              <Link
                to="/dashboard/knowledge"
                className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                Manage tenant knowledge <ArrowUpRight className="h-3 w-3" />
              </Link>
            </Card>

            {/* Agent-specific */}
            <Card className="border-border/40 bg-card/40 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Wrench className="h-4 w-4 text-primary" />
                <h2 className="font-display text-lg font-semibold">Agent-specific knowledge</h2>
                <Badge variant="outline" className="text-[10px] text-primary">
                  Editable
                </Badge>
              </div>
              <ul className="divide-y divide-border/40">
                {agentKnowledge.map((k) => (
                  <li key={k.id} className="flex items-start gap-3 py-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium">{k.title}</div>
                      <div className="text-xs text-muted-foreground">{k.snippet}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAgentKnowledge(k.id)}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Delete entry"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
                {agentKnowledge.length === 0 && (
                  <li className="py-3 text-xs text-muted-foreground">
                    No agent-specific entries yet. Add one below to teach {agent.name} something only it should know.
                  </li>
                )}
              </ul>
              <div className="mt-4 grid gap-2 rounded-md border border-border/40 bg-background/40 p-3">
                <Input
                  placeholder="Title (e.g. 'How to handle birthday parties')"
                  value={newKTitle}
                  onChange={(e) => setNewKTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Snippet — what should the agent say or do?"
                  rows={2}
                  value={newKSnippet}
                  onChange={(e) => setNewKSnippet(e.target.value)}
                />
                <Button size="sm" onClick={addAgentKnowledge} className="self-end">
                  <Plus className="h-3.5 w-3.5" /> Add entry
                </Button>
              </div>
            </Card>

            {/* Knowledge gaps */}
            <Card className="border-warning/30 bg-warning/5 p-5">
              <div className="mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <h2 className="font-display text-lg font-semibold">Knowledge gaps</h2>
                <Badge variant="outline" className="border-warning/40 bg-warning/10 text-[10px] text-warning">
                  Unresolved customer questions
                </Badge>
              </div>
              {knowledgeGaps.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No outstanding gaps right now. Nice work.
                </p>
              ) : (
                <ul className="space-y-2">
                  {knowledgeGaps.map((g) => (
                    <li
                      key={g.id}
                      className="flex items-center gap-3 rounded-lg border border-border/40 bg-background/60 px-3 py-2.5"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium">"{g.question}"</div>
                        <div className="text-[11px] text-muted-foreground">
                          Asked {g.askedCount}× · last {g.lastAsked}
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => addGapAsFAQ(g.id)}>
                        <Plus className="h-3 w-3" /> Add as FAQ
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </TabsContent>

          {/* ACTIVITY */}
          <TabsContent value="activity" className="mt-6 space-y-5">
            {/* Pulse */}
            <div className="grid gap-3 sm:grid-cols-4">
              {[
                { label: "Messages", value: counters.messages, icon: MessageSquare },
                { label: "Bookings", value: counters.bookings, icon: CalendarCheck },
                { label: "Auto-resolved", value: counters.autoResolved, icon: ShieldCheck },
                { label: "Escalations", value: counters.escalations, icon: AlertTriangle },
              ].map((p) => {
                const Icon = p.icon;
                return (
                  <Card key={p.label} className="border-border/40 bg-card/40 p-4">
                    <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      <Icon className="h-3 w-3" /> {p.label}
                    </div>
                    <div className="mt-1 font-display text-2xl font-bold">{p.value}</div>
                    <div className="text-[10px] text-muted-foreground">today</div>
                  </Card>
                );
              })}
            </div>

            {/* Hero KPI + sparkline */}
            {agent.heroKPI && (
              <Card className="border-primary/30 bg-gradient-to-br from-card to-primary/5 p-6">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {agent.heroKPI.label} · 7 days
                </div>
                <div className="mt-2 flex items-end gap-4">
                  <div className="font-display text-4xl font-bold">{agent.heroKPI.value}</div>
                  <div className="h-14 flex-1">
                    <Sparkline values={agent.heroKPI.trend} height={56} className="h-14 w-full" />
                  </div>
                </div>
              </Card>
            )}

            {/* Outcomes */}
            <Card className="border-border/40 bg-card/40 p-5">
              <h3 className="mb-4 font-display text-base font-semibold">Outcomes (last 50)</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { key: "Booked", value: outcomes.booked, color: "bg-success" },
                  { key: "Answered", value: outcomes.answered, color: "bg-primary" },
                  { key: "Escalated", value: outcomes.escalated, color: "bg-warning" },
                ].map((o) => {
                  const pct = Math.round((o.value / Math.max(1, outcomes.total)) * 100);
                  return (
                    <div key={o.key}>
                      <div className="flex items-center justify-between text-xs">
                        <span>{o.key}</span>
                        <span className="font-semibold">{pct}%</span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                        <div className={cn("h-full", o.color)} style={{ width: `${pct}%` }} />
                      </div>
                      <div className="mt-1 text-[10px] text-muted-foreground">{o.value} conversations</div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Task feed */}
            <Card className="border-border/40 bg-card/40 p-5">
              <h3 className="mb-4 font-display text-base font-semibold">Recent tasks</h3>
              <ul className="divide-y divide-border/40">
                {activity.slice(0, 8).map((a) => (
                  <li key={a.id} className="flex items-center gap-3 py-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/40">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm">{a.preview}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {a.customer} · {a.time}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "shrink-0 text-[10px] uppercase tracking-wider",
                        a.outcome === "booked" && "border-success/30 bg-success/10 text-success",
                        a.outcome === "escalated" && "border-warning/30 bg-warning/10 text-warning",
                        a.outcome === "answered" && "border-border/60 bg-muted/40 text-muted-foreground",
                      )}
                    >
                      {a.outcome}
                    </Badge>
                  </li>
                ))}
              </ul>
            </Card>
          </TabsContent>

          {/* SETTINGS */}
          <TabsContent value="settings" className="mt-6 space-y-5">
            <Card className="space-y-5 border-border/40 bg-card/40 p-6">
              <h3 className="font-display text-lg font-semibold">Identity</h3>
              <div className="grid gap-2">
                <Label htmlFor="agent-name-quick">Agent name</Label>
                <Input
                  id="agent-name-quick"
                  value={agent.name}
                  onChange={(e) => setAgent((a) => ({ ...a, name: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label>Tone</Label>
                  <span className="text-xs font-medium text-primary">{toneStops[agent.tone]}</span>
                </div>
                <Slider
                  value={[agent.tone]}
                  min={0}
                  max={2}
                  step={1}
                  onValueChange={(v) => setAgent((a) => ({ ...a, tone: v[0] }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="welcome-quick">Welcome message</Label>
                <Textarea
                  id="welcome-quick"
                  rows={3}
                  value={agent.welcome}
                  onChange={(e) => setAgent((a) => ({ ...a, welcome: e.target.value }))}
                />
              </div>
            </Card>

            {/* Probation controls */}
            {onProbation && (
              <Card className="border-amber-400/40 bg-amber-400/5 p-6">
                <div className="mb-3 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-amber-500" />
                  <h3 className="font-display text-lg font-semibold">Probation controls</h3>
                  <Badge variant="outline" className="border-amber-400/40 bg-amber-400/10 text-[10px] text-amber-500">
                    Learning period
                  </Badge>
                </div>
                <p className="mb-4 text-xs text-muted-foreground">
                  {agent.name} is still calibrating. Drafts queue for your approval until you end the learning period or it reaches the confidence floor on its own.
                </p>
                <div className="mb-4 grid gap-2 rounded-md border border-border/40 bg-background/40 p-3">
                  <div className="flex items-center justify-between text-xs">
                    <Label>Confidence floor</Label>
                    <span className="font-medium">{Math.round((agent.confidenceFloor ?? 0.7) * 100)}%</span>
                  </div>
                  <Slider
                    value={[Math.round((agent.confidenceFloor ?? 0.7) * 100)]}
                    min={50}
                    max={95}
                    step={5}
                    onValueChange={(v) =>
                      setAgent((a) => ({ ...a, confidenceFloor: v[0] / 100 }))
                    }
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Drafts above this threshold auto-send once probation ends.
                  </p>
                </div>
                <Button onClick={endProbation} className="bg-success text-success-foreground hover:opacity-90">
                  End learning period
                </Button>
              </Card>
            )}

            <Card className="border-border/40 bg-card/40 p-6">
              <h3 className="mb-3 font-display text-lg font-semibold">Channels</h3>
              <div className="flex flex-wrap gap-2">
                {(["whatsapp", "voice", "instagram", "messenger"] as AgentChannel[]).map((c) => {
                  const Icon = channelIcon[c];
                  const on = agent.channels.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() =>
                        setAgent((a) => ({
                          ...a,
                          channels: on ? a.channels.filter((x) => x !== c) : [...a.channels, c],
                        }))
                      }
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors",
                        on
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border/60 bg-background/40 text-muted-foreground hover:bg-accent/40",
                      )}
                    >
                      <Icon className="h-3 w-3" /> {c}
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card className="border-border/40 bg-card/40 p-6">
              <h3 className="mb-3 font-display text-lg font-semibold">Working hours</h3>
              <div className="flex items-center justify-between rounded-md border border-border/40 bg-background/40 px-3 py-2.5 text-sm">
                <span>{agent.scheduleLabel}</span>
                <Link
                  to="/dashboard/hours"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  Edit hours <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </Card>

            <Card className="border-border/40 bg-card/40 p-6">
              <h3 className="mb-3 font-display text-lg font-semibold">Escalation rules</h3>
              <div className="flex flex-wrap gap-1.5">
                {agent.escalationKeywords.map((k) => (
                  <Badge key={k} variant="outline" className="border-warning/30 bg-warning/10 text-warning">
                    {k}
                  </Badge>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Escalates to {agent.escalationContact}.
              </p>
            </Card>

            <Card className="border-border/40 bg-card/40 p-6">
              <h3 className="mb-3 font-display text-lg font-semibold">Scheduled routines</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center justify-between rounded-md border border-border/40 bg-background/40 px-3 py-2">
                  <span>Confirm tomorrow's bookings</span>
                  <span className="text-xs text-muted-foreground">Daily · 6:00 PM</span>
                </li>
                <li className="flex items-center justify-between rounded-md border border-border/40 bg-background/40 px-3 py-2">
                  <span>Send weekly recap to owner</span>
                  <span className="text-xs text-muted-foreground">Sun · 8:00 AM</span>
                </li>
              </ul>
            </Card>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border/40 bg-card/30 px-4 py-3">
              <div className="text-xs text-muted-foreground">
                Need the deep-config view (rich tools, examples, advanced routing)?
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate({ to: "/dashboard/agents/$id", params: { id: agent.id } })}
              >
                Open full config <ArrowRight className="h-3 w-3" />
              </Button>
            </div>

            {newDraftTitle && <span className="hidden">{newDraftTitle}</span>}
            <button type="button" onClick={() => setNewDraftTitle("")} className="hidden" />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

function pickPlaygroundReply(input: string, tone: number): string {
  const m = input.toLowerCase();
  const formality = tone === 0 ? "Good evening." : tone === 1 ? "Hi there!" : "Hey!";
  if (m.includes("book") || m.includes("table") || m.includes("reserv")) {
    return `${formality} I can lock that in. What date and time, and how many people?`;
  }
  if (m.includes("hour") || m.includes("open") || m.includes("close")) {
    return `${formality} We're open Tue–Sun 5pm to 10:30pm. Last seating 9:45pm.`;
  }
  if (m.includes("price") || m.includes("cost") || m.includes("how much")) {
    return `${formality} Our menu ranges EC$28–EC$84 per main. Want me to share tonight's specials?`;
  }
  if (m.includes("park")) {
    return `${formality} Free parking on Bath Rd opposite the cruise terminal — 2 min walk.`;
  }
  return `${formality} Got it — let me think about that one. Want me to draft a longer reply?`;
}

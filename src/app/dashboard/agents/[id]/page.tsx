"use client";

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ChevronLeft,
  Bot,
  Sparkles,
  Phone,
  PhoneCall,
  Instagram,
  MessageCircle,
  Plus,
  Trash2,
  X,
  Save,
  Tag,
  Clock,
  Workflow,
  AlertTriangle,
  Upload,
  CheckCircle2,
  PauseCircle,
  Copy,
  CalendarCheck,
  MessageSquare,
  ArrowUpRight,
  Activity as ActivityIcon,
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../../layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  agents as seedAgents,
  defaultHours,
  getAgentActivity,
  type Agent,
  type AgentActivityOutcome,
  type AgentChannel,
  type AgentRoutingRule,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const channelMeta: Record<AgentChannel, { label: string; icon: typeof Phone; sub: string }> = {
  whatsapp: { label: "WhatsApp", icon: Phone, sub: "Customer-facing number · +1 767-818-3741" },
  voice: { label: "Voice", icon: PhoneCall, sub: "WA Business Calling (default) — switch to SIP if needed" },
  instagram: { label: "Instagram DMs", icon: Instagram, sub: "Direct messages on @coalpot_dom" },
  messenger: { label: "Facebook Messenger", icon: MessageCircle, sub: "Page messages on Coalpot Restaurant" },
};

const toneStops = ["Formal", "Friendly", "Casual"];

const ruleTypeMeta: Record<AgentRoutingRule["type"], { label: string; icon: typeof Tag; color: string }> = {
  tag: { label: "Tag-based", icon: Tag, color: "border-primary/30 bg-primary/10 text-primary" },
  time: { label: "Time-based", icon: Clock, color: "border-chart-2/30 bg-chart-2/10 text-chart-2" },
  fallback: { label: "Fallback", icon: Workflow, color: "border-ema/30 bg-ema/10 text-ema" },
};

const outcomeMeta: Record<AgentActivityOutcome, { label: string; icon: typeof Tag; className: string }> = {
  booked: {
    label: "Booked",
    icon: CalendarCheck,
    className: "border-success/30 bg-success/10 text-success",
  },
  answered: {
    label: "Answered",
    icon: MessageSquare,
    className: "border-border/60 bg-muted/40 text-muted-foreground",
  },
  escalated: {
    label: "Escalated",
    icon: AlertTriangle,
    className: "border-warning/30 bg-warning/10 text-warning",
  },
};

const activityChannelIcon: Record<AgentChannel, typeof Phone> = {
  whatsapp: Phone,
  voice: PhoneCall,
  instagram: Instagram,
  messenger: MessageCircle,
};

export default function AgentDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/dashboard/agents/$id" });

  const original = useMemo(() => seedAgents.find((a) => a.id === id) ?? seedAgents[0], [id]);
  const activity = useMemo(() => getAgentActivity(original.id), [original.id]);

  const [agent, setAgent] = useState<Agent>(original);
  const [keywordDraft, setKeywordDraft] = useState("");
  const [useBusinessHours, setUseBusinessHours] = useState(true);
  const [agentHours, setAgentHours] = useState(defaultHours);
  const [deleteOpen, setDeleteOpen] = useState(false);
  // Instagram sub-channels (UI-only — not part of AgentChannel union)
  const [igComments, setIgComments] = useState(false);
  const [igStories, setIgStories] = useState(true);

  useEffect(() => {
    setAgent(original);
  }, [original]);

  const update = <K extends keyof Agent>(key: K, value: Agent[K]) =>
    setAgent((prev) => ({ ...prev, [key]: value }));

  const toggleStatus = () =>
    update("status", agent.status === "active" ? "paused" : "active");

  const toggleChannel = (c: AgentChannel) => {
    const has = agent.channels.includes(c);
    update("channels", has ? agent.channels.filter((x) => x !== c) : [...agent.channels, c]);
  };

  const addKeyword = () => {
    const k = keywordDraft.trim();
    if (!k) return;
    if (agent.escalationKeywords.includes(k)) {
      toast.error("Keyword already added");
      return;
    }
    update("escalationKeywords", [...agent.escalationKeywords, k]);
    setKeywordDraft("");
  };

  const removeKeyword = (k: string) =>
    update("escalationKeywords", agent.escalationKeywords.filter((x) => x !== k));

  const addRule = (type: AgentRoutingRule["type"]) => {
    const placeholder: Record<AgentRoutingRule["type"], string> = {
      tag: "Route customers tagged #vip to me",
      time: "Only handle messages between 6pm and midnight",
      fallback: "Take over if Main Receptionist is busy",
    };
    update("routing", [
      ...agent.routing,
      { id: `r${Date.now()}`, type, label: placeholder[type] },
    ]);
  };

  const updateRule = (id: string, label: string) =>
    update(
      "routing",
      agent.routing.map((r) => (r.id === id ? { ...r, label } : r)),
    );

  const removeRule = (id: string) =>
    update("routing", agent.routing.filter((r) => r.id !== id));

  const updateHourDay = (day: string, patch: Partial<typeof agentHours[number]>) =>
    setAgentHours((prev) => prev.map((h) => (h.day === day ? { ...h, ...patch } : h)));

  const save = () => toast.success("Agent settings saved");

  const remove = () => {
    setDeleteOpen(false);
    toast.success(`Deleted ${agent.name}`);
    navigate({ to: "/dashboard/agents" });
  };

  const StatusIcon = agent.status === "active" ? CheckCircle2 : PauseCircle;

  return (
    <DashboardLayout currentPath="/dashboard/agents">
      <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8">
        <Link
          to="/dashboard/agents"
          className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-3 w-3" /> Back to agents
        </Link>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-ema text-lg font-semibold text-primary-foreground shadow-glow">
              {agent.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-bold leading-tight">{agent.name}</h1>
                <Badge variant="outline" className="border-border/60 bg-background/40 text-[10px] uppercase tracking-wider text-muted-foreground">
                  {agent.templateLabel}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{agent.scheduleLabel}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/40 px-4 py-2.5">
            <StatusIcon
              className={cn(
                "h-4 w-4",
                agent.status === "active" ? "text-success" : "text-warning",
              )}
            />
            <div className="text-sm">
              <div className="font-medium capitalize">{agent.status}</div>
              <div className="text-[10px] text-muted-foreground">Toggle to pause</div>
            </div>
            <Switch checked={agent.status === "active"} onCheckedChange={toggleStatus} />
          </div>
        </div>

        <Tabs defaultValue="persona">
          <TabsList>
            <TabsTrigger value="persona">Persona</TabsTrigger>
            <TabsTrigger value="channels">Channels</TabsTrigger>
            <TabsTrigger value="hours">Hours</TabsTrigger>
            <TabsTrigger value="routing">Routing</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="persona" className="mt-6 space-y-6">
            <Card className="space-y-5 border-border/40 bg-card/40 p-6">
              <div className="grid gap-5 sm:grid-cols-[120px_1fr]">
                <div className="space-y-2">
                  <Label>Avatar</Label>
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-ema text-2xl font-bold text-primary-foreground shadow-glow">
                    {agent.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <Button size="sm" variant="outline" onClick={() => toast("Avatar upload coming soon — using initials for now")}>
                    <Upload className="h-3 w-3" /> Upload
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="agent-name">Agent name</Label>
                    <Input
                      id="agent-name"
                      value={agent.name}
                      onChange={(e) => update("name", e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label>Tone of voice</Label>
                      <span className="text-xs font-medium text-primary">{toneStops[agent.tone]}</span>
                    </div>
                    <Slider
                      value={[agent.tone]}
                      min={0}
                      max={2}
                      step={1}
                      onValueChange={(v) => update("tone", v[0])}
                    />
                    <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                      {toneStops.map((t) => <span key={t}>{t}</span>)}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="welcome">Welcome message</Label>
                    <Textarea
                      id="welcome"
                      rows={3}
                      value={agent.welcome}
                      onChange={(e) => update("welcome", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="space-y-3 border-border/40 bg-card/40 p-6">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-ema" />
                <h3 className="font-display text-base font-semibold">Example responses</h3>
              </div>
              <p className="text-xs text-muted-foreground">A preview of what {agent.name} would say.</p>
              <div className="space-y-3">
                {agent.examples.map((ex, i) => (
                  <div key={i} className="space-y-2">
                    <div className="ml-auto max-w-[80%] rounded-2xl rounded-tl-sm bg-bubble-in px-3.5 py-2 text-sm text-bubble-in-foreground">
                      {ex.question}
                    </div>
                    <div className="mr-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-bubble-out px-3.5 py-2 text-sm text-bubble-out-foreground">
                      {ex.answer}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="space-y-4 border-border/40 bg-card/40 p-6">
              <h3 className="font-display text-base font-semibold">Escalation</h3>
              <div className="grid gap-2">
                <Label>Keywords that trigger handoff</Label>
                <div className="flex gap-2">
                  <Input
                    value={keywordDraft}
                    onChange={(e) => setKeywordDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addKeyword();
                      }
                    }}
                    placeholder="Type a keyword and press Enter…"
                  />
                  <Button variant="outline" onClick={addKeyword}>
                    <Plus className="h-4 w-4" /> Add
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {agent.escalationKeywords.length === 0 && (
                    <span className="text-xs text-muted-foreground">No keywords yet — the agent will only escalate on explicit requests.</span>
                  )}
                  {agent.escalationKeywords.map((k) => (
                    <Badge
                      key={k}
                      variant="outline"
                      className="gap-1 border-warning/40 bg-warning/10 text-warning"
                    >
                      {k}
                      <button onClick={() => removeKeyword(k)} aria-label={`Remove ${k}`}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="escalation-phone">Escalation contact (WhatsApp)</Label>
                <Input
                  id="escalation-phone"
                  value={agent.escalationContact}
                  onChange={(e) => update("escalationContact", e.target.value)}
                  placeholder="+1 767 ..."
                />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="channels" className="mt-6 space-y-3">
            {(Object.keys(channelMeta) as AgentChannel[]).map((c) => {
              const Icon = channelMeta[c].icon;
              const enabled = agent.channels.includes(c);
              return (
                <Card key={c} className="border-border/40 bg-card/40 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/40">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium">{channelMeta[c].label}</div>
                        <p className="mt-0.5 text-xs text-muted-foreground">{channelMeta[c].sub}</p>
                      </div>
                    </div>
                    <Switch checked={enabled} onCheckedChange={() => toggleChannel(c)} />
                  </div>

                  {enabled && c === "voice" && (
                    <div className="mt-4 grid gap-2 rounded-lg border border-border/40 bg-background/40 p-3">
                      <Label className="text-xs">Voice transport</Label>
                      <Select defaultValue="wa-calling">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wa-calling">WhatsApp Business Calling</SelectItem>
                          <SelectItem value="sip">Traditional SIP trunk</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {enabled && c === "whatsapp" && (
                    <div className="mt-4 grid gap-2 rounded-lg border border-border/40 bg-background/40 p-3">
                      <Label className="text-xs">WhatsApp number</Label>
                      <Select defaultValue="customer">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="customer">Customer-facing · +1 767-818-3741</SelectItem>
                          <SelectItem value="ema">Ema's line · +1 767-818-3742</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {enabled && c === "instagram" && (
                    <div className="mt-4 space-y-3 rounded-lg border border-border/40 bg-background/40 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-medium">Instagram comments</div>
                          <p className="text-xs text-muted-foreground">Auto-reply on post comments tagged with a question.</p>
                        </div>
                        <Switch checked={igComments} onCheckedChange={setIgComments} />
                      </div>
                      <div className="flex items-start justify-between gap-3 border-t border-border/40 pt-3">
                        <div>
                          <div className="text-sm font-medium">Instagram story mentions</div>
                          <p className="text-xs text-muted-foreground">Reply when customers @-mention you in a story.</p>
                        </div>
                        <Switch checked={igStories} onCheckedChange={setIgStories} />
                      </div>
                      <p className="border-t border-border/40 pt-3 text-[11px] text-muted-foreground">
                        <span className="font-medium text-foreground">Connected via Meta.</span> @coalpot_dom · 2.4k followers
                      </p>
                    </div>
                  )}
                  {enabled && c === "messenger" && (
                    <div className="mt-4 flex flex-wrap gap-2 rounded-lg border border-border/40 bg-background/40 p-3 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">Connected via Meta.</span>
                      Page messages on Coalpot Restaurant.
                    </div>
                  )}
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="hours" className="mt-6 space-y-4">
            <Card className="border-border/40 bg-card/40 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium">Schedule source</div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Inherit your business hours, or define a custom schedule for this agent.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={useBusinessHours ? "text-foreground font-medium" : "text-muted-foreground"}>Business</span>
                  <Switch checked={!useBusinessHours} onCheckedChange={(v) => setUseBusinessHours(!v)} />
                  <span className={!useBusinessHours ? "text-foreground font-medium" : "text-muted-foreground"}>Custom</span>
                </div>
              </div>
            </Card>

            <Card className="border-border/40 bg-card/40 p-6">
              <div className="mb-4 flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-display text-base font-semibold">
                    {useBusinessHours ? "Inherited business hours" : "Custom agent schedule"}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {useBusinessHours
                      ? "Synced from /dashboard/hours. Update there to change them everywhere."
                      : "This agent will only handle messages during these windows."}
                  </p>
                </div>
                {!useBusinessHours && (
                  <Button size="sm" variant="outline" onClick={() => toast.success("Monday applied to weekdays")}>
                    <Copy className="h-3.5 w-3.5" /> Copy Mon to Fri
                  </Button>
                )}
              </div>

              <div className="space-y-1">
                {agentHours.map((h) => (
                  <div
                    key={h.day}
                    className={cn(
                      "grid grid-cols-[110px_auto_1fr] items-center gap-3 rounded-md px-3 py-2.5 transition-colors",
                      useBusinessHours ? "opacity-70" : "hover:bg-accent/30",
                      h.closed && "opacity-60",
                    )}
                  >
                    <span className="text-sm font-medium">{h.day}</span>
                    <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                      <Checkbox
                        checked={h.closed}
                        disabled={useBusinessHours}
                        onCheckedChange={(v) => updateHourDay(h.day, { closed: Boolean(v) })}
                      />
                      Off
                    </label>
                    {h.closed ? (
                      <span className="text-sm text-muted-foreground">Off all day</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={h.open}
                          disabled={useBusinessHours}
                          onChange={(e) => updateHourDay(h.day, { open: e.target.value })}
                          className="h-8 w-32 text-sm"
                        />
                        <span className="text-xs text-muted-foreground">to</span>
                        <Input
                          type="time"
                          value={h.close}
                          disabled={useBusinessHours}
                          onChange={(e) => updateHourDay(h.day, { close: e.target.value })}
                          className="h-8 w-32 text-sm"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="routing" className="mt-6 space-y-4">
            <Card className="border-border/40 bg-card/40 p-6">
              <div className="mb-4 flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-display text-base font-semibold">Routing rules</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    When more than one agent could handle a message, these rules decide who answers.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(Object.keys(ruleTypeMeta) as AgentRoutingRule["type"][]).map((t) => {
                    const Icon = ruleTypeMeta[t].icon;
                    return (
                      <Button key={t} size="sm" variant="outline" onClick={() => addRule(t)}>
                        <Icon className="h-3 w-3" /> Add {ruleTypeMeta[t].label.toLowerCase()}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {agent.routing.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No rules yet — this agent runs on the defaults.
                </div>
              ) : (
                <div className="space-y-2">
                  {agent.routing.map((r) => {
                    const RuleIcon = ruleTypeMeta[r.type].icon;
                    return (
                      <div
                        key={r.id}
                        className="grid grid-cols-[140px_1fr_auto] items-center gap-3 rounded-md border border-border/40 bg-background/40 p-3"
                      >
                        <Badge variant="outline" className={cn("w-fit gap-1", ruleTypeMeta[r.type].color)}>
                          <RuleIcon className="h-3 w-3" /> {ruleTypeMeta[r.type].label}
                        </Badge>
                        <Input
                          value={r.label}
                          onChange={(e) => updateRule(r.id, e.target.value)}
                          className="h-8 border-transparent bg-transparent text-sm focus-visible:border-border focus-visible:bg-background/60"
                        />
                        <button
                          onClick={() => removeRule(r.id)}
                          className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                          aria-label="Delete rule"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-6 space-y-4">
            <Card className="border-border/40 bg-card/40 p-6">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <ActivityIcon className="h-4 w-4 text-primary" />
                    <h3 className="font-display text-base font-semibold">Recent activity</h3>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Last 50 conversations {agent.name} handled — across every channel.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground">
                  <Badge variant="outline" className="gap-1 border-success/30 bg-success/10 text-success">
                    <CalendarCheck className="h-2.5 w-2.5" />
                    {activity.filter((a) => a.outcome === "booked").length} booked
                  </Badge>
                  <Badge variant="outline" className="gap-1 border-border/60 bg-muted/40 text-muted-foreground">
                    <MessageSquare className="h-2.5 w-2.5" />
                    {activity.filter((a) => a.outcome === "answered").length} answered
                  </Badge>
                  <Badge variant="outline" className="gap-1 border-warning/30 bg-warning/10 text-warning">
                    <AlertTriangle className="h-2.5 w-2.5" />
                    {activity.filter((a) => a.outcome === "escalated").length} escalated
                  </Badge>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-border/40">
                <ul className="divide-y divide-border/40">
                  {activity.map((entry) => {
                    const ChannelIcon = activityChannelIcon[entry.channel];
                    const Outcome = outcomeMeta[entry.outcome];
                    const OutcomeIcon = Outcome.icon;
                    return (
                      <li key={entry.id}>
                        <Link
                          to="/dashboard/inbox"
                          className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/30"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/40 text-muted-foreground">
                            <ChannelIcon className="h-3.5 w-3.5" />
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium">{entry.customer}</div>
                            <div className="truncate text-xs text-muted-foreground">{entry.preview}</div>
                          </div>
                          <Badge variant="outline" className={cn("hidden gap-1 sm:inline-flex", Outcome.className)}>
                            <OutcomeIcon className="h-2.5 w-2.5" />
                            {Outcome.label}
                          </Badge>
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            <span className="hidden sm:inline">{entry.time}</span>
                            <ArrowUpRight className="h-3.5 w-3.5 opacity-60 transition-opacity group-hover:opacity-100" />
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <p className="mt-3 text-[11px] text-muted-foreground">
                Tap any row to open the full thread in your inbox.
              </p>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-6">
          <div className="text-xs text-muted-foreground">
            Changes apply instantly across all of <span className="font-medium text-foreground">{agent.name}</span>'s channels.
          </div>
          <Button onClick={save} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
            <Save className="h-4 w-4" /> Save changes
          </Button>
        </div>

        <Card className="mt-10 border-destructive/30 bg-destructive/5 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div className="flex-1">
              <h3 className="font-display text-base font-semibold text-destructive">Danger zone</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Deleting this agent immediately stops it from handling new messages. Past conversations are preserved.
              </p>
            </div>
            <Button
              variant="outline"
              className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete agent
            </Button>
          </div>
        </Card>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {agent.name}?</DialogTitle>
            <DialogDescription>
              This agent will stop handling new messages immediately. Past conversations remain in your inbox.
              This action can't be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={remove}
            >
              <Trash2 className="h-4 w-4" /> Yes, delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Bot className="hidden" />
    </DashboardLayout>
  );
}

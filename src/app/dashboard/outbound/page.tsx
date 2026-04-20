"use client";

import { useEffect, useState } from "react";
import {
  PhoneOutgoing,
  PhoneCall,
  Calendar as CalendarIcon,
  AlertTriangle,
  Plus,
  Layers,
  Mic,
  PhoneOff,
  Headphones,
  FileText,
  MoreHorizontal,
  X,
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  voiceMeter,
  outboundScheduled,
  outboundLive,
  outboundCompleted,
  outboundCancelled,
  outcomeMetaOutbound,
  type OutboundCall,
} from "@/lib/turn10-data";
import { agents } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function fmtDur(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function Waveform({ active }: { active: boolean }) {
  const bars = Array.from({ length: 28 }, (_, i) => i);
  return (
    <div className="flex h-10 items-center gap-0.5">
      {bars.map((i) => (
        <div
          key={i}
          className={cn(
            "w-1 rounded-full bg-primary/70",
            active ? "animate-pulse" : "opacity-40",
          )}
          style={{
            height: `${30 + ((i * 17) % 70)}%`,
            animationDelay: `${(i % 5) * 80}ms`,
          }}
        />
      ))}
    </div>
  );
}

function ScriptPill({ s }: { s: OutboundCall["script"] }) {
  const map: Record<OutboundCall["script"], string> = {
    "Booking Confirmation": "border-emerald-400/40 bg-emerald-500/10 text-emerald-300",
    "No-Show Recovery": "border-amber-400/40 bg-amber-500/10 text-amber-300",
    "Bill Reminder": "border-rose-400/40 bg-rose-500/10 text-rose-300",
    "Custom": "border-slate-400/40 bg-slate-500/10 text-slate-300",
  };
  return (
    <Badge variant="outline" className={cn("text-[10px]", map[s])}>{s}</Badge>
  );
}

export default function OutboundPage() {
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [batchOpen, setBatchOpen] = useState(false);
  const [transcriptCall, setTranscriptCall] = useState<OutboundCall | null>(null);

  // Live transcript: rolling messages every 3s
  const [liveIdx, setLiveIdx] = useState(3);
  useEffect(() => {
    const t = setInterval(() => {
      setLiveIdx((i) => Math.min(i + 1, outboundLive.transcript?.length ?? 0));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const liveDuration = (outboundLive.durationSec ?? 0) + Math.max(0, liveIdx - 3) * 3;

  const pct = (voiceMeter.used / voiceMeter.limit) * 100;
  const overage = Math.max(0, voiceMeter.paceProjection - voiceMeter.limit);
  const overageCost = (overage * voiceMeter.overageRateEC).toFixed(2);

  return (
    <DashboardLayout currentPath="/dashboard/outbound">
      <div className="px-6 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
              <PhoneOutgoing className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold leading-tight">Outbound AI calls</h1>
              <p className="max-w-xl text-sm text-muted-foreground">
                Schedule AI voice calls for booking confirmations, no-show recovery, and bill reminders.
                Your voice agent handles the conversation.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setBatchOpen(true)}>
              <Layers className="h-3.5 w-3.5" /> Batch schedule
            </Button>
            <Button size="sm" onClick={() => setScheduleOpen(true)}>
              <Plus className="h-3.5 w-3.5" /> Schedule a call
            </Button>
          </div>
        </div>

        {/* Voice meter */}
        <Card className="mb-6 rounded-xl border-border/40 bg-card/40 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm">
                <span className="font-display text-xl font-bold tabular-nums">{voiceMeter.used}</span>
                <span className="text-muted-foreground"> / {voiceMeter.limit} minutes used this month</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                At current pace, you'll hit <span className="font-semibold text-foreground">{voiceMeter.paceProjection}</span> by end of month — {overage} min overage (EC${overageCost}).
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <a href="/dashboard/billing">Top up</a>
            </Button>
          </div>
          <Progress value={pct} className="mt-3 h-2" />
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="scheduled">
          <TabsList>
            <TabsTrigger value="scheduled">
              Scheduled <Badge variant="outline" className="ml-1.5 border-border/60 text-[10px]">{outboundScheduled.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="live">
              Live now <Badge variant="outline" className="ml-1.5 border-emerald-400/40 bg-emerald-500/10 text-[10px] text-emerald-300">1</Badge>
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed <Badge variant="outline" className="ml-1.5 border-border/60 text-[10px]">{outboundCompleted.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled <Badge variant="outline" className="ml-1.5 border-border/60 text-[10px]">{outboundCancelled.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* Scheduled */}
          <TabsContent value="scheduled" className="mt-6">
            <Card className="rounded-xl border-border/40 bg-card/40 p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/40 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                      <th className="px-4 py-3">Target</th>
                      <th className="px-4 py-3">Script</th>
                      <th className="px-4 py-3">Agent</th>
                      <th className="px-4 py-3">Scheduled for</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {outboundScheduled.map((c) => (
                      <tr key={c.id} className="border-b border-border/30 last:border-0 hover:bg-accent/20">
                        <td className="px-4 py-3">
                          <div className="font-medium">{c.target}</div>
                          <div className="text-xs text-muted-foreground">{c.phone}</div>
                          {c.note && <div className="mt-1 text-[11px] text-muted-foreground">{c.note}</div>}
                        </td>
                        <td className="px-4 py-3"><ScriptPill s={c.script} /></td>
                        <td className="px-4 py-3 text-xs">{c.agentName}</td>
                        <td className="px-4 py-3 text-xs">{c.scheduledFor}</td>
                        <td className="px-4 py-3">
                          {c.status === "Batch" ? (
                            <Badge variant="outline" className="border-violet/40 bg-violet/10 text-violet">
                              <Layers className="h-2.5 w-2.5" /> Batch · {c.batchSize}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-sky-400/40 bg-sky-500/10 text-sky-300">
                              <CalendarIcon className="h-2.5 w-2.5" /> Scheduled
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger className="rounded p-1 text-muted-foreground hover:bg-accent/40">
                              <MoreHorizontal className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => toast.success("Edit dialog")}>Edit</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.success("Calling now…")}>Call now instead</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.error(`Cancelled call for ${c.target}`)}>Cancel</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Live */}
          <TabsContent value="live" className="mt-6">
            <Card className="rounded-xl border-emerald-400/40 bg-gradient-to-br from-emerald-500/5 via-card/40 to-transparent p-6 shadow-glow">
              <div className="flex flex-col gap-5 lg:flex-row">
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Live</span>
                      </div>
                      <h3 className="mt-1 font-display text-lg font-semibold">{outboundLive.target}</h3>
                      <div className="font-mono text-xs text-muted-foreground">{outboundLive.phone}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="text-2xl font-bold tabular-nums">{fmtDur(liveDuration)}</div>
                      <div className="text-[11px] text-muted-foreground">EC${(liveDuration * 0.0014).toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <ScriptPill s={outboundLive.script} />
                    <Badge variant="outline" className="border-border/60 text-[10px]"><Mic className="h-2.5 w-2.5" /> {outboundLive.agentName}</Badge>
                  </div>

                  <Waveform active />

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => toast.success("Listening in…")}>
                      <Headphones className="h-3.5 w-3.5" /> Listen in
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => toast.success("Call ended")}
                    >
                      <PhoneOff className="h-3.5 w-3.5" /> Hang up
                    </Button>
                  </div>
                </div>

                <div className="flex-1 lg:max-w-md">
                  <div className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">Live transcript</div>
                  <div className="max-h-72 space-y-2 overflow-y-auto rounded-lg border border-border/40 bg-background/40 p-3">
                    {(outboundLive.transcript ?? []).slice(0, liveIdx).map((m, i) => (
                      <div key={i} className={cn("text-xs", m.from === "ai" ? "text-foreground" : "text-muted-foreground")}>
                        <span className="mr-2 font-mono text-[10px] text-muted-foreground/60">{m.t}</span>
                        <span className={cn("font-semibold", m.from === "ai" ? "text-primary" : "text-foreground")}>
                          {m.from === "ai" ? outboundLive.agentName : outboundLive.target.split(" ")[0]}:
                        </span>{" "}
                        {m.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Completed */}
          <TabsContent value="completed" className="mt-6">
            <Card className="rounded-xl border-border/40 bg-card/40 p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/40 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                      <th className="px-4 py-3">Target</th>
                      <th className="px-4 py-3">Script</th>
                      <th className="px-4 py-3">Agent</th>
                      <th className="px-4 py-3">Completed</th>
                      <th className="px-4 py-3">Outcome</th>
                      <th className="px-4 py-3">Duration</th>
                      <th className="px-4 py-3">Cost</th>
                      <th className="px-4 py-3">Transcript</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outboundCompleted.map((c) => {
                      const o = c.outcome ? outcomeMetaOutbound[c.outcome] : null;
                      return (
                        <tr key={c.id} className="border-b border-border/30 last:border-0 hover:bg-accent/20">
                          <td className="px-4 py-3">
                            <div className="font-medium">{c.target}</div>
                            <div className="text-xs text-muted-foreground">{c.phone}</div>
                          </td>
                          <td className="px-4 py-3"><ScriptPill s={c.script} /></td>
                          <td className="px-4 py-3 text-xs">{c.agentName}</td>
                          <td className="px-4 py-3 text-xs">{c.scheduledFor}</td>
                          <td className="px-4 py-3">
                            {o && <Badge variant="outline" className={o.className}>{o.label}</Badge>}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs">{fmtDur(c.durationSec ?? 0)}</td>
                          <td className="px-4 py-3 font-mono text-xs">EC${c.costEC?.toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => setTranscriptCall(c)}
                              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                            >
                              <FileText className="h-3 w-3" /> View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Cancelled */}
          <TabsContent value="cancelled" className="mt-6">
            <Card className="rounded-xl border-border/40 bg-card/40 p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/40 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                      <th className="px-4 py-3">Target</th>
                      <th className="px-4 py-3">Script</th>
                      <th className="px-4 py-3">Agent</th>
                      <th className="px-4 py-3">Was scheduled</th>
                      <th className="px-4 py-3">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outboundCancelled.map((c) => (
                      <tr key={c.id} className="border-b border-border/30 last:border-0">
                        <td className="px-4 py-3">
                          <div className="font-medium">{c.target}</div>
                          <div className="text-xs text-muted-foreground">{c.phone}</div>
                        </td>
                        <td className="px-4 py-3"><ScriptPill s={c.script} /></td>
                        <td className="px-4 py-3 text-xs">{c.agentName}</td>
                        <td className="px-4 py-3 text-xs">{c.scheduledFor}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{c.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Schedule a call dialog */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Schedule an outbound call</DialogTitle>
            <DialogDescription>Pick a target, a script, and when your AI agent should call.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label>Target (search contacts or enter a number)</Label>
              <Input placeholder="e.g. Marcus Charles or +1 767 …" />
            </div>
            <div className="grid gap-2">
              <Label>Script</Label>
              <Select defaultValue="Booking Confirmation">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Booking Confirmation">Booking Confirmation</SelectItem>
                  <SelectItem value="No-Show Recovery">No-Show Recovery</SelectItem>
                  <SelectItem value="Bill Reminder">Bill Reminder</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Custom instructions (optional)</Label>
              <Textarea rows={2} placeholder="e.g. Confirm the tasting menu pre-order for 4 guests at 8pm Saturday." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Agent</Label>
                <Select defaultValue={agents[0]?.id ?? ""}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {agents.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>When</Label>
                <Select defaultValue="15min">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15min">In 15 minutes</SelectItem>
                    <SelectItem value="tomorrow">Tomorrow 9am</SelectItem>
                    <SelectItem value="custom">Custom date/time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="rounded-md border border-border/40 bg-background/40 p-3 text-xs text-muted-foreground">
              <div className="mb-1 font-semibold text-foreground">Retry rules</div>
              If no answer, retry 2 times at 1-hour intervals. Don't call before 9am or after 7pm.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleOpen(false)}>Cancel</Button>
            <Button onClick={() => { setScheduleOpen(false); toast.success("Call scheduled"); }}>
              <CalendarIcon className="h-3.5 w-3.5" /> Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Batch schedule */}
      <Dialog open={batchOpen} onOpenChange={setBatchOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Batch schedule</DialogTitle>
            <DialogDescription>Call a segment of customers with a single script.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label>Segment</Label>
              <Select defaultValue="bookings-tomorrow">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="bookings-tomorrow">All bookings tomorrow (12)</SelectItem>
                  <SelectItem value="no-shows-24h">All no-shows last 24h (4)</SelectItem>
                  <SelectItem value="overdue-invoices">All overdue invoices (7)</SelectItem>
                  <SelectItem value="custom">Custom filter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Script</Label>
                <Select defaultValue="Booking Confirmation">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Booking Confirmation">Booking Confirmation</SelectItem>
                    <SelectItem value="No-Show Recovery">No-Show Recovery</SelectItem>
                    <SelectItem value="Bill Reminder">Bill Reminder</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Agent</Label>
                <Select defaultValue={agents[0]?.id ?? ""}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {agents.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <div className="mb-2 text-xs font-semibold text-foreground">Preview (4 recipients)</div>
              <div className="space-y-1 rounded-md border border-border/40 bg-background/40 p-3 text-xs">
                {["Aaliyah George · +1 767 245 1182", "Marcus Charles · +1 767 123 4567", "Cherise Joseph · +1 767 614 9920", "Solange P. · +1 758 488 7011"].map((r) => (
                  <div key={r} className="flex items-center justify-between">
                    <span>{r}</span>
                    <button className="text-muted-foreground hover:text-destructive" aria-label="Remove">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-md border border-amber-400/40 bg-amber-500/5 p-3 text-[11px] text-amber-300">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span>Calls run sequentially with a 30-second gap. Estimated total time: ~4 minutes.</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBatchOpen(false)}>Cancel</Button>
            <Button onClick={() => { setBatchOpen(false); toast.success("Batch scheduled — 4 calls queued"); }}>
              <Layers className="h-3.5 w-3.5" /> Schedule batch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transcript drawer */}
      <Sheet open={!!transcriptCall} onOpenChange={(o) => !o && setTranscriptCall(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Transcript · {transcriptCall?.target}</SheetTitle>
            <SheetDescription>
              {transcriptCall?.script} · {transcriptCall?.agentName} · {fmtDur(transcriptCall?.durationSec ?? 0)} · {transcriptCall?.scheduledFor}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-3">
            <div className="rounded-md border border-border/40 bg-background/40 p-3">
              <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                <Headphones className="h-3 w-3" /> Audio recording
              </div>
              <div className="flex items-center gap-3">
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground" aria-label="Play">
                  ▶
                </button>
                <Waveform active={false} />
                <span className="font-mono text-xs text-muted-foreground">{fmtDur(transcriptCall?.durationSec ?? 0)}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Transcript</div>
              {/* Reuse live transcript template for visual continuity */}
              {(outboundLive.transcript ?? []).map((m, i) => (
                <div key={i} className={cn("text-sm", m.from === "ai" ? "text-foreground" : "text-muted-foreground")}>
                  <span className="mr-2 font-mono text-[10px] text-muted-foreground/60">{m.t}</span>
                  <span className={cn("font-semibold", m.from === "ai" ? "text-primary" : "text-foreground")}>
                    {m.from === "ai" ? transcriptCall?.agentName : (transcriptCall?.target ?? "").split(" ")[0]}:
                  </span>{" "}
                  {m.text}
                </div>
              ))}
              {transcriptCall?.note && (
                <div className="rounded-md border border-border/40 bg-card/40 p-3 text-xs">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Outcome note</div>
                  <div className="mt-1">{transcriptCall.note}</div>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <PhoneCall className="hidden" />
    </DashboardLayout>
  );
}

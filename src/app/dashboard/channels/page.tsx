"use client";

import { useState } from "react";
import {
  Antenna,
  CheckCircle2,
  AlertTriangle,
  Phone,
  PhoneCall,
  Instagram,
  MessageCircle,
  Facebook,
  MessageSquare,
  Plus,
  ArrowUpRight,
  Sparkles,
  Crown,
  Send,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { agents, whatsappLines } from "@/lib/mock-data";
import {
  channelPills,
  instagramAccount,
  facebookPage,
  voiceDids,
} from "@/lib/turn10-data";
import { cn } from "@/lib/utils";

function PillIcon({ id }: { id: string }) {
  const map: Record<string, typeof Phone> = {
    wa: Phone,
    "wa-voice": PhoneCall,
    ig: Instagram,
    fb: Facebook,
    sip: PhoneCall,
    sms: MessageSquare,
  };
  const Icon = map[id] ?? Antenna;
  return <Icon className="h-3.5 w-3.5" />;
}

function didFor(agentId: string) {
  let h = 0;
  for (let i = 0; i < agentId.length; i++) h = (h * 31 + agentId.charCodeAt(i)) >>> 0;
  const last4 = String(1000 + (h % 9000)).padStart(4, "0");
  return `+1 767-818-${last4}`;
}

export default function ChannelsPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [voiceState, setVoiceState] = useState<Record<string, { in: boolean; out: boolean }>>(
    () => Object.fromEntries(voiceDids.map((d) => [d.id, { in: d.inbound, out: d.outbound }])),
  );

  return (
    <DashboardLayout currentPath="/dashboard/channels">
      <div className="px-6 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
              <Antenna className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold leading-tight">Your channels</h1>
              <p className="text-sm text-muted-foreground">
                All the doors customers can reach you through. Connected to Meta, routed through EPIC's telecom.
              </p>
            </div>
          </div>
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="h-3.5 w-3.5" /> Add channel
          </Button>
        </div>

        {/* Status pills */}
        <div className="mb-8 flex flex-wrap gap-2">
          {channelPills.map((p) => (
            <div
              key={p.id}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs",
                p.status === "connected" && "border-primary/30 bg-primary/10 text-primary",
                p.status === "warning" && "border-amber-400/40 bg-amber-500/10 text-amber-300",
                p.status === "offline" && "border-destructive/30 bg-destructive/10 text-destructive",
              )}
            >
              <PillIcon id={p.id} />
              <span className="font-medium">{p.label}</span>
              <span className="opacity-60">·</span>
              {p.status === "connected" ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <AlertTriangle className="h-3 w-3" />
              )}
              <span className="text-[11px]">{p.detail}</span>
            </div>
          ))}
        </div>

        {/* WhatsApp section */}
        <section className="mb-10">
          <div className="mb-3 flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary" />
            <h2 className="font-display text-lg font-semibold">WhatsApp numbers</h2>
            <Badge variant="outline" className="border-border/60 text-[10px] uppercase tracking-wider text-muted-foreground">
              {agents.length + 1} numbers
            </Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {agents.map((a) => (
              <Card key={a.id} className="space-y-3 rounded-xl border-border/40 bg-card/40 p-5 transition-all hover:bg-card/60">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-display text-base font-semibold">{a.name}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{a.templateLabel}</div>
                  </div>
                  <Badge className="bg-primary/15 text-primary hover:bg-primary/20">
                    <CheckCircle2 className="h-3 w-3" /> Active
                  </Badge>
                </div>
                <div className="font-mono text-sm tabular-nums">{didFor(a.id)}</div>
                <div className="text-[11px] text-muted-foreground">Last message · 8m ago</div>
                <div className="flex items-center justify-between rounded-md border border-border/40 bg-background/40 px-3 py-2 text-xs">
                  <span className="text-muted-foreground">Voice calls</span>
                  <Switch defaultChecked={a.channels.includes("voice")} />
                </div>
                <Button asChild size="sm" variant="outline" className="w-full">
                  <a href={`https://wa.me/${didFor(a.id).replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                    <Send className="h-3.5 w-3.5" /> Test on WhatsApp
                  </a>
                </Button>
              </Card>
            ))}
            {/* Ema card */}
            <Card className="space-y-3 rounded-xl border-2 border-ema/40 bg-gradient-to-br from-ema/10 via-card/60 to-transparent p-5 shadow-ema">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 font-display text-base font-semibold">
                    <Sparkles className="h-4 w-4 text-ema" /> Ema
                  </div>
                  <Badge className="mt-1 bg-ema/20 text-[10px] uppercase tracking-wider text-ema hover:bg-ema/25">
                    <Crown className="h-2.5 w-2.5" /> Chief of Staff
                  </Badge>
                </div>
                <Badge className="bg-primary/15 text-primary hover:bg-primary/20">
                  <CheckCircle2 className="h-3 w-3" /> Active
                </Badge>
              </div>
              <div className="font-mono text-sm tabular-nums">{whatsappLines.ema.number}</div>
              <p className="text-[11px] text-muted-foreground">{whatsappLines.ema.description}</p>
              <Button asChild size="sm" className="w-full bg-gradient-ema text-ema-foreground hover:opacity-90">
                <a href={whatsappLines.ema.waLink} target="_blank" rel="noreferrer">
                  <Send className="h-3.5 w-3.5" /> Message Ema
                </a>
              </Button>
            </Card>
          </div>
        </section>

        {/* Instagram */}
        <section className="mb-10">
          <div className="mb-3 flex items-center gap-2">
            <Instagram className="h-4 w-4 text-pink-400" />
            <h2 className="font-display text-lg font-semibold">Instagram</h2>
          </div>
          <Card className="rounded-xl border-border/40 bg-card/40 p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 text-white">
                  <Instagram className="h-7 w-7" />
                </div>
                <div>
                  <div className="font-display text-lg font-semibold">{instagramAccount.handle}</div>
                  <div className="text-xs text-muted-foreground">
                    {instagramAccount.followers.toLocaleString()} followers · last post {instagramAccount.lastPost}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {instagramAccount.capabilities.map((c) => (
                      <Badge key={c} variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                        <CheckCircle2 className="h-2.5 w-2.5" /> {c}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button size="sm" variant="outline" asChild>
                  <a href="https://business.facebook.com" target="_blank" rel="noreferrer">
                    Manage in Meta Business Suite <ArrowUpRight className="h-3 w-3" />
                  </a>
                </Button>
                <Button size="sm" variant="ghost" onClick={() => toast.error("Disconnect requires re-auth")}>
                  Disconnect
                </Button>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-4 border-t border-border/40 pt-4 text-xs text-muted-foreground">
              <span><span className="font-semibold text-foreground">{instagramAccount.weeklyDms}</span> DMs handled this week</span>
              <span>·</span>
              <span><span className="font-semibold text-foreground">{instagramAccount.weeklyComments}</span> comments replied</span>
            </div>
          </Card>
        </section>

        {/* Facebook */}
        <section className="mb-10">
          <div className="mb-3 flex items-center gap-2">
            <Facebook className="h-4 w-4 text-sky-400" />
            <h2 className="font-display text-lg font-semibold">Facebook</h2>
          </div>
          <Card className="rounded-xl border-border/40 bg-card/40 p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-600 text-white">
                  <Facebook className="h-7 w-7" />
                </div>
                <div>
                  <div className="font-display text-lg font-semibold">{facebookPage.pageName}</div>
                  <div className="text-xs text-muted-foreground">
                    {facebookPage.likes.toLocaleString()} page likes · last post {facebookPage.lastPost}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {facebookPage.capabilities.map((c) => (
                      <Badge key={c} variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                        <CheckCircle2 className="h-2.5 w-2.5" /> {c}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button size="sm" variant="outline" asChild>
                  <a href="https://business.facebook.com" target="_blank" rel="noreferrer">
                    Manage in Meta Business Suite <ArrowUpRight className="h-3 w-3" />
                  </a>
                </Button>
                <Button size="sm" variant="ghost" onClick={() => toast.error("Disconnect requires re-auth")}>
                  Disconnect
                </Button>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-4 border-t border-border/40 pt-4 text-xs text-muted-foreground">
              <span><span className="font-semibold text-foreground">{facebookPage.weeklyThreads}</span> Messenger threads</span>
              <span>·</span>
              <span><span className="font-semibold text-foreground">{facebookPage.weeklyComments}</span> comments replied</span>
            </div>
          </Card>
        </section>

        {/* Voice */}
        <section className="mb-10">
          <div className="mb-3 flex items-center gap-2">
            <PhoneCall className="h-4 w-4 text-primary" />
            <h2 className="font-display text-lg font-semibold">Voice (SIP via EPIC)</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {voiceDids.map((d) => {
              const pct = (d.minutesUsed / d.minutesLimit) * 100;
              return (
                <Card key={d.id} className="rounded-xl border-border/40 bg-card/40 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-mono text-base font-semibold tabular-nums">{d.number}</div>
                      <div className="text-xs text-muted-foreground">{d.agentName}</div>
                    </div>
                    <Badge className="bg-primary/15 text-primary hover:bg-primary/20">
                      <CheckCircle2 className="h-3 w-3" /> Active
                    </Badge>
                  </div>
                  <div className="mt-4 space-y-2 rounded-md border border-border/40 bg-background/40 p-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Inbound calls</span>
                      <Switch
                        checked={voiceState[d.id]?.in}
                        onCheckedChange={(v) => setVoiceState((p) => ({ ...p, [d.id]: { ...p[d.id], in: v } }))}
                      />
                    </div>
                    <div className="flex items-center justify-between border-t border-border/40 pt-2">
                      <span className="text-muted-foreground">Outbound calls</span>
                      <Switch
                        checked={voiceState[d.id]?.out}
                        onCheckedChange={(v) => setVoiceState((p) => ({ ...p, [d.id]: { ...p[d.id], out: v } }))}
                      />
                    </div>
                  </div>
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Minutes used</span>
                      <span className="font-medium">{d.minutesUsed} / {d.minutesLimit}</span>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                  </div>
                  <Button size="sm" variant="outline" className="mt-4 w-full" onClick={() => toast.success("Calling your phone…")}>
                    <PhoneCall className="h-3.5 w-3.5" /> Test call
                  </Button>
                </Card>
              );
            })}
          </div>
        </section>

        {/* SMS — coming soon */}
        <section className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-display text-lg font-semibold">SMS</h2>
          </div>
          <Card className="rounded-xl border border-dashed border-border/60 bg-gradient-to-br from-muted/20 to-transparent p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted/40">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="mt-3 font-display text-lg font-semibold">SMS — Coming Q3 2026</h3>
            <p className="mx-auto mt-2 max-w-md text-xs text-muted-foreground">
              Two-way SMS over your Dominica DIDs. Same AI agents. Same Ema. Customers who don't use WhatsApp or Messenger will be able to reach you over plain SMS.
            </p>
            <Button size="sm" variant="outline" className="mt-4" disabled>
              Notify me when ready
            </Button>
          </Card>
        </section>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a channel</DialogTitle>
            <DialogDescription>
              More channels are on the roadmap. Pick one to be notified when it's live.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {[
              { id: "email", label: "Email inbox", desc: "Connect Gmail / Microsoft 365" },
              { id: "web", label: "Website chat widget", desc: "Embed a chat bubble on your site" },
              { id: "sms", label: "SMS", desc: "Two-way SMS on your Dominica numbers" },
              { id: "tiktok", label: "TikTok Business", desc: "DMs + comments on your TikTok account" },
            ].map((c) => (
              <div key={c.id} className="flex items-start justify-between gap-3 rounded-md border border-border/40 bg-card/40 p-3">
                <div>
                  <div className="text-sm font-medium">{c.label}</div>
                  <div className="text-xs text-muted-foreground">{c.desc}</div>
                </div>
                <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-muted-foreground">Coming soon</Badge>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Close</Button>
            <Button onClick={() => { toast.success("We'll let you know"); setAddOpen(false); }}>
              <RefreshCw className="h-3.5 w-3.5" /> Notify me
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

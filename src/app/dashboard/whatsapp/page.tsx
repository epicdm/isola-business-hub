"use client";

import { useState } from "react";
import {
  Phone,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Sparkles,
  Info,
  Send,
  Crown,
  Pause,
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { agents, whatsappLines, type WhatsAppLineStatus, type AgentStatus } from "@/lib/mock-data";

// Tiny generated QR-like grid (deterministic from string) — pure CSS, no deps.
function MockQR({ seed, size = 110 }: { seed: string; size?: number }) {
  const cells = 21;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const grid: boolean[] = [];
  for (let i = 0; i < cells * cells; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    grid.push((h & 1) === 1);
  }
  const setBlock = (cx: number, cy: number) => {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        const onBorder = x === 0 || y === 0 || x === 6 || y === 6;
        const onCenter = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        grid[(cy + y) * cells + (cx + x)] = onBorder || onCenter;
      }
    }
    for (let y = -1; y <= 7; y++) {
      for (let x = -1; x <= 7; x++) {
        if (x === -1 || x === 7 || y === -1 || y === 7) {
          const px = cx + x;
          const py = cy + y;
          if (px >= 0 && py >= 0 && px < cells && py < cells) {
            grid[py * cells + px] = false;
          }
        }
      }
    }
  };
  setBlock(0, 0);
  setBlock(cells - 7, 0);
  setBlock(0, cells - 7);
  return (
    <div
      className="grid rounded-md bg-white p-2"
      style={{
        width: size,
        height: size,
        gridTemplateColumns: `repeat(${cells}, 1fr)`,
        gridTemplateRows: `repeat(${cells}, 1fr)`,
        gap: 0,
      }}
      aria-label="WhatsApp QR code"
    >
      {grid.map((on, i) => (
        <div key={i} className={on ? "bg-zinc-900" : "bg-white"} />
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: WhatsAppLineStatus }) {
  if (status === "active") {
    return (
      <Badge className="bg-primary/15 text-primary hover:bg-primary/20">
        <CheckCircle2 className="h-3 w-3" /> Active
      </Badge>
    );
  }
  if (status === "registering") {
    return (
      <Badge className="bg-warning/15 text-warning hover:bg-warning/20">
        <Loader2 className="h-3 w-3 animate-spin" /> Registering
      </Badge>
    );
  }
  return (
    <Badge className="bg-destructive/15 text-destructive hover:bg-destructive/20">
      <AlertTriangle className="h-3 w-3" /> Failed
    </Badge>
  );
}

function PausedBadge() {
  return (
    <Badge className="bg-muted text-muted-foreground hover:bg-muted/80">
      <Pause className="h-3 w-3" /> Paused
    </Badge>
  );
}

// Map agents → fake DID phones (1-767-818-XXXX pool, deterministic)
function didFor(agentId: string): { display: string; href: string } {
  let h = 0;
  for (let i = 0; i < agentId.length; i++) h = (h * 31 + agentId.charCodeAt(i)) >>> 0;
  const last4 = String(1000 + (h % 9000)).padStart(4, "0");
  return {
    display: `+1 767-818-${last4}`,
    href: `https://wa.me/1767818${last4}?text=test`,
  };
}

function agentStatusToLine(s: AgentStatus): WhatsAppLineStatus | "paused" {
  if (s === "active") return "active";
  if (s === "error") return "failed";
  return "paused";
}

export default function WhatsAppPage() {
  const [zoomedQr, setZoomedQr] = useState<{ seed: string; title: string } | null>(null);
  const [voiceState, setVoiceState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(agents.map((a) => [a.id, a.channels.includes("voice")])),
  );

  return (
    <DashboardLayout currentPath="/dashboard/whatsapp">
      <div className="px-6 py-8 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
              <Phone className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold leading-tight">WhatsApp</h1>
              <p className="text-sm text-muted-foreground">
                Every agent has its own dedicated number. Ema gets her own private line.
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => toast.success("Synced with Meta")}>
            <RefreshCw className="h-3.5 w-3.5" /> Sync now
          </Button>
        </div>

        {/* Grid: 1 card per agent + 1 Ema card */}
        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {agents.map((a) => {
            const did = didFor(a.id);
            const lineStatus = agentStatusToLine(a.status);
            const failed = lineStatus === "failed";
            return (
              <Card
                key={a.id}
                className="flex flex-col gap-4 border-border/40 bg-card/60 p-5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="truncate font-display text-base font-semibold">{a.name}</h2>
                    </div>
                    <Badge
                      variant="outline"
                      className="mt-1 border-border/60 bg-background/40 text-[10px] uppercase tracking-wider text-muted-foreground"
                    >
                      {a.templateLabel}
                    </Badge>
                  </div>
                  {lineStatus === "paused" ? (
                    <PausedBadge />
                  ) : (
                    <StatusBadge status={lineStatus as WhatsAppLineStatus} />
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setZoomedQr({ seed: did.display, title: a.name })}
                    className="rounded-md transition-transform hover:scale-105"
                    aria-label={`Enlarge QR for ${a.name}`}
                  >
                    <MockQR seed={did.display} />
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-lg font-bold tabular-nums leading-tight">
                      {did.display}
                    </div>
                    <a
                      href={did.href}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block truncate font-mono text-[11px] text-primary hover:underline"
                    >
                      wa.me/1767818{did.display.slice(-4)}
                    </a>
                    <div className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                      Last message
                    </div>
                    <div className="text-xs">
                      {a.status === "active"
                        ? `${Math.max(2, a.messagesThisWeek % 30)}m ago`
                        : a.status === "paused"
                          ? "—"
                          : "Awaiting registration"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 rounded-md border border-border/40 bg-background/40 px-3 py-2">
                  <div className="flex items-center gap-2 text-xs">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Voice calls</span>
                  </div>
                  <Switch
                    checked={voiceState[a.id]}
                    onCheckedChange={(v) => {
                      setVoiceState((prev) => ({ ...prev, [a.id]: v }));
                      toast.success(v ? `Voice enabled for ${a.name}` : `Voice disabled for ${a.name}`);
                    }}
                    disabled={failed}
                  />
                </div>

                <div className="flex gap-2">
                  {failed ? (
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => toast.success("Retrying registration with Meta…")}
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Retry registration
                    </Button>
                  ) : (
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="flex-1"
                    >
                      <a href={did.href} target="_blank" rel="noreferrer">
                        <Send className="h-3.5 w-3.5" /> Test on WhatsApp
                      </a>
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}

          {/* Ema card — distinct */}
          <Card className="relative flex flex-col gap-4 border-2 border-ema/40 bg-gradient-to-br from-ema/10 via-card/60 to-transparent p-5 shadow-ema">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-ema" />
                  <h2 className="truncate font-display text-base font-semibold">Ema</h2>
                </div>
                <Badge className="mt-1 bg-ema/20 text-[10px] uppercase tracking-wider text-ema hover:bg-ema/25">
                  <Crown className="h-2.5 w-2.5" /> Chief of Staff
                </Badge>
              </div>
              <StatusBadge status={whatsappLines.ema.status} />
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setZoomedQr({ seed: whatsappLines.ema.number, title: "Ema" })}
                className="rounded-md transition-transform hover:scale-105"
                aria-label="Enlarge QR for Ema"
              >
                <MockQR seed={whatsappLines.ema.number} />
              </button>
              <div className="min-w-0 flex-1">
                <div className="font-display text-lg font-bold tabular-nums leading-tight">
                  {whatsappLines.ema.number}
                </div>
                <a
                  href={whatsappLines.ema.waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 block truncate font-mono text-[11px] text-ema hover:underline"
                >
                  wa.me/17678183742
                </a>
                <div className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                  Last from Ema
                </div>
                <div className="text-xs">{whatsappLines.ema.lastMessage}</div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">{whatsappLines.ema.description}</p>

            <Button
              asChild
              size="sm"
              className="bg-gradient-ema text-ema-foreground hover:opacity-90"
            >
              <a href={whatsappLines.ema.waLink} target="_blank" rel="noreferrer">
                <Send className="h-3.5 w-3.5" /> Message Ema
              </a>
            </Button>
          </Card>
        </div>

        {/* Footer info */}
        <div className="flex items-start gap-3 rounded-lg border border-border/30 bg-card/20 p-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            All numbers connected via Meta WhatsApp Business API. Calls routed through{" "}
            <span className="text-foreground">EPIC Communications'</span> Dominica pool
            (1-767-818-XXXX).
          </p>
        </div>
      </div>

      {/* QR zoom dialog */}
      <Dialog open={!!zoomedQr} onOpenChange={(o) => !o && setZoomedQr(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Scan to chat with {zoomedQr?.title}</DialogTitle>
            <DialogDescription>
              Open WhatsApp on your phone, tap Camera, and point at this code.
            </DialogDescription>
          </DialogHeader>
          {zoomedQr && (
            <div className="flex justify-center py-4">
              <MockQR seed={zoomedQr.seed} size={260} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

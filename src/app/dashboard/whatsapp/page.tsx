"use client";

import { useState } from "react";
import { Phone, CheckCircle2, AlertTriangle, Loader2, RefreshCw, Sparkles, PhoneCall, Info } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { whatsappLines, type WhatsAppLineStatus } from "@/lib/mock-data";

// Tiny generated QR-like grid (deterministic from string) — pure CSS, no deps.
function MockQR({ seed, size = 132 }: { seed: string; size?: number }) {
  const cells = 21;
  // Deterministic pseudo-random from seed
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const grid: boolean[] = [];
  for (let i = 0; i < cells * cells; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    grid.push((h & 1) === 1);
  }
  // Force the three finder boxes (top-left, top-right, bottom-left)
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

export default function WhatsAppPage() {
  const [callingEnabled, setCallingEnabled] = useState(true);
  const [pinging, setPinging] = useState(false);

  const handlePing = () => {
    setPinging(true);
    toast.success("Ping sent to Ema", { description: "She'll reply on WhatsApp shortly." });
    setTimeout(() => setPinging(false), 1600);
  };

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
                Your two dedicated lines: customers and Ema.
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => toast.success("Synced with Meta")}>
            <RefreshCw className="h-3.5 w-3.5" /> Sync now
          </Button>
        </div>

        {/* Two number cards side-by-side */}
        <div className="mb-6 grid gap-4 lg:grid-cols-2">
          {/* Customer-facing */}
          <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent p-6">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {whatsappLines.customer.label}
                </h2>
              </div>
              <StatusBadge status={whatsappLines.customer.status} />
            </div>
            <div className="flex items-center gap-5">
              <MockQR seed={whatsappLines.customer.number} />
              <div className="min-w-0 flex-1">
                <div className="font-display text-2xl font-bold tabular-nums leading-tight">
                  {whatsappLines.customer.number}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {whatsappLines.customer.displayName}
                </p>
                <a
                  href={whatsappLines.customer.waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block truncate font-mono text-[11px] text-primary hover:underline"
                >
                  wa.me/17678183741
                </a>
                <div className="mt-4 rounded-md border border-border/40 bg-background/40 px-3 py-2">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Last message
                  </div>
                  <div className="text-sm">{whatsappLines.customer.lastMessage}</div>
                </div>
                {whatsappLines.customer.status === "failed" && (
                  <Button size="sm" className="mt-3 w-full">
                    Retry registration
                  </Button>
                )}
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              {whatsappLines.customer.description}
            </p>
          </Card>

          {/* Ema's number */}
          <Card className="border-ema/30 bg-gradient-to-br from-ema/5 to-transparent p-6">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-ema" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {whatsappLines.ema.label}
                </h2>
              </div>
              <StatusBadge status={whatsappLines.ema.status} />
            </div>
            <div className="flex items-center gap-5">
              <MockQR seed={whatsappLines.ema.number} />
              <div className="min-w-0 flex-1">
                <div className="font-display text-2xl font-bold tabular-nums leading-tight">
                  {whatsappLines.ema.number}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{whatsappLines.ema.displayName}</p>
                <a
                  href={whatsappLines.ema.waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block truncate font-mono text-[11px] text-ema hover:underline"
                >
                  wa.me/17678183742
                </a>
                <div className="mt-4 rounded-md border border-border/40 bg-background/40 px-3 py-2">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Last from Ema
                  </div>
                  <div className="text-sm">{whatsappLines.ema.lastMessage}</div>
                </div>
                <Button
                  size="sm"
                  onClick={handlePing}
                  disabled={pinging}
                  className="mt-3 w-full bg-gradient-ema text-ema-foreground hover:opacity-90"
                >
                  {pinging ? (
                    <>
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ema-foreground/60" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-ema-foreground" />
                      </span>
                      Pinging…
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" /> Ping Ema
                    </>
                  )}
                </Button>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">{whatsappLines.ema.description}</p>
          </Card>
        </div>

        {/* WA Calling toggle */}
        <Card className="mb-6 border-border/40 bg-card/40 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <PhoneCall className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base font-semibold">
                    WhatsApp Business Calling API
                  </h3>
                  <Badge
                    className={
                      callingEnabled
                        ? "bg-primary/15 text-primary hover:bg-primary/20"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {callingEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <p className="mt-1 max-w-xl text-xs text-muted-foreground">
                  Customers can voice-call your WhatsApp number directly. Calls are answered by your AI receptionist and routed to your team or a SIP trunk.
                </p>
              </div>
            </div>
            <Switch
              checked={callingEnabled}
              onCheckedChange={(v) => {
                setCallingEnabled(v);
                toast.success(v ? "Voice calling enabled" : "Voice calling disabled");
              }}
            />
          </div>
        </Card>

        {/* Footer info */}
        <div className="flex items-start gap-3 rounded-lg border border-border/30 bg-card/20 p-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Connected via Meta WhatsApp Business API. Your dedicated number is allocated from{" "}
            <span className="text-foreground">EPIC Communications'</span> Dominica DID pool.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

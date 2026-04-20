"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  RefreshCw,
  Info,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  ReceiptText,
  PackageX,
  HandCoins,
  Wallet,
  ShoppingBag,
  UtensilsCrossed,
  ChevronRight,
  Database,
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import InsightCardMenu, {
  type InsightAction,
  type EmaContext,
} from "@/components/dashboard/InsightCardMenu";
import Sparkline from "@/components/dashboard/Sparkline";
import { insightsMockData } from "@/lib/mock-data";
import { useOdooConnection } from "@/hooks/use-odoo-connection";

const data = insightsMockData.cards;

type DrillKey =
  | "todaysSales"
  | "openTabs"
  | "outstandingInvoices"
  | "topCustomers"
  | "menuPerformance"
  | "lowStock"
  | "staffTips"
  | "cashBalance";

function formatEC(amount: number): string {
  return `EC$${amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function TrendPill({ delta, compare }: { delta: number; compare: string }) {
  const up = delta >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <div className={`inline-flex items-center gap-1 text-xs font-medium ${up ? "text-success" : "text-destructive"}`}>
      <Icon className="h-3.5 w-3.5" />
      <span>{up ? "+" : ""}{delta}%</span>
      <span className="text-muted-foreground font-normal">{compare}</span>
    </div>
  );
}

function CardShell({
  title,
  icon: Icon,
  tooltip,
  onClick,
  children,
}: {
  title: string;
  icon: typeof TrendingUp;
  tooltip: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Card
      onClick={onClick}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden border-border/60 bg-card/60 p-5 transition-all hover:-translate-y-0.5 hover:border-border hover:shadow-card"
    >
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={(e) => e.stopPropagation()}
                className="text-muted-foreground/60 hover:text-muted-foreground"
                aria-label={`About ${title}`}
              >
                <Info className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs text-xs">
              {tooltip}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex flex-1 flex-col">{children}</div>
    </Card>
  );
}

// ============================================================================
// Drill-down Sheets (rendered conditionally)
// ============================================================================

function DrillContent({ which }: { which: DrillKey }) {
  if (which === "todaysSales") {
    const c = data.todaysSales;
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Revenue" value={formatEC(c.amount)} />
          <Stat label="Orders" value={c.orders.toString()} />
          <Stat label="Avg ticket" value={formatEC(c.avgTicket)} />
        </div>
        <section>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hourly sales</h4>
          <div className="rounded-lg border border-border bg-card/40 p-4">
            <Sparkline values={c.hourly.map((h) => h.v)} variant="bars" height={64} className="w-full" />
            <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
              {c.hourly.map((h) => <span key={h.h}>{h.h}</span>)}
            </div>
          </div>
        </section>
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Top orders</h4>
            <div className="flex gap-1 text-[10px]">
              {["dine-in", "takeout", "delivery"].map((s) => (
                <Badge key={s} variant="outline" className="cursor-pointer">{s}</Badge>
              ))}
            </div>
          </div>
          <ul className="divide-y divide-border rounded-lg border border-border bg-card/40">
            {c.topOrders.map((o) => (
              <li key={o.id} className="flex items-center justify-between px-3 py-2 text-sm">
                <div>
                  <div className="font-medium">{o.customer}</div>
                  <div className="text-xs text-muted-foreground">{o.id} · {o.service} · {o.time}</div>
                </div>
                <div className="font-semibold text-success">{formatEC(o.total)}</div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  }
  if (which === "openTabs") {
    const c = data.openTabs;
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Open tables" value={`${c.tableCount}`} />
          <Stat label="Combined unpaid" value={formatEC(c.total)} />
        </div>
        <ul className="divide-y divide-border rounded-lg border border-border bg-card/40">
          {c.tabs.map((t) => (
            <li key={t.table} className="flex items-center justify-between px-3 py-3 text-sm">
              <div>
                <div className="font-medium">Table {t.table.replace("T.", "")}</div>
                <div className="text-xs text-muted-foreground">Server: {t.server} · seated {t.minutes} min</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">{formatEC(t.total)}</span>
                <Button size="sm" variant="outline" onClick={() => toast.success(`Tab ${t.table} closed`)}>
                  Close tab
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (which === "outstandingInvoices") {
    const c = data.outstandingInvoices;
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <BucketBar label="0–30 d" value={c.buckets.d0_30} max={c.total} color="bg-success" />
          <BucketBar label="30–60 d" value={c.buckets.d30_60} max={c.total} color="bg-warning" />
          <BucketBar label="60+ d" value={c.buckets.d60p} max={c.total} color="bg-destructive" />
        </div>
        <ul className="divide-y divide-border rounded-lg border border-border bg-card/40">
          {c.invoices.map((inv) => (
            <li key={inv.id} className="flex items-center justify-between px-3 py-2 text-sm">
              <div className="min-w-0">
                <div className="truncate font-medium">{inv.customer}</div>
                <div className="text-xs text-muted-foreground">
                  {inv.id} · {inv.daysOverdue > 0 ? `${inv.daysOverdue}d overdue` : "due"} · last reminder: {inv.lastReminder}
                </div>
              </div>
              <div className="ml-3 flex items-center gap-2">
                <span className="font-semibold">{formatEC(inv.amount)}</span>
                {inv.status === "overdue" && <Badge variant="destructive" className="text-[10px]">OVERDUE</Badge>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (which === "topCustomers") {
    return (
      <div className="space-y-4">
        <ul className="divide-y divide-border rounded-lg border border-border bg-card/40">
          {data.topCustomers.map((c, i) => (
            <li key={c.name} className="flex items-center gap-3 px-3 py-3 text-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold">
                {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <div className="flex-1">
                <div className="font-medium">#{i + 1} {c.name}</div>
                <div className="text-xs text-muted-foreground">{c.visits} visits · {c.segment}</div>
              </div>
              <div className="font-semibold text-success">{formatEC(c.spent)}</div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (which === "menuPerformance") {
    const c = data.menuPerformance;
    return (
      <div className="space-y-5">
        <section>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-success">✅ Top performers</h4>
          <ul className="divide-y divide-border rounded-lg border border-success/20 bg-success/5">
            {c.best.map((m) => (
              <li key={m.name} className="flex items-center justify-between px-3 py-2 text-sm">
                <span className="font-medium">{m.name}</span>
                <span className="text-muted-foreground">{m.orders} orders · {formatEC(m.revenue)}</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-warning">⚠ Underperformers</h4>
          <ul className="divide-y divide-border rounded-lg border border-warning/20 bg-warning/5">
            {c.worst.map((m) => (
              <li key={m.name} className="flex items-center justify-between px-3 py-2 text-sm">
                <span className="font-medium">{m.name}</span>
                <span className="text-muted-foreground">{m.orders} orders · {formatEC(m.revenue)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  }
  if (which === "lowStock") {
    return (
      <ul className="divide-y divide-border rounded-lg border border-border bg-card/40">
        {data.lowStock.map((s) => (
          <li key={s.name} className="flex items-center justify-between px-3 py-3 text-sm">
            <div>
              <div className="font-medium">
                <span className="mr-2">{s.severity === "red" ? "🔴" : "🟡"}</span>
                {s.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {s.qty} {s.unit} · reorder at {s.reorderAt} {s.unit} · {s.supplier}
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={() => toast.success(`PO drafted for ${s.name}`)}>
              Reorder
            </Button>
          </li>
        ))}
      </ul>
    );
  }
  if (which === "staffTips") {
    const c = data.staffTips;
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Pool today" value={formatEC(c.pool)} />
          <Stat label="Avg / staff" value={formatEC(Math.round(c.pool / c.servers.length))} />
          <Stat label="30-day avg" value={formatEC(c.avg30d)} />
        </div>
        <ul className="divide-y divide-border rounded-lg border border-border bg-card/40">
          {c.servers.map((s) => (
            <li key={s.name} className="flex items-center justify-between px-3 py-2 text-sm">
              <span className="font-medium">{s.name}</span>
              <span className="font-semibold text-success">{formatEC(s.share)}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  // cashBalance
  const c = data.cashBalance;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Cash on hand" value={formatEC(c.cashOnHand)} />
        <Stat label="Bank" value={formatEC(c.bank)} />
      </div>
      <div className="rounded-lg border border-border bg-card/40 p-4">
        <Sparkline values={c.sparkline.map((p) => p.v)} height={64} className="w-full" />
        <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
          {c.sparkline.map((p, i) => <span key={i}>{p.d}</span>)}
        </div>
      </div>
      <ul className="divide-y divide-border rounded-lg border border-border bg-card/40">
        {c.transactions.map((t, i) => (
          <li key={i} className="flex items-center justify-between px-3 py-2 text-sm">
            <div>
              <div className="font-medium">{t.label}</div>
              <div className="text-xs text-muted-foreground">{t.time}</div>
            </div>
            <span className={`font-semibold ${t.amount >= 0 ? "text-success" : "text-destructive"}`}>
              {t.amount >= 0 ? "+" : ""}{formatEC(t.amount)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card/40 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-lg font-semibold">{value}</div>
    </div>
  );
}

function BucketBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div>
      <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
        <span>{label}</span>
        <span className="font-semibold text-foreground">{formatEC(value)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ============================================================================
// Page
// ============================================================================

const DRILL_TITLES: Record<DrillKey, string> = {
  todaysSales: "Today's sales · full breakdown",
  openTabs: "Open tabs · live tables",
  outstandingInvoices: "Outstanding invoices · aging",
  topCustomers: "Top customers · last 30 days",
  menuPerformance: "Menu performance",
  lowStock: "Low-stock alerts · inventory",
  staffTips: "Staff tips · today",
  cashBalance: "Cash + bank · transactions",
};

export default function InsightsPage() {
  const [drill, setDrill] = useState<DrillKey | null>(null);
  const [synced, setSynced] = useState(insightsMockData.lastSyncedMinutesAgo);
  const [refreshing, setRefreshing] = useState(false);
  const [vertical, setVertical] = useState("Restaurants");
  const { connected: odooConnected, setConnected } = useOdooConnection();
  const [paywallDismissed, setPaywallDismissed] = useState(false);

  // Tick the "synced X min ago" pill
  useEffect(() => {
    const t = setInterval(() => setSynced((s) => s + 1), 60_000);
    return () => clearInterval(t);
  }, []);

  // Read session-only paywall dismissal
  useEffect(() => {
    if (typeof window === "undefined") return;
    setPaywallDismissed(window.sessionStorage.getItem("isola.insights.paywallDismissed") === "1");
  }, []);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setSynced(0);
      toast.success("Refreshed from Odoo · 1.2s");
    }, 1200);
  };

  const dismissPaywall = () => {
    setPaywallDismissed(true);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("isola.insights.paywallDismissed", "1");
    }
  };

  const tryReconnect = () => {
    // Mock optimistic re-check
    toast("Re-testing Odoo connection…");
    setTimeout(() => {
      // Just confirm it's still disconnected unless they actually configured it elsewhere
      toast("Still disconnected — connect from setup.");
    }, 900);
  };

  const c = data;
  const locked = odooConnected === false && !paywallDismissed;
  const blurred = odooConnected === false;

  return (
    <DashboardLayout currentPath="/dashboard/insights">
      <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-3xl font-bold md:text-4xl">Insights</h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-violet/30 bg-violet/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-violet">
                <span className="h-1.5 w-1.5 rounded-full bg-violet" /> Live from Odoo
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Your whole business, one pane.{" "}
              <span className="text-muted-foreground/70">Right-click any card to act on it.</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={refresh}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/40 px-3 py-1.5 text-xs text-muted-foreground transition hover:bg-accent hover:text-foreground"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Syncing…" : `Last sync ${synced === 0 ? "just now" : `${synced} min ago`}`}
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                  {vertical}
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => setVertical("Restaurants")}>
                  Restaurants
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  Hotels <Badge variant="outline" className="ml-2 text-[9px]">Coming soon</Badge>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  Clinics <Badge variant="outline" className="ml-2 text-[9px]">Coming soon</Badge>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Persistent dismissed-paywall banner */}
        {odooConnected === false && paywallDismissed && (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-warning/30 bg-warning/10 px-4 py-2.5 text-xs">
            <span className="text-foreground">
              Insights show mock data until Odoo is connected.
            </span>
            <Button size="sm" variant="outline" asChild>
              <Link to="/onboarding" search={{ step: 6, resume: 1, returnTo: "/dashboard/insights" }}>
                Connect now
              </Link>
            </Button>
          </div>
        )}

        {/* 8-card grid (locked behind Odoo connection) */}
        <div className="relative">
          <div
            className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 transition-all duration-300 ${
              blurred ? "pointer-events-none select-none blur-sm grayscale" : ""
            }`}
            aria-hidden={blurred}
          >
          <div
            className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 transition-all duration-300 ${
              locked ? "pointer-events-none select-none blur-sm grayscale" : ""
            }`}
            aria-hidden={locked}
          >

          {/* CARD 1 — Today's sales */}
          <InsightCardMenu
            cardTitle="Today's sales"
            emaContext={{
              cardTitle: "Today's sales",
              summary: `${formatEC(c.todaysSales.amount)} across ${c.todaysSales.orders} orders, +${c.todaysSales.trendPct}% vs yesterday.`,
              prompt: "Why are sales up 18% today vs yesterday? What changed?",
            }}
            actions={[
              { label: "Send to my accountant", toast: "✓ Snapshot emailed to accountant" },
              { label: "Compare to last week", toast: "✓ Comparison opened in drawer" },
            ]}
          >
            <CardShell title="Today's sales" icon={ShoppingBag} tooltip="Net revenue from all completed orders today, after refunds." onClick={() => setDrill("todaysSales")}>
              <div className="text-3xl font-bold text-success">{formatEC(c.todaysSales.amount)}</div>
              <TrendPill delta={c.todaysSales.trendPct} compare="vs yesterday" />
              <div className="mt-3">
                <Sparkline values={c.todaysSales.sparkline.map((p) => p.v)} className="w-full" height={36} />
              </div>
              <div className="mt-auto pt-3 text-xs text-muted-foreground">
                {c.todaysSales.orders} orders · avg {formatEC(c.todaysSales.avgTicket)} per ticket
              </div>
            </CardShell>
          </InsightCardMenu>

          {/* CARD 2 — Open tabs */}
          <InsightCardMenu
            cardTitle="Open tabs"
            emaContext={{
              cardTitle: "Open tabs",
              summary: `${c.openTabs.tableCount} tables open, ${formatEC(c.openTabs.total)} unpaid. Oldest: Table 7 at 1h 23min.`,
              prompt: "Which tables are running long and should I check on?",
            }}
            actions={[
              {
                label: "Close oldest tab",
                confirm: { title: "Close Table 7?", body: <>EC$210 · seated 1h 23min · server Maria.</>, cta: "Close & print" },
                toast: "✓ Tab closed, receipt printed",
              },
              { label: "Ping server", toast: "✓ Maria pinged on the floor" },
            ]}
          >
            <CardShell title="Open tabs" icon={Clock} tooltip="Tables seated with unpaid balances, live from POS." onClick={() => setDrill("openTabs")}>
              <div className="text-3xl font-bold">
                {c.openTabs.tableCount} <span className="text-base font-normal text-muted-foreground">tables ·</span>
                <span className="ml-1 text-success">{formatEC(c.openTabs.total)}</span>
              </div>
              <div className="text-xs text-warning">{c.openTabs.seatedOver45} seated &gt;45 min</div>
              <div className="mt-auto pt-3 text-xs text-muted-foreground">
                Oldest: Table {c.openTabs.oldest.table.replace("T.", "")} · {Math.floor(c.openTabs.oldest.minutes / 60)}h {c.openTabs.oldest.minutes % 60}min · {formatEC(c.openTabs.oldest.total)}
              </div>
            </CardShell>
          </InsightCardMenu>

          {/* CARD 3 — Outstanding invoices */}
          <InsightCardMenu
            cardTitle="Outstanding invoices"
            emaContext={{
              cardTitle: "Outstanding invoices",
              summary: `${formatEC(c.outstandingInvoices.total)} across ${c.outstandingInvoices.count} customers. ${c.outstandingInvoices.overdue} are overdue.`,
              prompt: "Who's at risk of non-payment? Draft tailored reminders for the top 3.",
            }}
            actions={[
              {
                label: "Send all reminders",
                confirm: {
                  title: "Send reminders?",
                  body: <>Send WhatsApp reminder to <b>8 customers</b> for <b>{formatEC(c.outstandingInvoices.total)} total</b>. 2 in 24h window will use template, 6 will reply directly.</>,
                  cta: "Send all",
                },
                toast: "✓ 8 reminders sent · 2 via template, 6 direct reply",
              },
              { label: "Mark batch paid", toast: "✓ Open the drawer to mark invoices paid" },
              { label: "Email chaser", toast: "✓ Email chaser sent to 8 customers" },
            ]}
          >
            <CardShell title="Outstanding invoices" icon={ReceiptText} tooltip="Total receivables from Odoo, grouped by aging bucket." onClick={() => setDrill("outstandingInvoices")}>
              <div className="text-3xl font-bold text-success">{formatEC(c.outstandingInvoices.total)}</div>
              <div className="text-xs text-muted-foreground">
                {c.outstandingInvoices.count} invoices · <span className="text-destructive">{c.outstandingInvoices.overdue} overdue</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-1.5">
                <BucketBar label="0–30 d" value={c.outstandingInvoices.buckets.d0_30} max={c.outstandingInvoices.total} color="bg-success" />
                <BucketBar label="30–60 d" value={c.outstandingInvoices.buckets.d30_60} max={c.outstandingInvoices.total} color="bg-warning" />
                <BucketBar label="60+ d" value={c.outstandingInvoices.buckets.d60p} max={c.outstandingInvoices.total} color="bg-destructive" />
              </div>
            </CardShell>
          </InsightCardMenu>

          {/* CARD 4 — Top customers */}
          <InsightCardMenu
            cardTitle="Top 5 customers"
            emaContext={{
              cardTitle: "Top customers (30d)",
              summary: "5 accounts drove 72% of revenue. Janelle, Marcus, Dr. A lead the pack.",
              prompt: "Draft a VIP appreciation message for the top 5 customers.",
            }}
            actions={[
              { label: "Send VIP appreciation", toast: "✓ VIP appreciation sent to 5 customers" },
              { label: "Export to CSV", toast: "✓ top-customers-30d.csv downloaded" },
              { label: "Create loyalty segment", toast: "✓ 'VIP regulars' segment created" },
            ]}
          >
            <CardShell title="Top 5 customers" icon={Users} tooltip="Highest-revenue accounts, last 30 days." onClick={() => setDrill("topCustomers")}>
              <ul className="space-y-1.5 text-sm">
                {c.topCustomers.slice(0, 5).map((cust) => (
                  <li key={cust.name} className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-semibold">
                        {cust.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                      <span className="truncate text-xs">{cust.name}</span>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-success">{formatEC(cust.spent)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-3 text-xs text-muted-foreground">
                5 accounts · {formatEC(c.topCustomers.slice(0, 5).reduce((s, x) => s + x.spent, 0))} · 72% of total
              </div>
            </CardShell>
          </InsightCardMenu>

          {/* CARD 5 — Menu performance */}
          <InsightCardMenu
            cardTitle="Menu performance"
            emaContext={{
              cardTitle: "Menu performance",
              summary: "Tasting Menu, Lobster Thermidor and Jerk Lamb dominate. Caesar Salad, Grilled Veg and Quinoa Bowl are flatlining.",
              prompt: "Should I 86 the bottom 3 items this week?",
            }}
            actions={[
              {
                label: "86 bottom 3",
                confirm: { title: "Remove these 3 items?", body: <>Caesar Salad, Grilled Vegetables, Quinoa Bowl will be 86'd in Odoo. Agents will stop offering them.</>, cta: "86 in Odoo" },
                toast: "✓ 3 items 86'd · Agents will stop offering them",
              },
              { label: "Feature top 3 in WA campaign", toast: "✓ Campaign drafted with top 3" },
              { label: "Update menu in Odoo", toast: "✓ Menu sync queued in Odoo" },
            ]}
          >
            <CardShell title="Menu performance" icon={UtensilsCrossed} tooltip="Best & worst-selling items in the last 30 days." onClick={() => setDrill("menuPerformance")}>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="mb-1 font-semibold text-success">✅ Top 3</div>
                  <ul className="space-y-0.5 text-muted-foreground">
                    {c.menuPerformance.best.map((m) => (
                      <li key={m.name} className="flex justify-between"><span>{m.name}</span><span>{m.orders}</span></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="mb-1 font-semibold text-warning">⚠ Bottom 3</div>
                  <ul className="space-y-0.5 text-muted-foreground">
                    {c.menuPerformance.worst.map((m) => (
                      <li key={m.name} className="flex justify-between"><span>{m.name}</span><span>{m.orders}</span></li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-auto pt-3 text-xs text-muted-foreground">Consider 86-ing bottom 3 this week</div>
            </CardShell>
          </InsightCardMenu>

          {/* CARD 6 — Low stock */}
          <InsightCardMenu
            cardTitle="Low stock"
            emaContext={{
              cardTitle: "Low stock alerts",
              summary: "4 SKUs below reorder threshold — 2 critical (rum punch, bread flour).",
              prompt: "Draft POs for the 4 low-stock items based on supplier mapping.",
            }}
            actions={[
              {
                label: "Send PO to suppliers",
                confirm: {
                  title: "Draft 4 purchase orders?",
                  body: <>Caribbean Spirits · Roseau Wholesale · Bayside Seafood · Mountain Dairy. POs will land on /dashboard/outbound for approval.</>,
                  cta: "Draft POs",
                },
                toast: "✓ 4 POs drafted, awaiting approval on /dashboard/outbound",
              },
              { label: "Mark restocked", toast: "✓ Items marked restocked" },
              { label: "Update thresholds", toast: "✓ Open inventory drawer to adjust" },
            ]}
          >
            <CardShell title="Low stock" icon={PackageX} tooltip="SKUs at or below the reorder threshold in Odoo." onClick={() => setDrill("lowStock")}>
              <div className="text-3xl font-bold text-destructive">
                {c.lowStock.length} <span className="text-base font-normal text-muted-foreground">items low</span>
              </div>
              <ul className="mt-2 space-y-1 text-xs">
                {c.lowStock.map((s) => (
                  <li key={s.name} className="flex items-center justify-between">
                    <span className="truncate">
                      <span className="mr-1">{s.severity === "red" ? "🔴" : "🟡"}</span>
                      {s.name}
                    </span>
                    <span className="ml-2 shrink-0 text-muted-foreground">{s.qty} {s.unit}</span>
                  </li>
                ))}
              </ul>
            </CardShell>
          </InsightCardMenu>

          {/* CARD 7 — Staff tips */}
          <InsightCardMenu
            cardTitle="Staff tips"
            emaContext={{
              cardTitle: "Staff tips today",
              summary: `Pool of ${formatEC(c.staffTips.pool)} across ${c.staffTips.servers.length} servers. Up ${formatEC(c.staffTips.diffVsLastWeek)} vs same day last week.`,
              prompt: "Distribute today's tip pool evenly to the 5 servers.",
            }}
            actions={[
              {
                label: "Distribute now",
                confirm: { title: "Distribute today's tip pool?", body: <>{formatEC(c.staffTips.pool)} split evenly across {c.staffTips.servers.length} servers.</>, cta: "Distribute" },
                toast: "✓ Tips distributed · payslips queued",
              },
              { label: "Export payslip", toast: "✓ Payslip CSV downloaded" },
              { label: "Report dispute", toast: "✓ Dispute logged, manager notified" },
            ]}
          >
            <CardShell title="Staff tips" icon={HandCoins} tooltip="Today's pooled tips before distribution." onClick={() => setDrill("staffTips")}>
              <div className="text-3xl font-bold text-success">{formatEC(c.staffTips.pool)}</div>
              <div className="text-xs text-success">+{formatEC(c.staffTips.diffVsLastWeek)} vs same day last week</div>
              <div className="mt-auto pt-3 text-xs text-muted-foreground">
                {c.staffTips.servers.length} servers · {formatEC(Math.round(c.staffTips.pool / c.staffTips.servers.length))} avg per staff
              </div>
            </CardShell>
          </InsightCardMenu>

          {/* CARD 8 — Cash + bank */}
          <InsightCardMenu
            cardTitle="Cash + bank"
            emaContext={{
              cardTitle: "Cash + bank balance",
              summary: `${formatEC(c.cashBalance.total)} combined. Payroll of ${formatEC(c.cashBalance.payrollAmount)} due in ${c.cashBalance.payrollDueDays} days.`,
              prompt: "Will I have enough to cover payroll + supplier invoices this week?",
            }}
            actions={[
              {
                label: "Pay supplier batch",
                confirm: { title: "Pay supplier batch?", body: <>{formatEC(c.cashBalance.supplierDue)} across pending supplier invoices via Fiserv.</>, cta: "Pay now" },
                toast: "✓ Supplier batch paid · Fiserv reference attached",
              },
              { label: "Reconcile Odoo", toast: "✓ Reconciliation triggered in Odoo" },
              { label: "Export statement", toast: "✓ Statement exported as PDF" },
            ]}
          >
            <CardShell title="Cash + bank" icon={Wallet} tooltip="Combined cash drawer + connected bank accounts." onClick={() => setDrill("cashBalance")}>
              <div className="text-3xl font-bold text-success">{formatEC(c.cashBalance.total)}</div>
              <div className="text-xs text-muted-foreground">
                Cash {formatEC(c.cashBalance.cashOnHand)} · Bank {formatEC(c.cashBalance.bank)}
              </div>
              <div className="mt-3">
                <Sparkline values={c.cashBalance.sparkline.map((p) => p.v)} className="w-full" height={32} />
              </div>
              <div className="mt-auto pt-3 text-xs text-muted-foreground">
                Payroll in {c.cashBalance.payrollDueDays}d: {formatEC(c.cashBalance.payrollAmount)} · Suppliers due: {formatEC(c.cashBalance.supplierDue)}
              </div>
            </CardShell>
          </InsightCardMenu>
          </div>

          {/* Soft paywall overlay */}
          {locked && (
            <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
              <div className="max-w-md rounded-2xl border border-violet-500/30 bg-card/95 p-6 text-center shadow-2xl backdrop-blur">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/15 text-violet-500">
                  <Database className="h-6 w-6" />
                </div>
                <h2 className="font-display text-lg font-bold">Connect Odoo to unlock Insights</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Today's sales, open tabs, outstanding invoices, low stock,
                  staff tips and cash balance — all live, all in one pane.
                </p>
                <div className="mt-5 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
                  <Button asChild className="gap-1.5">
                    <Link to="/onboarding" search={{ step: 6 }}>
                      <Database className="h-4 w-4" />
                      Connect Odoo
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link to="/dashboard/integrations">View integrations</Link>
                  </Button>
                </div>
                <p className="mt-3 text-[11px] text-muted-foreground">
                  ~2 min · We only read what's needed.
                </p>
              </div>
            </div>
          )}
        </div>

        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ChevronRight className="h-3 w-3" />
          Tip: right-click any card to act on it without opening the drawer.
        </p>
      </div>

      {/* Drill-down sheet */}
      <Sheet open={!!drill} onOpenChange={(o) => !o && setDrill(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
          {drill && (
            <>
              <SheetHeader>
                <SheetTitle>{DRILL_TITLES[drill]}</SheetTitle>
                <SheetDescription>Live Odoo data · click any row for inline actions.</SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <DrillContent which={drill} />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
}

"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
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
  BedDouble,
  Sparkles,
  CalendarCheck,
  CalendarX,
  Stethoscope,
  Pill,
  UserPlus,
  Briefcase,
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
import InsightCardMenu from "@/components/dashboard/InsightCardMenu";
import Sparkline from "@/components/dashboard/Sparkline";
import { insightsByVertical, type InsightsVertical } from "@/lib/mock-data";
import { useOdooConnection } from "@/hooks/use-odoo-connection";

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
// Vertical config — labels, icons, tooltips, and helpers per vertical
// ============================================================================

type VerticalSlug = "Restaurants" | "Hotels" | "Clinics";
const SLUG_TO_KEY: Record<VerticalSlug, InsightsVertical> = {
  Restaurants: "restaurants",
  Hotels: "hotels",
  Clinics: "clinics",
};

type CardCopy = {
  // Card titles
  todaysSales: string; // KPI 1
  openTabs: string;    // KPI 2
  topCustomers: string;
  menuPerformance: string;
  lowStock: string;
  staffTips: string;
  // KPI tooltips
  todaysSalesTip: string;
  openTabsTip: string;
  outstandingInvoicesTip: string;
  topCustomersTip: string;
  menuPerformanceTip: string;
  lowStockTip: string;
  staffTipsTip: string;
  cashBalanceTip: string;
  // Drill titles
  drillTitles: Record<DrillKey, string>;
  // Card-specific micro-copy
  ordersWord: string;       // "orders" | "stays" | "appointments"
  avgTicketWord: string;    // "per ticket" | "per night" | "per consult"
  openTabsRowLabel: (id: string) => string; // Table 7 / RES-8842 / APT-3360
  openTabsRowSubtitle: (server: string, minutes: number) => string;
  openTabsBigUnitLabel: string; // "tables ·" | "arrivals ·" | "at-risk slots ·"
  openTabsOldestLabel: string;  // "Oldest:" | "Latest arrival:" | "Highest-risk slot:"
  openTabsSeatedOverLabel: string; // "seated >45 min" etc.
  closeTabAction: string;   // "Close tab" | "Check in" | "Confirm slot"
  closeTabToast: (id: string) => string;
  staffTipsTotalLabel: string;     // "Pool today" | "Tips pool today" | "Billable today"
  staffTipsAvgLabel: string;
  staffTipsAvg30Label: string;
  reorderToast: (name: string) => string;
  // Icons
  icons: {
    todaysSales: typeof TrendingUp;
    openTabs: typeof TrendingUp;
    topCustomers: typeof TrendingUp;
    menuPerformance: typeof TrendingUp;
    lowStock: typeof TrendingUp;
    staffTips: typeof TrendingUp;
  };
};

const RESTAURANT_COPY: CardCopy = {
  todaysSales: "Today's sales",
  openTabs: "Open tabs",
  topCustomers: "Top 5 customers",
  menuPerformance: "Menu performance",
  lowStock: "Low stock",
  staffTips: "Staff tips",
  todaysSalesTip: "Net revenue from all completed orders today, after refunds.",
  openTabsTip: "Tables seated with unpaid balances, live from POS.",
  outstandingInvoicesTip: "Total receivables from Odoo, grouped by aging bucket.",
  topCustomersTip: "Highest-revenue accounts, last 30 days.",
  menuPerformanceTip: "Best & worst-selling items in the last 30 days.",
  lowStockTip: "SKUs at or below the reorder threshold in Odoo.",
  staffTipsTip: "Today's pooled tips before distribution.",
  cashBalanceTip: "Combined cash drawer + connected bank accounts.",
  drillTitles: {
    todaysSales: "Today's sales · full breakdown",
    openTabs: "Open tabs · live tables",
    outstandingInvoices: "Outstanding invoices · aging",
    topCustomers: "Top customers · last 30 days",
    menuPerformance: "Menu performance",
    lowStock: "Low-stock alerts · inventory",
    staffTips: "Staff tips · today",
    cashBalance: "Cash + bank · transactions",
  },
  ordersWord: "orders",
  avgTicketWord: "per ticket",
  openTabsRowLabel: (id) => `Table ${id.replace("T.", "")}`,
  openTabsRowSubtitle: (server, minutes) => `Server: ${server} · seated ${minutes} min`,
  openTabsBigUnitLabel: "tables ·",
  openTabsOldestLabel: "Oldest:",
  openTabsSeatedOverLabel: "seated >45 min",
  closeTabAction: "Close tab",
  closeTabToast: (id) => `Tab ${id} closed`,
  staffTipsTotalLabel: "Pool today",
  staffTipsAvgLabel: "Avg / staff",
  staffTipsAvg30Label: "30-day avg",
  reorderToast: (n) => `PO drafted for ${n}`,
  icons: {
    todaysSales: ShoppingBag,
    openTabs: Clock,
    topCustomers: Users,
    menuPerformance: UtensilsCrossed,
    lowStock: PackageX,
    staffTips: HandCoins,
  },
};

const HOTEL_COPY: CardCopy = {
  todaysSales: "RevPAR today",
  openTabs: "Arrivals & front desk",
  topCustomers: "Top 5 guests",
  menuPerformance: "Excursion & room performance",
  lowStock: "Housekeeping low stock",
  staffTips: "Concierge & staff tips",
  todaysSalesTip: "Revenue per available room today (occupancy × ADR), live from Odoo + PMS.",
  openTabsTip: "Arrivals expected today and guests still awaiting check-in.",
  outstandingInvoicesTip: "Open guest folios + group invoices, grouped by aging bucket.",
  topCustomersTip: "Highest-folio guests, last 30 days.",
  menuPerformanceTip: "Best & worst-performing room types and excursions, last 30 days.",
  lowStockTip: "Linens, mini-bar, and amenity SKUs at or below the reorder threshold.",
  staffTipsTip: "Today's pooled tips across concierge, bell and housekeeping.",
  cashBalanceTip: "Combined cash drawer + connected bank accounts.",
  drillTitles: {
    todaysSales: "RevPAR today · breakdown",
    openTabs: "Arrivals & departures · live front desk",
    outstandingInvoices: "Open folios · aging",
    topCustomers: "Top guests · last 30 days",
    menuPerformance: "Excursion & room performance",
    lowStock: "Housekeeping & amenity stock",
    staffTips: "Concierge / bell / housekeeping tips · today",
    cashBalance: "Cash + bank · transactions",
  },
  ordersWord: "stays",
  avgTicketWord: "per night",
  openTabsRowLabel: (id) => id,
  openTabsRowSubtitle: (server, minutes) => `${server} · waiting ${minutes} min`,
  openTabsBigUnitLabel: "arrivals ·",
  openTabsOldestLabel: "Latest arrival:",
  openTabsSeatedOverLabel: "awaiting check-in >45 min",
  closeTabAction: "Check in",
  closeTabToast: (id) => `${id} checked in`,
  staffTipsTotalLabel: "Tips pool today",
  staffTipsAvgLabel: "Avg / staff",
  staffTipsAvg30Label: "30-day avg",
  reorderToast: (n) => `PO drafted for ${n}`,
  icons: {
    todaysSales: BedDouble,
    openTabs: CalendarCheck,
    topCustomers: Users,
    menuPerformance: Sparkles,
    lowStock: PackageX,
    staffTips: HandCoins,
  },
};

const CLINIC_COPY: CardCopy = {
  todaysSales: "Appointments today",
  openTabs: "No-show risk",
  topCustomers: "Top 5 patients",
  menuPerformance: "Service performance",
  lowStock: "Supplies low",
  staffTips: "Provider hours billed",
  todaysSalesTip: "Total billed across appointments today, including telehealth.",
  openTabsTip: "Today's slots flagged as at-risk based on confirmation status.",
  outstandingInvoicesTip: "Outstanding co-pays and pending insurance claims, by aging bucket.",
  topCustomersTip: "Highest-billing patients, last 30 days.",
  menuPerformanceTip: "Best & worst-billing services, last 30 days.",
  lowStockTip: "Vaccines, PPE and lab supplies at or below the reorder threshold.",
  staffTipsTip: "Today's billable provider + nurse hours.",
  cashBalanceTip: "Combined cash drawer + connected bank accounts.",
  drillTitles: {
    todaysSales: "Appointments today · breakdown",
    openTabs: "No-show risk · today's at-risk slots",
    outstandingInvoices: "Co-pays & insurance claims · aging",
    topCustomers: "Top patients · last 30 days",
    menuPerformance: "Service performance",
    lowStock: "Low supplies · inventory",
    staffTips: "Provider hours billed · today",
    cashBalance: "Cash + bank · transactions",
  },
  ordersWord: "appointments",
  avgTicketWord: "per consult",
  openTabsRowLabel: (id) => id,
  openTabsRowSubtitle: (server, minutes) => `${server} · ${minutes}min until slot`,
  openTabsBigUnitLabel: "at-risk slots ·",
  openTabsOldestLabel: "Highest-risk slot:",
  openTabsSeatedOverLabel: "unconfirmed within 4h of slot",
  closeTabAction: "Confirm slot",
  closeTabToast: (id) => `${id} confirmed`,
  staffTipsTotalLabel: "Billable today",
  staffTipsAvgLabel: "Avg / provider",
  staffTipsAvg30Label: "30-day avg",
  reorderToast: (n) => `PO drafted for ${n}`,
  icons: {
    todaysSales: Stethoscope,
    openTabs: CalendarX,
    topCustomers: UserPlus,
    menuPerformance: Briefcase,
    lowStock: Pill,
    staffTips: HandCoins,
  },
};

const COPY_BY_VERTICAL: Record<VerticalSlug, CardCopy> = {
  Restaurants: RESTAURANT_COPY,
  Hotels: HOTEL_COPY,
  Clinics: CLINIC_COPY,
};

// ============================================================================
// Drill-down Sheets
// ============================================================================

type CardsBundle = (typeof insightsByVertical)["restaurants"]["cards"];

function DrillContent({ which, data, copy }: { which: DrillKey; data: CardsBundle; copy: CardCopy }) {
  // Maps card 1/2 to the correct vertical key in raw data; restaurant cards are the canonical names.
  // Hotels and clinics keep the SAME drill keys but the underlying data lives at different keys —
  // we resolve them via accessors below.
  const card1 = (data as { todaysSales?: typeof data.todaysSales; revpar?: typeof data.todaysSales; appointments?: typeof data.todaysSales }).todaysSales
    ?? (data as { revpar?: typeof data.todaysSales }).revpar
    ?? (data as { appointments?: typeof data.todaysSales }).appointments
    ?? data.todaysSales;
  const card2 = (data as { openTabs?: typeof data.openTabs; frontDesk?: typeof data.openTabs; noShows?: typeof data.openTabs }).openTabs
    ?? (data as { frontDesk?: typeof data.openTabs }).frontDesk
    ?? (data as { noShows?: typeof data.openTabs }).noShows
    ?? data.openTabs;

  if (which === "todaysSales") {
    const c = card1;
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Revenue" value={formatEC(c.amount)} />
          <Stat label={copy.ordersWord.charAt(0).toUpperCase() + copy.ordersWord.slice(1)} value={c.orders.toString()} />
          <Stat label={`Avg ${copy.avgTicketWord.replace("per ", "")}`} value={formatEC(c.avgTicket)} />
        </div>
        <section>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hourly</h4>
          <div className="rounded-lg border border-border bg-card/40 p-4">
            <Sparkline values={c.hourly.map((h) => h.v)} variant="bars" height={64} className="w-full" />
            <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
              {c.hourly.map((h) => <span key={h.h}>{h.h}</span>)}
            </div>
          </div>
        </section>
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Top {copy.ordersWord}</h4>
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
    const c = card2;
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Stat label={copy.openTabs} value={`${c.tableCount}`} />
          <Stat label="Combined value" value={formatEC(c.total)} />
        </div>
        <ul className="divide-y divide-border rounded-lg border border-border bg-card/40">
          {c.tabs.map((t) => (
            <li key={t.table} className="flex items-center justify-between px-3 py-3 text-sm">
              <div>
                <div className="font-medium">{copy.openTabsRowLabel(t.table)}</div>
                <div className="text-xs text-muted-foreground">{copy.openTabsRowSubtitle(t.server, t.minutes)}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">{formatEC(t.total)}</span>
                <Button size="sm" variant="outline" onClick={() => toast.success(copy.closeTabToast(t.table))}>
                  {copy.closeTabAction}
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
                <span className="text-muted-foreground">{m.orders} · {formatEC(m.revenue)}</span>
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
                <span className="text-muted-foreground">{m.orders} · {formatEC(m.revenue)}</span>
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
            <Button size="sm" variant="outline" onClick={() => toast.success(copy.reorderToast(s.name))}>
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
          <Stat label={copy.staffTipsTotalLabel} value={formatEC(c.pool)} />
          <Stat label={copy.staffTipsAvgLabel} value={formatEC(Math.round(c.pool / c.servers.length))} />
          <Stat label={copy.staffTipsAvg30Label} value={formatEC(c.avg30d)} />
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

/**
 * Resolve the canonical card data regardless of vertical-specific keys.
 * Hotel/clinic mock data uses revpar/appointments and frontDesk/noShows
 * but the rest (outstandingInvoices, topCustomers, menuPerformance, lowStock,
 * staffTips, cashBalance) match the restaurant shape exactly.
 */
function resolveCards(raw: (typeof insightsByVertical)[InsightsVertical]["cards"]): CardsBundle {
  const r = raw as Record<string, unknown>;
  const card1 = (r.todaysSales ?? r.revpar ?? r.appointments) as CardsBundle["todaysSales"];
  const card2 = (r.openTabs ?? r.frontDesk ?? r.noShows) as CardsBundle["openTabs"];
  return {
    todaysSales: card1,
    openTabs: card2,
    outstandingInvoices: r.outstandingInvoices as CardsBundle["outstandingInvoices"],
    topCustomers: r.topCustomers as CardsBundle["topCustomers"],
    menuPerformance: r.menuPerformance as CardsBundle["menuPerformance"],
    lowStock: r.lowStock as CardsBundle["lowStock"],
    staffTips: r.staffTips as CardsBundle["staffTips"],
    cashBalance: r.cashBalance as CardsBundle["cashBalance"],
  };
}

export default function InsightsPage() {
  const [drill, setDrill] = useState<DrillKey | null>(null);
  const [vertical, setVertical] = useState<VerticalSlug>("Restaurants");
  const verticalKey = SLUG_TO_KEY[vertical];
  const dataset = insightsByVertical[verticalKey];
  const [synced, setSynced] = useState(dataset.lastSyncedMinutesAgo);
  const [refreshing, setRefreshing] = useState(false);
  const { connected: odooConnected } = useOdooConnection();
  const [paywallDismissed, setPaywallDismissed] = useState(false);

  const copy = COPY_BY_VERTICAL[vertical];
  const c = useMemo(() => resolveCards(dataset.cards), [dataset]);

  // Tick the "synced X min ago" pill
  useEffect(() => {
    const t = setInterval(() => setSynced((s) => s + 1), 60_000);
    return () => clearInterval(t);
  }, []);

  // Reset sync timer when vertical changes
  useEffect(() => {
    setSynced(dataset.lastSyncedMinutesAgo);
  }, [dataset]);

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
    toast("Re-testing Odoo connection…");
    setTimeout(() => {
      toast("Still disconnected — connect from setup.");
    }, 900);
  };

  const locked = odooConnected === false && !paywallDismissed;
  const blurred = odooConnected === false;

  // Vertical-specific Ema summaries
  const card1Summary =
    vertical === "Restaurants"
      ? `${formatEC(c.todaysSales.amount)} across ${c.todaysSales.orders} orders, +${c.todaysSales.trendPct}% vs yesterday.`
      : vertical === "Hotels"
      ? `${formatEC(c.todaysSales.amount)} RevPAR · ${c.todaysSales.orders} stays · +${c.todaysSales.trendPct}% vs yesterday.`
      : `${formatEC(c.todaysSales.amount)} billed across ${c.todaysSales.orders} appointments, +${c.todaysSales.trendPct}% vs yesterday.`;

  const card1Prompt =
    vertical === "Restaurants"
      ? "Why are sales up 18% today vs yesterday? What changed?"
      : vertical === "Hotels"
      ? "Why is RevPAR up vs yesterday? Which room types and channels drove it?"
      : "Why are billed appointments up today? Which services and providers led it?";

  const card2EmaTitle = vertical === "Restaurants" ? "Open tabs" : vertical === "Hotels" ? "Arrivals & front desk" : "No-show risk";

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
                <DropdownMenuItem onSelect={() => setVertical("Hotels")}>
                  Hotels
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setVertical("Clinics")}>
                  Clinics
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

        {/* 8-card grid */}
        <div className="relative">
          <div
            className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 transition-all duration-300 ${
              blurred ? "pointer-events-none select-none blur-sm grayscale" : ""
            }`}
            aria-hidden={blurred}
          >

          {/* CARD 1 — Sales / RevPAR / Appointments */}
          <InsightCardMenu
            cardTitle={copy.todaysSales}
            emaContext={{
              cardTitle: copy.todaysSales,
              summary: card1Summary,
              prompt: card1Prompt,
            }}
            actions={[
              { label: "Send to my accountant", toast: "✓ Snapshot emailed to accountant" },
              { label: "Compare to last week", toast: "✓ Comparison opened in drawer" },
            ]}
          >
            <CardShell title={copy.todaysSales} icon={copy.icons.todaysSales} tooltip={copy.todaysSalesTip} onClick={() => setDrill("todaysSales")}>
              <div className="text-3xl font-bold text-success">{formatEC(c.todaysSales.amount)}</div>
              <TrendPill delta={c.todaysSales.trendPct} compare="vs yesterday" />
              <div className="mt-3">
                <Sparkline values={c.todaysSales.sparkline.map((p) => p.v)} className="w-full" height={36} />
              </div>
              <div className="mt-auto pt-3 text-xs text-muted-foreground">
                {c.todaysSales.orders} {copy.ordersWord} · avg {formatEC(c.todaysSales.avgTicket)} {copy.avgTicketWord}
              </div>
            </CardShell>
          </InsightCardMenu>

          {/* CARD 2 — Open tabs / Arrivals / No-show risk */}
          <InsightCardMenu
            cardTitle={copy.openTabs}
            emaContext={{
              cardTitle: card2EmaTitle,
              summary:
                vertical === "Restaurants"
                  ? `${c.openTabs.tableCount} tables open, ${formatEC(c.openTabs.total)} unpaid. Oldest seated 1h 23min.`
                  : vertical === "Hotels"
                  ? `${c.openTabs.tableCount} arrivals expected today, ${c.openTabs.seatedOver45} still awaiting check-in.`
                  : `${c.openTabs.tableCount} at-risk slots today · ${formatEC(c.openTabs.total)} potential revenue at risk.`,
              prompt:
                vertical === "Restaurants"
                  ? "Which tables are running long and should I check on?"
                  : vertical === "Hotels"
                  ? "Which arrivals are running late — should I message them?"
                  : "Which slots are highest-risk for no-show — send confirmations now?",
            }}
            actions={[
              {
                label:
                  vertical === "Restaurants"
                    ? "Close oldest tab"
                    : vertical === "Hotels"
                    ? "Check in latest arrival"
                    : "Send confirm to highest-risk",
                toast:
                  vertical === "Restaurants"
                    ? "✓ Tab closed, receipt printed"
                    : vertical === "Hotels"
                    ? "✓ Guest checked in"
                    : "✓ Confirmation WhatsApp sent",
              },
              {
                label: vertical === "Restaurants" ? "Ping server" : vertical === "Hotels" ? "Page concierge" : "Page nurse",
                toast: "✓ Ping sent",
              },
            ]}
          >
            <CardShell title={copy.openTabs} icon={copy.icons.openTabs} tooltip={copy.openTabsTip} onClick={() => setDrill("openTabs")}>
              <div className="text-3xl font-bold">
                {c.openTabs.tableCount} <span className="text-base font-normal text-muted-foreground">{copy.openTabsBigUnitLabel}</span>
                <span className="ml-1 text-success">{formatEC(c.openTabs.total)}</span>
              </div>
              <div className="text-xs text-warning">{c.openTabs.seatedOver45} {copy.openTabsSeatedOverLabel}</div>
              <div className="mt-auto pt-3 text-xs text-muted-foreground">
                {copy.openTabsOldestLabel} {copy.openTabsRowLabel(c.openTabs.oldest.table)} · {Math.floor(c.openTabs.oldest.minutes / 60)}h {c.openTabs.oldest.minutes % 60}min · {formatEC(c.openTabs.oldest.total)}
              </div>
            </CardShell>
          </InsightCardMenu>

          {/* CARD 3 — Outstanding invoices / folios / co-pays */}
          <InsightCardMenu
            cardTitle="Outstanding invoices"
            emaContext={{
              cardTitle: vertical === "Hotels" ? "Open folios" : vertical === "Clinics" ? "Co-pays & claims" : "Outstanding invoices",
              summary: `${formatEC(c.outstandingInvoices.total)} across ${c.outstandingInvoices.count} ${vertical === "Clinics" ? "patients/claims" : vertical === "Hotels" ? "folios" : "customers"}. ${c.outstandingInvoices.overdue} are overdue.`,
              prompt: "Who's at risk of non-payment? Draft tailored reminders for the top 3.",
            }}
            actions={[
              { label: "Send all reminders", toast: `✓ ${c.outstandingInvoices.count} reminders sent` },
              { label: "Mark batch paid", toast: "✓ Open the drawer to mark items paid" },
              { label: "Email chaser", toast: `✓ Email chaser sent to ${c.outstandingInvoices.count}` },
            ]}
          >
            <CardShell title={vertical === "Hotels" ? "Open folios" : vertical === "Clinics" ? "Co-pays & claims" : "Outstanding invoices"} icon={ReceiptText} tooltip={copy.outstandingInvoicesTip} onClick={() => setDrill("outstandingInvoices")}>
              <div className="text-3xl font-bold text-success">{formatEC(c.outstandingInvoices.total)}</div>
              <div className="text-xs text-muted-foreground">
                {c.outstandingInvoices.count} {vertical === "Hotels" ? "folios" : vertical === "Clinics" ? "claims" : "invoices"} · <span className="text-destructive">{c.outstandingInvoices.overdue} overdue</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-1.5">
                <BucketBar label="0–30 d" value={c.outstandingInvoices.buckets.d0_30} max={c.outstandingInvoices.total} color="bg-success" />
                <BucketBar label="30–60 d" value={c.outstandingInvoices.buckets.d30_60} max={c.outstandingInvoices.total} color="bg-warning" />
                <BucketBar label="60+ d" value={c.outstandingInvoices.buckets.d60p} max={c.outstandingInvoices.total} color="bg-destructive" />
              </div>
            </CardShell>
          </InsightCardMenu>

          {/* CARD 4 — Top customers / guests / patients */}
          <InsightCardMenu
            cardTitle={copy.topCustomers}
            emaContext={{
              cardTitle: copy.topCustomers,
              summary: `${c.topCustomers.slice(0, 5).length} accounts drove the bulk of revenue. ${c.topCustomers.slice(0, 3).map((x) => x.name.split(" ")[0]).join(", ")} lead.`,
              prompt: vertical === "Clinics" ? "Draft a wellness check-in to the top 5 patients." : `Draft a VIP appreciation message for the top 5 ${vertical === "Hotels" ? "guests" : "customers"}.`,
            }}
            actions={[
              { label: vertical === "Clinics" ? "Send wellness check-in" : "Send VIP appreciation", toast: "✓ Message sent to 5" },
              { label: "Export to CSV", toast: "✓ CSV downloaded" },
              { label: vertical === "Clinics" ? "Create care segment" : "Create loyalty segment", toast: "✓ Segment created" },
            ]}
          >
            <CardShell title={copy.topCustomers} icon={copy.icons.topCustomers} tooltip={copy.topCustomersTip} onClick={() => setDrill("topCustomers")}>
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
                5 accounts · {formatEC(c.topCustomers.slice(0, 5).reduce((s, x) => s + x.spent, 0))}
              </div>
            </CardShell>
          </InsightCardMenu>

          {/* CARD 5 — Menu / Excursion / Service performance */}
          <InsightCardMenu
            cardTitle={copy.menuPerformance}
            emaContext={{
              cardTitle: copy.menuPerformance,
              summary: `Top: ${c.menuPerformance.best.map((m) => m.name).join(", ")}. Underperforming: ${c.menuPerformance.worst.map((m) => m.name).join(", ")}.`,
              prompt:
                vertical === "Restaurants"
                  ? "Should I 86 the bottom 3 items this week?"
                  : vertical === "Hotels"
                  ? "Should I bundle the underperforming room types into a weekend offer?"
                  : "Should I sunset the bottom 3 services or reprice them?",
            }}
            actions={[
              {
                label:
                  vertical === "Restaurants"
                    ? "86 bottom 3"
                    : vertical === "Hotels"
                    ? "Bundle underperformers"
                    : "Reprice bottom 3",
                toast: "✓ Action queued in Odoo",
              },
              { label: "Feature top 3 in WA campaign", toast: "✓ Campaign drafted with top 3" },
              { label: "Update catalog in Odoo", toast: "✓ Sync queued in Odoo" },
            ]}
          >
            <CardShell title={copy.menuPerformance} icon={copy.icons.menuPerformance} tooltip={copy.menuPerformanceTip} onClick={() => setDrill("menuPerformance")}>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="mb-1 font-semibold text-success">✅ Top 3</div>
                  <ul className="space-y-0.5 text-muted-foreground">
                    {c.menuPerformance.best.map((m) => (
                      <li key={m.name} className="flex justify-between"><span className="truncate pr-2">{m.name}</span><span>{m.orders}</span></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="mb-1 font-semibold text-warning">⚠ Bottom 3</div>
                  <ul className="space-y-0.5 text-muted-foreground">
                    {c.menuPerformance.worst.map((m) => (
                      <li key={m.name} className="flex justify-between"><span className="truncate pr-2">{m.name}</span><span>{m.orders}</span></li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardShell>
          </InsightCardMenu>

          {/* CARD 6 — Low stock / housekeeping / supplies */}
          <InsightCardMenu
            cardTitle={copy.lowStock}
            emaContext={{
              cardTitle: copy.lowStock,
              summary: `${c.lowStock.length} SKUs below reorder threshold — ${c.lowStock.filter((s) => s.severity === "red").length} critical.`,
              prompt: `Draft POs for the ${c.lowStock.length} low-stock items based on supplier mapping.`,
            }}
            actions={[
              { label: "Send PO to suppliers", toast: `✓ ${c.lowStock.length} POs drafted, awaiting approval on /dashboard/outbound` },
              { label: "Mark restocked", toast: "✓ Items marked restocked" },
              { label: "Update thresholds", toast: "✓ Open inventory drawer to adjust" },
            ]}
          >
            <CardShell title={copy.lowStock} icon={copy.icons.lowStock} tooltip={copy.lowStockTip} onClick={() => setDrill("lowStock")}>
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

          {/* CARD 7 — Staff tips / concierge tips / provider hours */}
          <InsightCardMenu
            cardTitle={copy.staffTips}
            emaContext={{
              cardTitle: copy.staffTips,
              summary: `${formatEC(c.staffTips.pool)} across ${c.staffTips.servers.length}. Up ${formatEC(c.staffTips.diffVsLastWeek)} vs same day last week.`,
              prompt:
                vertical === "Clinics"
                  ? "Summarize provider utilization today and flag anyone over capacity."
                  : `Distribute today's pool evenly to the ${c.staffTips.servers.length} ${vertical === "Hotels" ? "staff" : "servers"}.`,
            }}
            actions={[
              {
                label: vertical === "Clinics" ? "Approve hours" : "Distribute now",
                toast: vertical === "Clinics" ? "✓ Hours approved · payroll queued" : "✓ Tips distributed · payslips queued",
              },
              { label: "Export payslip", toast: "✓ Payslip CSV downloaded" },
              { label: vertical === "Clinics" ? "Flag overtime" : "Report dispute", toast: "✓ Logged, manager notified" },
            ]}
          >
            <CardShell title={copy.staffTips} icon={copy.icons.staffTips} tooltip={copy.staffTipsTip} onClick={() => setDrill("staffTips")}>
              <div className="text-3xl font-bold text-success">{formatEC(c.staffTips.pool)}</div>
              <div className="text-xs text-success">+{formatEC(c.staffTips.diffVsLastWeek)} vs same day last week</div>
              <div className="mt-auto pt-3 text-xs text-muted-foreground">
                {c.staffTips.servers.length} {vertical === "Clinics" ? "providers" : vertical === "Hotels" ? "staff" : "servers"} · {formatEC(Math.round(c.staffTips.pool / c.staffTips.servers.length))} avg
              </div>
            </CardShell>
          </InsightCardMenu>

          {/* CARD 8 — Cash + bank (universal) */}
          <InsightCardMenu
            cardTitle="Cash + bank"
            emaContext={{
              cardTitle: "Cash + bank balance",
              summary: `${formatEC(c.cashBalance.total)} combined. Payroll of ${formatEC(c.cashBalance.payrollAmount)} due in ${c.cashBalance.payrollDueDays} days.`,
              prompt: "Will I have enough to cover payroll + supplier invoices this week?",
            }}
            actions={[
              { label: "Pay supplier batch", toast: "✓ Supplier batch paid · Fiserv reference attached" },
              { label: "Reconcile Odoo", toast: "✓ Reconciliation triggered in Odoo" },
              { label: "Export statement", toast: "✓ Statement exported as PDF" },
            ]}
          >
            <CardShell title="Cash + bank" icon={Wallet} tooltip={copy.cashBalanceTip} onClick={() => setDrill("cashBalance")}>
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
                  Live revenue, open balances, top accounts, performance, stock, staff and cash —
                  all live, all in one pane.
                </p>
                <div className="mt-5 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
                  <Button asChild className="gap-1.5">
                    <Link to="/onboarding" search={{ step: 6, resume: 1, returnTo: "/dashboard/insights" }}>
                      <Database className="h-4 w-4" />
                      Connect Odoo now
                    </Link>
                  </Button>
                  <Button variant="ghost" onClick={dismissPaywall}>
                    Maybe later
                  </Button>
                </div>
                <button
                  type="button"
                  onClick={tryReconnect}
                  className="mt-3 text-[11px] text-muted-foreground hover:text-foreground"
                >
                  Already connected? Refresh →
                </button>
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
                <SheetTitle>{copy.drillTitles[drill]}</SheetTitle>
                <SheetDescription>Live Odoo data · click any row for inline actions.</SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <DrillContent which={drill} data={c} copy={copy} />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
}

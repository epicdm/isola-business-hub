"use client";

import { Sparkles, ArrowRight, Phone, PhoneCall, Instagram, MessageCircle, Facebook, TrendingUp, Database, X } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import DashboardLayout from "./layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { kpis, recentActivity, type Channel } from "@/lib/mock-data";

const channelIcon: Record<Channel, typeof Phone> = {
  whatsapp: Phone,
  voice: PhoneCall,
  instagram: Instagram,
  messenger: MessageCircle,
  facebook: Facebook,
};

const channelColor: Record<Channel, string> = {
  whatsapp: "text-success bg-success/15",
  voice: "text-primary bg-primary/15",
  instagram: "text-ema bg-ema/15",
  messenger: "text-chart-4 bg-chart-4/15",
  facebook: "text-chart-4 bg-chart-4/15",
};


export default function DashboardHomePage() {
  const [today, setToday] = useState("");
  const [odooConnected, setOdooConnected] = useState<boolean | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  useEffect(() => {
    setToday(
      new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    );
    if (typeof window !== "undefined") {
      setOdooConnected(window.localStorage.getItem("odooConnected") === "true");
      setBannerDismissed(window.localStorage.getItem("odooBannerDismissed") === "true");
    }
  }, []);

  const dismissBanner = () => {
    setBannerDismissed(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("odooBannerDismissed", "true");
    }
  };

  const showOdooBanner = odooConnected === false && !bannerDismissed;

  return (
    <DashboardLayout currentPath="/dashboard">
      <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-10">
        {/* Odoo paywall banner — appears when onboarding skipped Odoo */}
        {showOdooBanner && (
          <div className="flex items-start gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-warning/20 text-warning">
              <Database className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-foreground">Connect Odoo to unlock the full Isola</p>
              <p className="mt-0.5 text-muted-foreground">
                Insights, AI-assisted invoicing, and inventory-aware agents are
                waiting on your Odoo connection. Takes about 2 minutes.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button size="sm" asChild>
                <Link to="/onboarding" search={{ step: 6 }}>
                  Connect Odoo
                </Link>
              </Button>
              <button
                type="button"
                onClick={dismissBanner}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-warning/20 hover:text-foreground"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Greeting */}
        <div>
          <p className="text-sm text-muted-foreground">{today}</p>
          <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl">
            Good morning, Marcus 👋
          </h1>
        </div>

        {/* Ema greeting card */}
        <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card className="overflow-hidden border-ema/30 bg-gradient-to-br from-card to-ema/5 shadow-ema">
            <div className="flex flex-col gap-5 p-6 md:flex-row md:items-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-ema shadow-ema">
                <Sparkles className="h-7 w-7 text-ema-foreground" />
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-display font-semibold">Ema</span>
                  <Badge variant="outline" className="border-ema/30 bg-ema/10 text-ema text-[10px]">
                    Daily digest
                  </Badge>
                </div>
                <p className="text-base">
                  Yesterday: <strong>14 messages handled</strong>, <strong>3 bookings</strong>, and{" "}
                  <strong className="text-warning">1 escalation</strong> needs you (Kareem L. asked about a private dinner).
                </p>
              </div>
              <div className="flex gap-2">
                <Button className="bg-gradient-ema text-ema-foreground hover:opacity-90" asChild>
                  <a href="/dashboard/ema">
                    Ask Ema <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((k, i) => (
            <motion.div
              key={k.label}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border-border/60 bg-card/50 p-5">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {k.label}
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="font-display text-3xl font-bold">{k.value}</span>
                  <span className="flex items-center gap-1 text-xs font-medium text-success">
                    <TrendingUp className="h-3 w-3" /> {k.delta}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Activity + side */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-border/60 bg-card/50 p-6 lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Recent activity</h2>
              <Button variant="ghost" size="sm" asChild>
                <a href="/dashboard/inbox">
                  View all <ArrowRight className="ml-1 h-3 w-3" />
                </a>
              </Button>
            </div>
            <ul className="divide-y divide-border/40">
              {recentActivity.map((a) => {
                const Icon = channelIcon[a.channel as Channel];
                return (
                  <li key={a.id} className="flex items-center gap-4 py-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${channelColor[a.channel as Channel]}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{a.customer}</div>
                      <div className="truncate text-xs text-muted-foreground">{a.action}</div>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{a.time}</span>
                  </li>
                );
              })}
            </ul>
          </Card>

          <div className="space-y-6">
            <Card className="border-border/60 bg-card/50 p-6">
              <h3 className="font-display text-base font-semibold">Quick actions</h3>
              <div className="mt-4 space-y-2">
                {[
                  { label: "Add menu item", href: "/dashboard/catalog" },
                  { label: "Update hours", href: "/dashboard/hours" },
                  { label: "Add knowledge", href: "/dashboard/knowledge" },
                  { label: "Check WhatsApp", href: "/dashboard/whatsapp" },
                ].map((q) => (
                  <a
                    key={q.label}
                    href={q.href}
                    className="flex items-center justify-between rounded-lg border border-border/40 bg-background/30 px-3 py-2.5 text-sm transition-colors hover:bg-accent"
                  >
                    {q.label}
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </a>
                ))}
              </div>
            </Card>

            <Card className="border-primary/30 bg-gradient-to-br from-card to-primary/5 p-6">
              <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                Status
              </Badge>
              <h3 className="mt-3 font-display text-base font-semibold">All systems operational</h3>
              <ul className="mt-3 space-y-1.5 text-xs">
                {[
                  ["WhatsApp", "online"],
                  ["Voice", "online"],
                  ["Ema", "online"],
                ].map(([k, v]) => (
                  <li key={k} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="flex items-center gap-1.5 text-success">
                      <span className="h-1.5 w-1.5 rounded-full bg-success" /> {v}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

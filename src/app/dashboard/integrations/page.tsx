"use client";

import { useState } from "react";
import { Plug, Check, ExternalLink, Settings as SettingsIcon } from "lucide-react";
import DashboardLayout from "../layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { integrations as initialIntegrations } from "@/lib/mock-data";

export default function IntegrationsPage() {
  const [items, setItems] = useState(initialIntegrations);

  const toggle = (id: string) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, connected: !i.connected } : i)));

  const categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <DashboardLayout currentPath="/dashboard/integrations">
      <div className="px-6 py-8 lg:px-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
            <Plug className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold leading-tight">Integrations</h1>
            <p className="text-sm text-muted-foreground">
              Connect Isola to the tools you already use.
            </p>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SummaryStat label="Connected" value={items.filter((i) => i.connected).length} accent />
          <SummaryStat label="Available" value={items.length} />
          <SummaryStat label="Categories" value={categories.length} />
          <SummaryStat label="API calls / day" value="12.4K" />
        </div>

        {categories.map((cat) => {
          const catItems = items.filter((i) => i.category === cat);
          return (
            <section key={cat} className="mb-8">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {cat}
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                {catItems.map((item) => (
                  <Card
                    key={item.id}
                    className={`border-border/40 bg-card/40 p-5 transition-all hover:bg-card/60 ${
                      item.connected ? "border-primary/30" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                            item.connected ? "bg-primary/15 text-primary" : "bg-accent/60 text-muted-foreground"
                          }`}
                        >
                          <span className="font-display text-sm font-bold">
                            {item.name.slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-display text-base font-semibold">{item.name}</h3>
                            {item.connected && (
                              <Badge className="bg-primary/15 text-primary hover:bg-primary/20">
                                <Check className="h-2.5 w-2.5" /> Connected
                              </Badge>
                            )}
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">{item.desc}</p>
                          {item.account && (
                            <p className="mt-2 font-mono text-[11px] text-muted-foreground/80">
                              {item.account}
                            </p>
                          )}
                        </div>
                      </div>
                      <Switch
                        checked={item.connected}
                        onCheckedChange={() => toggle(item.id)}
                      />
                    </div>
                    {item.connected && (
                      <div className="mt-4 flex gap-2 border-t border-border/30 pt-3">
                        <Button variant="ghost" size="sm" className="text-xs">
                          <SettingsIcon className="h-3 w-3" /> Configure
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs">
                          <ExternalLink className="h-3 w-3" /> Open
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </DashboardLayout>
  );
}

function SummaryStat({ label, value, accent = false }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <Card className="border-border/40 bg-card/40 p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`mt-1 font-display text-2xl font-bold ${accent ? "text-primary" : ""}`}>
        {value}
      </div>
    </Card>
  );
}

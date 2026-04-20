"use client";

import { useState } from "react";
import { Check, X, ArrowRight, Sparkles } from "lucide-react";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { pricingTiers } from "@/lib/mock-data";

const compareRows: Array<{
  feature: string;
  starter: boolean | string;
  pro: boolean | string;
  business: boolean | string;
}> = [
  { feature: "AI on WhatsApp text", starter: true, pro: true, business: true },
  { feature: "AI on Instagram (DMs, comments, stories)", starter: false, pro: true, business: true },
  { feature: "AI on Facebook Messenger + page comments", starter: false, pro: true, business: true },
  { feature: "AI voice — inbound", starter: true, pro: true, business: true },
  { feature: "AI voice — outbound (confirmation, no-show recovery)", starter: false, pro: true, business: true },
  { feature: "Odoo ERP integration (invoices, inventory, customers)", starter: false, pro: true, business: true },
  { feature: "Fiserv payments (XCD native)", starter: true, pro: true, business: true },
  { feature: "Reloadly airtime + bill pay", starter: false, pro: true, business: true },
  { feature: "Ema — your AI chief of staff", starter: true, pro: true, business: true },
  { feature: "Unified inbox (Chatwoot-powered)", starter: true, pro: true, business: true },
  { feature: "Per-agent custom tone + tools", starter: false, pro: true, business: true },
  { feature: "Voice minutes included", starter: "100", pro: "500", business: "Unlimited" },
  { feature: "Customer-facing numbers", starter: "1", pro: "1", business: "3" },
  { feature: "Support tier", starter: "Email", pro: "Priority email", business: "Dedicated line + WhatsApp" },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />

      <section className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center">
          <Badge variant="outline" className="mb-6 border-primary/30 bg-primary/10 text-primary">
            <Sparkles className="mr-1.5 h-3 w-3" /> Pricing
          </Badge>
          <h1 className="font-display text-5xl font-bold leading-[1.05] md:text-6xl">
            One stack. <span className="text-gradient-primary">One bill.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            All prices in EC$. No reseller margin. No middleman markup. Built and billed by EPIC Communications.
          </p>

          <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-border/60 bg-card/50 px-5 py-2.5">
            <span className={`text-sm ${!annual ? "font-semibold" : "text-muted-foreground"}`}>Monthly</span>
            <Switch checked={annual} onCheckedChange={setAnnual} />
            <span className={`text-sm ${annual ? "font-semibold" : "text-muted-foreground"}`}>Annual</span>
            <Badge variant="outline" className="border-success/30 bg-success/10 text-success">Save 20%</Badge>
          </div>
        </div>
      </section>

      {/* TIERS */}
      <section className="mx-auto -mt-8 max-w-6xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {pricingTiers.map((t) => (
            <Card
              key={t.name}
              className={`relative flex flex-col p-7 ${
                t.badge ? "border-primary/50 bg-gradient-to-b from-primary/10 to-card shadow-glow" : "border-border/60 bg-card/50"
              }`}
            >
              {t.badge && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary text-primary-foreground">
                  {t.badge}
                </Badge>
              )}
              <h3 className="font-display text-xl font-bold">{t.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
              <div className="mt-5 flex items-baseline gap-1.5">
                <span className="font-display text-4xl font-bold">EC${annual ? t.annual : t.price}</span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </div>
              {annual && (
                <p className="mt-1 text-xs text-success">Billed annually · save EC${(t.price - t.annual) * 12}/yr</p>
              )}
              <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`mt-7 ${t.badge ? "bg-gradient-primary text-primary-foreground shadow-glow" : ""}`}
                variant={t.badge ? "default" : "outline"}
                asChild
              >
                <a href={t.name === "Business" ? "mailto:hello@isola.app?subject=Business%20demo" : "/auth/sign-up"}>
                  {t.cta} <ArrowRight className="ml-1.5 h-4 w-4" />
                </a>
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* COMPARE */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <h2 className="mb-10 text-center font-display text-3xl font-bold md:text-4xl">Compare every feature</h2>
        <Card className="overflow-hidden border-border/60 bg-card/30">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 bg-card/50">
                  <th className="p-4 text-left font-semibold">Feature</th>
                  <th className="p-4 text-center font-semibold">Starter</th>
                  <th className="p-4 text-center font-semibold text-primary">Pro</th>
                  <th className="p-4 text-center font-semibold">Business</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((r) => (
                  <tr key={r.feature} className="border-b border-border/30 last:border-0">
                    <td className="p-4 font-medium">{r.feature}</td>
                    {(["starter", "pro", "business"] as const).map((tier) => (
                      <td key={tier} className="p-4 text-center">
                        {typeof r[tier] === "boolean" ? (
                          r[tier] ? (
                            <Check className="mx-auto h-4 w-4 text-success" />
                          ) : (
                            <X className="mx-auto h-4 w-4 text-muted-foreground/40" />
                          )
                        ) : (
                          <span className="text-muted-foreground">{r[tier]}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="border-t border-border/40 bg-card/40">
                  <td className="p-4 font-medium">Setup fee</td>
                  <td className="p-4 text-center text-muted-foreground">EC$200 (waived on annual)</td>
                  <td className="p-4 text-center text-muted-foreground">EC$200 (waived on annual)</td>
                  <td className="p-4 text-center text-muted-foreground">EC$200 (waived on annual)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* WHY CHEAPER */}
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-card p-7">
          <h3 className="font-display text-xl font-bold">Why are we cheaper than Wati?</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Wati charges US$50–300+/mo on top of WhatsApp's own fees, plus Twilio minutes on top of
            that. We own the telecom — no reseller margin. We own the gateway — no Stripe margin.
            We're the vendor, not a middleman.
          </p>
        </Card>
      </section>

      {/* BUSINESS CTA */}
      <section className="mx-auto max-w-3xl px-6 pb-24 text-center">
        <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow" asChild>
          <a href="mailto:hello@isola.app?subject=Business%20demo">Book a demo — we'll call you <ArrowRight className="ml-2 h-4 w-4" /></a>
        </Button>
      </section>

      <MarketingFooter />
    </div>
  );
}

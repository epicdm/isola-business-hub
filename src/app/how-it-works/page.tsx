"use client";

import {
  ArrowRight,
  Smartphone,
  Bot,
  BarChart3,
  Sparkles,
  PhoneCall,
  CalendarCheck,
  CreditCard,
  MessageSquare,
} from "lucide-react";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />

      <section className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center">
          <Badge variant="outline" className="mb-6 border-primary/30 bg-primary/10 text-primary">
            <Sparkles className="mr-1.5 h-3 w-3" /> How it works
          </Badge>
          <h1 className="font-display text-5xl font-bold leading-[1.05] md:text-6xl">
            From customer message to <span className="text-gradient-primary">money in the bank.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            One stack. Three steps. No middleman.
          </p>
        </div>
      </section>

      {/* JOURNEY MAP */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-stretch gap-6 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
          <JourneyColumn
            n="1"
            icon={Smartphone}
            title="Your customer texts (or calls)"
            desc="They reach you on whatever channel is open on their phone."
            chips={["WhatsApp", "Instagram", "Messenger", "Voice"]}
          />
          <Arrow />
          <JourneyColumn
            n="2"
            icon={Bot}
            title="Isola handles it"
            desc="Your AI team reads the context, checks the menu in Odoo, confirms availability, takes the booking, sends a payment link. In under 3 seconds."
            chips={["AI agents", "Ema", "Odoo-aware"]}
          />
          <Arrow />
          <JourneyColumn
            n="3"
            icon={BarChart3}
            title="Your business runs"
            desc="Booking on your calendar. Invoice in Odoo. Money cleared. Every morning, Ema tells you what happened overnight."
            chips={["Calendar", "Odoo", "Bank", "Digest"]}
          />
        </div>
      </section>

      {/* SUB-FLOWS */}
      <section className="bg-card/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-12 text-center font-display text-3xl font-bold md:text-4xl">Three flows. One stack.</h2>
          <div className="space-y-6">
            <SubFlow
              badge="Sub-flow A"
              icon={MessageSquare}
              title="Inbound WhatsApp booking"
              steps={[
                "Customer texts your number",
                "AI reads inventory in Odoo",
                "Offers available slots",
                "Customer picks one",
                "AI takes deposit via Fiserv (XCD)",
                "Saved to Odoo + Google Calendar",
                "Confirmation sent",
                "Reminder via AI voice call 24h later",
              ]}
            />
            <SubFlow
              badge="Sub-flow B"
              icon={PhoneCall}
              title="The outbound voice confirmation"
              steps={[
                "24h before booking",
                "AI calls customer on their number",
                "Opens with 'I'm Maxine, an AI assistant from Coalpot — is this a good time?'",
                "Confirms or reschedules",
                "Updates Odoo + Google Calendar",
                "Owner sees the change in dashboard",
              ]}
            />
            <SubFlow
              badge="Sub-flow C"
              icon={Sparkles}
              title="Ema's morning digest"
              ema
              steps={[
                "7am — Ema reads everything that happened",
                "Composes digest",
                "Sends on Ema's WhatsApp number",
                "Owner reads digest during coffee",
                "Replies: 'launch the reminder campaign'",
                "Ema executes",
                "Reports back in 10 min with delivery confirmation",
              ]}
            />
          </div>
        </div>
      </section>

      {/* THE FULL STACK */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <h2 className="mb-3 text-center font-display text-3xl font-bold md:text-4xl">The full stack visualized</h2>
        <p className="mb-12 text-center text-muted-foreground">Most tools give you the middle. Isola gives you all three.</p>

        <div className="space-y-4">
          <StackLayer
            tone="primary"
            label="Customers"
            chips={["WhatsApp", "Instagram", "Messenger", "Voice / phone"]}
          />
          <Connector />
          <StackLayer
            tone="ema"
            label="Isola"
            chips={["AI agents", "Ema chief-of-staff", "Unified inbox"]}
          />
          <Connector />
          <StackLayer
            tone="violet"
            label="Business systems"
            chips={["Odoo ERP", "Fiserv (XCD)", "Reloadly", "Google Calendar", "Magnus / Asterisk SIP"]}
          />
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-primary py-20">
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-4xl font-bold text-primary-foreground">Ready to see it for yourself?</h2>
          <p className="mt-3 text-primary-foreground/80">14-day free trial · No credit card · Live in 48 hours</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" variant="secondary" asChild>
              <a href="/auth/sign-up">Start free trial <ArrowRight className="ml-2 h-4 w-4" /></a>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <a href="mailto:hello@isola.app?subject=Demo">See the demo</a>
            </Button>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

function JourneyColumn({
  n, icon: Icon, title, desc, chips,
}: { n: string; icon: typeof Smartphone; title: string; desc: string; chips: string[] }) {
  return (
    <Card className="flex h-full flex-col items-center border-border/60 bg-card/50 p-6 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
        <Icon className="h-6 w-6 text-primary-foreground" />
      </div>
      <div className="text-xs font-medium uppercase tracking-wider text-primary">Step {n}</div>
      <h3 className="mt-1 font-display text-lg font-bold">{title}</h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{desc}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-1.5">
        {chips.map((c) => (
          <span key={c} className="rounded-md border border-border/60 bg-background/50 px-2 py-0.5 text-[11px] text-muted-foreground">
            {c}
          </span>
        ))}
      </div>
    </Card>
  );
}

function Arrow() {
  return (
    <div className="hidden items-center justify-center md:flex">
      <ArrowRight className="h-6 w-6 text-primary" />
    </div>
  );
}

function SubFlow({
  badge, icon: Icon, title, steps, ema,
}: { badge: string; icon: typeof MessageSquare; title: string; steps: string[]; ema?: boolean }) {
  return (
    <Card className={`border-border/60 ${ema ? "bg-gradient-to-br from-ema/10 to-card" : "bg-card/50"} p-6`}>
      <div className="flex items-start gap-4">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${ema ? "bg-gradient-ema shadow-ema" : "bg-gradient-primary shadow-glow"}`}>
          <Icon className={`h-5 w-5 ${ema ? "text-ema-foreground" : "text-primary-foreground"}`} />
        </div>
        <div className="flex-1">
          <Badge variant="outline" className={`mb-2 text-xs ${ema ? "border-ema/30 bg-ema/10 text-ema" : "border-primary/30 bg-primary/10 text-primary"}`}>
            {badge}
          </Badge>
          <h3 className="font-display text-lg font-bold">{title}</h3>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <span className="rounded-lg border border-border/60 bg-background/40 px-3 py-1.5 text-xs">{s}</span>
                {i < steps.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function StackLayer({ tone, label, chips }: { tone: "primary" | "ema" | "violet"; label: string; chips: string[] }) {
  const toneClass =
    tone === "primary"
      ? "border-primary/40 bg-primary/10"
      : tone === "ema"
      ? "border-ema/40 bg-ema/10"
      : "border-violet/40 bg-violet/10";
  return (
    <div className={`flex flex-col items-center gap-3 rounded-2xl border ${toneClass} px-6 py-5 md:flex-row md:justify-between`}>
      <div className="font-display text-lg font-bold">{label}</div>
      <div className="flex flex-wrap justify-center gap-2">
        {chips.map((c) => (
          <span key={c} className="rounded-md bg-background/50 px-2.5 py-1 text-xs">{c}</span>
        ))}
      </div>
    </div>
  );
}

function Connector() {
  return <div className="mx-auto h-6 w-px bg-border" />;
}

"use client";

import { ArrowRight, MessageSquare, Sparkles, Brain, Zap, Users, BarChart3 } from "lucide-react";
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
            Three flows. <span className="text-gradient-primary">One business OS.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Customers chat. Ema reports. You sleep. Here's exactly what happens behind the scenes.
          </p>
        </div>
      </section>

      {/* FLOW 1: Customer message */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 text-center">
          <Badge variant="outline" className="mb-3 border-success/30 bg-success/10 text-success">Flow 1</Badge>
          <h2 className="font-display text-3xl font-bold md:text-4xl">A customer messages you</h2>
          <p className="mt-2 text-muted-foreground">From WhatsApp ping to confirmed booking — under 3 seconds.</p>
        </div>

        <div className="grid items-stretch gap-4 md:grid-cols-5">
          {[
            { icon: MessageSquare, t: "Message arrives", d: "WhatsApp, IG, Messenger, or voice call" },
            { icon: Brain, t: "AI understands intent", d: "Booking, question, complaint, or chat" },
            { icon: Zap, t: "Acts on your data", d: "Menu, hours, availability, prices" },
            { icon: Users, t: "Replies in seconds", d: "Friendly, on-brand, in their language" },
            { icon: BarChart3, t: "Logs everything", d: "Inbox, CRM, calendar — all updated" },
          ].map((s, i, arr) => (
            <div key={s.t} className="flex flex-col items-center text-center">
              <Card className="relative w-full border-border/60 bg-card/50 p-5">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                  <s.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Step {i + 1}</div>
                <h3 className="mt-1 font-display font-semibold">{s.t}</h3>
                <p className="mt-1.5 text-xs text-muted-foreground">{s.d}</p>
              </Card>
              {i < arr.length - 1 && (
                <ArrowRight className="my-2 h-4 w-4 rotate-90 text-muted-foreground md:rotate-0" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FLOW 2: Ema digest */}
      <section className="bg-card/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 text-center">
            <Badge variant="outline" className="mb-3 border-ema/30 bg-ema/10 text-ema">Flow 2</Badge>
            <h2 className="font-display text-3xl font-bold md:text-4xl">Ema runs your morning</h2>
            <p className="mt-2 text-muted-foreground">Your private AI chief-of-staff, every day at 7am.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-ema/30 bg-gradient-to-br from-card to-ema/5 p-6 shadow-ema">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-ema shadow-ema">
                  <Sparkles className="h-4 w-4 text-ema-foreground" />
                </div>
                <span className="font-display font-semibold">Ema · 7:00 AM</span>
              </div>
              <div className="space-y-3 rounded-xl bg-background/40 p-4">
                <p className="text-sm">Good morning ☀️</p>
                <p className="text-sm">Yesterday: <strong>14 messages</strong>, <strong>3 bookings</strong>, <strong className="text-warning">1 escalation</strong> for you.</p>
                <p className="text-sm">Friday is filling up — only 2 tables left for 7pm. Want me to push Instagram?</p>
              </div>
            </Card>

            <div className="space-y-3">
              {[
                { t: "Reads every conversation overnight", d: "Inbox, calls, DMs — Ema knows what happened." },
                { t: "Spots patterns and flags issues", d: "Repeat complaints, lost bookings, slow response times." },
                { t: "Drafts replies for escalations", d: "You approve with one tap. Ema sends." },
                { t: "Suggests campaigns and pushes", d: "Quiet Tuesday? Ema drafts an IG story for you." },
              ].map((b, i) => (
                <Card key={b.t} className="flex gap-4 border-border/60 bg-card/50 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ema/15 font-display text-sm font-bold text-ema">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-display font-semibold">{b.t}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">{b.d}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FLOW 3: Setup */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 text-center">
          <Badge variant="outline" className="mb-3 border-primary/30 bg-primary/10 text-primary">Flow 3</Badge>
          <h2 className="font-display text-3xl font-bold md:text-4xl">Live in 48 hours</h2>
          <p className="mt-2 text-muted-foreground">From signup to first AI-handled message.</p>
        </div>

        <div className="space-y-4">
          {[
            { day: "Day 0", t: "Sign up & onboard", d: "5-minute wizard: business type, hours, services, tone of voice. We meet Ema." },
            { day: "Day 1", t: "WhatsApp Business verification", d: "We provision your number and verify with Meta. You upload your menu / room rates / service list." },
            { day: "Day 2", t: "Test, tune, go live", d: "Run test conversations with our team. Adjust tone and escalation rules. Flip the switch — you're live." },
          ].map((s, i) => (
            <Card key={s.t} className="flex flex-col gap-4 border-border/60 bg-card/50 p-6 md:flex-row md:items-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-primary font-display text-lg font-bold text-primary-foreground shadow-glow">
                {i + 1}
              </div>
              <div className="flex-1">
                <Badge variant="outline" className="mb-1.5 border-primary/30 bg-primary/10 text-xs text-primary">
                  {s.day}
                </Badge>
                <h3 className="font-display text-xl font-semibold">{s.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-primary py-20">
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-4xl font-bold text-primary-foreground">Ready to see it for yourself?</h2>
          <p className="mt-3 text-primary-foreground/80">14-day free trial · No credit card · Live in 48 hours</p>
          <Button size="lg" variant="secondary" className="mt-8" asChild>
            <a href="/auth/sign-up">Start free trial <ArrowRight className="ml-2 h-4 w-4" /></a>
          </Button>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

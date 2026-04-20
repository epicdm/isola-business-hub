"use client";

import {
  ArrowRight,
  Star,
  Hotel,
  X,
  Sparkles,
  Moon,
  Compass,
  KeyRound,
  Globe2,
  UtensilsCrossed,
  PhoneCall,
  Bell,
  CalendarRange,
} from "lucide-react";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const pains = [
  "Excursion revenue lost to unanswered WhatsApps",
  "Front desk on the phone instead of with guests",
  "Multilingual guests you can't always staff for",
  "Post-stay review chase-up that never happens",
];

const capabilities = [
  { icon: Moon, t: "24/7 concierge", d: "Separate agent for guest inquiries vs reservations." },
  { icon: Compass, t: "Excursion booking", d: "Takes deposit, adds to calendar, confirms supplier." },
  { icon: KeyRound, t: "Check-in / check-out flow", d: "WhatsApp Flows, signed forms, saved in Odoo." },
  { icon: Globe2, t: "Multi-language detection", d: "French, English, Spanish (Patois in Phase 2)." },
  { icon: UtensilsCrossed, t: "Room service orders", d: "Charged to folio in Odoo automatically." },
  { icon: PhoneCall, t: "Post-stay NPS + Google review", d: "AI voice call 48h after checkout." },
  { icon: Bell, t: "Housekeeping dispatch", d: "Towel shortage? Routed to the right team in seconds." },
  { icon: CalendarRange, t: "Rate availability sync", d: "If Odoo says the suite is unavailable, AI stops offering it." },
];

const emaPrompts = [
  "What's this week's occupancy projection?",
  "Email all guests staying next week with our hurricane contingency plan",
  "Send a review-ask template to everyone who checked out yesterday",
];

export default function HotelsPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />

      <section className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center">
          <Badge variant="outline" className="mb-6 border-primary/30 bg-primary/10 text-primary">
            <Hotel className="mr-1.5 h-3 w-3" /> For Hotels & Guesthouses
          </Badge>
          <h1 className="font-display text-5xl font-bold leading-[1.05] md:text-6xl">
            Your concierge is available at 3am. <span className="text-gradient-primary">Because your guests are.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Excursion bookings, room service questions, late check-in coordination, spa appointments —
            in WhatsApp, in English or French, in your brand voice.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow" asChild>
              <a href="/auth/sign-up">Start free trial <ArrowRight className="ml-2 h-4 w-4" /></a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/pricing">From EC$449/mo</a>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-3 md:grid-cols-4">
          {pains.map((p) => (
            <Card key={p} className="flex items-start gap-3 border-destructive/20 bg-destructive/5 p-4">
              <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <p className="text-sm">{p}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-12 text-center font-display text-3xl font-bold md:text-4xl">What Isola does for hotels</h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((c) => (
            <Card key={c.t} className="border-border/60 bg-card/50 p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                <c.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-display text-base font-semibold">{c.t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{c.d}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-card/30 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="mb-4 flex justify-center gap-0.5 text-warning">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
          </div>
          <p className="font-display text-2xl leading-relaxed md:text-3xl">
            "Our concierge handles excursion bookings in English, French, and Spanish. Guest satisfaction
            jumped <span className="text-gradient-primary">15 points</span>. Excursion revenue is up
            EC$11,000/mo because every late-night WhatsApp now becomes a booking. It paid for itself the
            first month."
          </p>
          <div className="mt-6">
            <div className="font-semibold">Janelle Rose</div>
            <div className="text-sm text-muted-foreground">GM, Fort Young Hotel · Roseau, Dominica</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="mb-10 text-center">
          <Badge variant="outline" className="mb-3 border-ema/30 bg-ema/10 text-ema">
            <Sparkles className="mr-1.5 h-3 w-3" /> How hotels use Ema
          </Badge>
          <h2 className="font-display text-3xl font-bold md:text-4xl">Your AI ops manager. On-call, always.</h2>
        </div>
        <div className="space-y-3">
          {emaPrompts.map((p) => (
            <div key={p} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl bg-primary/15 px-4 py-2.5 text-sm">{p}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20">
        <Card className="border-primary/40 bg-gradient-to-br from-primary/10 to-card p-8 text-center shadow-glow">
          <div className="text-sm uppercase tracking-wider text-muted-foreground">Business tier</div>
          <div className="mt-2 font-display text-4xl font-bold">EC$449<span className="text-lg text-muted-foreground">/mo</span></div>
          <p className="mt-3 text-sm text-muted-foreground">
            3 agents (concierge, reservations, spa), unlimited voice, full stack.
          </p>
        </Card>
      </section>

      <section className="relative overflow-hidden bg-gradient-primary py-20">
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-4xl font-bold text-primary-foreground">Wake up to more bookings.</h2>
          <p className="mt-3 text-primary-foreground/80">Live in 48 hours · No credit card required</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" variant="secondary" asChild>
              <a href="/auth/sign-up">Start free trial <ArrowRight className="ml-2 h-4 w-4" /></a>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <a href="mailto:hello@isola.app?subject=Hotel%20demo">Talk to our team</a>
            </Button>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

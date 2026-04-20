"use client";

import {
  ArrowRight,
  Star,
  Utensils,
  X,
  Calendar,
  Package,
  CreditCard,
  PhoneCall,
  PhoneOff,
  AlertCircle,
  MapPin,
  Sparkles,
} from "lucide-react";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const pains = [
  "Missing reservations after midnight",
  "Staff on WhatsApp instead of serving tables",
  "Tourists asking about allergens you don't know how to explain",
  "No-show rate killing revenue",
];

const capabilities = [
  { icon: Calendar, t: "Takes reservations 24/7", d: "Dedicated WhatsApp number, auto-books to Google Calendar." },
  { icon: Utensils, t: "Knows your menu cold", d: "Integrated with Odoo, stops offering items that are 86'd." },
  { icon: Package, t: "Handles pre-orders", d: "Tasting menu, group menus, private dining." },
  { icon: CreditCard, t: "Sends payment links", d: "Fiserv in XCD, cleared instantly, saved to Odoo as paid." },
  { icon: PhoneCall, t: "Calls to confirm bookings", d: "AI voice, 24h before, reschedules or cancels." },
  { icon: PhoneOff, t: "Recovers no-shows", d: "AI calls 15 min after a missed booking: 'running late?'" },
  { icon: AlertCircle, t: "Answers allergen questions", d: "Trained on your ingredient list. Honest about cross-contact." },
  { icon: MapPin, t: "Shares menu, location, hours", d: "Lists, buttons, pin drops, the works." },
];

const emaPrompts = [
  "Launch a reminder campaign to everyone who booked last month",
  "Send the tasting menu to Marcus Charles — he asked about it yesterday",
  "What were our top sellers this week? Send to my accountant.",
];

export default function RestaurantsPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />

      <section className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center">
          <Badge variant="outline" className="mb-6 border-primary/30 bg-primary/10 text-primary">
            <Utensils className="mr-1.5 h-3 w-3" /> For Restaurants
          </Badge>
          <h1 className="font-display text-5xl font-bold leading-[1.05] md:text-6xl">
            Your restaurant runs itself <span className="text-gradient-primary">from 10pm to 10am.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Reservations. Menu questions. Takeout orders. Payments. Tomorrow's bookings confirmed by
            AI voice call. All without you checking your phone at dinner service.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow" asChild>
              <a href="/auth/sign-up">Start 14-day trial <ArrowRight className="ml-2 h-4 w-4" /></a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/pricing">From EC$249/mo</a>
            </Button>
          </div>
        </div>
      </section>

      {/* PAINS */}
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

      {/* WHAT IT DOES — 8 capabilities */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-12 text-center font-display text-3xl font-bold md:text-4xl">What Isola does for restaurants</h2>
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

      {/* TESTIMONIAL */}
      <section className="bg-card/30 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="mb-4 flex justify-center gap-0.5 text-warning">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
          </div>
          <p className="font-display text-2xl leading-relaxed md:text-3xl">
            "We have 32 seats. We get 90+ WhatsApp messages a day. Before Isola, my hostess was a 20-hour-a-week hire.
            Now she works 4 hours, handling only what Isola escalates. Payroll dropped EC$1,800/mo. Reservations went up{" "}
            <span className="text-gradient-primary">30%</span>."
          </p>
          <div className="mt-6">
            <div className="font-semibold">Marcus Joseph</div>
            <div className="text-sm text-muted-foreground">Chef-Owner, Coalpot Restaurant · Roseau, Dominica</div>
          </div>
        </div>
      </section>

      {/* HOW RESTAURANTS USE EMA */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="mb-10 text-center">
          <Badge variant="outline" className="mb-3 border-ema/30 bg-ema/10 text-ema">
            <Sparkles className="mr-1.5 h-3 w-3" /> How restaurants use Ema
          </Badge>
          <h2 className="font-display text-3xl font-bold md:text-4xl">Talk to Ema like she's your manager.</h2>
          <p className="mt-2 text-muted-foreground">Real prompts owners send their Ema chief-of-staff:</p>
        </div>
        <div className="space-y-3">
          {emaPrompts.map((p) => (
            <div key={p} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl bg-primary/15 px-4 py-2.5 text-sm">{p}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING ANCHOR */}
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <Card className="border-primary/40 bg-gradient-to-br from-primary/10 to-card p-8 text-center shadow-glow">
          <div className="text-sm uppercase tracking-wider text-muted-foreground">Pro tier</div>
          <div className="mt-2 font-display text-4xl font-bold">EC$249<span className="text-lg text-muted-foreground">/mo</span></div>
          <p className="mt-3 text-sm text-muted-foreground">
            The full stack: multi-agent, Odoo integration, Fiserv, outbound voice, full Meta channels.
          </p>
        </Card>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-primary py-20">
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-4xl font-bold text-primary-foreground">Stop losing tables. Start tonight.</h2>
          <p className="mt-3 text-primary-foreground/80">From EC$249/mo · Live in 48 hours · No credit card required</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" variant="secondary" asChild>
              <a href="/auth/sign-up">Start 14-day trial <ArrowRight className="ml-2 h-4 w-4" /></a>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <a href="mailto:hello@isola.app?subject=Restaurant%20demo">Talk to our team</a>
            </Button>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

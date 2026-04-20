"use client";

import { ArrowRight, Star, Hotel, Moon, Globe2, CreditCard, BedDouble } from "lucide-react";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
            Your front desk, <span className="text-gradient-primary">awake at 3am.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Booking questions, room availability, transfers from the airport — answered in seconds.
            Tourists arrive happy, your team sleeps.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow" asChild>
              <a href="/auth/sign-up">Start free trial <ArrowRight className="ml-2 h-4 w-4" /></a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/pricing">From EC$249/mo</a>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="mb-3 text-center font-display text-3xl font-bold md:text-4xl">The 3am problem</h2>
        <p className="mb-12 text-center text-muted-foreground">When your guests need you most, your team is asleep.</p>
        <div className="grid gap-5 md:grid-cols-2">
          {[
            { t: "Late-night booking inquiries lost", d: "Cruise tourists message at midnight — gone by morning." },
            { t: "Front desk drowning during check-in", d: "Phone, walk-ins, and WhatsApp all at the same time." },
            { t: "Repetitive questions, every day", d: "Wifi password, breakfast hours, beach access — over and over." },
            { t: "OTA commissions eating margin", d: "Direct bookings die when nobody answers fast enough." },
          ].map((p) => (
            <Card key={p.t} className="border-border/60 bg-card/50 p-6">
              <h3 className="font-display text-lg font-semibold">{p.t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{p.d}</p>
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
            "Guest satisfaction jumped <span className="text-gradient-primary">15 points</span>. Late-night booking questions are no longer a problem."
          </p>
          <div className="mt-6">
            <div className="font-semibold">Janelle Rose</div>
            <div className="text-sm text-muted-foreground">GM, Fort Young Hotel · Roseau, Dominica</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="mb-12 text-center font-display text-3xl font-bold md:text-4xl">What Isola does for hotels</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {[
            { icon: BedDouble, t: "Real-time room availability", d: "Syncs with your PMS. Quotes nights, taxes, and packages instantly." },
            { icon: Moon, t: "24/7 multilingual concierge", d: "Wifi, breakfast, transfers, tours — answered in seconds, any hour." },
            { icon: CreditCard, t: "Captures direct bookings", d: "Skip OTA fees. Stripe deposit links sent over WhatsApp." },
            { icon: Globe2, t: "Speaks every guest's language", d: "English, French, Spanish, Kwéyòl — fluent and on-brand." },
          ].map((f) => (
            <Card key={f.t} className="flex gap-5 border-border/60 bg-card/50 p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                <f.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold">{f.t}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.d}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-primary py-20">
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-4xl font-bold text-primary-foreground">Wake up to more bookings.</h2>
          <p className="mt-3 text-primary-foreground/80">From EC$249/mo · Live in 48 hours · No credit card required</p>
          <Button size="lg" variant="secondary" className="mt-8" asChild>
            <a href="/auth/sign-up">Start free trial <ArrowRight className="ml-2 h-4 w-4" /></a>
          </Button>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

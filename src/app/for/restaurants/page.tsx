"use client";

import { Check, ArrowRight, Star, Utensils, Clock, MessageSquare, Globe2 } from "lucide-react";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
            Every reservation handled. <span className="text-gradient-primary">Every time.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Stop losing tables to unanswered WhatsApps. Isola books guests in seconds, day or night, in any
            language your tourists speak.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow" asChild>
              <a href="/auth/sign-up">
                Start free trial <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/pricing">From EC$249/mo</a>
            </Button>
          </div>
        </div>
      </section>

      {/* PAIN POINTS */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="mb-3 text-center font-display text-3xl font-bold md:text-4xl">
          Sound familiar?
        </h2>
        <p className="mb-12 text-center text-muted-foreground">The everyday reality of running a Caribbean restaurant.</p>
        <div className="grid gap-5 md:grid-cols-2">
          {[
            { t: "No-shows are killing margins", d: "Tables held, kitchen prepped, then silence." },
            { t: "After 9pm = lost reservations", d: "Late-night WhatsApps go unanswered until morning." },
            { t: "Phone rings during dinner rush", d: "Servers can't run food and book guests at once." },
            { t: "Tourists message in 4 languages", d: "Kwéyòl, French, Spanish, English — all in one shift." },
          ].map((p) => (
            <Card key={p.t} className="border-border/60 bg-card/50 p-6">
              <h3 className="font-display text-lg font-semibold">{p.t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{p.d}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="bg-card/30 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="mb-4 flex justify-center gap-0.5 text-warning">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-current" />
            ))}
          </div>
          <p className="font-display text-2xl leading-relaxed md:text-3xl">
            "We captured <span className="text-gradient-primary">30% more reservations</span> in month one. Isola never sleeps and never says the wrong thing about our menu."
          </p>
          <div className="mt-6">
            <div className="font-semibold">Marcus Joseph</div>
            <div className="text-sm text-muted-foreground">Chef-Owner, Coalpot Restaurant · Roseau, Dominica</div>
          </div>
        </div>
      </section>

      {/* WHAT IT DOES */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="mb-12 text-center font-display text-3xl font-bold md:text-4xl">
          What Isola does for restaurants
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          {[
            { icon: MessageSquare, t: "Books reservations in seconds", d: "Captures party size, time, dietary notes — straight to your calendar." },
            { icon: Utensils, t: "Answers menu questions accurately", d: "Trained on your menu, allergens, and prep times. No hallucinations." },
            { icon: Clock, t: "Knows your hours and holidays", d: "Polite explanations when you're closed, suggests next available slot." },
            { icon: Globe2, t: "Speaks the tourist's language", d: "English, French, Spanish, Kwéyòl — fluent and friendly." },
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

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-primary py-20">
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-4xl font-bold text-primary-foreground">
            Stop losing tables. Start tonight.
          </h2>
          <p className="mt-3 text-primary-foreground/80">From EC$249/mo · Live in 48 hours · No credit card required</p>
          <Button size="lg" variant="secondary" className="mt-8" asChild>
            <a href="/auth/sign-up">
              Start free trial <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

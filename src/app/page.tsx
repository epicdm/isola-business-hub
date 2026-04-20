"use client";

import {
  Phone,
  PhoneCall,
  Instagram,
  MessageCircle,
  Calendar,
  Sparkles,
  Check,
  ArrowRight,
  Star,
  Utensils,
  Hotel,
  Stethoscope,
  Zap,
  ShieldCheck,
  Globe2,
} from "lucide-react";
import { motion } from "framer-motion";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  homeFeatures,
  trustedLogos,
  testimonials,
  faqs,
  pricingTiers,
} from "@/lib/mock-data";

const iconMap = { Phone, PhoneCall, Instagram, MessageCircle, Calendar, Sparkles } as const;

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />

      {/* HERO */}
      <section className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-6 border-primary/30 bg-primary/10 text-primary">
              <Sparkles className="mr-1.5 h-3 w-3" />
              Now in beta across the Caribbean
            </Badge>
            <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Your AI business team{" "}
              <span className="text-gradient-primary">on WhatsApp.</span>
              <br />
              Built for the Caribbean.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              24/7 coverage across WhatsApp, Instagram, Messenger, and voice. Plus{" "}
              <span className="text-gradient-ema font-semibold">Ema</span> — your personal AI
              chief-of-staff who runs reports, sends daily digests, and executes commands.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
                <a href="/auth/sign-up">
                  Start free 14-day trial <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/how-it-works">See how it works</a>
              </Button>
            </div>
            <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-primary" /> No credit card
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-primary" /> Live in 48h
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative mx-auto"
          >
            <PhoneMockup />
          </motion.div>
        </div>
      </section>

      {/* TRUSTED BY */}
      <section className="border-y border-border/40 bg-card/30 py-10">
        <div className="mx-auto max-w-7xl px-6">
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Trusted by Caribbean businesses
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-70">
            {trustedLogos.map((logo) => (
              <span key={logo} className="font-display text-lg font-semibold text-muted-foreground">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* VERTICAL CALLOUTS */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 text-center">
          <h2 className="font-display text-4xl font-bold md:text-5xl">Built for your industry</h2>
          <p className="mt-3 text-muted-foreground">Specialized AI agents trained for Caribbean hospitality and care.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Utensils, title: "Restaurants", desc: "Reservations, menu Q&A, after-hours coverage.", href: "/for/restaurants" },
            { icon: Hotel, title: "Hotels", desc: "Bookings, late-night check-in, excursions.", href: "/for/hotels" },
            { icon: Stethoscope, title: "Clinics", desc: "Appointments, intake, multi-doctor scheduling.", href: "/for/clinics" },
          ].map((v) => (
            <a key={v.title} href={v.href}>
              <Card className="group h-full overflow-hidden border-border/60 bg-card/50 p-8 transition-all hover:border-primary/50 hover:shadow-glow">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                  <v.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-bold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Card>
            </a>
          ))}
        </div>
      </section>

      {/* MEET EMA */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-card/40 to-background py-24">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-ema/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <EmaPreviewCard />
          </div>
          <div className="order-1 lg:order-2">
            <Badge className="mb-4 bg-ema/15 text-ema border-ema/30" variant="outline">
              <Sparkles className="mr-1.5 h-3 w-3" />
              Meet Ema
            </Badge>
            <h2 className="font-display text-4xl font-bold leading-tight md:text-5xl">
              Your AI <span className="text-gradient-ema">chief-of-staff.</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              While Isola's agents handle your customers, <strong className="text-foreground">Ema</strong> handles{" "}
              <em>you</em>. She lives on her own dedicated WhatsApp number, sends a daily digest every
              morning, and executes commands like "launch a campaign for regulars" or "show me this
              week's escalations."
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Daily morning digest with the metrics that matter",
                "Weekly summary every Monday at 7am",
                "Real-time alerts when something needs you",
                "Execute campaigns, broadcasts, and reminders by chat",
              ].map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ema/20">
                    <Check className="h-3 w-3 text-ema" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FEATURE GRID */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 text-center">
          <h2 className="font-display text-4xl font-bold md:text-5xl">Everything in one place</h2>
          <p className="mt-3 text-muted-foreground">Six channels, one operating system, zero missed messages.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {homeFeatures.map((f, i) => {
            const Icon = iconMap[f.icon];
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Card className="h-full border-border/60 bg-card/50 p-6 transition-colors hover:bg-card">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="bg-card/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className="font-display text-4xl font-bold md:text-5xl">Simple Caribbean pricing</h2>
            <p className="mt-3 text-muted-foreground">All prices in EC$. Annual saves 20%.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {pricingTiers.map((t) => (
              <Card
                key={t.name}
                className={`relative flex flex-col p-8 ${
                  t.badge ? "border-primary/60 bg-card shadow-glow" : "border-border/60 bg-card/50"
                }`}
              >
                {t.badge && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary text-primary-foreground">
                    {t.badge}
                  </Badge>
                )}
                <h3 className="font-display text-xl font-bold">{t.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">EC${t.price}</span>
                  <span className="text-sm text-muted-foreground">/mo</span>
                </div>
                <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`mt-8 ${t.badge ? "bg-gradient-primary text-primary-foreground" : ""}`}
                  variant={t.badge ? "default" : "outline"}
                  asChild
                >
                  <a href="/pricing">{t.cta}</a>
                </Button>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button variant="link" asChild>
              <a href="/pricing">See full pricing & comparison →</a>
            </Button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 text-center">
          <h2 className="font-display text-4xl font-bold md:text-5xl">Loved by operators</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="flex flex-col border-border/60 bg-card/50 p-6">
              <div className="mb-3 flex gap-0.5 text-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="flex-1 text-sm leading-relaxed text-foreground/90">"{t.quote}"</p>
              <div className="mt-5 border-t border-border/40 pt-4">
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
                <div className="text-xs text-muted-foreground">{t.location}</div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="bg-card/30 py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-3">
          {[
            { icon: Zap, t: "Live in 48 hours", d: "From signup to first message handled." },
            { icon: ShieldCheck, t: "Encrypted end-to-end", d: "GDPR-aligned, Caribbean data residency." },
            { icon: Globe2, t: "Speaks your language", d: "English, Kwéyòl, French, Spanish — natively." },
          ].map((b) => (
            <div key={b.t} className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <b.icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold">{b.t}</h4>
                <p className="text-sm text-muted-foreground">{b.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-24">
        <h2 className="mb-8 text-center font-display text-4xl font-bold md:text-5xl">
          Frequently asked questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-base">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-gradient-primary py-20">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-4xl font-bold text-primary-foreground md:text-5xl">
            Ready to never miss a message?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
            Set up takes 10 minutes. You'll be live before lunch.
          </p>
          <Button size="lg" variant="secondary" className="mt-8" asChild>
            <a href="/auth/sign-up">
              Start your free trial <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

// ---------- Inline subcomponents ----------

function PhoneMockup() {
  return (
    <div className="relative mx-auto h-[560px] w-[280px]">
      <div className="absolute inset-0 rounded-[3rem] border-[10px] border-foreground/80 bg-background shadow-glow">
        <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-foreground/80" />
        <div className="flex h-full flex-col overflow-hidden rounded-[2.2rem]">
          {/* WhatsApp header */}
          <div className="flex items-center gap-3 bg-[#075E54] px-4 pb-3 pt-8 text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">Coalpot Restaurant</div>
              <div className="text-[10px] opacity-80">online · typing…</div>
            </div>
          </div>
          {/* Messages */}
          <div className="flex-1 space-y-2 bg-[#0B141A] p-3">
            <Bubble side="left" time="7:42 PM">
              Hi! Do you have a table for 4 tonight at 8pm?
            </Bubble>
            <Bubble side="right" time="7:42 PM" ai>
              Hi Aaliyah! 🌴 Yes, we have a table for 4 at 8pm. Indoor or terrace?
            </Bubble>
            <Bubble side="left" time="7:43 PM">
              Terrace please 🙏
            </Bubble>
            <Bubble side="right" time="7:43 PM" ai>
              Booked ✓ Table for 4, terrace, tonight at 8pm. Reply STOP to cancel.
            </Bubble>
            <Bubble side="left" time="7:44 PM">
              Perfect! See you soon ❤️
            </Bubble>
          </div>
        </div>
      </div>
      {/* Floating Ema badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="absolute -right-12 top-20 hidden rounded-2xl border border-ema/30 bg-card/95 p-3 shadow-ema backdrop-blur md:block"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-ema">
            <Sparkles className="h-3.5 w-3.5 text-ema-foreground" />
          </div>
          <div>
            <div className="text-xs font-semibold">Ema</div>
            <div className="text-[10px] text-muted-foreground">+1 booking captured ✓</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Bubble({ side, time, ai, children }: { side: "left" | "right"; time: string; ai?: boolean; children: React.ReactNode }) {
  return (
    <div className={`flex ${side === "right" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[78%] rounded-lg px-3 py-1.5 text-xs ${
          side === "right" ? "bg-[#005C4B] text-white" : "bg-[#202C33] text-white"
        }`}
      >
        {ai && <div className="mb-0.5 text-[9px] font-semibold uppercase tracking-wide text-primary">Isola AI</div>}
        <div>{children}</div>
        <div className="mt-0.5 text-right text-[9px] opacity-60">{time}</div>
      </div>
    </div>
  );
}

function EmaPreviewCard() {
  return (
    <Card className="overflow-hidden border-ema/30 bg-card shadow-ema">
      <div className="flex items-center gap-3 border-b border-border bg-gradient-ema px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background/20 backdrop-blur">
          <Sparkles className="h-5 w-5 text-ema-foreground" />
        </div>
        <div>
          <div className="font-semibold text-ema-foreground">Ema · Daily digest</div>
          <div className="text-xs text-ema-foreground/70">Today, 7:00 AM</div>
        </div>
      </div>
      <div className="space-y-4 p-5">
        <p className="text-sm">
          Good morning ☀️ Here's what happened yesterday at <strong>Coalpot</strong>:
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Messages", value: "47" },
            { label: "Bookings", value: "12" },
            { label: "Revenue", value: "EC$2.4k" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg bg-accent/40 p-3 text-center">
              <div className="font-display text-xl font-bold text-gradient-ema">{s.value}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-warning/30 bg-warning/5 p-3 text-xs">
          ⚠️ 1 escalation needs you — Kareem L. asked about a private dinner. Want me to draft a reply?
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="flex-1 bg-gradient-ema text-ema-foreground hover:opacity-90">
            Reply
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            Snooze
          </Button>
        </div>
      </div>
    </Card>
  );
}

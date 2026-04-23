"use client";

import {
  Sparkles,
  Check,
  ArrowRight,
  Star,
  Utensils,
  Hotel,
  Stethoscope,
  Globe,
  MessageCircle,
  Users,
  Database,
  CreditCard,
  Phone,
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
import { testimonials, faqs, pricingTiers } from "@/lib/mock-data";
import { EmaOrb } from "@/components/brand/IsolaBrand";

const stackLayers = [
  {
    icon: MessageCircle,
    title: "Channels",
    desc: "WhatsApp, Instagram, Messenger, voice — every door your customers knock on, answered.",
    tags: ["WA Business", "IG", "FB", "SIP"],
    accent: "from-primary/20 to-primary/0",
  },
  {
    icon: Users,
    title: "AI workforce",
    desc: "A team of agents you configure: receptionist, booker, seller, support. Plus Ema, your chief of staff.",
    tags: ["Multi-agent", "Outbound AI", "Ema"],
    accent: "from-violet/20 to-violet/0",
  },
  {
    icon: Database,
    title: "Business systems",
    desc: "Live Odoo. Catalog that knows what's in stock. Invoices paid via Fiserv. Expenses approved on WhatsApp.",
    tags: ["Odoo", "Fiserv", "XCD"],
    accent: "from-aqua/20 to-aqua/0",
  },
  {
    icon: Globe,
    title: "Caribbean-native",
    desc: "Local Dominican numbers (1-767-818-XXXX). Airtime via Reloadly. Patois-aware agents.",
    tags: ["Magnus SIP", "Reloadly", "Patois"],
    accent: "from-ema/20 to-ema/0",
  },
];

const proofMetrics = [
  { value: "47", unit: "msgs/day", label: "answered without you" },
  { value: "12", unit: "bookings", label: "captured automatically" },
  { value: "EC$2.4k", unit: "deposits", label: "collected before noon" },
  { value: "<2s", unit: "reply time", label: "across every channel" },
];

const fitTogether = [
  { emoji: "💳", title: "Payments in XCD, native.", desc: "No Stripe-decline problem. Caribbean cards approved, first try." },
  { emoji: "📞", title: "Same number for text and voice.", desc: "Call your Dominica line — AI answers. Text it — AI answers. Books and charges you." },
  { emoji: "📦", title: "Inventory-aware AI.", desc: "Menu item 86'd in Odoo? Your agent stops offering it. Automatically." },
  { emoji: "🇩🇲", title: "Local everything.", desc: "Local number. Local currency. Local language. Local support — from the company that built your ISP." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />

      {/* HERO */}
      <section className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute inset-0 grain opacity-100" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-[1.15fr_1fr] lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-card/40 py-1.5 pl-1.5 pr-4 text-xs backdrop-blur">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-aurora text-[10px] font-bold text-foreground">
                <Sparkles className="h-3 w-3" />
              </span>
              <span className="text-muted-foreground">
                <span className="text-foreground">One stack.</span> One bill. One Caribbean vendor.
              </span>
            </div>

            <h1 className="mt-7 font-display text-[2.75rem] font-bold leading-[1.02] tracking-tight md:text-6xl lg:text-[4.5rem]">
              The AI operating system{" "}
              <span className="block text-gradient-aurora">that runs your business.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              WhatsApp. Voice. Bookings. Payments. ERP. One AI team — led by{" "}
              <span className="font-semibold text-foreground">Ema</span>, your chief of staff —
              answering, booking, and billing while you sleep.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                asChild
                className="group h-12 rounded-full bg-gradient-primary px-7 text-primary-foreground shadow-glow hover:opacity-95"
              >
                <a href="/auth/sign-up" className="gap-2">
                  Start free — 14 days
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-12 rounded-full border-border/60 bg-card/30 px-7 backdrop-blur hover:bg-card/60"
              >
                <a href="mailto:hello@isola.app?subject=Demo%20request">Book a demo</a>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/15">
                  <Check className="h-2.5 w-2.5 text-primary" />
                </span>
                Built by EPIC Communications
              </div>
              <div className="flex items-center gap-1.5">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/15">
                  <Check className="h-2.5 w-2.5 text-primary" />
                </span>
                Live in 48 hours
              </div>
              <div className="flex items-center gap-1.5">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/15">
                  <Check className="h-2.5 w-2.5 text-primary" />
                </span>
                Caribbean-native
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto"
          >
            <DeviceStack />
          </motion.div>
        </div>

        {/* Proof bar — anchors hero with quantifiable trust */}
        <div className="relative mx-auto max-w-7xl px-6 pb-16">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/40 bg-border/40 md:grid-cols-4">
            {proofMetrics.map((m) => (
              <div key={m.label} className="bg-card/60 p-5 backdrop-blur">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-2xl font-bold tabular-nums">{m.value}</span>
                  <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    {m.unit}
                  </span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ONE STACK — refined card grid */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            01 — The stack
          </div>
          <h2 className="mt-3 font-display text-4xl font-bold leading-tight md:text-5xl">
            Everything your business runs on.{" "}
            <span className="text-muted-foreground">Under one roof.</span>
          </h2>
          <p className="mt-5 text-muted-foreground">
            No Twilio. No Stripe-only limits. No WhatsApp-only narrowness. Your entire customer-facing
            and back-office stack — from a vendor who actually answers the phone.
          </p>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stackLayers.map((l, i) => (
            <motion.div
              key={l.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card className="group relative flex h-full flex-col gap-4 overflow-hidden border-border/40 bg-card/40 p-6 backdrop-blur transition-all hover:border-primary/40 hover:shadow-glow">
                <div
                  className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${l.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                />
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/40 bg-background/40">
                  <l.icon className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Layer 0{i + 1}
                  </div>
                  <h3 className="mt-1 font-display text-lg font-bold">{l.title}</h3>
                </div>
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{l.desc}</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {l.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border/40 bg-background/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MEET EMA — signature section */}
      <section className="relative overflow-hidden border-y border-border/30 bg-gradient-to-b from-card/30 via-background to-card/30 py-28 grain">
        <div className="absolute right-[-10%] top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-ema/10 blur-3xl" />
        <div className="absolute left-[-10%] top-0 h-[400px] w-[400px] rounded-full bg-violet/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <EmaConversation />
          </div>
          <div className="order-1 lg:order-2">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ema">
              02 — Meet Ema
            </div>
            <h2 className="mt-3 font-display text-4xl font-bold leading-[1.05] md:text-6xl">
              Your AI <span className="text-gradient-ema">chief of staff.</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Every Isola tenant gets their own Ema. She reads every conversation, every booking, every
              invoice. She digests your morning. She takes commands at any hour:
            </p>
            <div className="mt-6 space-y-2">
              {[
                "\"Launch the reminder campaign for tomorrow.\"",
                "\"Mark invoice 0042 paid.\"",
                "\"Top up EC$20 airtime for Mrs. Joseph.\"",
              ].map((q) => (
                <div
                  key={q}
                  className="rounded-xl border border-ema/20 bg-ema/5 px-4 py-2.5 text-sm font-medium italic text-foreground/90"
                >
                  {q}
                </div>
              ))}
            </div>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                "Daily 7am digest",
                "Weekly Monday summary",
                "Real-time escalations",
                "Execute by chat",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ema/15">
                    <Check className="h-3 w-3 text-ema" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* VERTICALS */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="mb-14 text-center">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            03 — Built for you
          </div>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            Vertical playbooks <span className="text-muted-foreground">from day one.</span>
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: Utensils,
              title: "Restaurants",
              quote: "Reservations captured, menu questions answered, tabs paid — without leaving the kitchen.",
              href: "/for/restaurants",
              tone: "primary",
            },
            {
              icon: Hotel,
              title: "Hotels",
              quote: "Guests text. Concierge runs itself. Check-ins, excursions, late-night questions — handled.",
              href: "/for/hotels",
              tone: "ema",
            },
            {
              icon: Stethoscope,
              title: "Clinics",
              quote: "Appointments, intake forms, reminders — handled while you focus on patients.",
              href: "/for/clinics",
              tone: "violet",
            },
          ].map((v) => (
            <a key={v.title} href={v.href}>
              <Card className="group relative h-full overflow-hidden border-border/40 bg-card/30 p-8 backdrop-blur transition-all hover:border-primary/40 hover:shadow-elegant">
                <div
                  className={`pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full opacity-50 blur-3xl transition-opacity group-hover:opacity-80 ${v.tone === "primary" ? "bg-primary/30" : v.tone === "ema" ? "bg-ema/30" : "bg-violet/30"}`}
                />
                <div className="relative">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-border/50 bg-background/50 backdrop-blur">
                    <v.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <h3 className="font-display text-2xl font-bold">{v.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/75">{v.quote}</p>
                  <div className="mt-6 flex items-center gap-1 text-sm font-medium text-primary">
                    Explore the playbook
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Card>
            </a>
          ))}
        </div>
      </section>

      {/* HOW IT FITS TOGETHER */}
      <section className="relative border-y border-border/30 bg-card/20 py-28">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              04 — Why one stack
            </div>
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
              Why one stack <span className="text-muted-foreground">beats five subscriptions.</span>
            </h2>
            <p className="mt-5 text-muted-foreground">
              Most SMB tools are glued together. Ours fit together. Here's what that means for your business:
            </p>
          </div>
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border/40 bg-border/40 md:grid-cols-2 lg:grid-cols-4">
            {fitTogether.map((f) => (
              <div key={f.title} className="bg-card/60 p-7 backdrop-blur">
                <div className="text-3xl">{f.emoji}</div>
                <h3 className="mt-4 font-display text-base font-bold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="mb-14 text-center">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            05 — Operators speak
          </div>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            Loved by the people <span className="text-muted-foreground">who run the islands.</span>
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Card
              key={t.name}
              className={`flex flex-col border-border/40 p-7 ${i === 1 ? "bg-gradient-to-br from-primary/5 to-transparent shadow-glow" : "bg-card/40"} backdrop-blur`}
            >
              <div className="mb-4 flex gap-0.5 text-warning">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="flex-1 text-base leading-relaxed text-foreground/90">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3 border-t border-border/40 pt-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-aurora text-xs font-bold text-foreground">
                  {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role} · {t.location}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="border-t border-border/30 bg-card/20 py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              06 — Pricing
            </div>
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
              Simple Caribbean pricing.
            </h2>
            <p className="mt-3 text-muted-foreground">All prices in EC$. Annual saves 20%.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {pricingTiers.map((t) => (
              <Card
                key={t.name}
                className={`relative flex flex-col p-8 ${t.badge ? "border-primary/50 bg-card shadow-elegant" : "border-border/40 bg-card/40"} backdrop-blur`}
              >
                {t.badge && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary text-primary-foreground shadow-glow">
                    {t.badge}
                  </Badge>
                )}
                <h3 className="font-display text-xl font-bold">{t.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
                <div className="mt-7 flex items-baseline gap-1">
                  <span className="font-display text-5xl font-bold tracking-tight">EC${t.price}</span>
                  <span className="text-sm text-muted-foreground">/mo</span>
                </div>
                <ul className="mt-7 flex-1 space-y-3 text-sm">
                  {t.features.slice(0, 3).map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/15">
                        <Check className="h-2.5 w-2.5 text-primary" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`mt-8 h-11 rounded-full ${t.badge ? "bg-gradient-primary text-primary-foreground shadow-glow" : ""}`}
                  variant={t.badge ? "default" : "outline"}
                  asChild
                >
                  <a href="/pricing">{t.cta}</a>
                </Button>
              </Card>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button variant="link" asChild>
              <a href="/pricing">See full pricing & comparison →</a>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-28">
        <div className="mb-10 text-center">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            07 — Questions
          </div>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            Frequently asked.
          </h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border/40">
              <AccordionTrigger className="text-left text-base hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden border-t border-border/30">
        <div className="absolute inset-0 bg-gradient-aurora opacity-90" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute inset-0 grain opacity-40" />
        <div className="relative mx-auto max-w-3xl px-6 py-24 text-center">
          <h2 className="font-display text-4xl font-bold leading-[1.05] text-foreground md:text-6xl">
            One stack. One bill. <br /> One Caribbean vendor.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-foreground/85">
            Built by a Caribbean ISP. Not rented from Silicon Valley.
          </p>
          <Button
            size="lg"
            className="mt-9 h-12 rounded-full bg-background px-7 text-foreground shadow-elegant hover:bg-background/90"
            asChild
          >
            <a href="/auth/sign-up" className="gap-2">
              Start your free trial <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

// ---------- Subcomponents ----------

function DeviceStack() {
  return (
    <div className="relative mx-auto h-[540px] w-[300px]">
      {/* Aurora glow behind device */}
      <div className="absolute -inset-12 -z-10 rounded-full bg-gradient-aurora opacity-20 blur-3xl" />

      {/* Phone */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="absolute inset-0 rounded-[3rem] border-[10px] border-foreground/80 bg-background shadow-float"
      >
        <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-foreground/80" />
        <div className="flex h-full flex-col overflow-hidden rounded-[2.2rem]">
          <div className="flex items-center gap-3 bg-[#075E54] px-4 pb-3 pt-8 text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">Coalpot Restaurant</div>
              <div className="text-[10px] opacity-80">online · typing…</div>
            </div>
          </div>
          <div className="flex-1 space-y-2 bg-[#0B141A] p-3">
            <Bubble side="left">Hey I want to book a table for 4 tonight at 8pm</Bubble>
            <Bubble side="right" ai>Hi Marcus! 🎉 Yes, 8pm for 4 is available. Want to pre-order our tasting menu?</Bubble>
            <Bubble side="left">what's on it</Bubble>
            <Bubble side="right" ai>Chef's Caribbean tasting — lobster, jerk lamb, rum cake. EC$180/person.</Bubble>
            <Bubble side="left">lets do it for all 4</Bubble>
          </div>
        </div>
      </motion.div>

      {/* Floating Ema digest */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.55, duration: 0.6 }}
        className="absolute -right-20 top-12 hidden w-56 rounded-2xl border border-ema/30 bg-card/95 p-3.5 shadow-ema backdrop-blur md:block"
      >
        <div className="mb-2 flex items-center gap-2">
          <EmaOrb size={28} pulse={false} />
          <div>
            <div className="text-xs font-semibold leading-none">Ema · 7am digest</div>
            <div className="mt-1 text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              Tuesday brief
            </div>
          </div>
        </div>
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Yesterday: <span className="font-semibold text-foreground">47 messages</span>,{" "}
          <span className="font-semibold text-foreground">12 bookings</span>, EC$2,400 in deposits.
        </p>
      </motion.div>

      {/* Floating call card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.75, duration: 0.6 }}
        className="absolute -left-16 bottom-16 hidden w-52 rounded-2xl border border-primary/30 bg-card/95 p-3.5 shadow-glow backdrop-blur md:block"
      >
        <div className="mb-1.5 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-primary">
            <Phone className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <div>
            <div className="text-xs font-semibold leading-none">AI voice call</div>
            <div className="mt-1 text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              Outbound · 2m 14s
            </div>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Maxine confirmed Saturday's booking.
        </p>
      </motion.div>
    </div>
  );
}

function Bubble({ side, ai, children }: { side: "left" | "right"; ai?: boolean; children: React.ReactNode }) {
  return (
    <div className={`flex ${side === "right" ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[78%] rounded-lg px-3 py-1.5 text-xs ${side === "right" ? "bg-[#005C4B] text-white" : "bg-[#202C33] text-white"}`}>
        {ai && <div className="mb-0.5 text-[9px] font-semibold uppercase tracking-wide text-primary">Maxine · AI</div>}
        <div>{children}</div>
      </div>
    </div>
  );
}

function EmaConversation() {
  const messages = [
    { side: "right", text: "How was yesterday?" },
    { side: "left", text: "Yesterday: 47 messages, 12 bookings, EC$2,400 in deposits. 1 escalation: Kareem L. asked about a private dinner. Friday is filling up — only 2 tables left for 7pm. Want me to push Instagram?" },
    { side: "right", text: "Launch the reminder campaign for tomorrow's bookings" },
    { side: "left", text: "On it. 14 reminders queued. AI voice calls start at 5pm. I'll report back when done." },
  ];
  return (
    <Card className="overflow-hidden border-ema/30 bg-card shadow-ema">
      <div className="relative flex items-center gap-3 border-b border-border/40 bg-gradient-ema-soft px-5 py-4">
        <div className="absolute inset-0 grain opacity-50" />
        <div className="relative">
          <EmaOrb size={42} pulse={false} />
        </div>
        <div className="relative">
          <div className="font-display text-base font-semibold">Ema</div>
          <div className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            +1 (767) 818-2002 · your private line
          </div>
        </div>
      </div>
      <div className="space-y-3 p-5">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.4, duration: 0.4 }}
            className={`flex ${m.side === "right" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.side === "right" ? "bg-primary/15 text-foreground" : "border border-ema/20 bg-ema/10 text-foreground"}`}>
              {m.text}
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

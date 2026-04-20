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
  Package,
  MapPin,
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

const stackLayers = [
  {
    icon: MessageCircle,
    title: "Channels",
    desc: "WhatsApp, Instagram DMs + comments + stories, Facebook Messenger, voice (inbound + outbound AI calls).",
    tags: ["WA Business", "IG", "FB", "SIP"],
  },
  {
    icon: Users,
    title: "AI workforce",
    desc: "A team of agents you configure: receptionist, booker, seller, support. Each with its own WhatsApp number. Plus Ema, your chief-of-staff.",
    tags: ["Multi-agent", "Outbound AI", "Ema"],
  },
  {
    icon: Database,
    title: "Business systems",
    desc: "Live Odoo integration. Catalog that knows what's in stock. Invoices paid via Fiserv. Expenses approved via WhatsApp.",
    tags: ["Odoo", "Fiserv", "Caribbean XCD"],
  },
  {
    icon: Globe,
    title: "Caribbean-native",
    desc: "Local Dominican numbers (1-767-818-XXXX). Airtime and bill pay via Reloadly. Patois-aware agents.",
    tags: ["Magnus SIP", "Reloadly", "Patois"],
  },
];

const fitTogether = [
  { emoji: "💳", title: "Payments in XCD, native.", desc: "No Stripe decline problem. Caribbean cards approved, first try." },
  { emoji: "📞", title: "Same number for text and voice.", desc: "Call your Dominica number — AI answers. Text it — AI answers. Book you. Charge you." },
  { emoji: "📦", title: "Inventory-aware AI.", desc: "Menu item 86'd in Odoo? Isola agent stops offering it. Automatically." },
  { emoji: "🇩🇲", title: "Local everything.", desc: "Local number. Local currency. Local language. Local support — from the company that built your ISP." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />

      {/* HERO */}
      <section className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.1fr_1fr] lg:py-28">
          <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge variant="outline" className="mb-6 border-primary/30 bg-primary/10 text-primary">

              <Sparkles className="mr-1.5 h-3 w-3" />
              One stack. One bill. One vendor.
            </Badge>
            <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              The operating system that{" "}
              <span className="text-gradient-primary">runs your business.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              WhatsApp, Instagram, Messenger, voice calls, bookings, payments, airtime top-ups, ERP —
              one AI team, one Caribbean stack, one monthly bill.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
                <a href="/auth/sign-up">Start free trial <ArrowRight className="ml-2 h-4 w-4" /></a>
              </Button>
              <Button size="lg" variant="ghost" asChild>
                <a href="mailto:hello@isola.app?subject=Demo%20request">Book a demo</a>
              </Button>
            </div>
            <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> Built by EPIC Communications</div>
              <div className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> Live in 48h</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="relative mx-auto">
            <DeviceStack />
          </motion.div>
        </div>
      </section>

      {/* ONE STACK */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-4xl font-bold md:text-5xl">Everything your business needs. Under one roof.</h2>
          <p className="mt-4 text-muted-foreground">
            No Twilio, no Stripe-only limitations, no WhatsApp-only narrowness. Your entire customer-facing
            and back-office stack, from a Caribbean vendor who actually answers the phone.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {stackLayers.map((l, i) => (
            <motion.div
              key={l.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Card className="flex h-full flex-col gap-3 border-border/60 bg-card/50 p-6 transition-all hover:border-primary/40 hover:shadow-glow">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                  <l.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-bold">{l.title}</h3>
                <p className="flex-1 text-sm text-muted-foreground">{l.desc}</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {l.tags.map((t) => (
                    <span key={t} className="rounded-md border border-border/60 bg-background/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MEET EMA */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-card/40 to-background py-24">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-ema/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <EmaConversation />
          </div>
          <div className="order-1 lg:order-2">
            <Badge className="mb-4 bg-ema/15 text-ema border-ema/30" variant="outline">
              <Sparkles className="mr-1.5 h-3 w-3" /> Meet Ema
            </Badge>
            <h2 className="font-display text-4xl font-bold leading-tight md:text-5xl">
              Your AI <span className="text-gradient-ema">chief of staff.</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Every Isola tenant gets their own Ema. She reads every conversation, every booking, every
              invoice, every expense. She sends you a digest each morning and takes your commands at any
              time: "Launch the reminder campaign." "Mark invoice 0042 paid." "Top up EC$20 airtime for
              Mrs. Joseph."
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Daily morning digest with the metrics that matter",
                "Weekly summary every Monday at 7am",
                "Real-time alerts when something needs you",
                "Execute campaigns, broadcasts, top-ups by chat",
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

      {/* VERTICALS */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 text-center">
          <h2 className="font-display text-4xl font-bold md:text-5xl">Built for Caribbean SMBs. Vertical playbooks from Day One.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Utensils, title: "Restaurants", quote: "Reservations captured, menu questions answered, tabs paid — without leaving the kitchen.", href: "/for/restaurants", grad: "from-primary/30 to-primary/5" },
            { icon: Hotel, title: "Hotels", quote: "Guests text you. Concierge runs itself. Check-ins, excursions, late-night questions — handled.", href: "/for/hotels", grad: "from-ema/30 to-ema/5" },
            { icon: Stethoscope, title: "Clinics", quote: "Appointments, intake forms, reminders — handled while you focus on patients.", href: "/for/clinics", grad: "from-violet/30 to-violet/5" },
          ].map((v) => (
            <a key={v.title} href={v.href}>
              <Card className={`group relative h-full overflow-hidden border-border/60 bg-gradient-to-br ${v.grad} p-8 transition-all hover:border-primary/50 hover:shadow-glow`}>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-background/40 backdrop-blur">
                  <v.icon className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="font-display text-2xl font-bold">{v.title}</h3>
                <p className="mt-3 text-sm text-foreground/80">{v.quote}</p>
                <div className="mt-5 flex items-center gap-1 text-sm font-medium text-primary">
                  Learn more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Card>
            </a>
          ))}
        </div>
      </section>

      {/* HOW IT FITS TOGETHER */}
      <section className="bg-card/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-4xl font-bold md:text-5xl">Why one stack beats five subscriptions.</h2>
            <p className="mt-4 text-muted-foreground">
              Most SMB tools are glued together. Ours fit together. Here's what that means for your business:
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {fitTogether.map((f) => (
              <Card key={f.title} className="border-border/60 bg-card/50 p-6">
                <div className="text-3xl">{f.emoji}</div>
                <h3 className="mt-3 font-display font-bold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </Card>
            ))}
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

      {/* PRICING PREVIEW */}
      <section className="bg-card/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className="font-display text-4xl font-bold md:text-5xl">Simple Caribbean pricing</h2>
            <p className="mt-3 text-muted-foreground">All prices in EC$. Annual saves 20%.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {pricingTiers.map((t) => (
              <Card key={t.name} className={`relative flex flex-col p-8 ${t.badge ? "border-primary/60 bg-card shadow-glow" : "border-border/60 bg-card/50"}`}>
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
                  {t.features.slice(0, 3).map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className={`mt-8 ${t.badge ? "bg-gradient-primary text-primary-foreground" : ""}`} variant={t.badge ? "default" : "outline"} asChild>
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

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-24">
        <h2 className="mb-8 text-center font-display text-4xl font-bold md:text-5xl">Frequently asked questions</h2>
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
            One stack. One bill. One vendor.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
            Built by a Caribbean ISP. Not rented from Silicon Valley.
          </p>
          <Button size="lg" variant="secondary" className="mt-8" asChild>
            <a href="/auth/sign-up">Start your free trial <ArrowRight className="ml-2 h-4 w-4" /></a>
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
    <div className="relative mx-auto h-[520px] w-[300px]">
      {/* Phone */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="absolute inset-0 rounded-[3rem] border-[10px] border-foreground/80 bg-background shadow-glow"
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
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="absolute -right-16 top-12 hidden w-52 rounded-2xl border border-ema/30 bg-card/95 p-3 shadow-ema backdrop-blur md:block"
      >
        <div className="mb-1.5 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-ema">
            <Sparkles className="h-3.5 w-3.5 text-ema-foreground" />
          </div>
          <div className="text-xs font-semibold">Ema · 7am digest</div>
        </div>
        <p className="text-[11px] text-muted-foreground">Yesterday: 47 messages, 12 bookings, EC$2,400.</p>
      </motion.div>

      {/* Floating call card */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute -left-12 bottom-16 hidden w-48 rounded-2xl border border-primary/30 bg-card/95 p-3 shadow-glow backdrop-blur md:block"
      >
        <div className="mb-1 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-primary">
            <Phone className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <div className="text-xs font-semibold">AI voice call</div>
        </div>
        <p className="text-[11px] text-muted-foreground">Maxine confirmed Saturday's booking.</p>
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
      <div className="flex items-center gap-3 border-b border-border bg-gradient-ema px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background/20 backdrop-blur">
          <Sparkles className="h-5 w-5 text-ema-foreground" />
        </div>
        <div>
          <div className="font-semibold text-ema-foreground">Ema</div>
          <div className="text-xs text-ema-foreground/70">+1 (767) 818-2002 · your private line</div>
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
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${m.side === "right" ? "bg-primary/15 text-foreground" : "bg-ema/10 text-foreground border border-ema/20"}`}>
              {m.text}
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

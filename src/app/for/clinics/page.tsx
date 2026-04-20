"use client";

import {
  ArrowRight,
  Star,
  Stethoscope,
  X,
  Sparkles,
  CalendarCheck,
  PhoneCall,
  ClipboardList,
  Pill,
  Users,
  ScanLine,
  HeartPulse,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const pains = [
  "Monday morning reception chaos",
  "No-shows costing you a day of revenue a month",
  "Patients asking for appointments at 10pm",
  "Paper intake forms that nobody wants to fill out",
];

const capabilities = [
  { icon: CalendarCheck, t: "Appointment booking", d: "Routed to the right doctor, respects recurring availability." },
  { icon: PhoneCall, t: "AI voice reminder calls", d: "Day before every appointment. Dramatically reduces no-shows." },
  { icon: ClipboardList, t: "Intake forms via WhatsApp", d: "Signed, secured, saved to patient record." },
  { icon: Pill, t: "Prescription refill requests", d: "Triaged and routed (Phase 2 for actual e-prescribing)." },
  { icon: Users, t: "Multi-doctor scheduling", d: "Knows who's in, who's on call, who's out." },
  { icon: ScanLine, t: "Insurance card capture", d: "Customer snaps a photo. OCR extracts. Filed in Odoo." },
  { icon: HeartPulse, t: "Post-visit care instructions", d: "Sent automatically 2h after visit." },
  { icon: CreditCard, t: "Billing + co-pay", d: "Fiserv link for co-pay, paid in XCD." },
];

const emaPrompts = [
  "Remind me to call the Haitian consulate about Mrs. Charles's visa letter",
  "How many appointments do I have Monday? Any gaps?",
  "Send the weekly schedule to my MA",
];

export default function ClinicsPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />

      <section className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center">
          <Badge variant="outline" className="mb-6 border-primary/30 bg-primary/10 text-primary">
            <Stethoscope className="mr-1.5 h-3 w-3" /> For Clinics & Practices
          </Badge>
          <h1 className="font-display text-5xl font-bold leading-[1.05] md:text-6xl">
            Patients text. You treat. <span className="text-gradient-primary">Isola handles the rest.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Appointments scheduled, reminders sent by AI voice call, intake forms via WhatsApp,
            prescriptions refilled — while you focus on care.
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
        <h2 className="mb-12 text-center font-display text-3xl font-bold md:text-4xl">What Isola does for clinics</h2>
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
            "We added <span className="text-gradient-primary">40 appointments a week</span> without
            hiring anyone. Isola confirms every booking by voice the day before. No-shows dropped 60%.
            My reception team finally takes a lunch break."
          </p>
          <div className="mt-6">
            <div className="font-semibold">Dr. Alvarez</div>
            <div className="text-sm text-muted-foreground">Founder, Pediatric Clinic · Castries, Saint Lucia</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="mb-10 text-center">
          <Badge variant="outline" className="mb-3 border-ema/30 bg-ema/10 text-ema">
            <Sparkles className="mr-1.5 h-3 w-3" /> How clinics use Ema
          </Badge>
          <h2 className="font-display text-3xl font-bold md:text-4xl">Your AI practice manager.</h2>
        </div>
        <div className="space-y-3">
          {emaPrompts.map((p) => (
            <div key={p} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl bg-primary/15 px-4 py-2.5 text-sm">{p}</div>
            </div>
          ))}
        </div>
      </section>

      {/* COMPLIANCE */}
      <section className="mx-auto max-w-3xl px-6 pb-12">
        <Card className="border-border/60 bg-card/50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display font-semibold">Compliance</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Isola stores patient data securely — encrypted at rest, access logged. We're compliant
                with the Dominica Data Protection Act. HIPAA / US compliance coming Phase 3 for Caribbean
                clinics serving US patients.
              </p>
            </div>
          </div>
        </Card>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20">
        <Card className="border-primary/40 bg-gradient-to-br from-primary/10 to-card p-8 text-center shadow-glow">
          <div className="text-sm uppercase tracking-wider text-muted-foreground">Pro tier</div>
          <div className="mt-2 font-display text-4xl font-bold">EC$249<span className="text-lg text-muted-foreground">/mo</span></div>
          <p className="mt-3 text-sm text-muted-foreground">
            For single-doctor practices. Business tier for multi-doctor.
          </p>
        </Card>
      </section>

      <section className="relative overflow-hidden bg-gradient-primary py-20">
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-4xl font-bold text-primary-foreground">Give your reception team a teammate.</h2>
          <p className="mt-3 text-primary-foreground/80">Live in 48 hours · No credit card required</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" variant="secondary" asChild>
              <a href="/auth/sign-up">Start free trial <ArrowRight className="ml-2 h-4 w-4" /></a>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <a href="mailto:hello@isola.app?subject=Clinic%20demo">Talk to our team</a>
            </Button>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

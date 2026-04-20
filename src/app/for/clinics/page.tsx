"use client";

import { ArrowRight, Star, Stethoscope, ShieldCheck, CalendarCheck, Bell, FileLock2 } from "lucide-react";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
            More appointments. <span className="text-gradient-primary">Fewer no-shows.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Patients book themselves. Reminders go out automatically. Your reception team finally
            gets to breathe — and your calendar stays full.
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
        <h2 className="mb-3 text-center font-display text-3xl font-bold md:text-4xl">The reception bottleneck</h2>
        <p className="mb-12 text-center text-muted-foreground">Every minute on the phone is a minute not with patients.</p>
        <div className="grid gap-5 md:grid-cols-2">
          {[
            { t: "Phone lines constantly busy", d: "Patients give up and call the next clinic." },
            { t: "20% no-show rate killing revenue", d: "Empty slots = wasted hours and lost income." },
            { t: "Appointment requests after hours", d: "WhatsApps pile up overnight, answered too late." },
            { t: "Reception burnout is real", d: "Same questions, all day, every day. Staff turnover is high." },
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
            "We added <span className="text-gradient-primary">40 appointments per week</span> without adding any staff. Ema's morning digest tells me everything."
          </p>
          <div className="mt-6">
            <div className="font-semibold">Dr. Alvarez</div>
            <div className="text-sm text-muted-foreground">Founder, Pediatric Clinic · Castries, Saint Lucia</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="mb-12 text-center font-display text-3xl font-bold md:text-4xl">What Isola does for clinics</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {[
            { icon: CalendarCheck, t: "Self-serve appointment booking", d: "Patients pick a slot over WhatsApp. Direct to your calendar." },
            { icon: Bell, t: "Automated reminders + confirmations", d: "Slashes no-shows by up to 60%. Reschedules handled automatically." },
            { icon: ShieldCheck, t: "Knows what to escalate", d: "Urgent symptoms, prescription renewals, sensitive cases — straight to you." },
            { icon: FileLock2, t: "Privacy-first by design", d: "Encrypted at rest and in transit. Compliant with Caribbean health data laws." },
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
          <h2 className="font-display text-4xl font-bold text-primary-foreground">Give your reception team a teammate.</h2>
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

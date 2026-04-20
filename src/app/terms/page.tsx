"use client";

import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />

      <article className="mx-auto max-w-3xl px-6 py-20">
        <p className="text-sm text-muted-foreground">Last updated: January 1, 2026</p>
        <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Terms of Service</h1>
        <p className="mt-4 text-muted-foreground">
          By using Isola, you agree to these terms. Read them carefully — they're written in plain
          English on purpose.
        </p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-semibold">1. The service</h2>
            <p className="mt-2 text-muted-foreground">
              Isola provides AI-powered customer messaging across WhatsApp, Instagram, Messenger, and
              voice, plus the Ema chief-of-staff agent. We operate the platform; you operate your
              business.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">2. Your responsibilities</h2>
            <p className="mt-2 text-muted-foreground">
              You're responsible for the accuracy of business data you upload (menu, prices, hours),
              for complying with WhatsApp Business policies, and for honoring bookings or commitments
              the AI makes on your behalf.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">3. Acceptable use</h2>
            <p className="mt-2 text-muted-foreground">
              No spam, no illegal content, no harassment, no prohibited industries (gambling,
              adult content, weapons). Violations may result in immediate account suspension.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">4. Billing</h2>
            <p className="mt-2 text-muted-foreground">
              Plans are billed monthly or annually in advance. 14-day free trial, no credit card
              required to start. Cancel anytime — you keep access through the end of your billing
              period. Refunds within 30 days of first paid invoice, no questions asked.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">5. AI limitations</h2>
            <p className="mt-2 text-muted-foreground">
              AI is powerful but not perfect. We do our best to keep responses accurate and on-brand,
              but you remain responsible for what's communicated to your customers. Use the
              escalation rules to keep humans in the loop on sensitive topics.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">6. Uptime & support</h2>
            <p className="mt-2 text-muted-foreground">
              We target 99.9% monthly uptime. Status at <a className="text-primary hover:underline" href="https://status.isola.app">status.isola.app</a>.
              Support response times: Starter (48h), Pro (12h), Business (1h).
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">7. Liability</h2>
            <p className="mt-2 text-muted-foreground">
              Our total liability for any claim is limited to the amount you paid Isola in the 12
              months before the claim. We are not liable for indirect or consequential damages
              (lost profits, lost data, etc.).
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">8. Termination</h2>
            <p className="mt-2 text-muted-foreground">
              You can cancel anytime from your dashboard. We can suspend or terminate accounts that
              violate these terms with at least 7 days' notice (or immediately for serious abuse).
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">9. Governing law</h2>
            <p className="mt-2 text-muted-foreground">
              These terms are governed by the laws of the Commonwealth of Dominica. Disputes resolved
              by arbitration in Roseau.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">10. Contact</h2>
            <p className="mt-2 text-muted-foreground">
              <a className="text-primary hover:underline" href="mailto:legal@isola.app">legal@isola.app</a> · Isola Ltd., Roseau, Dominica.
            </p>
          </section>
        </div>
      </article>

      <MarketingFooter />
    </div>
  );
}

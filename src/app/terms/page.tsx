"use client";

import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />

      <article className="mx-auto max-w-3xl px-6 py-20">
        <p className="text-sm text-muted-foreground">Last updated: April 1, 2026</p>
        <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Terms of Service</h1>
        <p className="mt-4 text-muted-foreground">
          By using Isola, you agree to these terms. Plain English on purpose.
        </p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-semibold">1. The service</h2>
            <p className="mt-2 text-muted-foreground">
              Isola provides AI agents across WhatsApp, Instagram, Messenger, and voice; the Ema chief-of-staff
              agent; integrations with Odoo, Fiserv, and Reloadly. Operated by EPIC Communications.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">2. Your responsibilities</h2>
            <p className="mt-2 text-muted-foreground">
              Accuracy of data you upload (menu, prices, hours), compliance with WhatsApp Business policies,
              and honoring bookings or commitments the AI makes on your behalf.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">3. Acceptable use</h2>
            <p className="mt-2 text-muted-foreground">
              No spam, illegal content, harassment, or prohibited industries (gambling, adult content, weapons).
              Violations may result in immediate account suspension.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">4. Service level</h2>
            <p className="mt-2 text-muted-foreground">
              99.5% uptime guarantee for voice and WhatsApp channels (because we own the stack). Status at{" "}
              <a className="text-primary hover:underline" href="https://status.isola.app">status.isola.app</a>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">5. Data ownership</h2>
            <p className="mt-2 text-muted-foreground">
              Your conversations, your customers, your Odoo — are yours. Exportable anytime. Deleted within
              30 days of cancellation.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">6. Fair use on voice minutes</h2>
            <p className="mt-2 text-muted-foreground">
              Overage billed at EC$0.05–0.15/min as per plan; hard cap of 10,000 min/mo on Unlimited to
              prevent abuse.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">7. AI disclosure requirement</h2>
            <p className="mt-2 text-muted-foreground">
              You agree that your AI agents will identify as AI when asked, per Meta's WhatsApp Business
              Policy. Customers can always reach a human by replying HUMAN.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">8. Billing</h2>
            <p className="mt-2 text-muted-foreground">
              Plans are billed monthly or annually in advance. 14-day free trial, no credit card required.
              Cancel anytime — you keep access through the end of your billing period.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">9. AI limitations</h2>
            <p className="mt-2 text-muted-foreground">
              AI is powerful but not perfect. You remain responsible for what's communicated. Use the
              escalation rules to keep humans in the loop on sensitive topics.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">10. Liability</h2>
            <p className="mt-2 text-muted-foreground">
              Our total liability for any claim is limited to the amount you paid in the 12 months before
              the claim. Not liable for indirect or consequential damages (lost profits, lost data, etc.).
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">11. Termination</h2>
            <p className="mt-2 text-muted-foreground">
              You can cancel anytime from your dashboard. We can suspend or terminate accounts that violate
              these terms with at least 7 days' notice (or immediately for serious abuse).
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">12. Governing law</h2>
            <p className="mt-2 text-muted-foreground">
              Governed by the laws of the Commonwealth of Dominica. Disputes resolved by arbitration in Roseau.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">13. Contact</h2>
            <p className="mt-2 text-muted-foreground">
              <a className="text-primary hover:underline" href="mailto:legal@epic.dm">legal@epic.dm</a> ·
              EPIC Communications · Roseau, Dominica.
            </p>
          </section>
        </div>
      </article>

      <MarketingFooter />
    </div>
  );
}

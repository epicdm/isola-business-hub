"use client";

import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />

      <article className="mx-auto max-w-3xl px-6 py-20">
        <p className="text-sm text-muted-foreground">Last updated: April 1, 2026</p>
        <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Privacy Policy</h1>
        <p className="mt-4 text-muted-foreground">
          Isola ("we", "us", "our") is operated by EPIC Communications in Dominica. This policy explains
          what we collect, why, and how we protect it.
        </p>

        <div className="prose prose-invert mt-10 max-w-none space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-semibold">1. Information we collect</h2>
            <p className="mt-2 text-muted-foreground">
              (a) Account data you give us (name, email, business info), (b) messages and call transcripts
              processed by our AI on your behalf, (c) usage data (logins, feature use). We do not sell your
              data. Ever.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">2. How we use it</h2>
            <p className="mt-2 text-muted-foreground">
              To provide the service, train your private AI on your business data (never on other customers'
              data), send product updates, and improve reliability. AI prompts are not retained beyond what's
              needed to answer your customer.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">3. Where your data lives</h2>
            <p className="mt-2 text-muted-foreground">
              Encrypted at rest (AES-256) and in transit (TLS 1.3). Hosted in compliance with the Dominica
              Data Protection Act and Caribbean data laws.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">4. What we share with third-party services</h2>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Meta (WhatsApp Business API, Instagram, Facebook):</strong> message content only for delivery.</li>
              <li><strong className="text-foreground">Fiserv (via EPIC gateway):</strong> card + payment data per PCI requirements; we never see the card.</li>
              <li><strong className="text-foreground">Reloadly:</strong> recipient phone for airtime/bill pay only.</li>
              <li><strong className="text-foreground">Odoo:</strong> data stays in your own Odoo; we only READ (and WRITE what you explicitly authorize) via API.</li>
              <li><strong className="text-foreground">DigitalOcean:</strong> data hosting, encrypted at rest, SOC 2 region.</li>
              <li><strong className="text-foreground">OpenRouter / Anthropic / DeepSeek:</strong> AI processing; conversations NOT used for training.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">5. Your rights</h2>
            <p className="mt-2 text-muted-foreground">
              Access, export, correct, or delete your data anytime by emailing{" "}
              <a className="text-primary hover:underline" href="mailto:privacy@epic.dm">privacy@epic.dm</a>.
              We respond within 7 days.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">6. Cookies</h2>
            <p className="mt-2 text-muted-foreground">
              Essential cookies for authentication and analytics cookies (PostHog) to understand product
              usage. No third-party advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">7. Children</h2>
            <p className="mt-2 text-muted-foreground">
              Isola is not intended for use by children under 16. We do not knowingly collect data from minors.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">8. Changes</h2>
            <p className="mt-2 text-muted-foreground">
              If we change this policy, we'll email account owners and post the updated version here at
              least 14 days before changes take effect.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">9. Contact</h2>
            <p className="mt-2 text-muted-foreground">
              Questions about your data? Email{" "}
              <a className="text-primary hover:underline" href="mailto:privacy@epic.dm">privacy@epic.dm</a>{" "}
              or message our Ema bot on WhatsApp. EPIC Communications · Roseau, Dominica.
            </p>
          </section>
        </div>
      </article>

      <MarketingFooter />
    </div>
  );
}

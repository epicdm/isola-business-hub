"use client";

import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />

      <article className="mx-auto max-w-3xl px-6 py-20">
        <p className="text-sm text-muted-foreground">Last updated: January 1, 2026</p>
        <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Privacy Policy</h1>
        <p className="mt-4 text-muted-foreground">
          Isola ("we", "us", "our") respects your privacy. This policy explains what we collect, why,
          and how we protect it.
        </p>

        <div className="prose prose-invert mt-10 max-w-none space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-semibold">1. Information we collect</h2>
            <p className="mt-2 text-muted-foreground">
              We collect (a) account data you give us (name, email, business info), (b) messages and
              call transcripts processed by our AI on your behalf, and (c) usage data (logins, feature
              use). We do not sell your data. Ever.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">2. How we use it</h2>
            <p className="mt-2 text-muted-foreground">
              To provide the service, train your private AI on your business data (never on other
              customers' data), send product updates, and improve reliability. AI prompts are not
              retained beyond what's needed to answer your customer.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">3. Where your data lives</h2>
            <p className="mt-2 text-muted-foreground">
              Encrypted at rest (AES-256) and in transit (TLS 1.3). Hosted in compliance with GDPR
              and Caribbean data protection laws. We use sub-processors (Meta WhatsApp Business API,
              Stripe, OpenAI/Anthropic, Cloudflare). Full list available on request.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">4. Your rights</h2>
            <p className="mt-2 text-muted-foreground">
              Access, export, correct, or delete your data anytime by emailing
              {" "}<a className="text-primary hover:underline" href="mailto:privacy@isola.app">privacy@isola.app</a>. We respond within 7 days.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">5. Cookies</h2>
            <p className="mt-2 text-muted-foreground">
              We use essential cookies for authentication and analytics cookies (PostHog) to
              understand product usage. No third-party advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">6. Children</h2>
            <p className="mt-2 text-muted-foreground">
              Isola is not intended for use by children under 16. We do not knowingly collect data
              from minors.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">7. Changes</h2>
            <p className="mt-2 text-muted-foreground">
              If we change this policy, we'll email account owners and post the updated version here
              at least 14 days before changes take effect.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">8. Contact</h2>
            <p className="mt-2 text-muted-foreground">
              Questions? <a className="text-primary hover:underline" href="mailto:privacy@isola.app">privacy@isola.app</a> · Isola Ltd., Roseau, Dominica.
            </p>
          </section>
        </div>
      </article>

      <MarketingFooter />
    </div>
  );
}

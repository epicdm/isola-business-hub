import { IsolaWordmark } from "@/components/brand/IsolaBrand";

export default function MarketingFooter() {
  return (
    <footer className="relative border-t border-border/30 bg-sidebar grain">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <IsolaWordmark size={32} showSub />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            The operating system for the Caribbean business. WhatsApp, voice, payments, and an AI chief of
            staff — under one roof.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border/40 bg-card/40 px-3 py-1.5 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            Live in Dominica · Saint Lucia · Grenada
          </div>
        </div>
        <div>
          <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Product</h4>
          <ul className="space-y-2.5 text-sm text-foreground/70">
            <li><a href="/pricing" className="hover:text-foreground">Pricing</a></li>
            <li><a href="/how-it-works" className="hover:text-foreground">How it works</a></li>
            <li><a href="/for/restaurants" className="hover:text-foreground">For restaurants</a></li>
            <li><a href="/for/hotels" className="hover:text-foreground">For hotels</a></li>
            <li><a href="/for/clinics" className="hover:text-foreground">For clinics</a></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Company</h4>
          <ul className="space-y-2.5 text-sm text-foreground/70">
            <li><a href="/auth/sign-in" className="hover:text-foreground">Sign in</a></li>
            <li><a href="/auth/sign-up" className="hover:text-foreground">Get started</a></li>
            <li><a href="mailto:hello@isola.app" className="hover:text-foreground">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Legal</h4>
          <ul className="space-y-2.5 text-sm text-foreground/70">
            <li><a href="/privacy" className="hover:text-foreground">Privacy</a></li>
            <li><a href="/terms" className="hover:text-foreground">Terms</a></li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-3 border-t border-border/30 px-6 py-5 text-center text-xs text-muted-foreground sm:flex-row">
        <span>© 2026 Isola. Made in the Caribbean.</span>
        <span className="hidden h-3 w-px bg-border sm:block" />
        <a href="https://epic.communications" className="flex items-center gap-2 transition-colors hover:text-foreground">
          <img src="/logo-epic.png" alt="Epic Communications" className="h-5 w-5 rounded bg-white p-0.5" />
          <span>Built by Epic Communications</span>
        </a>
      </div>
    </footer>
  );
}

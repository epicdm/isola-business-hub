import { Sparkles } from "lucide-react";

export default function MarketingFooter() {
  return (
    <footer className="border-t border-border/40 bg-sidebar">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold">Isola</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built by EPIC Communications in Dominica. An operating system for the Caribbean business.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="/pricing" className="hover:text-foreground">Pricing</a></li>
            <li><a href="/how-it-works" className="hover:text-foreground">How it works</a></li>
            <li><a href="/for/restaurants" className="hover:text-foreground">For restaurants</a></li>
            <li><a href="/for/hotels" className="hover:text-foreground">For hotels</a></li>
            <li><a href="/for/clinics" className="hover:text-foreground">For clinics</a></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="/auth/sign-in" className="hover:text-foreground">Sign in</a></li>
            <li><a href="/auth/sign-up" className="hover:text-foreground">Get started</a></li>
            <li><a href="mailto:hello@isola.app" className="hover:text-foreground">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="/privacy" className="hover:text-foreground">Privacy</a></li>
            <li><a href="/terms" className="hover:text-foreground">Terms</a></li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-3 border-t border-border/40 px-6 py-5 text-center text-xs text-muted-foreground sm:flex-row">
        <span>© 2026 Isola. Made in the Caribbean. 🌴</span>
        <span className="hidden h-3 w-px bg-border sm:block" />
        <a href="https://epic.communications" className="flex items-center gap-2 transition-colors hover:text-foreground">
          <img src="/logo-epic.png" alt="Epic Communications" className="h-5 w-5 rounded bg-white p-0.5" />
          <span>Built by Epic Communications</span>
        </a>
      </div>
    </footer>
  );
}

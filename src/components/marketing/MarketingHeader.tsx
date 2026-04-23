import { Sparkles, Menu, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IsolaWordmark } from "@/components/brand/IsolaBrand";

const navLinks = [
  { href: "/for/restaurants", label: "Restaurants" },
  { href: "/for/hotels", label: "Hotels" },
  { href: "/for/clinics", label: "Clinics" },
  { href: "/pricing", label: "Pricing" },
  { href: "/how-it-works", label: "How it works" },
];

export default function MarketingHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/30 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="/" className="flex items-center">
          <IsolaWordmark size={30} />
        </a>
        <nav className="hidden items-center gap-1 rounded-full border border-border/40 bg-card/40 px-2 py-1 text-sm md:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <a href="/auth/sign-in">Sign in</a>
          </Button>
          <Button
            size="sm"
            className="group bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95"
            asChild
          >
            <a href="/auth/sign-up" className="gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Start free
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>
          </Button>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          <Menu className="h-5 w-5" />
        </button>
      </div>
      {open && (
        <div className="border-t border-border/40 bg-background/95 px-6 py-4 md:hidden">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="block py-2 text-sm">
              {l.label}
            </a>
          ))}
          <div className="mt-3 flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <a href="/auth/sign-in">Sign in</a>
            </Button>
            <Button size="sm" className="flex-1 bg-gradient-primary text-primary-foreground" asChild>
              <a href="/auth/sign-up">Start trial</a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export const SHORTCUTS_OPEN_EVENT = "isola:shortcuts-open";
export const NAV_MODE_EVENT = "isola:nav-mode";

/** Programmatic open — used by the system menu and the `?` key handler. */
export function openShortcutsOverlay() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(SHORTCUTS_OPEN_EVENT));
}

type Shortcut = {
  /** Array of key tokens — composite "G then H" renders as two kbd pills. */
  keys: string[];
  description: string;
};

type Group = { title: string; rows: Shortcut[] };

const GROUPS: Group[] = [
  {
    title: "Global",
    rows: [
      { keys: ["⌘", "K"], description: "Open command palette" },
      { keys: ["?"], description: "Open this shortcuts sheet" },
      { keys: ["Esc"], description: "Close any open overlay" },
    ],
  },
  {
    title: "Navigation",
    rows: [
      { keys: ["G", "then", "H"], description: "Go to Home" },
      { keys: ["G", "then", "I"], description: "Go to Inbox" },
      { keys: ["G", "then", "B"], description: "Go to Bookings" },
      { keys: ["G", "then", "A"], description: "Go to Agents (or Team)" },
      { keys: ["G", "then", "S"], description: "Go to Settings" },
    ],
  },
  {
    title: "Agents",
    rows: [
      { keys: ["⌘", "."], description: "Pause all agents (Do Not Disturb)" },
      { keys: ["⌘", "/"], description: "Open Ema chat" },
    ],
  },
];

export default function ShortcutsOverlay() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen((v) => !v);
    window.addEventListener(SHORTCUTS_OPEN_EVENT, handler);
    return () => window.removeEventListener(SHORTCUTS_OPEN_EVENT, handler);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="flex max-h-[90vh] w-[calc(100vw-2rem)] max-w-[560px] flex-col gap-0 overflow-hidden border-border/40 bg-card p-4 shadow-float sm:p-6"
      >
        <DialogTitle className="pr-8 font-display text-base font-semibold">
          Keyboard shortcuts
        </DialogTitle>
        <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Move at the speed of thought
        </div>

        <div className="-mx-1 mt-4 flex-1 space-y-5 overflow-y-auto px-1 sm:mt-5">
          {GROUPS.map((g) => (
            <section key={g.title}>
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
                {g.title}
              </div>
              <ul className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-[auto_1fr]">
                {g.rows.map((s) => (
                  <li
                    key={s.description}
                    className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm sm:contents"
                  >
                    <span className="flex shrink-0 items-center gap-1">
                      {s.keys.map((k, i) =>
                        k === "then" ? (
                          <span
                            key={i}
                            className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70"
                          >
                            then
                          </span>
                        ) : (
                          <kbd
                            key={i}
                            className="rounded border border-border/60 bg-background/40 px-1.5 py-0.5 text-[11px] font-mono text-foreground/80"
                          >
                            {k}
                          </kbd>
                        ),
                      )}
                    </span>
                    <span className="text-foreground/80">{s.description}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-4 shrink-0 border-t border-border/40 pt-3 text-[11px] text-muted-foreground">
          Tip: shortcuts are disabled while you're typing in an input.
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Floating "GO TO…" pill rendered while the user is in nav mode (after
 * pressing G). Listens for the same event the layout dispatches so it can
 * appear from anywhere without prop drilling.
 */
export function NavModeHint() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<{ active: boolean }>).detail;
      setActive(!!detail?.active);
    };
    window.addEventListener(NAV_MODE_EVENT, onChange as EventListener);
    return () => window.removeEventListener(NAV_MODE_EVENT, onChange as EventListener);
  }, []);

  if (!active) return null;
  return (
    <div className="pointer-events-none fixed left-1/2 top-1/2 z-[60] -translate-x-1/2 -translate-y-1/2">
      <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/95 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-foreground shadow-float backdrop-blur-xl">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/70 opacity-70" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
        </span>
        Go to…
        <span className="ml-1 flex items-center gap-1 normal-case tracking-normal text-muted-foreground">
          <kbd className="rounded border border-border/60 bg-background/40 px-1.5 py-0.5 font-mono text-[10px]">H</kbd>
          <kbd className="rounded border border-border/60 bg-background/40 px-1.5 py-0.5 font-mono text-[10px]">I</kbd>
          <kbd className="rounded border border-border/60 bg-background/40 px-1.5 py-0.5 font-mono text-[10px]">B</kbd>
          <kbd className="rounded border border-border/60 bg-background/40 px-1.5 py-0.5 font-mono text-[10px]">A</kbd>
          <kbd className="rounded border border-border/60 bg-background/40 px-1.5 py-0.5 font-mono text-[10px]">S</kbd>
        </span>
      </div>
    </div>
  );
}

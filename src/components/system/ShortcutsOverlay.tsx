"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const rowRefs = useRef<Array<HTMLLIElement | null>>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Place the cursor at the end of the existing query (preserved across opens)
  // so the user can keep typing without re-selecting text.
  const focusInput = () => {
    const el = inputRef.current;
    if (!el) return;
    el.focus();
    const len = el.value.length;
    try {
      el.setSelectionRange(len, len);
    } catch {
      // Some input types don't support selection — safe to ignore.
    }
  };

  useEffect(() => {
    const handler = () => setOpen((v) => !v);
    window.addEventListener(SHORTCUTS_OPEN_EVENT, handler);
    return () => window.removeEventListener(SHORTCUTS_OPEN_EVENT, handler);
  }, []);

  // Note: we intentionally preserve `query` across close/reopen so pressing
  // Escape (or clicking outside) doesn't wipe what the user just typed.
  // `activeIndex` is reset by the query/length effects below.

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GROUPS;
    return GROUPS.map((g) => ({
      ...g,
      rows: g.rows.filter((s) => {
        const haystack = `${g.title} ${s.description} ${s.keys.join(" ")}`.toLowerCase();
        return haystack.includes(q);
      }),
    })).filter((g) => g.rows.length > 0);
  }, [query]);

  // Flat list mirrors visual order, used for arrow-key navigation and to
  // resolve the currently highlighted row for the details strip.
  const flatRows = useMemo(
    () => filteredGroups.flatMap((g) => g.rows.map((row) => ({ group: g.title, row }))),
    [filteredGroups],
  );
  const flatRowsCount = flatRows.length;
  const activeRow = flatRows[activeIndex];

  // Clamp + reset the active index when results change.
  useEffect(() => {
    setActiveIndex((i) => {
      if (flatRowsCount === 0) return 0;
      if (i > flatRowsCount - 1) return flatRowsCount - 1;
      return i;
    });
  }, [flatRowsCount]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Keep the highlighted row in view as the user arrows through results.
  useEffect(() => {
    rowRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Escape closes immediately. Radix already handles this on the Dialog,
    // but we wire it explicitly so the behavior survives any future Dialog
    // refactor and can't be disabled by a stopPropagation upstream. We do
    // NOT clear `query` — preserving the search box is the whole point.
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
      return;
    }
    if (flatRowsCount === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % flatRowsCount);
      focusInput();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + flatRowsCount) % flatRowsCount);
      focusInput();
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
      focusInput();
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(flatRowsCount - 1);
      focusInput();
    } else if (e.key === "Enter") {
      // Close the overlay so the user can actually press the shortcut they
      // just looked up. The selection is informational, not actionable.
      e.preventDefault();
      setOpen(false);
    }
  };

  // Visual index counter, incremented as we render rows in document order.
  let flatIdx = -1;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onKeyDown={handleKeyDown}
        // Radix tries to focus the first focusable element; we override so
        // the search input always wins, even with the close button present.
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          // rAF lets the dialog finish mounting before we steal focus.
          requestAnimationFrame(focusInput);
        }}
        className="flex max-h-[90vh] w-[calc(100vw-2rem)] max-w-[560px] flex-col gap-0 overflow-hidden border-border/40 bg-card p-4 shadow-float sm:p-6"
      >
        <DialogTitle className="pr-8 font-display text-base font-semibold">
          Keyboard shortcuts
        </DialogTitle>
        <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Move at the speed of thought
        </div>

        <div className="relative mt-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search shortcuts…"
            aria-label="Filter shortcuts"
            aria-controls="shortcuts-listbox"
            aria-activedescendant={
              flatRowsCount > 0 ? `shortcut-row-${activeIndex}` : undefined
            }
            className="h-9 border-border/40 bg-background/40 pl-8 text-sm placeholder:text-muted-foreground/60"
          />
        </div>

        <div
          id="shortcuts-listbox"
          role="listbox"
          aria-label="Shortcuts"
          className="-mx-1 mt-4 flex-1 space-y-5 overflow-y-auto px-1 sm:mt-5"
        >
          {filteredGroups.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No shortcuts match “{query}”.
            </div>
          ) : null}
          {filteredGroups.map((g) => (
            <section key={g.title}>
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
                {g.title}
              </div>
              <ul className="flex flex-col gap-1">
                {g.rows.map((s) => {
                  flatIdx += 1;
                  const idx = flatIdx;
                  const isActive = idx === activeIndex;
                  return (
                    <li
                      key={s.description}
                      ref={(el) => {
                        rowRefs.current[idx] = el;
                      }}
                      id={`shortcut-row-${idx}`}
                      role="option"
                      aria-selected={isActive}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={cn(
                        "flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md px-2 py-1.5 text-sm transition-colors",
                        isActive
                          ? "bg-primary/10 ring-1 ring-inset ring-primary/30 text-foreground"
                          : "text-foreground/80",
                      )}
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
                      <span>{s.description}</span>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        {/* Details strip — full label + group for the currently highlighted row. */}
        <div
          aria-live="polite"
          className="mt-3 shrink-0 rounded-md border border-border/40 bg-background/30 px-3 py-2 text-sm"
        >
          {activeRow ? (
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
                  {activeRow.group}
                </div>
                <div className="mt-0.5 truncate text-foreground">
                  {activeRow.row.description}
                </div>
              </div>
              <span className="flex shrink-0 items-center gap-1">
                {activeRow.row.keys.map((k, i) =>
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
            </div>
          ) : (
            <div className="text-muted-foreground">
              No shortcut selected — type to search or press ↓ to start.
            </div>
          )}
        </div>

        <div className="mt-3 shrink-0 border-t border-border/40 pt-3 text-[11px] text-muted-foreground">
          <span className="hidden sm:inline">↑↓ navigate · Enter / Esc close · </span>
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

"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { globalAlerts, type AlertItem, type AlertCategory } from "@/lib/mock-data";
import { dispatchAskEma } from "./InsightCardMenu";

const TABS: Array<{ id: "all" | AlertCategory; label: string }> = [
  { id: "all", label: "All" },
  { id: "critical", label: "Critical" },
  { id: "escalation", label: "Escalations" },
  { id: "system", label: "System" },
];

const SNOOZE_OPTIONS = [
  { label: "Tomorrow 9:00 AM", value: "tomorrow" },
  { label: "Next Monday", value: "monday" },
  { label: "7 days", value: "7d" },
  { label: "Custom…", value: "custom" },
];

const categoryStyles: Record<AlertCategory, { ring: string; tag: string; label: string }> = {
  critical: { ring: "border-l-destructive", tag: "bg-destructive/15 text-destructive", label: "Critical" },
  escalation: { ring: "border-l-warning", tag: "bg-warning/15 text-warning", label: "Escalation" },
  system: { ring: "border-l-muted-foreground/40", tag: "bg-muted text-muted-foreground", label: "System" },
  ema: { ring: "border-l-ema", tag: "bg-ema/15 text-ema", label: "Ema" },
  snoozed: { ring: "border-l-muted-foreground/30", tag: "bg-muted text-muted-foreground", label: "Snoozed" },
};

export default function AlertTray() {
  const [items, setItems] = useState<AlertItem[]>(globalAlerts);
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("all");
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Hydrate persisted read state from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("isola.alerts.read");
      if (!raw) return;
      const readSet: string[] = JSON.parse(raw);
      setItems((prev) => prev.map((a) => (readSet.includes(a.id) ? { ...a, read: true } : a)));
    } catch {
      /* ignore */
    }
  }, []);

  const persistRead = (next: AlertItem[]) => {
    if (typeof window === "undefined") return;
    const ids = next.filter((a) => a.read).map((a) => a.id);
    window.localStorage.setItem("isola.alerts.read", JSON.stringify(ids));
  };

  const visibleAll = items.filter((a) => a.category !== "snoozed" || tab === "all");
  const filtered = useMemo(() => {
    if (tab === "all") return visibleAll;
    if (tab === "escalation") return items.filter((a) => a.category === "escalation" || a.category === "critical");
    return items.filter((a) => a.category === tab);
  }, [items, tab, visibleAll]);

  const unreadCount = items.filter((a) => !a.read && (a.category === "critical" || a.category === "escalation")).length;
  const hasCritical = items.some((a) => !a.read && a.category === "critical");
  const hasEscalation = items.some((a) => !a.read && a.category === "escalation");
  const dotClass = hasCritical ? "bg-destructive" : hasEscalation ? "bg-warning" : "bg-muted-foreground";

  const markAllRead = () => {
    const next = items.map((a) => ({ ...a, read: true }));
    setItems(next);
    persistRead(next);
    toast.success("All alerts marked as read");
  };

  const dismiss = (id: string) => {
    const next = items.filter((a) => a.id !== id);
    setItems(next);
    persistRead(next);
  };

  const markRead = (id: string) => {
    const next = items.map((a) => (a.id === id ? { ...a, read: true } : a));
    setItems(next);
    persistRead(next);
  };

  const handleAction = (a: AlertItem, action: AlertItem["actions"][number]) => {
    switch (action) {
      case "review":
        markRead(a.id);
        toast(`Opening: ${a.title}`, { description: "Routing to the relevant record…" });
        break;
      case "dismiss":
        dismiss(a.id);
        toast.success("Alert dismissed");
        break;
      case "takeover":
        markRead(a.id);
        toast.success("Conversation taken over", { description: "Customer is now connected to you directly." });
        break;
      case "call":
        markRead(a.id);
        toast.success("Calling now via EPIC voice…");
        break;
      case "ask-ema":
        dispatchAskEma({
          cardTitle: a.title,
          summary: a.body ?? a.title,
          prompt: `Help me with: "${a.title}". ${a.body ?? ""}`.trim(),
        });
        markRead(a.id);
        setOpen(false);
        toast("Ema is on it");
        break;
      case "snooze":
        // handled by submenu
        break;
    }
  };

  const snooze = (a: AlertItem, label: string) => {
    dismiss(a.id);
    toast.success(`Snoozed until ${label}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Alerts${unreadCount ? ` · ${unreadCount} unread` : ""}`}
          className="relative flex h-9 w-9 items-center justify-center rounded-md border border-border/60 bg-background/40 text-muted-foreground transition hover:bg-accent hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className={`absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white ${dotClass}`}>
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[400px] max-w-[calc(100vw-2rem)] p-0"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">Alerts</span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-destructive/15 px-2 py-0.5 text-[10px] font-semibold text-destructive">
                {unreadCount} new
              </span>
            )}
          </div>
          <button
            onClick={markAllRead}
            className="text-xs text-muted-foreground transition hover:text-foreground"
          >
            Mark all read
          </button>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList className="grid w-full grid-cols-4 rounded-none border-b border-border bg-transparent p-0">
            {TABS.map((t) => (
              <TabsTrigger
                key={t.id}
                value={t.id}
                className="rounded-none border-b-2 border-transparent py-2 text-xs data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="max-h-[480px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              You're all caught up. 🎉
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {filtered.map((a) => {
                const styles = categoryStyles[a.category];
                const isExpanded = expanded[a.id];
                return (
                  <ContextMenu key={a.id}>
                    <ContextMenuTrigger asChild>
                      <li
                        className={`group border-l-2 ${styles.ring} px-3 py-3 text-sm transition hover:bg-accent/30 ${a.read ? "opacity-70" : ""}`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="mt-0.5 text-base leading-none" aria-hidden>{a.icon}</span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <button
                                onClick={() => setExpanded((e) => ({ ...e, [a.id]: !isExpanded }))}
                                className={`text-left font-medium leading-snug ${isExpanded ? "" : "line-clamp-2"}`}
                              >
                                {a.title}
                              </button>
                              {!a.read && <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />}
                            </div>
                            {a.body && isExpanded && (
                              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{a.body}</p>
                            )}
                            <div className="mt-2 flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                                <span className={`rounded px-1.5 py-0.5 ${styles.tag}`}>{styles.label}</span>
                                <span>{a.createdAt}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                {a.actions.includes("takeover") && (
                                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => handleAction(a, "takeover")}>
                                    Take over
                                  </Button>
                                )}
                                {a.actions.includes("call") && (
                                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => handleAction(a, "call")}>
                                    Call
                                  </Button>
                                )}
                                {a.actions.includes("review") && (
                                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => handleAction(a, "review")}>
                                    Review
                                  </Button>
                                )}
                                {a.actions.includes("ask-ema") && (
                                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-ema hover:text-ema" onClick={() => handleAction(a, "ask-ema")}>
                                    Ask Ema
                                  </Button>
                                )}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <button
                                      aria-label="More actions"
                                      className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"
                                    >
                                      <MoreHorizontal className="h-3.5 w-3.5" />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48">
                                    {a.actions.includes("snooze") && (
                                      <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>Snooze…</DropdownMenuSubTrigger>
                                        <DropdownMenuSubContent>
                                          {SNOOZE_OPTIONS.map((s) => (
                                            <DropdownMenuItem key={s.value} onSelect={() => snooze(a, s.label)}>
                                              {s.label}
                                            </DropdownMenuItem>
                                          ))}
                                        </DropdownMenuSubContent>
                                      </DropdownMenuSub>
                                    )}
                                    {!a.read && (
                                      <DropdownMenuItem onSelect={() => markRead(a.id)}>
                                        Mark as read
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onSelect={() => dismiss(a.id)}>
                                      Dismiss
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ContextMenuTrigger>
                    <ContextMenuContent className="w-48">
                      {a.actions.includes("review") && (
                        <ContextMenuItem onSelect={() => handleAction(a, "review")}>Review</ContextMenuItem>
                      )}
                      {a.actions.includes("takeover") && (
                        <ContextMenuItem onSelect={() => handleAction(a, "takeover")}>Take over</ContextMenuItem>
                      )}
                      {a.actions.includes("call") && (
                        <ContextMenuItem onSelect={() => handleAction(a, "call")}>Call now</ContextMenuItem>
                      )}
                      {a.actions.includes("ask-ema") && (
                        <ContextMenuItem onSelect={() => handleAction(a, "ask-ema")}>Ask Ema</ContextMenuItem>
                      )}
                      <ContextMenuItem onSelect={() => dismiss(a.id)}>Dismiss</ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                );
              })}
            </ul>
          )}
        </div>

        <div className="border-t border-border px-4 py-2 text-center">
          <button
            className="text-xs text-muted-foreground transition hover:text-foreground"
            onClick={() => toast("Alerts archive coming soon")}
          >
            View all alerts →
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

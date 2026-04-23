"use client";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Sparkles,
  Home,
  Users2,
  ShieldCheck,
  Package,
  Calendar,
  Users,
  Clock,
  BookOpen,
  Antenna,
  Plug,
  CreditCard,
  Settings as SettingsIcon,
  Bot,
  History,
  CornerDownLeft,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { agents } from "@/lib/mock-data";
import { readRecentPaths, type RecentPath } from "@/lib/recent-paths";
import { dispatchAskEma } from "@/components/dashboard/InsightCardMenu";

export const COMMAND_PALETTE_OPEN_EVENT = "isola:cmdk-open";

type NavTarget = {
  label: string;
  path: string;
  icon: typeof Home;
  keywords?: string;
};

const NAV_TARGETS: NavTarget[] = [
  { label: "Home", path: "/dashboard/home", icon: Home, keywords: "command center overview" },
  { label: "Drafts on probation", path: "/dashboard/drafts", icon: ShieldCheck, keywords: "approve review" },
  { label: "Inbox", path: "/dashboard/inbox", icon: Users2, keywords: "messages conversations" },
  { label: "Catalog", path: "/dashboard/catalog", icon: Package, keywords: "menu items products" },
  { label: "Bookings", path: "/dashboard/bookings", icon: Calendar, keywords: "reservations" },
  { label: "Contacts", path: "/dashboard/contacts", icon: Users, keywords: "customers" },
  { label: "Hours", path: "/dashboard/hours", icon: Clock },
  { label: "Knowledge", path: "/dashboard/knowledge", icon: BookOpen, keywords: "faq answers" },
  { label: "Channels", path: "/dashboard/channels", icon: Antenna, keywords: "whatsapp instagram voice" },
  { label: "Integrations", path: "/dashboard/integrations", icon: Plug, keywords: "odoo stripe" },
  { label: "Billing", path: "/dashboard/billing", icon: CreditCard, keywords: "plan invoice" },
  { label: "Team", path: "/dashboard/team", icon: Users2, keywords: "agents roster" },
  { label: "Settings", path: "/dashboard/settings", icon: SettingsIcon, keywords: "preferences" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [recents, setRecents] = useState<RecentPath[]>([]);
  const navigate = useNavigate();

  // Global Cmd/Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // External open trigger (header pill, kbd hint, sidebar menu)
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener(COMMAND_PALETTE_OPEN_EVENT, handler);
    return () => window.removeEventListener(COMMAND_PALETTE_OPEN_EVENT, handler);
  }, []);

  // Recents — refresh whenever palette opens
  useEffect(() => {
    if (!open) return;
    setRecents(readRecentPaths());
    setQuery("");
  }, [open]);

  const trimmed = query.trim();

  const recentSet = useMemo(() => new Set(recents.map((r) => r.path)), [recents]);

  const goto = (path: string) => {
    setOpen(false);
    // Slight defer so the dialog can unmount cleanly before navigation.
    requestAnimationFrame(() => {
      // Generic string nav — TanStack accepts absolute paths at runtime.
      navigate({ to: path } as never);
    });
  };

  const askEma = (q: string) => {
    setOpen(false);
    requestAnimationFrame(() => {
      dispatchAskEma({
        cardTitle: "From command palette",
        summary: q,
        prompt: q,
      });
    });
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        value={query}
        onValueChange={setQuery}
        placeholder="Ask Ema or jump to anything…"
      />
      <CommandList className="max-h-[420px]">
        <CommandEmpty>No results. Try a different query.</CommandEmpty>

        {trimmed.length > 0 && (
          <CommandGroup heading="Ask Ema">
            <PaletteItem
              value={`ask-ema-${trimmed}`}
              onSelect={() => askEma(trimmed)}
              icon={<Sparkles className="h-4 w-4 text-ema" />}
              label={<>Ask Ema: <span className="text-foreground">"{trimmed}"</span></>}
              shortcut={<CornerDownLeft className="h-3 w-3" />}
            />
          </CommandGroup>
        )}

        <CommandGroup heading="Jump to">
          {NAV_TARGETS.map((t) => {
            const Icon = t.icon;
            return (
              <PaletteItem
                key={t.path}
                value={`nav-${t.path} ${t.label} ${t.keywords ?? ""}`}
                onSelect={() => goto(t.path)}
                icon={<Icon className="h-4 w-4 text-muted-foreground" />}
                label={t.label}
                meta={t.path.replace("/dashboard/", "")}
              />
            );
          })}
        </CommandGroup>

        {recents.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Recent">
              {recents
                .filter((r) => recentSet.has(r.path))
                .map((r) => (
                  <PaletteItem
                    key={`recent-${r.path}`}
                    value={`recent-${r.path} ${r.label}`}
                    onSelect={() => goto(r.path)}
                    icon={<History className="h-4 w-4 text-muted-foreground" />}
                    label={r.label}
                    meta={r.path.replace("/dashboard/", "")}
                  />
                ))}
            </CommandGroup>
          </>
        )}

        <CommandSeparator />
        <CommandGroup heading="Agents">
          {agents.map((a) => (
            <PaletteItem
              key={`agent-${a.id}`}
              value={`agent-${a.id} ${a.name} ${a.templateLabel}`}
              onSelect={() => goto(`/dashboard/agent/${a.id}`)}
              icon={<Bot className="h-4 w-4 text-primary" />}
              label={a.name}
              meta={a.templateLabel}
            />
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

function PaletteItem({
  value,
  onSelect,
  icon,
  label,
  meta,
  shortcut,
}: {
  value: string;
  onSelect: () => void;
  icon: React.ReactNode;
  label: React.ReactNode;
  meta?: string;
  shortcut?: React.ReactNode;
}) {
  return (
    <CommandItem
      value={value}
      onSelect={onSelect}
      className="group relative my-0.5 cursor-pointer rounded-md px-2.5 py-2 data-[selected=true]:bg-ema/15 data-[selected=true]:text-foreground"
    >
      {/* Active indicator — aurora bar on the left, mirrors sidebar pattern */}
      <span
        aria-hidden
        className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-aurora opacity-0 shadow-glow group-data-[selected=true]:opacity-100"
      />
      <span className="ml-1 flex h-6 w-6 shrink-0 items-center justify-center">{icon}</span>
      <span className="min-w-0 flex-1 truncate text-sm">{label}</span>
      {meta && (
        <span className="ml-auto truncate text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {meta}
        </span>
      )}
      {shortcut && <span className="ml-2 text-muted-foreground">{shortcut}</span>}
    </CommandItem>
  );
}

/** Convenience for components that want to programmatically open the palette. */
export function openCommandPalette() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(COMMAND_PALETTE_OPEN_EVENT));
}

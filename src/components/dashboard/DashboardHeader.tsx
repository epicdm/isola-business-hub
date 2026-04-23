"use client";

import { Search, Users2, User, Command as CommandIcon } from "lucide-react";
import AlertTray from "./AlertTray";
import { useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { accountDefaults, agents } from "@/lib/mock-data";
import { getInitials, readProfile } from "@/lib/profile";
import { openCommandPalette } from "@/components/system/CommandPalette";

const MOCK_MODE_KEY = "isola.mockMode";

type MockMode = "solo" | "team";

export default function DashboardHeader() {
  const [profile, setProfile] = useState<{ contactName?: string }>({});
  const [mode, setMode] = useState<MockMode>("solo");
  const location = useLocation();

  useEffect(() => {
    setProfile(readProfile());
    if (typeof window !== "undefined") {
      const v = window.localStorage.getItem(MOCK_MODE_KEY);
      setMode(v === "team" ? "team" : "solo");
    }
  }, []);

  const contactName = profile.contactName?.trim() || accountDefaults.ownerName;
  const initials = getInitials(contactName);

  const path = location.pathname;
  let pageTitle: string | null = null;
  let pageEyebrow = "Workspace";
  if (path === "/dashboard/home" || path === "/dashboard" || path === "/dashboard/") {
    pageTitle = "Command center";
    pageEyebrow = "Isola";
  } else if (path.startsWith("/dashboard/agent/")) {
    const id = path.split("/")[3];
    const agent = agents.find((a) => a.id === id);
    if (agent) pageTitle = `${agent.name} — workspace`;
  } else if (path === "/dashboard/team") {
    pageTitle = "Your team";
  } else if (path === "/dashboard/drafts") {
    pageTitle = "Drafts on probation";
  }

  const flipMode = () => {
    if (typeof window === "undefined") return;
    const next: MockMode = mode === "solo" ? "team" : "solo";
    window.localStorage.setItem(MOCK_MODE_KEY, next);
    window.location.href = "/dashboard";
  };

  // When the page title takes over the search slot, give the user a separate
  // way to invoke the command palette so it's reachable without remembering ⌘K.
  const showInlineCmdK = !!pageTitle;

  return (
    <header className="sticky top-8 z-30 flex h-16 items-center gap-3 border-b border-border/40 bg-background/70 px-5 backdrop-blur-xl lg:px-7">
      {pageTitle ? (
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {pageEyebrow}
          </div>
          <h1 className="mt-0.5 truncate font-display text-base font-semibold leading-tight">
            {pageTitle}
          </h1>
        </div>
      ) : (
        <button
          type="button"
          onClick={openCommandPalette}
          className="group relative max-w-md flex-1 cursor-pointer text-left"
          aria-label="Open command palette"
        >
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <div className="flex h-10 w-full items-center rounded-full border border-border/50 bg-card/40 pl-10 pr-4 text-sm text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:text-foreground">
            Search conversations, contacts, invoices…
          </div>
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-border/60 bg-background/40 px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline-block">
            ⌘K
          </kbd>
        </button>
      )}
      <div className="ml-auto flex items-center gap-2.5">
        {showInlineCmdK && (
          <button
            type="button"
            onClick={openCommandPalette}
            title="Open command palette (⌘K)"
            className="hidden items-center gap-1.5 rounded-full border border-border/60 bg-card/40 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:border-primary/40 hover:bg-accent hover:text-foreground sm:inline-flex"
          >
            <CommandIcon className="h-3 w-3" />
            <span className="tabular-nums normal-case tracking-normal">⌘K</span>
          </button>
        )}
        <button
          type="button"
          onClick={flipMode}
          title={`Demo: switch to ${mode === "solo" ? "team" : "solo"} view`}
          className="hidden items-center gap-1.5 rounded-full border border-dashed border-border/60 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:border-primary/40 hover:bg-accent hover:text-foreground sm:inline-flex"
        >
          {mode === "solo" ? <User className="h-3 w-3" /> : <Users2 className="h-3 w-3" />}
          {mode === "solo" ? "Solo" : "Team"} view
        </button>
        <AlertTray />
        <div className="relative">
          <span className="absolute -inset-0.5 rounded-full bg-gradient-aurora opacity-60 blur-sm" />
          <div
            aria-label={contactName}
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-card text-xs font-semibold ring-1 ring-border"
          >
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}

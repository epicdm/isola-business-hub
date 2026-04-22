"use client";

import { Search, Users2, User } from "lucide-react";
import AlertTray from "./AlertTray";
import { useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { accountDefaults, agents } from "@/lib/mock-data";
import { getInitials, readProfile } from "@/lib/profile";

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
  if (path.startsWith("/dashboard/agent/")) {
    const id = path.split("/")[3];
    const agent = agents.find((a) => a.id === id);
    if (agent) pageTitle = `${agent.name} — your Isola`;
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

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl lg:px-6">
      {pageTitle ? (
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-base font-semibold">{pageTitle}</h1>
        </div>
      ) : (
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search conversations, contacts, invoices…"
            className="h-9 w-full rounded-md border border-border bg-background/60 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      )}
      <div className="ml-auto flex items-center gap-3">
        <button
          type="button"
          onClick={flipMode}
          title={`Demo: switch to ${mode === "solo" ? "team" : "solo"} view`}
          className="hidden items-center gap-1 rounded-full border border-dashed border-border px-2.5 py-1 text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:inline-flex"
        >
          {mode === "solo" ? <User className="h-3 w-3" /> : <Users2 className="h-3 w-3" />}
          {mode === "solo" ? "Solo" : "Team"} mode
        </button>
        <AlertTray />
        <div
          aria-label={contactName}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-xs font-semibold"
        >
          {initials}
        </div>
      </div>
    </header>
  );
}

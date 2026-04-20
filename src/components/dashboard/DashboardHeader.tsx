"use client";

import { Search } from "lucide-react";
import AlertTray from "./AlertTray";
import { useEffect, useState } from "react";
import { accountDefaults } from "@/lib/mock-data";
import { getInitials, readProfile } from "@/lib/profile";

export default function DashboardHeader() {
  const [profile, setProfile] = useState<{ contactName?: string }>({});
  useEffect(() => {
    setProfile(readProfile());
  }, []);
  const contactName = profile.contactName?.trim() || accountDefaults.ownerName;
  const initials = getInitials(contactName);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl lg:px-6">
      <div className="relative flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search conversations, contacts, invoices…"
          className="h-9 w-full rounded-md border border-border bg-background/60 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>
      <div className="ml-auto flex items-center gap-3">
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

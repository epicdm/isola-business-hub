"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import EmaChatWidget from "@/components/dashboard/EmaChatWidget";
import SystemStatusBar from "@/components/system/SystemStatusBar";
import CommandPalette from "@/components/system/CommandPalette";
import { pushRecentPath } from "@/lib/recent-paths";

// Best-effort label for a dashboard path — drives the "Recent" row in the
// command palette. We keep this dumb on purpose; the palette lives at the
// shell layer and shouldn't reach into per-page state.
function labelFor(path: string): string {
  if (path === "/dashboard" || path === "/dashboard/" || path === "/dashboard/home") return "Home";
  if (path.startsWith("/dashboard/agent/")) return "Agent workspace";
  const seg = path.replace(/^\/dashboard\//, "").split("/")[0] ?? "";
  if (!seg) return "Dashboard";
  return seg
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function DashboardLayout({
  children,
  currentPath = "/dashboard",
}: {
  children: ReactNode;
  currentPath?: string;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const loggedIn = window.localStorage.getItem("mockLoggedIn") === "true";
    if (!loggedIn) {
      navigate({ to: "/auth/$pathname", params: { pathname: "sign-in" } });
    } else {
      setAllowed(true);
    }
  }, [navigate]);

  // Track every dashboard route visit so the command palette has live recents.
  useEffect(() => {
    if (!allowed) return;
    pushRecentPath(location.pathname, labelFor(location.pathname));
  }, [allowed, location.pathname]);

  if (!allowed) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar currentPath={currentPath} />
      <div className="flex min-w-0 flex-1 flex-col">
        <SystemStatusBar />
        <DashboardHeader />
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
      <EmaChatWidget />
      <CommandPalette />
    </div>
  );
}

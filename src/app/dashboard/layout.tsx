"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import EmaChatWidget from "@/components/dashboard/EmaChatWidget";
import SystemStatusBar from "@/components/system/SystemStatusBar";
import CommandPalette from "@/components/system/CommandPalette";
import ShortcutsOverlay, {
  NavModeHint,
  NAV_MODE_EVENT,
  openShortcutsOverlay,
} from "@/components/system/ShortcutsOverlay";
import { pushRecentPath } from "@/lib/recent-paths";
import { agents } from "@/lib/mock-data";
import { toggleDnd } from "@/lib/system-flags";

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

// Lookup table for the "G then X" navigation pattern.
const NAV_MAP: Record<string, string> = {
  h: "/dashboard/home",
  i: "/dashboard/inbox",
  b: "/dashboard/bookings",
  s: "/dashboard/settings",
  // 'a' is resolved at runtime against MOCK_MODE_KEY (solo → first agent;
  // team → /dashboard/team).
};

function isTypingTarget(t: EventTarget | null): boolean {
  if (!(t instanceof HTMLElement)) return false;
  if (t.isContentEditable) return true;
  const tag = t.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
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

  // ---------------------------------------------------------------------------
  // Global keyboard shortcuts
  // ---------------------------------------------------------------------------
  // We keep nav-mode in a ref so timers/closures don't fight a stale render.
  const navModeRef = useRef(false);
  const navTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!allowed) return;

    const setNavMode = (active: boolean) => {
      navModeRef.current = active;
      window.dispatchEvent(
        new CustomEvent(NAV_MODE_EVENT, { detail: { active } }),
      );
    };

    const clearNavTimer = () => {
      if (navTimerRef.current !== null) {
        window.clearTimeout(navTimerRef.current);
        navTimerRef.current = null;
      }
    };

    const goAgents = () => {
      const mode =
        window.localStorage.getItem("isola.mockMode") === "team" ? "team" : "solo";
      if (mode === "solo" && agents[0]) {
        navigate({
          to: "/dashboard/agent/$agentId",
          params: { agentId: agents[0].id },
        });
      } else {
        navigate({ to: "/dashboard/team" });
      }
    };

    const handler = (e: KeyboardEvent) => {
      // Don't hijack typing.
      if (isTypingTarget(e.target)) return;

      const key = e.key;
      const lower = key.toLowerCase();

      // Cmd/Ctrl combos — agent shortcuts.
      if (e.metaKey || e.ctrlKey) {
        if (key === ".") {
          e.preventDefault();
          const next = toggleDnd();
          toast(next ? "Do Not Disturb on" : "Do Not Disturb off");
          return;
        }
        if (key === "/") {
          e.preventDefault();
          window.dispatchEvent(
            new CustomEvent("isola:ask-ema", {
              detail: {
                cardTitle: "Open Ema",
                summary: "",
                prompt: "",
              },
            }),
          );
          return;
        }
        return; // let other Cmd/Ctrl combos through (e.g. ⌘K is handled in CommandPalette)
      }

      // ? opens the shortcuts overlay.
      if (key === "?") {
        e.preventDefault();
        openShortcutsOverlay();
        return;
      }

      // Esc clears nav mode (other overlays close themselves via Radix).
      if (key === "Escape" && navModeRef.current) {
        clearNavTimer();
        setNavMode(false);
        return;
      }

      // G enters nav mode for 1.5s.
      if (lower === "g" && !navModeRef.current) {
        e.preventDefault();
        setNavMode(true);
        clearNavTimer();
        navTimerRef.current = window.setTimeout(() => {
          setNavMode(false);
          navTimerRef.current = null;
        }, 1500);
        return;
      }

      // While in nav mode, the next letter dispatches navigation.
      if (navModeRef.current) {
        e.preventDefault();
        clearNavTimer();
        setNavMode(false);
        if (lower === "a") {
          goAgents();
          return;
        }
        const dest = NAV_MAP[lower];
        if (dest) navigate({ to: dest });
      }
    };

    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      clearNavTimer();
    };
  }, [allowed, navigate]);

  if (!allowed) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar currentPath={currentPath} />
      <div className="flex min-w-0 flex-1 flex-col">
        <SystemStatusBar />
        <DashboardHeader />
        <main className="flex-1 overflow-x-hidden bg-hero-timed">{children}</main>
      </div>
      <EmaChatWidget />
      <CommandPalette />
      <ShortcutsOverlay />
      <NavModeHint />
    </div>
  );
}

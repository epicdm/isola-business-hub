import {
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
  LogOut,
  ChevronDown,
  Activity as ActivityIcon,
  PauseOctagon,
  Command as CommandIcon,
  Keyboard,
  Info,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { clearProfile, getInitials, readProfile } from "@/lib/profile";
import { accountDefaults, agents } from "@/lib/mock-data";
import logoEpic from "@/assets/logo-epic.png";
import { IsolaWordmark } from "@/components/brand/IsolaBrand";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { openCommandPalette } from "@/components/system/CommandPalette";
import AboutModal from "@/components/system/AboutModal";
import { DND_EVENT, readDnd, toggleDnd } from "@/lib/system-flags";

const MOCK_MODE_KEY = "isola.mockMode";

type MockMode = "solo" | "team";

function readMockMode(): MockMode {
  if (typeof window === "undefined") return "solo";
  const v = window.localStorage.getItem(MOCK_MODE_KEY);
  return v === "team" ? "team" : "solo";
}

export default function DashboardSidebar({ currentPath = "/dashboard" }: { currentPath?: string }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ contactName?: string; businessName?: string }>({});
  const [mode, setMode] = useState<MockMode>("solo");
  const [aboutOpen, setAboutOpen] = useState(false);
  const [dnd, setDnd] = useState(false);

  useEffect(() => {
    setProfile(readProfile());
    setMode(readMockMode());
    setDnd(readDnd());
    const onDnd = () => setDnd(readDnd());
    window.addEventListener(DND_EVENT, onDnd);
    return () => window.removeEventListener(DND_EVENT, onDnd);
  }, []);

  const contactName = profile.contactName?.trim() || accountDefaults.ownerName;
  const businessName = profile.businessName?.trim() || accountDefaults.businessName;
  const initials = getInitials(contactName);

  const firstAgentId = agents[0]?.id;
  const pendingDrafts = useMemo(
    () =>
      agents
        .filter((a) => a.status === "on_probation")
        .reduce((sum, a) => sum + (a.probationDrafts?.length ?? 0), 0),
    [],
  );

  const sections = useMemo(
    () => [
      {
        label: "Command center",
        items: [
          {
            href: "/dashboard/home",
            icon: Home,
            label: "Home",
          },
          {
            href: mode === "team" ? "/dashboard/team" : `/dashboard/agent/${firstAgentId}`,
            icon: Users2,
            label: mode === "team" ? "Team" : "Agent workspace",
          },
          {
            href: "/dashboard/drafts",
            icon: ShieldCheck,
            label: "Drafts on probation",
            badge: pendingDrafts > 0 ? pendingDrafts : undefined,
          },
        ],
      },
      {
        label: "Workspace",
        items: [
          { href: "/dashboard/catalog", icon: Package, label: "Catalog" },
          { href: "/dashboard/bookings", icon: Calendar, label: "Bookings" },
          { href: "/dashboard/contacts", icon: Users, label: "Contacts" },
          { href: "/dashboard/hours", icon: Clock, label: "Hours" },
          { href: "/dashboard/knowledge", icon: BookOpen, label: "Knowledge" },
        ],
      },
      {
        label: "Account",
        items: [
          { href: "/dashboard/channels", icon: Antenna, label: "Channels" },
          { href: "/dashboard/integrations", icon: Plug, label: "Integrations" },
          { href: "/dashboard/billing", icon: CreditCard, label: "Billing" },
          { href: "/dashboard/settings", icon: SettingsIcon, label: "Settings" },
        ],
      },
    ],
    [mode, firstAgentId, pendingDrafts],
  );

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("mockLoggedIn");
    }
    clearProfile();
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  return (
    <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
      <div className="sticky top-0 flex h-screen flex-col">
        <div className="flex h-16 items-center border-b border-sidebar-border px-5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Isola system menu"
                className="group/wordmark relative flex items-center gap-1.5 rounded-md transition-all duration-200 hover:-translate-y-[2px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <IsolaWordmark size={30} showSub />
                <ChevronDown className="h-3 w-3 text-muted-foreground opacity-0 transition-all group-hover/wordmark:opacity-100 group-data-[state=open]/wordmark:opacity-100" />
                <span
                  aria-hidden
                  className="pointer-events-none absolute -inset-2 rounded-xl opacity-0 shadow-glow transition-opacity duration-200 group-hover/wordmark:opacity-100"
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              sideOffset={8}
              className="w-60 border-border/40 bg-card/95 backdrop-blur-xl"
            >
              <DropdownMenuLabel className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Isola
              </DropdownMenuLabel>
              <DropdownMenuItem
                onSelect={() => {
                  navigate({ to: "/dashboard/home" });
                  // Scroll to executive header on next tick.
                  requestAnimationFrame(() => {
                    document
                      .querySelector("[data-executive-header]")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  });
                }}
              >
                <ActivityIcon className="h-4 w-4" /> System status
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  const next = toggleDnd();
                  toast(next ? "All agents paused" : "Agents resumed", {
                    description: next
                      ? "Do Not Disturb mode is on. Status bar will reflect this."
                      : "Agents are back on the floor.",
                  });
                }}
              >
                <PauseOctagon className={`h-4 w-4 ${dnd ? "text-warning" : ""}`} />
                {dnd ? "Resume all agents" : "Pause all agents"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  const next = toggleDnd();
                  toast(next ? "Do Not Disturb on" : "Do Not Disturb off");
                }}
              >
                <PauseOctagon className="h-4 w-4" /> Do not disturb mode
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => openCommandPalette()}>
                <CommandIcon className="h-4 w-4" /> Command palette
                <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  toast("Keyboard shortcuts", {
                    description: "Coming soon — ⌘K for the command palette in the meantime.",
                  });
                }}
              >
                <Keyboard className="h-4 w-4" /> Keyboard shortcuts
                <DropdownMenuShortcut>?</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setAboutOpen(true)}>
                <Info className="h-4 w-4" /> About Isola
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleSignOut}>
                <LogOut className="h-4 w-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <AboutModal open={aboutOpen} onOpenChange={setAboutOpen} />
        <nav className="flex-1 space-y-7 overflow-y-auto px-3 py-6">
          {sections.map((section) => (
            <div key={section.label}>
              <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/60">
                {section.label}
              </div>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const active =
                    currentPath === item.href ||
                    (item.label === "Agent workspace" &&
                      mode === "solo" &&
                      currentPath.startsWith("/dashboard/agent/"));
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                          active
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "text-sidebar-foreground/65 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground"
                        }`}
                      >
                        {active && (
                          <span className="absolute -left-3 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-primary shadow-glow" />
                        )}
                        <Icon
                          className={`h-4 w-4 transition-colors ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}
                        />
                        <span className="flex-1">{item.label}</span>
                        {"badge" in item && item.badge !== undefined && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-ema px-1.5 text-[10px] font-bold text-ema-foreground shadow-ema">
                            {item.badge}
                          </span>
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className="space-y-3 border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent/30 p-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-aurora text-[11px] font-semibold text-foreground">
              <span className="absolute inset-[2px] flex items-center justify-center rounded-full bg-sidebar text-foreground">
                {initials}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{contactName}</div>
              <div className="truncate text-xs text-muted-foreground">{businessName}</div>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              aria-label="Sign out"
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
          <a
            href="https://epic.communications"
            className="flex items-center gap-2 rounded-md border border-sidebar-border/60 bg-sidebar-accent/20 px-2.5 py-2 text-[10px] uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:bg-sidebar-accent/50"
          >
            <img src={logoEpic} alt="Epic Communications" className="h-6 w-6 rounded bg-white p-0.5" />
            <span className="leading-tight">
              Built by
              <br />
              <span className="text-sidebar-foreground">Epic Communications</span>
            </span>
          </a>
        </div>
      </div>
    </aside>
  );
}

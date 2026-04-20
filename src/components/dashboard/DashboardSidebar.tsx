import {
  LayoutDashboard,
  Inbox,
  Calendar,
  Users,
  Sparkles,
  FileText,
  Settings as SettingsIcon,
  BookOpen,
  Clock,
  Phone,
  Plug,
  CreditCard,
  ShoppingBag,
  LogOut,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { clearProfile, getInitials, readProfile } from "@/lib/profile";
import { accountDefaults } from "@/lib/mock-data";
import logoEpic from "@/assets/logo-epic.png";

const sections = [
  {
    label: "Overview",
    items: [
      { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
      { href: "/dashboard/inbox", icon: Inbox, label: "Inbox" },
      { href: "/dashboard/bookings", icon: Calendar, label: "Bookings" },
      { href: "/dashboard/contacts", icon: Users, label: "Contacts" },
    ],
  },
  {
    label: "Ema",
    items: [
      { href: "/dashboard/ema", icon: Sparkles, label: "Chat with Ema" },
      { href: "/dashboard/ema/reports", icon: FileText, label: "Reports" },
      { href: "/dashboard/ema/settings", icon: SettingsIcon, label: "Configure" },
    ],
  },
  {
    label: "Business",
    items: [
      { href: "/dashboard/catalog", icon: ShoppingBag, label: "Catalog" },
      { href: "/dashboard/hours", icon: Clock, label: "Hours" },
      { href: "/dashboard/knowledge", icon: BookOpen, label: "Knowledge" },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/dashboard/whatsapp", icon: Phone, label: "WhatsApp" },
      { href: "/dashboard/integrations", icon: Plug, label: "Integrations" },
      { href: "/dashboard/billing", icon: CreditCard, label: "Billing" },
      { href: "/dashboard/settings", icon: SettingsIcon, label: "Settings" },
    ],
  },
];

export default function DashboardSidebar({ currentPath = "/dashboard" }: { currentPath?: string }) {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<{ contactName?: string; businessName?: string }>({});

  useEffect(() => {
    setProfile(readProfile());
  }, []);

  const contactName = profile.contactName?.trim() || accountDefaults.ownerName;
  const businessName = profile.businessName?.trim() || accountDefaults.businessName;
  const initials = getInitials(contactName);

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
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold">Isola</span>
        </div>
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-6">
          {sections.map((section) => (
            <div key={section.label}>
              <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                {section.label}
              </div>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const active = currentPath === item.href;
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                          active
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className="space-y-3 border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-semibold">
              MJ
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">Marcus Joseph</div>
              <div className="truncate text-xs text-muted-foreground">Coalpot Restaurant</div>
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
            className="flex items-center gap-2 rounded-md border border-sidebar-border/60 bg-sidebar-accent/30 px-2.5 py-2 text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:bg-sidebar-accent/60"
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

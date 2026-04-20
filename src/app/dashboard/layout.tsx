"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import EmaChatWidget from "@/components/dashboard/EmaChatWidget";

export default function DashboardLayout({
  children,
  currentPath = "/dashboard",
}: {
  children: ReactNode;
  currentPath?: string;
}) {
  const navigate = useNavigate();
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

  if (!allowed) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar currentPath={currentPath} />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
      <EmaChatWidget />
    </div>
  );
}

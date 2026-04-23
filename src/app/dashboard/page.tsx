"use client";

import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

/**
 * /dashboard → /dashboard/home
 *
 * The home command center is the new default first destination after login.
 * It sits ABOVE individual agents and gives a business-wide view first.
 * Drill-down into a specific agent workspace happens from the Agents
 * Overview block on /dashboard/home.
 */
export default function DashboardIndexPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/dashboard/home", replace: true });
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-sm text-muted-foreground">Loading your workspace…</div>
    </div>
  );
}

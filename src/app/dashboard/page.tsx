"use client";

import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { agents } from "@/lib/mock-data";

const MOCK_MODE_KEY = "isola.mockMode";

export default function DashboardIndexPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") return;
    let mode = window.localStorage.getItem(MOCK_MODE_KEY);
    if (mode !== "solo" && mode !== "team") {
      mode = "solo";
      window.localStorage.setItem(MOCK_MODE_KEY, mode);
    }
    if (mode === "solo") {
      const first = agents[0];
      if (first) {
        navigate({
          to: "/dashboard/agent/$agentId",
          params: { agentId: first.id },
          replace: true,
        });
        return;
      }
    }
    navigate({ to: "/dashboard/team", replace: true });
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-sm text-muted-foreground">Loading your workspace…</div>
    </div>
  );
}

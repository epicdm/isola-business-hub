"use client";

import { type ReactNode } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import EmaChatWidget from "@/components/dashboard/EmaChatWidget";

export default function DashboardLayout({
  children,
  currentPath = "/dashboard",
}: {
  children: ReactNode;
  currentPath?: string;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar currentPath={currentPath} />
      <main className="flex-1 overflow-x-hidden">{children}</main>
      <EmaChatWidget />
    </div>
  );
}

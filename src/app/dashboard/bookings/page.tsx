"use client";

import { useState, useMemo } from "react";
import { Calendar, List, Phone, PhoneCall, Instagram, MessageCircle, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import DashboardLayout from "../layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { bookings, type Channel, type BookingStatus } from "@/lib/mock-data";

const channelIcon: Record<Channel, typeof Phone> = {
  whatsapp: Phone,
  voice: PhoneCall,
  instagram: Instagram,
  messenger: MessageCircle,
};

const statusStyle: Record<BookingStatus, string> = {
  confirmed: "border-success/30 bg-success/10 text-success",
  pending: "border-warning/30 bg-warning/10 text-warning",
  cancelled: "border-destructive/30 bg-destructive/10 text-destructive",
};

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

export default function BookingsPage() {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [statusFilter, setStatusFilter] = useState<"all" | BookingStatus>("all");

  const filtered = useMemo(
    () => (statusFilter === "all" ? bookings : bookings.filter((b) => b.status === statusFilter)),
    [statusFilter]
  );

  // Build a calendar week view (next 7 days from a fixed reference for SSR stability)
  const referenceDate = "2026-04-21";
  const week = useMemo(() => {
    const [y, m, d] = referenceDate.split("-").map(Number);
    return Array.from({ length: 7 }, (_, i) => {
      const dt = new Date(y, m - 1, d + i);
      const iso = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
      return {
        iso,
        weekday: dt.toLocaleDateString(undefined, { weekday: "short" }),
        day: dt.getDate(),
        items: bookings.filter((b) => b.date === iso),
      };
    });
  }, []);

  const counts = {
    all: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  return (
    <DashboardLayout currentPath="/dashboard/bookings">
      <div className="mx-auto max-w-7xl space-y-6 p-6 lg:p-10">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold md:text-4xl">Bookings</h1>
            <p className="mt-1 text-sm text-muted-foreground">Reservations captured by AI across every channel.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-border/60 bg-card/30 p-1">
              <button
                onClick={() => setView("list")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  view === "list" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="h-3.5 w-3.5" /> List
              </button>
              <button
                onClick={() => setView("calendar")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  view === "calendar" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Calendar className="h-3.5 w-3.5" /> Calendar
              </button>
            </div>
            <Button size="sm" className="bg-gradient-primary text-primary-foreground shadow-glow">
              <Plus className="h-3.5 w-3.5" /> New booking
            </Button>
          </div>
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap gap-2">
          {(["all", "confirmed", "pending", "cancelled"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setStatusFilter(k)}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium capitalize transition-colors ${
                statusFilter === k
                  ? "border-primary/40 bg-primary/15 text-primary"
                  : "border-border/60 bg-card/40 text-muted-foreground hover:bg-accent"
              }`}
            >
              {k} <span className="ml-1.5 opacity-60">{counts[k]}</span>
            </button>
          ))}
        </div>

        {/* List view */}
        {view === "list" && (
          <Card className="border-border/60 bg-card/40">
            <Table>
              <TableHeader>
                <TableRow className="border-border/40">
                  <TableHead className="pl-5">Guest</TableHead>
                  <TableHead>Party</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-5">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((b) => {
                  const ChannelIcon = channelIcon[b.channel];
                  return (
                    <TableRow key={b.id} className="border-border/30">
                      <TableCell className="pl-5 font-medium">{b.guest}</TableCell>
                      <TableCell>{b.party}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(b.date)}</TableCell>
                      <TableCell className="text-muted-foreground">{b.time}</TableCell>
                      <TableCell>
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-accent/40">
                          <ChannelIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`capitalize ${statusStyle[b.status]}`}>
                          {b.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-5 text-xs text-muted-foreground">
                        {b.notes || <span className="opacity-40">—</span>}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        )}

        {/* Calendar view */}
        {view === "calendar" && (
          <Card className="border-border/60 bg-card/40 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="font-display text-lg font-semibold">Week of Apr 21 — Apr 27</div>
                <div className="text-xs text-muted-foreground">{filtered.length} bookings shown</div>
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {week.map((day) => {
                const dayItems = day.items.filter(
                  (b) => statusFilter === "all" || b.status === statusFilter
                );
                return (
                  <div
                    key={day.iso}
                    className="min-h-[180px] rounded-lg border border-border/40 bg-background/30 p-2"
                  >
                    <div className="mb-2 flex items-baseline justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{day.weekday}</span>
                      <span className="font-display text-lg font-bold">{day.day}</span>
                    </div>
                    <div className="space-y-1.5">
                      {dayItems.map((b) => (
                        <div
                          key={b.id}
                          className={`rounded border-l-2 bg-card/60 p-1.5 text-[11px] leading-tight ${
                            b.status === "confirmed"
                              ? "border-l-success"
                              : b.status === "pending"
                              ? "border-l-warning"
                              : "border-l-destructive opacity-60"
                          }`}
                        >
                          <div className="font-semibold">{b.time}</div>
                          <div className="truncate text-muted-foreground">{b.guest} · {b.party}</div>
                        </div>
                      ))}
                      {dayItems.length === 0 && (
                        <div className="py-4 text-center text-[10px] text-muted-foreground/40">No bookings</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

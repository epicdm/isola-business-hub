"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Clock,
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  AlertCircle,
  CheckCircle2,
  CircleSlash,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { defaultHours, holidays as initialHolidays } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type DaySchedule = {
  day: string;
  closed: boolean;
  open: string;
  close: string;
};

type Holiday = {
  id: string;
  date: string;
  label: string;
  closed: boolean;
  open?: string;
  close?: string;
};

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

/** Parse "HH:MM" into minutes; treat 00:00 close as 24:00 (midnight roll-over). */
const toMinutes = (t: string, isClose = false) => {
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  const total = h * 60 + (m || 0);
  if (isClose && total === 0) return 24 * 60;
  return total;
};

const diffHours = (open: string, close: string) => {
  const mins = toMinutes(close, true) - toMinutes(open);
  return (mins / 60).toFixed(1);
};

const formatTime12 = (t: string) => {
  if (!t) return "";
  const [hStr, m] = t.split(":");
  const h = Number(hStr);
  if (h === 0 && m === "00") return "midnight";
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === "00" ? `${h12}${suffix}` : `${h12}:${m}${suffix}`;
};

/** Determine if "now" falls inside the schedule, including midnight roll-over. */
const isOpenNow = (schedule: DaySchedule[], now: Date) => {
  const dayIdx = (now.getDay() + 6) % 7; // 0 = Monday
  const today = schedule[dayIdx];
  const yesterday = schedule[(dayIdx + 6) % 7];
  const minutesNow = now.getHours() * 60 + now.getMinutes();

  // Yesterday's session that crosses midnight
  if (!yesterday.closed) {
    const open = toMinutes(yesterday.open);
    const close = toMinutes(yesterday.close, true);
    if (close > 24 * 60 - 1 && close <= 48 * 60 && minutesNow < close - 24 * 60) {
      return { open: true, day: yesterday };
    }
    // explicit midnight rollover (close < open)
    if (close < open && minutesNow < close) {
      return { open: true, day: yesterday };
    }
  }

  if (today.closed) return { open: false, day: today };
  const open = toMinutes(today.open);
  const close = toMinutes(today.close, true);
  if (close <= open) {
    // crosses midnight — handled above for yesterday's window
    if (minutesNow >= open) return { open: true, day: today };
    return { open: false, day: today };
  }
  if (minutesNow >= open && minutesNow < close) {
    return { open: true, day: today };
  }
  return { open: false, day: today };
};

export default function HoursPage() {
  const [hours, setHours] = useState<DaySchedule[]>(defaultHours);
  const [holidays, setHolidays] = useState<Holiday[]>(initialHolidays);
  const [now, setNow] = useState(() => new Date());
  const [holidayDialog, setHolidayDialog] = useState(false);

  // Tick the "now" indicator every minute
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const status = useMemo(() => isOpenNow(hours, now), [hours, now]);

  const updateDay = (day: string, patch: Partial<DaySchedule>) =>
    setHours((prev) => prev.map((h) => (h.day === day ? { ...h, ...patch } : h)));

  const applyToAllWeekdays = () => {
    const monday = hours.find((h) => h.day === "Monday");
    if (!monday) return;
    setHours((prev) =>
      prev.map((h) =>
        WEEKDAYS.includes(h.day)
          ? { ...h, closed: monday.closed, open: monday.open, close: monday.close }
          : h,
      ),
    );
    toast.success("Monday's hours applied to Tue–Fri");
  };

  const removeHoliday = (id: string) => {
    setHolidays((prev) => prev.filter((h) => h.id !== id));
    toast.success("Holiday removed");
  };

  const addHoliday = (holiday: Holiday) => {
    setHolidays((prev) =>
      [...prev, holiday].sort((a, b) => (a.date < b.date ? -1 : 1)),
    );
    toast.success(`Added ${holiday.label}`);
    setHolidayDialog(false);
  };

  return (
    <DashboardLayout currentPath="/dashboard/hours">
      <div className="px-6 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
              <Clock className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold leading-tight">Hours</h1>
              <p className="text-sm text-muted-foreground">
                Used by AI agents to answer "are you open?" and to schedule quiet-hour replies.
              </p>
            </div>
          </div>

          {/* Open / Closed indicator */}
          <div
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium",
              status.open
                ? "border-success/40 bg-success/10 text-success"
                : "border-muted-foreground/30 bg-muted/30 text-muted-foreground",
            )}
            role="status"
            aria-live="polite"
          >
            {status.open ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                </span>
                Currently OPEN
                {!status.day.closed && (
                  <span className="text-xs opacity-80">
                    · until {formatTime12(status.day.close)}
                  </span>
                )}
              </>
            ) : (
              <>
                <CircleSlash className="h-3.5 w-3.5" />
                Currently CLOSED
              </>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Weekly schedule */}
          <Card className="border-border/40 bg-card/40 p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-lg font-semibold">Weekly schedule</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Local time · America/Dominica · 24-hour format
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={applyToAllWeekdays}>
                <Copy className="h-3.5 w-3.5" /> Apply Mon to all weekdays
              </Button>
            </div>

            <div className="space-y-1">
              {hours.map((h) => (
                <div
                  key={h.day}
                  className={cn(
                    "grid grid-cols-[110px_auto_1fr_auto] items-center gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-accent/30",
                    h.closed && "opacity-70",
                  )}
                >
                  <span className="text-sm font-medium">{h.day}</span>
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                    <Checkbox
                      checked={h.closed}
                      onCheckedChange={(v) => updateDay(h.day, { closed: Boolean(v) })}
                      aria-label={`${h.day} closed`}
                    />
                    Closed
                  </label>
                  {h.closed ? (
                    <span className="text-sm text-muted-foreground">All day</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={h.open}
                        onChange={(e) => updateDay(h.day, { open: e.target.value })}
                        className="h-8 w-32 text-sm"
                        disabled={h.closed}
                      />
                      <span className="text-xs text-muted-foreground">to</span>
                      <Input
                        type="time"
                        value={h.close}
                        onChange={(e) => updateDay(h.day, { close: e.target.value })}
                        className="h-8 w-32 text-sm"
                        disabled={h.closed}
                      />
                    </div>
                  )}
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px]",
                      h.closed
                        ? "border-muted text-muted-foreground"
                        : "border-primary/30 bg-primary/10 text-primary",
                    )}
                  >
                    {h.closed ? "Closed" : `${diffHours(h.open, h.close)}h`}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-end">
              <Button
                size="sm"
                className="bg-gradient-primary text-primary-foreground hover:opacity-90"
                onClick={() => toast.success("Hours saved")}
              >
                <CheckCircle2 className="h-4 w-4" /> Save hours
              </Button>
            </div>
          </Card>

          {/* Holiday overrides + quiet hours notice */}
          <div className="space-y-6">
            <Card className="border-border/40 bg-card/40 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-primary" />
                  <h2 className="font-display text-base font-semibold">Holiday overrides</h2>
                </div>
                <Dialog open={holidayDialog} onOpenChange={setHolidayDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Plus className="h-3.5 w-3.5" /> Add
                    </Button>
                  </DialogTrigger>
                  <HolidayDialog onAdd={addHoliday} />
                </Dialog>
              </div>

              {holidays.length === 0 ? (
                <p className="py-6 text-center text-xs text-muted-foreground">
                  No holiday overrides yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {holidays.map((h) => (
                    <div
                      key={h.id}
                      className="flex items-start justify-between gap-3 rounded-md border border-border/40 bg-background/40 p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium">{h.label}</div>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                          {h.date} ·{" "}
                          {h.closed
                            ? "Closed all day"
                            : `${formatTime12(h.open ?? "")} to ${formatTime12(h.close ?? "")}`}
                        </div>
                      </div>
                      <button
                        onClick={() => removeHoliday(h.id)}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                        aria-label={`Remove ${h.label}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="border-warning/30 bg-warning/5 p-5">
              <div className="flex gap-3">
                <AlertCircle className="h-4 w-4 shrink-0 text-warning" />
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium text-foreground">Quiet hours active</p>
                  <p className="mt-1">
                    Outside business hours, Ema replies with "We're closed — back at X"
                    instead of holding messages.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

/* ------------------------------ Holiday dialog ------------------------------ */

function HolidayDialog({ onAdd }: { onAdd: (h: Holiday) => void }) {
  const [label, setLabel] = useState("");
  const [date, setDate] = useState("");
  const [closed, setClosed] = useState(true);
  const [open, setOpen] = useState("12:00");
  const [close, setClose] = useState("20:00");

  const submit = () => {
    if (!label.trim()) {
      toast.error("Give the holiday a label");
      return;
    }
    if (!date) {
      toast.error("Pick a date");
      return;
    }
    onAdd({
      id: `h${Date.now()}`,
      label: label.trim(),
      date,
      closed,
      open: closed ? undefined : open,
      close: closed ? undefined : close,
    });
    setLabel("");
    setDate("");
    setClosed(true);
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Add holiday override</DialogTitle>
        <DialogDescription>
          Override your regular schedule for a specific date.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-2">
        <div className="grid gap-2">
          <Label htmlFor="hol-label">Label</Label>
          <Input
            id="hol-label"
            placeholder="e.g. Christmas Day"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="hol-date">Date</Label>
          <Input
            id="hol-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between rounded-md border border-border/60 bg-card/40 px-3 py-2">
          <Label htmlFor="hol-closed" className="text-sm">
            Closed all day
          </Label>
          <Switch id="hol-closed" checked={closed} onCheckedChange={setClosed} />
        </div>
        {!closed && (
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="hol-open">Open</Label>
              <Input
                id="hol-open"
                type="time"
                value={open}
                onChange={(e) => setOpen(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hol-close">Close</Label>
              <Input
                id="hol-close"
                type="time"
                value={close}
                onChange={(e) => setClose(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button
          onClick={submit}
          className="bg-gradient-primary text-primary-foreground hover:opacity-90"
        >
          Add holiday
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

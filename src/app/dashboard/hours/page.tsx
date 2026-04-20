"use client";

import { useState } from "react";
import { Clock, Plus, Trash2, Calendar, AlertCircle } from "lucide-react";
import DashboardLayout from "../layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { defaultHours, holidays as initialHolidays } from "@/lib/mock-data";

export default function HoursPage() {
  const [hours, setHours] = useState(defaultHours);
  const [holidays, setHolidays] = useState(initialHolidays);

  const updateDay = (day: string, patch: Partial<(typeof hours)[number]>) =>
    setHours((prev) => prev.map((h) => (h.day === day ? { ...h, ...patch } : h)));

  const removeHoliday = (id: string) => setHolidays((prev) => prev.filter((h) => h.id !== id));

  return (
    <DashboardLayout currentPath="/dashboard/hours">
      <div className="px-6 py-8 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
              <Clock className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold leading-tight">Hours</h1>
              <p className="text-sm text-muted-foreground">
                The AI uses these to answer "are you open?" and to set quiet-hour replies.
              </p>
            </div>
          </div>
          <Button size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
            Save changes
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <Card className="border-border/40 bg-card/40 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Weekly schedule</h2>
              <span className="text-xs text-muted-foreground">Local time · America/Dominica</span>
            </div>
            <div className="space-y-1">
              {hours.map((h) => (
                <div
                  key={h.day}
                  className="grid grid-cols-[120px_60px_1fr_auto] items-center gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-accent/30"
                >
                  <span className="text-sm font-medium">{h.day}</span>
                  <Switch
                    checked={!h.closed}
                    onCheckedChange={(v) => updateDay(h.day, { closed: !v })}
                  />
                  {h.closed ? (
                    <span className="text-sm text-muted-foreground">Closed</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={h.open}
                        onChange={(e) => updateDay(h.day, { open: e.target.value })}
                        className="h-8 w-28 text-sm"
                      />
                      <span className="text-xs text-muted-foreground">to</span>
                      <Input
                        type="time"
                        value={h.close}
                        onChange={(e) => updateDay(h.day, { close: e.target.value })}
                        className="h-8 w-28 text-sm"
                      />
                    </div>
                  )}
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${
                      h.closed
                        ? "border-muted text-muted-foreground"
                        : "border-primary/30 bg-primary/10 text-primary"
                    }`}
                  >
                    {h.closed ? "Closed" : `${diffHours(h.open, h.close)}h`}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="border-border/40 bg-card/40 p-6">
              <div className="mb-4 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <h2 className="font-display text-base font-semibold">Holidays & exceptions</h2>
              </div>
              <div className="space-y-2">
                {holidays.map((h) => (
                  <div
                    key={h.id}
                    className="flex items-start justify-between gap-3 rounded-md border border-border/40 bg-background/40 p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium">{h.label}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {h.date} · {h.closed ? "Closed all day" : `${h.open ?? ""}–${h.close ?? ""}`}
                      </div>
                    </div>
                    <button
                      onClick={() => removeHoliday(h.id)}
                      className="text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-3 w-full">
                <Plus className="h-3.5 w-3.5" /> Add holiday
              </Button>
            </Card>

            <Card className="border-warning/30 bg-warning/5 p-5">
              <div className="flex gap-3">
                <AlertCircle className="h-4 w-4 shrink-0 text-warning" />
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium text-foreground">Quiet hours active</p>
                  <p className="mt-1">
                    Outside business hours, Ema replies with "We're closed — back at X" instead of holding messages.
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

function diffHours(open: string, close: string) {
  const [oh, om] = open.split(":").map(Number);
  const [ch, cm] = close.split(":").map(Number);
  const mins = ch * 60 + cm - (oh * 60 + om);
  return (mins / 60).toFixed(1);
}

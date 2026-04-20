"use client";

import { useState, useMemo } from "react";
import { Search, Phone, PhoneCall, Instagram, MessageCircle, Star, Plus, MessageSquare, X } from "lucide-react";
import DashboardLayout from "../layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { contacts, type Channel } from "@/lib/mock-data";

const channelIcon: Record<Channel, typeof Phone> = {
  whatsapp: Phone,
  voice: PhoneCall,
  instagram: Instagram,
  messenger: MessageCircle,
};

const tagStyle: Record<string, string> = {
  vip: "border-ema/30 bg-ema/10 text-ema",
  regular: "border-primary/30 bg-primary/10 text-primary",
  new: "border-success/30 bg-success/10 text-success",
  vegetarian: "border-chart-4/30 bg-chart-4/10 text-chart-4",
};

export default function ContactsPage() {
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return contacts.filter((c) => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (tagFilter !== "all" && !c.tags.includes(tagFilter)) return false;
      return true;
    });
  }, [search, tagFilter]);

  const active = contacts.find((c) => c.id === openId);
  const ActiveChannelIcon = active ? channelIcon[active.channel] : Phone;

  const tags = ["all", "vip", "regular", "new"];

  return (
    <DashboardLayout currentPath="/dashboard/contacts">
      <div className="mx-auto max-w-7xl space-y-6 p-6 lg:p-10">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold md:text-4xl">Contacts</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Every customer Isola has talked to — auto-built from your channels.
            </p>
          </div>
          <Button size="sm" className="bg-gradient-primary text-primary-foreground shadow-glow">
            <Plus className="h-3.5 w-3.5" /> Add contact
          </Button>
        </div>

        {/* KPI strip */}
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { label: "Total contacts", value: contacts.length },
            { label: "VIPs", value: contacts.filter((c) => c.tags.includes("vip")).length },
            { label: "Regulars", value: contacts.filter((c) => c.tags.includes("regular")).length },
            { label: "New this week", value: contacts.filter((c) => c.tags.includes("new")).length },
          ].map((k) => (
            <Card key={k.label} className="border-border/60 bg-card/40 p-4">
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{k.label}</div>
              <div className="mt-1 font-display text-2xl font-bold">{k.value}</div>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name…"
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setTagFilter(t)}
                className={`rounded-full border px-3.5 py-1 text-xs font-medium capitalize transition-colors ${
                  tagFilter === t
                    ? "border-primary/40 bg-primary/15 text-primary"
                    : "border-border/60 bg-card/40 text-muted-foreground hover:bg-accent"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <Card className="border-border/60 bg-card/40">
          <Table>
            <TableHeader>
              <TableRow className="border-border/40">
                <TableHead className="pl-5">Name</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Visits</TableHead>
                <TableHead>Spend</TableHead>
                <TableHead>Last seen</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="pr-5"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => {
                const ChannelIcon = channelIcon[c.channel];
                return (
                  <TableRow
                    key={c.id}
                    className="cursor-pointer border-border/30"
                    onClick={() => setOpenId(c.id)}
                  >
                    <TableCell className="pl-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-xs font-semibold">
                          {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-medium">{c.name}</div>
                          <div className="text-xs text-muted-foreground">{c.phone}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-accent/40">
                        <ChannelIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{c.visits}</TableCell>
                    <TableCell className="text-muted-foreground">EC${c.spend.toLocaleString()}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{c.lastSeen}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {c.tags.length === 0 && <span className="text-xs text-muted-foreground/40">—</span>}
                        {c.tags.map((t) => (
                          <Badge key={t} variant="outline" className={`text-[10px] capitalize ${tagStyle[t] ?? "border-border/60 bg-card text-muted-foreground"}`}>
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="pr-5 text-right">
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                    No contacts match your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Drawer */}
      <Sheet open={!!openId} onOpenChange={(o) => !o && setOpenId(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          {active && (
            <>
              <SheetHeader className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary text-base font-semibold text-primary-foreground shadow-glow">
                    {active.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <SheetTitle className="font-display text-xl">{active.name}</SheetTitle>
                    <SheetDescription className="mt-0.5 flex items-center gap-2">
                      <ActiveChannelIcon className="h-3.5 w-3.5" /> {active.phone}
                    </SheetDescription>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {active.tags.map((t) => (
                    <Badge key={t} variant="outline" className={`capitalize ${tagStyle[t] ?? "border-border/60"}`}>
                      {t === "vip" && <Star className="mr-1 h-2.5 w-2.5 fill-current" />}
                      {t}
                    </Badge>
                  ))}
                </div>
              </SheetHeader>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <Card className="border-border/60 bg-card/40 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Visits</div>
                  <div className="mt-1 font-display text-xl font-bold">{active.visits}</div>
                </Card>
                <Card className="border-border/60 bg-card/40 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Spend</div>
                  <div className="mt-1 font-display text-xl font-bold">EC${active.spend}</div>
                </Card>
                <Card className="border-border/60 bg-card/40 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Last seen</div>
                  <div className="mt-1 text-sm font-semibold">{active.lastSeen}</div>
                </Card>
              </div>

              <div className="mt-6">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notes</h3>
                <Card className="border-border/60 bg-card/40 p-4 text-sm leading-relaxed">
                  {active.notes || <span className="text-muted-foreground italic">No notes yet.</span>}
                </Card>
              </div>

              <div className="mt-6">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recent activity</h3>
                <ul className="space-y-2 text-sm">
                  {[
                    { t: "Booked table for 4", d: "2m ago" },
                    { t: "Asked about menu", d: "3 days ago" },
                    { t: "Confirmed reservation", d: "1 week ago" },
                  ].map((a) => (
                    <li key={a.t} className="flex items-center justify-between rounded-lg border border-border/40 bg-card/40 px-3 py-2">
                      <span>{a.t}</span>
                      <span className="text-xs text-muted-foreground">{a.d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex gap-2">
                <Button className="flex-1 bg-gradient-primary text-primary-foreground" asChild>
                  <a href="/dashboard/inbox">
                    <MessageSquare className="h-3.5 w-3.5" /> Open chat
                  </a>
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setOpenId(null)}>
                  <X className="h-3.5 w-3.5" /> Close
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
}

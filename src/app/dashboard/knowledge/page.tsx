"use client";

import { useState } from "react";
import { BookOpen, Plus, Search, Pencil, Trash2, TrendingUp, Sparkles } from "lucide-react";
import DashboardLayout from "../layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { knowledgeCategories, knowledgeEntries, type KnowledgeCategory } from "@/lib/mock-data";

export default function KnowledgePage() {
  const [activeCat, setActiveCat] = useState<KnowledgeCategory | "All">("All");
  const [search, setSearch] = useState("");

  const filtered = knowledgeEntries.filter((e) => {
    const matchesCat = activeCat === "All" || e.category === activeCat;
    const matchesSearch =
      !search ||
      e.q.toLowerCase().includes(search.toLowerCase()) ||
      e.a.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <DashboardLayout currentPath="/dashboard/knowledge">
      <div className="px-6 py-8 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold leading-tight">Knowledge</h1>
              <p className="text-sm text-muted-foreground">
                Q&A entries the AI references when customers ask. Specific beats clever.
              </p>
            </div>
          </div>
          <Button size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
            <Plus className="h-3.5 w-3.5" /> New entry
          </Button>
        </div>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {(["All", ...knowledgeCategories] as const).map((cat) => {
              const active = activeCat === cat;
              const count =
                cat === "All"
                  ? knowledgeEntries.length
                  : knowledgeEntries.filter((e) => e.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat as KnowledgeCategory | "All")}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    active
                      ? "border-primary/40 bg-primary/15 text-primary"
                      : "border-border/60 bg-card/40 text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {cat} <span className="opacity-60">{count}</span>
                </button>
              );
            })}
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search question or answer…"
              className="h-9 pl-9 text-sm"
            />
          </div>
        </div>

        <div className="grid gap-3">
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No entries match this view.
            </div>
          )}
          {filtered.map((entry) => (
            <Card
              key={entry.id}
              className="group border-border/40 bg-card/40 p-5 transition-all hover:border-primary/30 hover:bg-card/60"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-border/60 bg-background/40 text-[10px] uppercase tracking-wider"
                    >
                      {entry.category}
                    </Badge>
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <TrendingUp className="h-3 w-3" /> {entry.uses} uses
                    </span>
                    <span className="text-[11px] text-muted-foreground/70">
                      Updated {entry.lastUpdated}
                    </span>
                  </div>
                  <p className="text-sm font-semibold">{entry.q}</p>
                  <p className="mt-1.5 text-sm text-muted-foreground">{entry.a}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 rounded-lg border border-ema/20 bg-ema/5 px-4 py-3 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-ema" />
          Ema suggests adding answers for "Do you have parking?" — asked 14 times this week.
        </div>
      </div>
    </DashboardLayout>
  );
}

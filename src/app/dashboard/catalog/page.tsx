"use client";

import { useMemo, useState } from "react";
import { Plus, Search, ShoppingBag, Pencil, Trash2, GripVertical } from "lucide-react";
import DashboardLayout from "../layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { catalogCategories, catalogItems, type CatalogCategory } from "@/lib/mock-data";

export default function CatalogPage() {
  const [items, setItems] = useState(catalogItems);
  const [activeCat, setActiveCat] = useState<CatalogCategory | "All">("All");
  const [search, setSearch] = useState("");

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: items.length };
    catalogCategories.forEach((c) => (map[c] = items.filter((i) => i.category === c).length));
    return map;
  }, [items]);

  const filtered = items.filter((i) => {
    const matchesCat = activeCat === "All" || i.category === activeCat;
    const matchesSearch = !search || i.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleAvailable = (id: string) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, available: !i.available } : i)));

  return (
    <DashboardLayout currentPath="/dashboard/catalog">
      <div className="px-6 py-8 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
              <ShoppingBag className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold leading-tight">Catalog</h1>
              <p className="text-sm text-muted-foreground">
                Menu items the AI uses to answer questions and confirm orders.
              </p>
            </div>
          </div>
          <Button size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
            <Plus className="h-3.5 w-3.5" /> New item
          </Button>
        </div>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {(["All", ...catalogCategories] as const).map((cat) => {
              const active = activeCat === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat as CatalogCategory | "All")}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    active
                      ? "border-primary/40 bg-primary/15 text-primary"
                      : "border-border/60 bg-card/40 text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {cat} <span className="opacity-60">{counts[cat] ?? 0}</span>
                </button>
              );
            })}
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search menu…"
              className="h-9 pl-9 text-sm"
            />
          </div>
        </div>

        <Card className="overflow-hidden border-border/40 bg-card/40">
          <div className="grid grid-cols-[24px_1fr_120px_100px_140px_100px_60px] items-center gap-3 border-b border-border/40 px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span></span>
            <span>Item</span>
            <span>Category</span>
            <span className="text-right">Price</span>
            <span>Tags</span>
            <span className="text-center">Available</span>
            <span></span>
          </div>
          {filtered.length === 0 && (
            <div className="px-6 py-12 text-center text-sm text-muted-foreground">
              No items match this view.
            </div>
          )}
          {filtered.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[24px_1fr_120px_100px_140px_100px_60px] items-center gap-3 border-b border-border/30 px-4 py-3 transition-colors last:border-0 hover:bg-accent/30"
            >
              <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground/50" />
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{item.name}</div>
                <div className="truncate text-xs text-muted-foreground">{item.desc}</div>
              </div>
              <Badge variant="outline" className="w-fit border-border/60 text-[10px]">
                {item.category}
              </Badge>
              <div className="text-right text-sm font-semibold tabular-nums">
                EC${item.price}
              </div>
              <div className="flex flex-wrap gap-1">
                {item.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-accent/60 px-2 py-0.5 text-[10px] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex justify-center">
                <Switch checked={item.available} onCheckedChange={() => toggleAvailable(item.id)} />
              </div>
              <div className="flex items-center justify-end gap-1">
                <button className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </Card>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          {filtered.length} of {items.length} items shown · drag to reorder
        </p>
      </div>
    </DashboardLayout>
  );
}

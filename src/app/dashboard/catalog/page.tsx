"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  Search,
  ShoppingBag,
  Pencil,
  Trash2,
  Upload,
  ImageIcon,
  Trash,
  ToggleRight,
  PackageOpen,
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  catalogCategories,
  catalogItems,
  type CatalogCategory,
  type CatalogItem,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "isola.catalog.images";

type StoredImages = Record<string, string>; // itemId -> data URL

const formatPrice = (n: number) => `EC$${n.toLocaleString("en-US")}`;

export default function CatalogPage() {
  const [items, setItems] = useState<CatalogItem[]>(catalogItems);
  const [images, setImages] = useState<StoredImages>({});
  const [activeCat, setActiveCat] = useState<CatalogCategory | "All">("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CatalogItem | null>(null);

  // Hydrate stored images
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setImages(JSON.parse(raw) as StoredImages);
    } catch {
      /* ignore */
    }
  }, []);

  const persistImages = (next: StoredImages) => {
    setImages(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore quota */
    }
  };

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: items.length };
    catalogCategories.forEach((c) => (map[c] = items.filter((i) => i.category === c).length));
    return map;
  }, [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((i) => {
      const okCat = activeCat === "All" || i.category === activeCat;
      const okSearch =
        !q ||
        i.name.toLowerCase().includes(q) ||
        i.desc.toLowerCase().includes(q) ||
        i.tags.some((t) => t.toLowerCase().includes(q));
      return okCat && okSearch;
    });
  }, [items, activeCat, search]);

  const toggleAvailable = (id: string) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, available: !i.available } : i)),
    );

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAllVisible = (checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      filtered.forEach((i) => (checked ? next.add(i.id) : next.delete(i.id)));
      return next;
    });
  };

  const allVisibleSelected =
    filtered.length > 0 && filtered.every((i) => selected.has(i.id));

  const bulkDelete = () => {
    setItems((prev) => prev.filter((i) => !selected.has(i.id)));
    toast.success(`${selected.size} item${selected.size === 1 ? "" : "s"} deleted`);
    setSelected(new Set());
  };

  const bulkToggle = () => {
    const allAvailable = items
      .filter((i) => selected.has(i.id))
      .every((i) => i.available);
    setItems((prev) =>
      prev.map((i) => (selected.has(i.id) ? { ...i, available: !allAvailable } : i)),
    );
    toast.success(
      `${selected.size} item${selected.size === 1 ? "" : "s"} marked ${
        allAvailable ? "unavailable" : "available"
      }`,
    );
  };

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (item: CatalogItem) => {
    setEditing(item);
    setDialogOpen(true);
  };

  const saveItem = (item: CatalogItem, imageDataUrl: string | null) => {
    setItems((prev) => {
      const exists = prev.some((p) => p.id === item.id);
      return exists ? prev.map((p) => (p.id === item.id ? item : p)) : [item, ...prev];
    });
    if (imageDataUrl !== null) {
      const next: StoredImages = { ...images };
      if (imageDataUrl) next[item.id] = imageDataUrl;
      else delete next[item.id];
      persistImages(next);
    }
    toast.success(editing ? "Item updated" : "Item added");
    setDialogOpen(false);
    setEditing(null);
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    const next = { ...images };
    delete next[id];
    persistImages(next);
    setSelected((prev) => {
      const n = new Set(prev);
      n.delete(id);
      return n;
    });
    toast.success("Item deleted");
  };

  return (
    <DashboardLayout currentPath="/dashboard/catalog">
      <TooltipProvider delayDuration={150}>
        <div className="px-6 py-8 lg:px-8">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
                <ShoppingBag className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold leading-tight">Catalog</h1>
                <p className="text-sm text-muted-foreground">
                  Items your AI agents and Ema use to answer questions, quote prices, and confirm orders.
                </p>
              </div>
            </div>
            <Button
              onClick={openCreate}
              className="bg-gradient-primary text-primary-foreground hover:opacity-90"
            >
              <Plus className="h-4 w-4" /> Add item
            </Button>
          </div>

          {/* Filter bar */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-1.5">
              {(["All", ...catalogCategories] as const).map((cat) => {
                const active = activeCat === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCat(cat as CatalogCategory | "All")}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      active
                        ? "border-primary/40 bg-primary/15 text-primary"
                        : "border-border/60 bg-card/40 text-muted-foreground hover:bg-accent",
                    )}
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
                placeholder="Search items, tags, descriptions…"
                className="h-9 pl-9 text-sm"
              />
            </div>
          </div>

          {/* Bulk action bar */}
          {selected.size > 0 && (
            <div className="mb-3 flex items-center justify-between rounded-lg border border-primary/30 bg-primary/10 px-4 py-2.5">
              <div className="text-sm">
                <span className="font-semibold">{selected.size}</span> selected
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={bulkToggle}>
                  <ToggleRight className="h-4 w-4" /> Toggle availability
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-destructive/40 text-destructive hover:bg-destructive/10"
                  onClick={bulkDelete}
                >
                  <Trash className="h-4 w-4" /> Delete selected
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>
                  Clear
                </Button>
              </div>
            </div>
          )}

          {/* Table */}
          <Card className="overflow-hidden border-border/40 bg-card/40">
            <div className="grid grid-cols-[40px_56px_minmax(180px,1.4fr)_120px_100px_minmax(160px,1.6fr)_120px_72px] items-center gap-3 border-b border-border/40 px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <Checkbox
                checked={allVisibleSelected}
                onCheckedChange={(v) => selectAllVisible(Boolean(v))}
                aria-label="Select all visible"
              />
              <span>Image</span>
              <span>Name</span>
              <span>Category</span>
              <span className="text-right">Price</span>
              <span>Description</span>
              <span className="text-center">Available</span>
              <span></span>
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <PackageOpen className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">No items match this view</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try clearing your search or switching categories.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSearch("");
                    setActiveCat("All");
                  }}
                >
                  Reset filters
                </Button>
              </div>
            ) : (
              filtered.map((item) => {
                const img = images[item.id];
                const isSelected = selected.has(item.id);
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "grid grid-cols-[40px_56px_minmax(180px,1.4fr)_120px_100px_minmax(160px,1.6fr)_120px_72px] items-center gap-3 border-b border-border/30 px-4 py-3 transition-colors last:border-0 hover:bg-accent/30",
                      isSelected && "bg-primary/5",
                    )}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleSelect(item.id)}
                      aria-label={`Select ${item.name}`}
                    />
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md border border-border/50 bg-muted text-xl">
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <span aria-hidden>{item.emoji}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{item.name}</div>
                      <div className="mt-0.5 flex flex-wrap gap-1">
                        {item.tags.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-accent/60 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Badge variant="outline" className="w-fit border-border/60 text-[10px]">
                      {item.category}
                    </Badge>
                    <div className="text-right text-sm font-semibold tabular-nums">
                      {formatPrice(item.price)}
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="truncate text-sm text-muted-foreground">{item.desc}</p>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        {item.desc}
                      </TooltipContent>
                    </Tooltip>
                    <div className="flex justify-center">
                      <Switch
                        checked={item.available}
                        onCheckedChange={() => toggleAvailable(item.id)}
                        aria-label={`Toggle availability for ${item.name}`}
                      />
                    </div>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(item)}
                        className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        aria-label={`Edit ${item.name}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                        aria-label={`Delete ${item.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </Card>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Showing {filtered.length} of {items.length} items
          </p>
        </div>

        <ItemDialog
          open={dialogOpen}
          onOpenChange={(o) => {
            setDialogOpen(o);
            if (!o) setEditing(null);
          }}
          editing={editing}
          existingImage={editing ? images[editing.id] ?? null : null}
          onSave={saveItem}
        />
      </TooltipProvider>
    </DashboardLayout>
  );
}

/* ----------------------------- Add/Edit Dialog ----------------------------- */

function ItemDialog({
  open,
  onOpenChange,
  editing,
  existingImage,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: CatalogItem | null;
  existingImage: string | null;
  onSave: (item: CatalogItem, imageDataUrl: string | null) => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<CatalogCategory>("Food");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [available, setAvailable] = useState(true);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [imageDirty, setImageDirty] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setName(editing.name);
      setCategory(editing.category);
      setPrice(String(editing.price));
      setDesc(editing.desc);
      setAvailable(editing.available);
      setImageDataUrl(existingImage);
    } else {
      setName("");
      setCategory("Food");
      setPrice("");
      setDesc("");
      setAvailable(true);
      setImageDataUrl(null);
    }
    setImageDirty(false);
  }, [open, editing, existingImage]);

  const onPickImage = (file: File | null) => {
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      toast.error("Image must be under 1.5 MB for the local preview");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageDataUrl(typeof reader.result === "string" ? reader.result : null);
      setImageDirty(true);
    };
    reader.readAsDataURL(file);
  };

  const submit = () => {
    const trimmedName = name.trim();
    const parsedPrice = Number(price);
    if (!trimmedName) {
      toast.error("Item name is required");
      return;
    }
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      toast.error("Price must be a non-negative number");
      return;
    }
    const item: CatalogItem = {
      id: editing?.id ?? `c${Date.now()}`,
      name: trimmedName,
      category,
      price: parsedPrice,
      desc: desc.trim(),
      available,
      tags: editing?.tags ?? [],
      emoji: editing?.emoji ?? defaultEmojiFor(category),
    };
    onSave(item, imageDirty ? imageDataUrl : null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit item" : "Add item"}</DialogTitle>
          <DialogDescription>
            {editing
              ? "Update this item — the AI agents pick up the change immediately."
              : "Add an item to your catalog. Your AI agents will use it to quote and confirm."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="item-image">Image</Label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-md border border-dashed border-border bg-muted/40 transition-colors hover:bg-muted"
                aria-label="Upload image"
              >
                {imageDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageDataUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
              <div className="flex flex-col gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload className="h-3.5 w-3.5" />
                  {imageDataUrl ? "Replace" : "Upload"}
                </Button>
                {imageDataUrl && (
                  <button
                    type="button"
                    className="text-left text-xs text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      setImageDataUrl(null);
                      setImageDirty(true);
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                ref={fileRef}
                id="item-image"
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => onPickImage(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="item-name">Name</Label>
            <Input
              id="item-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Grilled callaloo stack"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="item-category">Category</Label>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as CatalogCategory)}
              >
                <SelectTrigger id="item-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {catalogCategories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="item-price">Price (EC$)</Label>
              <Input
                id="item-price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                inputMode="decimal"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="item-desc">Description</Label>
            <Textarea
              id="item-desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              placeholder="Short description the AI uses when describing this item to customers."
            />
          </div>

          <div className="flex items-center justify-between rounded-md border border-border/60 bg-card/40 px-3 py-2">
            <div>
              <Label htmlFor="item-available" className="text-sm">
                Available
              </Label>
              <p className="text-xs text-muted-foreground">
                When off, the AI will say this is unavailable.
              </p>
            </div>
            <Switch id="item-available" checked={available} onCheckedChange={setAvailable} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={submit}
            className="bg-gradient-primary text-primary-foreground hover:opacity-90"
          >
            {editing ? "Save changes" : "Add item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function defaultEmojiFor(c: CatalogCategory) {
  switch (c) {
    case "Food":
      return "🍽️";
    case "Drinks":
      return "🥂";
    case "Services":
      return "🩺";
    case "Rooms":
      return "🛏️";
    default:
      return "📦";
  }
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Pencil,
  Trash2,
  TrendingUp,
  Sparkles,
  Upload,
  FileText,
  FileSpreadsheet,
  FileImage,
  File as FileIcon,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  knowledgeCategories,
  knowledgeEntries,
  knowledgeDocuments,
  type KnowledgeCategory,
  type KnowledgeFaq,
  type KnowledgeDocument,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "isola.knowledge.documents";

const formatSize = (kb: number) => {
  if (kb < 1) return "1 KB";
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};

const docIcon = (ext: KnowledgeDocument["ext"]) => {
  switch (ext) {
    case "xlsx":
      return FileSpreadsheet;
    case "image":
      return FileImage;
    case "txt":
      return FileText;
    case "docx":
    case "pdf":
      return FileText;
    default:
      return FileIcon;
  }
};

const inferExt = (name: string): KnowledgeDocument["ext"] => {
  const lower = name.toLowerCase();
  if (lower.endsWith(".pdf")) return "pdf";
  if (lower.endsWith(".docx") || lower.endsWith(".doc")) return "docx";
  if (lower.endsWith(".xlsx") || lower.endsWith(".xls") || lower.endsWith(".csv"))
    return "xlsx";
  if (lower.endsWith(".txt") || lower.endsWith(".md")) return "txt";
  if (/\.(png|jpe?g|gif|webp|svg)$/i.test(lower)) return "image";
  return "txt";
};

export default function KnowledgePage() {
  const [activeTab, setActiveTab] = useState<"faqs" | "documents">("faqs");
  const [activeCat, setActiveCat] = useState<KnowledgeCategory | "All">("All");
  const [search, setSearch] = useState("");

  const [faqs, setFaqs] = useState<KnowledgeFaq[]>(knowledgeEntries);
  const [docs, setDocs] = useState<KnowledgeDocument[]>(knowledgeDocuments);

  const [faqDialog, setFaqDialog] = useState(false);
  const [editingFaq, setEditingFaq] = useState<KnowledgeFaq | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // Hydrate locally-uploaded docs (mock)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored = JSON.parse(raw) as KnowledgeDocument[];
        setDocs((prev) => {
          const existingIds = new Set(prev.map((d) => d.id));
          return [...stored.filter((d) => !existingIds.has(d.id)), ...prev];
        });
      }
    } catch {
      /* ignore */
    }
  }, []);

  const persistUploaded = (next: KnowledgeDocument[]) => {
    const uploaded = next.filter(
      (d) => !knowledgeDocuments.some((seed) => seed.id === d.id),
    );
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(uploaded));
    } catch {
      /* ignore */
    }
  };

  /* ------------------------------ FAQs ------------------------------ */

  const filteredFaqs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return faqs.filter((e) => {
      const okCat = activeCat === "All" || e.category === activeCat;
      const okSearch =
        !q || e.q.toLowerCase().includes(q) || e.a.toLowerCase().includes(q);
      return okCat && okSearch;
    });
  }, [faqs, activeCat, search]);

  const filteredDocs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return docs.filter((d) => !q || d.filename.toLowerCase().includes(q));
  }, [docs, search]);

  const openCreateFaq = () => {
    setEditingFaq(null);
    setFaqDialog(true);
  };

  const openEditFaq = (faq: KnowledgeFaq) => {
    setEditingFaq(faq);
    setFaqDialog(true);
  };

  const saveFaq = (faq: KnowledgeFaq) => {
    setFaqs((prev) => {
      const exists = prev.some((p) => p.id === faq.id);
      return exists ? prev.map((p) => (p.id === faq.id ? faq : p)) : [faq, ...prev];
    });
    toast.success(editingFaq ? "FAQ updated" : "FAQ added");
    setFaqDialog(false);
    setEditingFaq(null);
  };

  const deleteFaq = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    toast.success("FAQ deleted");
  };

  /* ----------------------------- Documents ----------------------------- */

  const onPickFile = (file: File | null) => {
    if (!file) return;
    const newDoc: KnowledgeDocument = {
      id: `d${Date.now()}`,
      filename: file.name,
      ext: inferExt(file.name),
      sizeKb: Math.max(1, Math.round(file.size / 1024)),
      uploadedAt: "Just now",
    };
    setDocs((prev) => {
      const next = [newDoc, ...prev];
      persistUploaded(next);
      return next;
    });
    toast.success(`Uploaded ${file.name}`);
  };

  const deleteDoc = (id: string) => {
    setDocs((prev) => {
      const next = prev.filter((d) => d.id !== id);
      persistUploaded(next);
      return next;
    });
    toast.success("Document removed");
  };

  return (
    <DashboardLayout currentPath="/dashboard/knowledge">
      <div className="px-6 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold leading-tight">Knowledge</h1>
              <p className="text-sm text-muted-foreground">
                Your AI agents and Ema use these to answer customer questions.
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-5 flex items-center gap-2">
          <div className="relative flex-1 sm:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search FAQs and documents…"
              className="h-9 pl-9 text-sm"
            />
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "faqs" | "documents")}
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <TabsList>
              <TabsTrigger value="faqs">
                FAQs <span className="ml-1.5 opacity-60">{faqs.length}</span>
              </TabsTrigger>
              <TabsTrigger value="documents">
                Documents <span className="ml-1.5 opacity-60">{docs.length}</span>
              </TabsTrigger>
            </TabsList>

            {activeTab === "faqs" ? (
              <Button
                size="sm"
                onClick={openCreateFaq}
                className="bg-gradient-primary text-primary-foreground hover:opacity-90"
              >
                <Plus className="h-4 w-4" /> Add FAQ
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  onClick={() => fileRef.current?.click()}
                  className="bg-gradient-primary text-primary-foreground hover:opacity-90"
                >
                  <Upload className="h-4 w-4" /> Upload document
                </Button>
                <input
                  ref={fileRef}
                  type="file"
                  hidden
                  onChange={(e) => {
                    onPickFile(e.target.files?.[0] ?? null);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                />
              </>
            )}
          </div>

          {/* ============================== FAQs ============================== */}
          <TabsContent value="faqs" className="mt-0">
            <div className="mb-4 flex flex-wrap gap-1.5">
              {(["All", ...knowledgeCategories] as const).map((cat) => {
                const active = activeCat === cat;
                const count =
                  cat === "All"
                    ? faqs.length
                    : faqs.filter((e) => e.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCat(cat as KnowledgeCategory | "All")}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      active
                        ? "border-primary/40 bg-primary/15 text-primary"
                        : "border-border/60 bg-card/40 text-muted-foreground hover:bg-accent",
                    )}
                  >
                    {cat} <span className="opacity-60">{count}</span>
                  </button>
                );
              })}
            </div>

            <div className="grid gap-3">
              {filteredFaqs.length === 0 ? (
                <div className="rounded-lg border border-border/40 bg-card/30 py-12 text-center text-sm text-muted-foreground">
                  No FAQs match this view.
                </div>
              ) : (
                filteredFaqs.map((entry) => (
                  <Card
                    key={entry.id}
                    className="group border-border/40 bg-card/40 p-5 transition-all hover:border-primary/30 hover:bg-card/60"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
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
                        <button
                          onClick={() => openEditFaq(entry)}
                          className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                          aria-label={`Edit ${entry.q}`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => deleteFaq(entry.id)}
                          className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                          aria-label={`Delete ${entry.q}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 rounded-lg border border-ema/20 bg-ema/5 px-4 py-3 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-ema" />
              Ema suggests adding answers for "Do you have a kids menu?" — asked 11 times this week.
            </div>
          </TabsContent>

          {/* ============================ Documents ============================ */}
          <TabsContent value="documents" className="mt-0">
            {filteredDocs.length === 0 ? (
              <div className="rounded-lg border border-border/40 bg-card/30 py-12 text-center text-sm text-muted-foreground">
                No documents match this view.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredDocs.map((doc) => {
                  const Icon = docIcon(doc.ext);
                  return (
                    <Card
                      key={doc.id}
                      className="group flex flex-col border-border/40 bg-card/40 p-4 transition-all hover:border-primary/30 hover:bg-card/60"
                    >
                      <div className="mb-3 flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium" title={doc.filename}>
                            {doc.filename}
                          </p>
                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                            <span className="uppercase">{doc.ext}</span> ·{" "}
                            {formatSize(doc.sizeKb)}
                          </p>
                        </div>
                      </div>

                      <p className="mb-3 text-[11px] text-muted-foreground/80">
                        Uploaded {doc.uploadedAt}
                      </p>

                      <div className="mt-auto flex items-center justify-between gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toast(`Preview not available in mock — ${doc.filename}`)}
                        >
                          <Eye className="h-3.5 w-3.5" /> View
                        </Button>
                        <button
                          onClick={() => deleteDoc(doc.id)}
                          className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                          aria-label={`Delete ${doc.filename}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <FaqDialog
        open={faqDialog}
        onOpenChange={(o) => {
          setFaqDialog(o);
          if (!o) setEditingFaq(null);
        }}
        editing={editingFaq}
        onSave={saveFaq}
      />
    </DashboardLayout>
  );
}

/* ------------------------------- FAQ Dialog ------------------------------- */

function FaqDialog({
  open,
  onOpenChange,
  editing,
  onSave,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  editing: KnowledgeFaq | null;
  onSave: (faq: KnowledgeFaq) => void;
}) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState<KnowledgeCategory>("Reservations");

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setQuestion(editing.q);
      setAnswer(editing.a);
      setCategory(editing.category);
    } else {
      setQuestion("");
      setAnswer("");
      setCategory("Reservations");
    }
  }, [open, editing]);

  const submit = () => {
    if (!question.trim() || !answer.trim()) {
      toast.error("Question and answer are both required");
      return;
    }
    const faq: KnowledgeFaq = {
      id: editing?.id ?? `k${Date.now()}`,
      category,
      q: question.trim(),
      a: answer.trim(),
      uses: editing?.uses ?? 0,
      lastUpdated: "Just now",
    };
    onSave(faq);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
          <DialogDescription>
            FAQs are the fastest way for your AI agents to learn the answers customers ask most.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="faq-cat">Category</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as KnowledgeCategory)}
            >
              <SelectTrigger id="faq-cat">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {knowledgeCategories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="faq-q">Question</Label>
            <Input
              id="faq-q"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What customers ask…"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="faq-a">Answer</Label>
            <Textarea
              id="faq-a"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={4}
              placeholder="The answer your AI will give. Be specific."
            />
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
            {editing ? "Save changes" : "Add FAQ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

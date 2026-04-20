"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Phone,
  PhoneCall,
  Instagram,
  MessageCircle,
  Search,
  Send,
  Sparkles,
  AlertCircle,
  Paperclip,
  Smile,
  UserCheck,
  RotateCcw,
  X,
  Plus,
  Ban,
  Lock,
  BookOpen,
  StickyNote,
  MessageSquare,
  RefreshCw,
  Wand2,
  Calendar as CalendarIcon,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  Clock,
  Pencil,
  Inbox as InboxIcon,
  Tag,
  FileText,
  FileArchive,
  ImageIcon,
  Play,
  Pause,
  Download,
  MapPin,
  ChevronDown,
  Camera,
  LayoutTemplate,
  Bot,
} from "lucide-react";
import { toast } from "sonner";
import { format, addDays } from "date-fns";
import DashboardLayout from "../layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  conversations,
  contacts,
  agents,
  pendingDrafts as seedPendingDrafts,
  emaConvQuickActions,
  emaConversationReply,
  getSuggestions,
  conversationMeta as seedConvMeta,
  tenantLabels as seedLabels,
  statusMeta,
  labelColorClasses,
  conversationMedia,
  messageTemplates,
  renderTemplate,
  type Channel,
  type EmaConvChatMsg,
  type MessageCard,
  type MessageMedia,
  type MessageTemplate,
  type PendingDraft,
  type ConversationStatus,
  type ConversationMeta,
  type LabelDef,
} from "@/lib/mock-data";

const channelMeta: Record<Channel, { icon: typeof Phone; label: string; color: string }> = {
  whatsapp: { icon: Phone, label: "WhatsApp", color: "text-success bg-success/15" },
  voice: { icon: PhoneCall, label: "Voice", color: "text-primary bg-primary/15" },
  instagram: { icon: Instagram, label: "Instagram", color: "text-ema bg-ema/15" },
  messenger: { icon: MessageCircle, label: "Messenger", color: "text-chart-4 bg-chart-4/15" },
};

const tabs: Array<{ key: "all" | Channel; label: string }> = [
  { key: "all", label: "All" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "voice", label: "Voice" },
  { key: "instagram", label: "Instagram" },
  { key: "messenger", label: "Messenger" },
];

// Mock — which agent handles which conversation. Read-only pill in header.
const conversationAgent: Record<string, string> = {
  c1: "ag-receptionist",
  c2: "ag-receptionist",
  c3: "ag-receptionist",
  c4: "ag-receptionist",
  c5: "ag-aftersales",
  c6: "ag-receptionist",
};

type Qualification = "Lead" | "Customer" | "Blocked" | "Unknown";

type ThreadMsg = {
  id: number | string;
  from: "customer" | "ai" | "owner" | "whisper";
  text: string;
  time: string;
  ownerName?: string;
  teachAi?: boolean;
  card?: MessageCard;
  media?: MessageMedia;
};

// Mocked POST /api/inbox/conversations/[id]/whisper.
// In a real backend this would persist + (if teachAi) push to the agent's memory.
async function postWhisper(
  conversationId: string,
  body: { text: string; teachAi: boolean },
): Promise<{ id: string; text: string; teachAi: boolean; createdAt: string }> {
  await new Promise((r) => setTimeout(r, 200));
  return {
    id: `wh_${Date.now()}_${conversationId}`,
    text: body.text,
    teachAi: body.teachAi,
    createdAt: new Date().toISOString(),
  };
}

// Mocked POST /api/ema/conversation-chat.
// Returns Ema's reply and (optionally) a draft the owner can paste into the composer.
async function postEmaConversationChat(
  conversationId: string,
  message: string,
): Promise<{ id: string; text: string; draftReply?: string; createdAt: string }> {
  await new Promise((r) => setTimeout(r, 350));
  const reply = emaConversationReply(conversationId, message);
  return {
    id: `ema_${Date.now()}_${conversationId}`,
    text: reply.text,
    draftReply: reply.draftReply,
    createdAt: new Date().toISOString(),
  };
}

// Mocked GET /api/inbox/conversations/[id]/suggestions.
async function fetchSuggestions(
  conversationId: string,
  rotation: number,
): Promise<{ suggestions: [string, string, string] }> {
  await new Promise((r) => setTimeout(r, 200));
  const s = getSuggestions(conversationId, rotation);
  return { suggestions: [s[0], s[1], s[2]] as [string, string, string] };
}

// Mocked PATCH /api/inbox/conversations/[id]. Mutates the in-memory store via setState in caller.
async function patchConversation(
  conversationId: string,
  body: Partial<{ status: ConversationStatus; snoozeUntil?: string; labels: string[] }>,
): Promise<{ id: string } & Partial<ConversationMeta>> {
  await new Promise((r) => setTimeout(r, 120));
  return { id: conversationId, ...body };
}

// Mocked GET /api/labels + POST /api/labels — local-only here.
async function fetchTemplates(): Promise<{ templates: MessageTemplate[] }> {
  await new Promise((r) => setTimeout(r, 80));
  return { templates: messageTemplates };
}

const OWNER_NAME = "You";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export default function InboxPage() {
  const [activeTab, setActiveTab] = useState<"all" | Channel>("all");
  const [statusTab, setStatusTab] = useState<"active" | "snoozed">("active");
  const [activeId, setActiveId] = useState(conversations[0].id);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [aiHandled, setAiHandled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(conversations.map((c) => [c.id, c.status === "ai"])),
  );
  // Take-over confirm
  const [confirmTakeOverFor, setConfirmTakeOverFor] = useState<string | null>(null);
  // Contact drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  // Filter inbox by a specific contact (when "View all conversations" clicked)
  const [contactFilter, setContactFilter] = useState<string | null>(null);
  // Composer mode: reply / whisper / template
  const [composerMode, setComposerMode] = useState<"reply" | "whisper" | "template">("reply");
  const [teachAi, setTeachAi] = useState(false);
  // Whispers added at runtime, keyed by conversation id
  const [extraWhispers, setExtraWhispers] = useState<Record<string, ThreadMsg[]>>({});
  const [savingWhisper, setSavingWhisper] = useState(false);
  // Editable per-contact state (mock — local only)
  const [contactState, setContactState] = useState<
    Record<
      string,
      { tags: string[]; notes: string; qualification: Qualification }
    >
  >(() =>
    Object.fromEntries(
      contacts.map((c) => [
        c.name,
        {
          tags: [...c.tags],
          notes: c.notes,
          qualification: (c.tags.includes("vip")
            ? "Customer"
            : c.tags.includes("new")
              ? "Lead"
              : "Unknown") as Qualification,
        },
      ]),
    ),
  );
  const [newTagDraft, setNewTagDraft] = useState("");

  // ---- Feature 1: Ask Ema drawer ----
  const [emaOpen, setEmaOpen] = useState(false);
  const [emaChats, setEmaChats] = useState<Record<string, EmaConvChatMsg[]>>({});
  const [emaInput, setEmaInput] = useState("");
  const [emaThinking, setEmaThinking] = useState(false);
  const emaScrollRef = useRef<HTMLDivElement | null>(null);

  // ---- Feature 2: AI suggested replies ----
  const [suggestionsByConv, setSuggestionsByConv] = useState<Record<string, string[]>>({});
  const [suggestionRotation, setSuggestionRotation] = useState<Record<string, number>>({});
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  // ---- Feature 3: Review mode + pending approval queue ----
  const [reviewModeMap, setReviewModeMap] = useState<Record<string, boolean>>({});
  const [leftPane, setLeftPane] = useState<"conversations" | "pending">("conversations");
  const [pendingFilter, setPendingFilter] = useState<string>("all");
  const [pendingQueue, setPendingQueue] = useState<PendingDraft[]>(seedPendingDrafts);
  const [rejectingDraft, setRejectingDraft] = useState<PendingDraft | null>(null);
  const [rejectNote, setRejectNote] = useState("");

  // ---- Turn 8 · Feature 1: Status + labels ----
  const [convMeta, setConvMeta] = useState<Record<string, ConversationMeta>>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem("isola.convMeta");
        if (raw) return { ...seedConvMeta, ...(JSON.parse(raw) as Record<string, ConversationMeta>) };
      } catch {
        /* ignore */
      }
    }
    return seedConvMeta;
  });
  const [labelLibrary, setLabelLibrary] = useState<LabelDef[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem("isola.labels");
        if (raw) return JSON.parse(raw) as LabelDef[];
      } catch {
        /* ignore */
      }
    }
    return seedLabels;
  });
  const [statusFilter, setStatusFilter] = useState<"all" | ConversationStatus>("all");
  const [labelFilter, setLabelFilter] = useState<string>("all");
  const [snoozePopoverFor, setSnoozePopoverFor] = useState<string | null>(null);
  const [snoozeCustomDate, setSnoozeCustomDate] = useState<Date | undefined>(undefined);

  // ---- Turn 8 · Feature 2: Templates ----
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [templateSearch, setTemplateSearch] = useState("");
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);
  const [templateValues, setTemplateValues] = useState<Record<number, string>>({});

  // ---- Turn 8 · Feature 3: Media (extras added at runtime) ----
  const [extraMedia, setExtraMedia] = useState<Record<string, ThreadMsg[]>>({});

  // Persist meta + labels
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("isola.convMeta", JSON.stringify(convMeta));
      } catch {
        /* ignore */
      }
    }
  }, [convMeta]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("isola.labels", JSON.stringify(labelLibrary));
      } catch {
        /* ignore */
      }
      // Re-read on focus so changes from /dashboard/settings appear without reload
      const reread = () => {
        const raw = window.localStorage.getItem("isola.labels");
        if (raw) {
          try {
            setLabelLibrary(JSON.parse(raw) as LabelDef[]);
          } catch {
            /* ignore */
          }
        }
      };
      window.addEventListener("focus", reread);
      window.addEventListener("storage", reread);
      return () => {
        window.removeEventListener("focus", reread);
        window.removeEventListener("storage", reread);
      };
    }
  }, [labelLibrary]);

  // Load templates once
  useEffect(() => {
    void fetchTemplates().then((r) => setTemplates(r.templates));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const read = () => {
      try {
        const raw = window.localStorage.getItem("isola.reviewMode");
        setReviewModeMap(raw ? (JSON.parse(raw) as Record<string, boolean>) : {});
      } catch {
        setReviewModeMap({});
      }
    };
    read();
    window.addEventListener("storage", read);
    window.addEventListener("focus", read);
    return () => {
      window.removeEventListener("storage", read);
      window.removeEventListener("focus", read);
    };
  }, []);

  const anyReviewModeOn = useMemo(
    () => agents.some((a) => reviewModeMap[a.id]),
    [reviewModeMap],
  );
  const visiblePending = useMemo(
    () =>
      pendingQueue.filter((d) => {
        if (!reviewModeMap[d.agentId]) return false;
        if (pendingFilter !== "all" && d.agentId !== pendingFilter) return false;
        return true;
      }),
    [pendingQueue, reviewModeMap, pendingFilter],
  );

  useEffect(() => {
    if (!anyReviewModeOn && leftPane === "pending") setLeftPane("conversations");
  }, [anyReviewModeOn, leftPane]);

  const loadSuggestions = async (convId: string, rotation: number) => {
    setSuggestionsLoading(true);
    try {
      const res = await fetchSuggestions(convId, rotation);
      setSuggestionsByConv((p) => ({ ...p, [convId]: res.suggestions }));
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const aiHandledForActive = aiHandled[activeId];
  useEffect(() => {
    if (!aiHandledForActive) return;
    if (suggestionsByConv[activeId]) return;
    void loadSuggestions(activeId, suggestionRotation[activeId] ?? 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, aiHandledForActive]);

  useEffect(() => {
    if (!emaOpen) return;
    requestAnimationFrame(() => {
      emaScrollRef.current?.scrollTo({ top: emaScrollRef.current.scrollHeight, behavior: "smooth" });
    });
  }, [emaChats, emaThinking, emaOpen]);

  const handleConfirmTakeOver = () => {
    if (!confirmTakeOverFor) return;
    const conv = conversations.find((c) => c.id === confirmTakeOverFor);
    setAiHandled((prev) => ({ ...prev, [confirmTakeOverFor]: false }));
    toast.success("You're now handling this conversation", {
      description: conv ? `AI is paused for ${conv.customer}.` : undefined,
    });
    setConfirmTakeOverFor(null);
  };

  const handleGiveBack = (id: string, customer: string) => {
    setAiHandled((prev) => ({ ...prev, [id]: true }));
    toast.success("Handed back to AI", {
      description: `Ema is replying to ${customer} again.`,
    });
  };

  const labelById = useMemo(
    () => Object.fromEntries(labelLibrary.map((l) => [l.id, l])) as Record<string, LabelDef>,
    [labelLibrary],
  );

  const getMeta = (id: string): ConversationMeta =>
    convMeta[id] ?? { status: "open", labels: [], hoursSinceLastInbound: 0.5 };

  const snoozedCount = useMemo(
    () => conversations.filter((c) => getMeta(c.id).status === "snoozed").length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [convMeta],
  );

  const filtered = conversations.filter((c) => {
    const m = getMeta(c.id);
    if (statusTab === "snoozed") {
      if (m.status !== "snoozed") return false;
    } else if (m.status === "snoozed") {
      return false;
    }
    if (activeTab !== "all" && c.channel !== activeTab) return false;
    if (statusFilter !== "all" && m.status !== statusFilter) return false;
    if (labelFilter !== "all" && !m.labels.includes(labelFilter)) return false;
    if (search && !c.customer.toLowerCase().includes(search.toLowerCase())) return false;
    if (contactFilter && c.customer !== contactFilter) return false;
    return true;
  });

  const active = conversations.find((c) => c.id === activeId) ?? conversations[0];
  const ActiveChannelIcon = channelMeta[active.channel].icon;
  const activeMeta = getMeta(active.id);
  const isAi = aiHandled[active.id];
  const composerDisabled = isAi || !draft.trim();
  const isStale24h = activeMeta.hoursSinceLastInbound > 24;

  const updateMeta = (id: string, patch: Partial<ConversationMeta>) => {
    setConvMeta((prev) => ({
      ...prev,
      [id]: { ...getMeta(id), ...patch },
    }));
    void patchConversation(id, patch);
  };

  const setStatusFor = (id: string, status: ConversationStatus, snoozeUntil?: string) => {
    updateMeta(id, { status, snoozeUntil: status === "snoozed" ? snoozeUntil : undefined });
    toast.success(
      status === "snoozed" && snoozeUntil
        ? `Snoozed until ${format(new Date(snoozeUntil), "PPp")}`
        : `Marked as ${statusMeta[status].label}`,
    );
  };

  const toggleLabel = (id: string, labelId: string) => {
    const cur = getMeta(id).labels;
    const next = cur.includes(labelId) ? cur.filter((l) => l !== labelId) : [...cur, labelId];
    updateMeta(id, { labels: next });
  };

  const snoozePresets = useMemo(
    () => [
      { key: "tomorrow", label: "Tomorrow 9am", date: (() => { const d = addDays(new Date(), 1); d.setHours(9, 0, 0, 0); return d; })() },
      { key: "nextweek", label: "Next week", date: (() => { const d = addDays(new Date(), 7); d.setHours(9, 0, 0, 0); return d; })() },
    ],
    [],
  );

  // Contact details for the drawer (look up by name; fall back to a synthetic record)
  const matchedContact = contacts.find((c) => c.name === active.customer);
  const contactKey = active.customer;
  const editable =
    contactState[contactKey] ??
    { tags: matchedContact?.tags ?? [], notes: matchedContact?.notes ?? "", qualification: "Unknown" as Qualification };

  const updateContact = (
    patch: Partial<{ tags: string[]; notes: string; qualification: Qualification }>,
  ) => {
    setContactState((prev) => ({
      ...prev,
      [contactKey]: { ...editable, ...patch },
    }));
  };

  const conversationCount = conversations.filter((c) => c.customer === active.customer).length;
  const bookingsCount = matchedContact?.visits ?? 0;

  return (
    <DashboardLayout currentPath="/dashboard/inbox">
      <div className="flex h-[calc(100vh-0px)] flex-col">
        {/* Header */}
        <div className="border-b border-border/40 px-6 py-5 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold">Inbox</h1>
              <p className="text-sm text-muted-foreground">All conversations across every channel.</p>
            </div>
            <Badge variant="outline" className="border-success/30 bg-success/10 text-success">
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-success" /> Auto-reply on
            </Badge>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === t.key
                    ? "border-primary/40 bg-primary/15 text-primary"
                    : "border-border/60 bg-card/40 text-muted-foreground hover:bg-accent"
                }`}
              >
                {t.label}
                <span className="ml-1.5 opacity-60">
                  {t.key === "all"
                    ? conversations.length
                    : conversations.filter((c) => c.channel === t.key).length}
                </span>
              </button>
            ))}
            {contactFilter && (
              <button
                onClick={() => setContactFilter(null)}
                className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-ema/40 bg-ema/10 px-3 py-1.5 text-xs font-medium text-ema transition-colors hover:bg-ema/20"
              >
                Filter: {contactFilter}
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          {/* Status tab + filters row */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-md border border-border/60 bg-card/40 p-0.5">
              <button
                onClick={() => setStatusTab("active")}
                className={`rounded px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  statusTab === "active" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusTab("snoozed")}
                className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  statusTab === "snoozed" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Clock className="h-3 w-3" /> Snoozed
                {snoozedCount > 0 && (
                  <span className="ml-0.5 rounded-full bg-violet/20 px-1.5 text-[10px] font-bold text-violet">
                    {snoozedCount}
                  </span>
                )}
              </button>
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
              <SelectTrigger className="h-8 w-auto gap-1.5 border-border/60 bg-card/40 text-xs">
                <Tag className="h-3 w-3 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={labelFilter} onValueChange={setLabelFilter}>
              <SelectTrigger className="h-8 w-auto gap-1.5 border-border/60 bg-card/40 text-xs">
                <Tag className="h-3 w-3 text-muted-foreground" />
                <SelectValue placeholder="Labels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any label</SelectItem>
                {labelLibrary.map((l) => (
                  <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Split pane */}
        <div className="grid flex-1 grid-cols-1 overflow-hidden md:grid-cols-[340px_1fr]">
          {/* Conversation list */}
          <aside className="flex flex-col border-r border-border/40">
            <div className="border-b border-border/40 p-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search conversations…"
                  className="pl-9"
                />
              </div>
            </div>
            <ul className="flex-1 overflow-y-auto">
              {filtered.length === 0 && (
                <li className="px-5 py-12 text-center text-sm text-muted-foreground">No conversations</li>
              )}
              {filtered.map((c) => {
                const Icon = channelMeta[c.channel].icon;
                const isActive = c.id === activeId;
                const m = getMeta(c.id);
                const sm = statusMeta[m.status];
                const visibleLabels = m.labels.slice(0, 2);
                const overflow = m.labels.length - visibleLabels.length;
                return (
                  <li key={c.id}>
                    <button
                      onClick={() => setActiveId(c.id)}
                      className={`flex w-full items-start gap-3 border-l-2 px-4 py-3.5 text-left transition-colors ${
                        isActive
                          ? "border-l-primary bg-accent/40"
                          : "border-l-transparent hover:bg-accent/20"
                      }`}
                    >
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${channelMeta[c.channel].color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="inline-flex min-w-0 items-center gap-1.5">
                            <span
                              className={`h-1.5 w-1.5 shrink-0 rounded-full ${sm.dot}`}
                              title={sm.label}
                            />
                            <span className="truncate text-sm font-semibold">{c.customer}</span>
                          </span>
                          <span className="shrink-0 text-[10px] text-muted-foreground">{c.time}</span>
                        </div>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">{c.preview}</p>
                        {(visibleLabels.length > 0 || c.status === "escalated") && (
                          <div className="mt-1.5 flex flex-wrap items-center gap-1">
                            {visibleLabels.map((id) => {
                              const lab = labelById[id];
                              if (!lab) return null;
                              const cls = labelColorClasses[lab.color];
                              return (
                                <span
                                  key={id}
                                  className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0 text-[9px] font-medium ${cls.chip}`}
                                >
                                  {lab.name}
                                </span>
                              );
                            })}
                            {overflow > 0 && (
                              <span className="text-[9px] text-muted-foreground">+{overflow}</span>
                            )}
                            {c.status === "escalated" && (
                              <Badge variant="outline" className="border-warning/30 bg-warning/10 px-1.5 py-0 text-[9px] text-warning">
                                <AlertCircle className="mr-0.5 h-2 w-2" /> Needs you
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      {c.unread > 0 && (
                        <span className="ml-1 mt-1 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                          {c.unread}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Thread */}
          <section className="flex min-w-0 flex-col bg-background">
            <div className="flex items-center justify-between border-b border-border/40 px-6 py-4">
              <button
                onClick={() => setDrawerOpen(true)}
                className="flex items-center gap-3 rounded-md text-left transition-colors hover:bg-accent/40 -mx-2 px-2 py-1"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${channelMeta[active.channel].color}`}>
                  <ActiveChannelIcon className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold underline-offset-2 group-hover:underline">{active.customer}</div>
                  <div className="text-xs text-muted-foreground">
                    via {channelMeta[active.channel].label}
                    {active.status === "escalated" && <span className="text-warning"> · escalated to you</span>}
                  </div>
                </div>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEmaOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-violet/40 bg-violet/10 px-3 py-1.5 text-xs font-semibold text-violet transition-colors hover:bg-violet/20"
                >
                  <Sparkles className="h-3 w-3" /> Ask Ema
                </button>
                {anyReviewModeOn && (
                  <button
                    onClick={() => setLeftPane(leftPane === "pending" ? "conversations" : "pending")}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      leftPane === "pending"
                        ? "border-violet/60 bg-violet/20 text-violet"
                        : "border-border/60 bg-card/40 text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    <InboxIcon className="h-3 w-3" /> Pending
                    {visiblePending.length > 0 && (
                      <span className="ml-0.5 rounded-full bg-violet px-1.5 text-[10px] font-bold text-violet-foreground">
                        {visiblePending.length}
                      </span>
                    )}
                  </button>
                )}
                {isAi ? (
                  <Button
                    size="sm"
                    onClick={() => setConfirmTakeOverFor(active.id)}
                    className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
                  >
                    <UserCheck className="h-3.5 w-3.5" /> Take over
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleGiveBack(active.id, active.customer)}
                    className="border-primary/40 bg-primary/10 text-primary hover:bg-primary/15"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Give back to AI
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => setDrawerOpen(true)}>
                  View contact
                </Button>
              </div>
            </div>

            {/* Manual-reply banner */}
            {!isAi && (
              <div className="flex items-center gap-2 border-b border-warning/30 bg-warning/10 px-6 py-2.5 text-xs text-warning">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span className="flex-1">
                  You're replying manually. AI is paused for this conversation.
                </span>
                <button
                  onClick={() => handleGiveBack(active.id, active.customer)}
                  className="font-semibold underline-offset-2 hover:underline"
                >
                  Hand back to AI
                </button>
              </div>
            )}

            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
              {[...(active.messages as ThreadMsg[]), ...(extraWhispers[active.id] ?? [])].map((m) => {
                if (m.from === "whisper") {
                  return (
                    <div key={m.id} className="w-full">
                      <div className="rounded-xl border-l-4 border-amber-500 bg-amber-950/30 px-4 py-3">
                        <div className="mb-1.5 flex flex-wrap items-center gap-2 text-[11px] font-medium text-amber-300">
                          <span className="inline-flex items-center gap-1">
                            <Lock className="h-3 w-3" /> Private note by {m.ownerName ?? OWNER_NAME}
                          </span>
                          <span className="text-amber-300/60">·</span>
                          <span className="text-amber-300/80">{m.time}</span>
                          {m.teachAi && (
                            <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-200">
                              <BookOpen className="h-2.5 w-2.5" /> AI will remember this
                            </span>
                          )}
                        </div>
                        <p className="text-sm leading-relaxed text-amber-50">{m.text}</p>
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={m.id} className={`flex ${m.from === "customer" ? "justify-start" : "justify-end"}`}>
                    <div className="max-w-[75%]">
                      {m.from === "ai" && (
                        <div className="mb-1 flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground">
                          <Sparkles className="h-2.5 w-2.5 text-primary" /> AI replied
                        </div>
                      )}
                      {m.card ? (
                        <RichCard card={m.card} fromCustomer={m.from === "customer"} />
                      ) : (
                        <Card
                          className={`px-4 py-2.5 text-sm ${
                            m.from === "customer"
                              ? "rounded-2xl rounded-tl-sm border-transparent bg-bubble-in text-bubble-in-foreground"
                              : "rounded-2xl rounded-tr-sm border-transparent bg-bubble-out text-bubble-out-foreground"
                          }`}
                        >
                          {m.text}
                        </Card>
                      )}
                      {m.text && m.card && (
                        <div className="mt-1 text-xs text-muted-foreground">{m.text}</div>
                      )}
                      <div className={`mt-1 text-[10px] text-muted-foreground ${m.from === "customer" ? "text-left" : "text-right"}`}>
                        {m.time}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Suggested replies (Feature 2) — only when AI is handling */}
            {isAi && (
              <div className="border-t border-border/40 bg-violet/5 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-violet">
                    <Wand2 className="h-3 w-3" /> Suggested
                  </span>
                  <div className="flex flex-1 flex-wrap items-center gap-1.5">
                    <TooltipProvider delayDuration={150}>
                      {(suggestionsByConv[activeId] ?? []).map((s, i) => (
                        <Tooltip key={i}>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => {
                                setDraft(s);
                                setComposerMode("reply");
                                setAiHandled((p) => ({ ...p, [activeId]: false }));
                                toast.success("AI paused — edit and send when ready");
                              }}
                              className="rounded-full border border-violet/40 bg-violet/10 px-3 py-1 text-[11px] text-foreground transition-colors hover:border-violet/60 hover:bg-violet/20"
                            >
                              {s.length > 60 ? s.slice(0, 60) + "…" : s}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">{s}</TooltipContent>
                        </Tooltip>
                      ))}
                      {suggestionsLoading && (suggestionsByConv[activeId] ?? []).length === 0 && (
                        <span className="text-[11px] text-muted-foreground">Generating…</span>
                      )}
                    </TooltipProvider>
                  </div>
                  <button
                    onClick={() => {
                      const next = (suggestionRotation[activeId] ?? 0) + 1;
                      setSuggestionRotation((p) => ({ ...p, [activeId]: next }));
                      void loadSuggestions(activeId, next);
                    }}
                    className="rounded-md p-1.5 text-violet transition-colors hover:bg-violet/15"
                    aria-label="Regenerate suggestions"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${suggestionsLoading ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>
            )}

            {/* Composer */}
            <div className="border-t border-border/40 bg-card/30 p-4">
              {/* Tabs */}
              <div className="mb-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setComposerMode("reply")}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    composerMode === "reply"
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent/40"
                  }`}
                >
                  <MessageSquare className="h-3 w-3" /> Reply
                </button>
                <button
                  type="button"
                  onClick={() => setComposerMode("whisper")}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    composerMode === "whisper"
                      ? "bg-amber-500/20 text-amber-300"
                      : "text-muted-foreground hover:bg-accent/40"
                  }`}
                >
                  <StickyNote className="h-3 w-3" /> Whisper
                </button>
              </div>

              {composerMode === "reply" ? (
                <>
                  <div className={`flex items-end gap-2 rounded-xl border p-2 transition-colors ${isAi ? "border-border/40 bg-background/40 opacity-60" : "border-border/60 bg-background"}`}>
                    <Button variant="ghost" size="icon" className="shrink-0" disabled={isAi}>
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder={isAi ? "AI is handling this thread — take over to reply" : "Type your reply…"}
                      disabled={isAi}
                      className="border-0 focus-visible:ring-0 disabled:cursor-not-allowed"
                    />
                    <Button variant="ghost" size="icon" className="shrink-0" disabled={isAi}>
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      className="shrink-0 bg-success text-success-foreground hover:bg-success/90"
                      disabled={composerDisabled}
                      onClick={() => {
                        if (!draft.trim()) return;
                        toast.success("Message sent");
                        setDraft("");
                      }}
                    >
                      <Send className="h-3.5 w-3.5" /> Send
                    </Button>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      {isAi ? (
                        <>
                          <Sparkles className="h-3 w-3 text-primary" /> AI is monitoring this thread
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-3 w-3 text-warning" /> You're replying as yourself
                        </>
                      )}
                    </span>
                    <span>Press ⌘⏎ to send</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-2">
                    <div className="flex items-end gap-2">
                      <Lock className="ml-1 mb-2 h-3.5 w-3.5 shrink-0 text-amber-400" />
                      <Input
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder="Private note — customer won't see this"
                        className="border-0 bg-transparent text-amber-50 placeholder:text-amber-200/50 focus-visible:ring-0"
                      />
                      <Button
                        size="sm"
                        className="shrink-0 bg-amber-500 text-amber-950 hover:bg-amber-400"
                        disabled={!draft.trim() || savingWhisper}
                        onClick={async () => {
                          if (!draft.trim()) return;
                          setSavingWhisper(true);
                          try {
                            const res = await postWhisper(active.id, {
                              text: draft.trim(),
                              teachAi,
                            });
                            const msg: ThreadMsg = {
                              id: res.id,
                              from: "whisper",
                              text: res.text,
                              time: "just now",
                              ownerName: OWNER_NAME,
                              teachAi: res.teachAi,
                            };
                            setExtraWhispers((prev) => ({
                              ...prev,
                              [active.id]: [...(prev[active.id] ?? []), msg],
                            }));
                            toast.success(
                              res.teachAi ? "Note saved · AI will remember" : "Private note saved",
                            );
                            setDraft("");
                          } catch {
                            toast.error("Couldn't save note");
                          } finally {
                            setSavingWhisper(false);
                          }
                        }}
                      >
                        <StickyNote className="h-3.5 w-3.5" /> Save note
                      </Button>
                    </div>
                  </div>
                  <label className="mt-2 flex cursor-pointer items-start gap-2 rounded-md px-1 py-1 text-[11px] text-muted-foreground hover:text-foreground">
                    <Checkbox
                      checked={teachAi}
                      onCheckedChange={(v) => setTeachAi(v === true)}
                      className="mt-0.5"
                    />
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="h-3 w-3 text-amber-400" />
                      Teach the AI — include this note in future AI responses to this contact
                    </span>
                  </label>
                </>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Take-over confirm dialog */}
      <AlertDialog open={!!confirmTakeOverFor} onOpenChange={(o) => !o && setConfirmTakeOverFor(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Take over this conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              AI will pause until you give it back. You'll be the one replying from here on.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmTakeOver} className="bg-gradient-primary text-primary-foreground">
              Take over
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Contact drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-[400px]">
          <SheetHeader className="border-b border-border/40 px-6 py-5">
            <div className="flex items-start gap-3">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${channelMeta[active.channel].color}`}>
                {initials(active.customer)}
              </div>
              <div className="min-w-0 flex-1">
                <SheetTitle className="font-display text-lg">{active.customer}</SheetTitle>
                <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
                  {matchedContact?.phone ?? "No phone on file"}
                </p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                  via {channelMeta[active.channel].label}
                </p>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
            {/* Tags */}
            <div>
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Tags
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {editable.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-accent/40 px-2.5 py-0.5 text-[11px] font-medium"
                  >
                    {t}
                    <button
                      onClick={() => updateContact({ tags: editable.tags.filter((x) => x !== t) })}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label={`Remove ${t}`}
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}
                <div className="inline-flex items-center gap-1">
                  <Input
                    value={newTagDraft}
                    onChange={(e) => setNewTagDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newTagDraft.trim()) {
                        e.preventDefault();
                        const t = newTagDraft.trim().toLowerCase();
                        if (!editable.tags.includes(t)) {
                          updateContact({ tags: [...editable.tags, t] });
                        }
                        setNewTagDraft("");
                      }
                    }}
                    placeholder="Add tag…"
                    className="h-7 w-24 px-2 text-[11px]"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-[11px]"
                    onClick={() => {
                      const t = newTagDraft.trim().toLowerCase();
                      if (!t) return;
                      if (!editable.tags.includes(t)) {
                        updateContact({ tags: [...editable.tags, t] });
                      }
                      setNewTagDraft("");
                    }}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2">
              <KV label="First contact" value={matchedContact ? "3 months ago" : "—"} />
              <KV label="Last contact" value={active.time} />
              <KV label="Conversations" value={conversationCount.toString()} />
              <KV label="Bookings" value={bookingsCount.toString()} />
            </div>

            {/* Qualification */}
            <div>
              <Label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Qualification
              </Label>
              <Select
                value={editable.qualification}
                onValueChange={(v) => updateContact({ qualification: v as Qualification })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lead">Lead</SelectItem>
                  <SelectItem value="Customer">Customer</SelectItem>
                  <SelectItem value="Blocked">Blocked</SelectItem>
                  <SelectItem value="Unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div>
              <Label
                htmlFor="contact-notes"
                className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Notes
              </Label>
              <Textarea
                id="contact-notes"
                rows={4}
                value={editable.notes}
                onChange={(e) => updateContact({ notes: e.target.value })}
                onBlur={() => toast.success("Notes saved")}
                placeholder="Add anything worth remembering about this customer…"
              />
            </div>
          </div>

          <div className="border-t border-border/40 bg-card/30 px-6 py-4">
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setContactFilter(active.customer);
                  setDrawerOpen(false);
                  toast.success(`Filtered inbox by ${active.customer}`);
                }}
              >
                View all conversations
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-destructive/40 bg-destructive/5 text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    updateContact({ qualification: "Blocked" });
                    toast.success(`${active.customer} blocked`, {
                      description: "Future messages will be ignored.",
                    });
                  }}
                >
                  <Ban className="h-3.5 w-3.5" /> Block contact
                </Button>
                <Button size="sm" className="flex-1" variant="ghost" onClick={() => setDrawerOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Ask Ema drawer (Feature 1) */}
      <Sheet open={emaOpen} onOpenChange={setEmaOpen}>
        <SheetContent className="flex w-full flex-col gap-0 border-l-violet/40 bg-background p-0 sm:max-w-[400px]">
          <SheetHeader className="border-b border-violet/30 bg-violet/8 px-6 py-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-violet text-white shadow-violet">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <SheetTitle className="font-display text-base">Ema — about this conversation</SheetTitle>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{active.customer} · {channelMeta[active.channel].label}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {emaConvQuickActions.map((q) => (
                <button
                  key={q}
                  disabled={emaThinking}
                  onClick={async () => {
                    const userMsg: EmaConvChatMsg = { id: `u${Date.now()}`, from: "owner", text: q, time: "now" };
                    setEmaChats((p) => ({ ...p, [activeId]: [...(p[activeId] ?? []), userMsg] }));
                    setEmaThinking(true);
                    const res = await postEmaConversationChat(activeId, q);
                    setEmaChats((p) => ({
                      ...p,
                      [activeId]: [
                        ...(p[activeId] ?? []),
                        { id: res.id, from: "ema", text: res.text, time: "now", draftReply: res.draftReply },
                      ],
                    }));
                    setEmaThinking(false);
                  }}
                  className="rounded-full border border-violet/40 bg-violet/10 px-2.5 py-1 text-[11px] font-medium text-violet transition-colors hover:bg-violet/20 disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </SheetHeader>

          <div ref={emaScrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
            {(emaChats[activeId] ?? []).length === 0 && !emaThinking && (
              <div className="rounded-lg border border-violet/20 bg-violet/5 p-3 text-xs text-muted-foreground">
                Tap a chip above or type below — Ema reads the full thread for context.
              </div>
            )}
            {(emaChats[activeId] ?? []).map((m) => (
              <div key={m.id} className={`flex ${m.from === "owner" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm ${
                  m.from === "owner"
                    ? "rounded-tr-sm bg-bubble-out text-bubble-out-foreground"
                    : "rounded-tl-sm border border-violet/30 bg-violet/10 text-foreground"
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                  {m.draftReply && (
                    <div className="mt-2 rounded-md border border-violet/40 bg-background/60 p-2">
                      <p className="text-xs italic text-muted-foreground">"{m.draftReply}"</p>
                      <Button
                        size="sm"
                        className="mt-2 h-7 bg-gradient-violet text-white hover:opacity-90"
                        onClick={() => {
                          setDraft(m.draftReply!);
                          setComposerMode("reply");
                          setEmaOpen(false);
                          toast.success("Draft inserted into composer");
                        }}
                      >
                        <Pencil className="h-3 w-3" /> Insert into composer
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {emaThinking && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-tl-sm border border-violet/30 bg-violet/10 px-3.5 py-2 text-xs text-muted-foreground">
                  Ema is thinking…
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-violet/30 bg-violet/5 p-3">
            <div className="flex items-end gap-2 rounded-xl border border-violet/40 bg-background p-2">
              <Input
                value={emaInput}
                onChange={(e) => setEmaInput(e.target.value)}
                placeholder="Ask Ema anything about this conversation…"
                className="border-0 focus-visible:ring-0"
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && emaInput.trim() && !emaThinking) {
                    e.preventDefault();
                    const text = emaInput.trim();
                    setEmaInput("");
                    const userMsg: EmaConvChatMsg = { id: `u${Date.now()}`, from: "owner", text, time: "now" };
                    setEmaChats((p) => ({ ...p, [activeId]: [...(p[activeId] ?? []), userMsg] }));
                    setEmaThinking(true);
                    const res = await postEmaConversationChat(activeId, text);
                    setEmaChats((p) => ({
                      ...p,
                      [activeId]: [
                        ...(p[activeId] ?? []),
                        { id: res.id, from: "ema", text: res.text, time: "now", draftReply: res.draftReply },
                      ],
                    }));
                    setEmaThinking(false);
                  }
                }}
              />
              <Button size="sm" disabled={!emaInput.trim() || emaThinking} className="bg-gradient-violet text-white hover:opacity-90">
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Pending approval drawer (Feature 3) */}
      <Sheet open={leftPane === "pending"} onOpenChange={(o) => setLeftPane(o ? "pending" : "conversations")}>
        <SheetContent side="left" className="flex w-full flex-col gap-0 p-0 sm:max-w-[440px]">
          <SheetHeader className="border-b border-border/40 px-6 py-5">
            <SheetTitle className="flex items-center gap-2 font-display text-lg">
              <InboxIcon className="h-4 w-4 text-violet" /> Pending approval
              <Badge variant="outline" className="border-violet/40 bg-violet/15 text-violet">{visiblePending.length}</Badge>
            </SheetTitle>
            <p className="text-xs text-muted-foreground">
              AI drafts from agents with Review mode on. Approve, edit, or reject.
            </p>
            <div className="mt-2">
              <Select value={pendingFilter} onValueChange={setPendingFilter}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All agents</SelectItem>
                  {agents.filter((a) => reviewModeMap[a.id]).map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </SheetHeader>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {visiblePending.length === 0 && (
              <div className="rounded-lg border border-border/40 bg-card/40 p-6 text-center text-sm text-muted-foreground">
                <CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-success" />
                Inbox zero — no drafts waiting.
              </div>
            )}
            {visiblePending.map((d) => {
              const ChIcon = channelMeta[d.channel].icon;
              return (
                <Card key={d.id} className="border-border/40 bg-card/40 p-4">
                  <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5"><ChIcon className="h-3 w-3" /> {d.customer}</span>
                    <span><Clock className="mr-1 inline h-3 w-3" />{d.draftTime}</span>
                  </div>
                  <div className="rounded-lg bg-bubble-in px-3 py-2 text-xs text-bubble-in-foreground">{d.customerMessage}</div>
                  <div className="mt-1.5 flex items-start gap-1.5">
                    <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-violet" />
                    <div className="flex-1 rounded-lg border border-violet/30 bg-violet/8 px-3 py-2 text-xs">
                      <div className="mb-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-violet">
                        <Sparkles className="h-2.5 w-2.5" /> AI draft
                      </div>
                      <p className="leading-relaxed text-foreground">{d.draft}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <Button
                      size="sm"
                      className="h-7 flex-1 bg-success text-success-foreground hover:bg-success/90"
                      onClick={() => {
                        setPendingQueue((p) => p.filter((x) => x.id !== d.id));
                        toast.success(`Sent to ${d.customer}`);
                      }}
                    >
                      <CheckCircle2 className="h-3 w-3" /> Approve & send
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7"
                      onClick={() => {
                        setActiveId(d.conversationId);
                        setDraft(d.draft);
                        setComposerMode("reply");
                        setAiHandled((p) => ({ ...p, [d.conversationId]: false }));
                        setPendingQueue((p) => p.filter((x) => x.id !== d.id));
                        setLeftPane("conversations");
                        toast.success("Draft loaded into composer");
                      }}
                    >
                      <Pencil className="h-3 w-3" /> Edit & send
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                      onClick={() => { setRejectingDraft(d); setRejectNote(""); }}
                    >
                      <X className="h-3 w-3" /> Reject + teach
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>

      {/* Reject + teach Ema dialog */}
      <Dialog open={!!rejectingDraft} onOpenChange={(o) => !o && setRejectingDraft(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-amber-400" /> Teach Ema</DialogTitle>
            <DialogDescription>
              Tell Ema what was wrong with this draft so future replies improve.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            rows={4}
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
            placeholder="E.g., 'Don't quote prices for private dinners — escalate to Marcus instead.'"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectingDraft(null)}>Cancel</Button>
            <Button
              className="bg-amber-500 text-amber-950 hover:bg-amber-400"
              onClick={() => {
                if (rejectingDraft) {
                  setPendingQueue((p) => p.filter((x) => x.id !== rejectingDraft.id));
                }
                setRejectingDraft(null);
                toast.success("Got it — Ema will remember this");
              }}
            >
              <BookOpen className="h-3.5 w-3.5" /> Save & reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border/40 bg-card/40 p-2.5">
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm font-semibold">{value}</div>
    </div>
  );
}

// Feature 4 — Rich message cards (catalog / payment / booking) rendered inside an AI bubble.
function RichCard({ card, fromCustomer }: { card: MessageCard; fromCustomer: boolean }) {
  if (card.kind === "catalog") {
    return (
      <Card className="overflow-hidden rounded-2xl rounded-tr-sm border-border/60 bg-card p-0">
        <div className="flex items-center justify-center bg-gradient-to-br from-primary/30 to-ema/30 py-6 text-4xl">
          {card.emoji}
        </div>
        <div className="p-3">
          <div className="flex items-baseline justify-between gap-2">
            <div className="text-sm font-semibold">{card.name}</div>
            <div className="text-sm font-bold text-primary">EC${card.price}</div>
          </div>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{card.desc}</p>
          {card.tapped && (
            <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-medium text-success">
              <CheckCircle2 className="h-2.5 w-2.5" /> Customer tapped Order
            </div>
          )}
        </div>
      </Card>
    );
  }
  if (card.kind === "payment") {
    const statusMeta = {
      pending: { cls: "border-warning/40 bg-warning/15 text-warning", label: "Pending" },
      paid: { cls: "border-success/40 bg-success/15 text-success", label: "Paid" },
      expired: { cls: "border-border bg-muted text-muted-foreground", label: "Expired" },
    }[card.status];
    return (
      <Card className={`rounded-2xl ${fromCustomer ? "rounded-tl-sm" : "rounded-tr-sm"} border-border/60 bg-card p-3.5`}>
        <div className="flex items-start justify-between gap-2">
          <div className="text-sm font-semibold">💰 Payment request — EC${card.amount}</div>
          <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusMeta.cls}`}>{statusMeta.label}</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{card.description}</p>
        {card.status === "paid" && card.paidAt && (
          <p className="mt-1 text-[10px] text-success">Paid at {card.paidAt}</p>
        )}
        <div className="mt-2 flex items-center justify-end text-[9px] uppercase tracking-wider text-muted-foreground">
          <CreditCard className="mr-1 h-2.5 w-2.5" /> via {card.provider}
        </div>
      </Card>
    );
  }
  // booking
  return (
    <Card className={`rounded-2xl ${fromCustomer ? "rounded-tl-sm" : "rounded-tr-sm"} border-primary/30 bg-card p-3.5`}>
      <div className="text-sm font-semibold">📅 Booking confirmed</div>
      <div className="mt-1.5 text-sm">
        <div className="font-semibold">{card.service}</div>
        <div className="text-xs text-muted-foreground">{card.date} · {card.time} · party of {card.party}</div>
        {card.notes && <div className="mt-1 text-xs text-muted-foreground">Notes: {card.notes}</div>}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Button size="sm" variant="outline" className="h-7" onClick={() => toast.success("Calendar event created")}>
          <CalendarIcon className="h-3 w-3" /> Add to calendar
        </Button>
        <Button size="sm" variant="ghost" className="h-7" onClick={() => toast("Reschedule flow — coming soon")}>
          Reschedule
        </Button>
      </div>
    </Card>
  );
}

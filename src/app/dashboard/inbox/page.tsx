"use client";

import { useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { conversations, contacts, type Channel } from "@/lib/mock-data";

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

type Qualification = "Lead" | "Customer" | "Blocked" | "Unknown";

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

  const filtered = conversations.filter((c) => {
    if (activeTab !== "all" && c.channel !== activeTab) return false;
    if (search && !c.customer.toLowerCase().includes(search.toLowerCase())) return false;
    if (contactFilter && c.customer !== contactFilter) return false;
    return true;
  });

  const active = conversations.find((c) => c.id === activeId) ?? conversations[0];
  const ActiveChannelIcon = channelMeta[active.channel].icon;
  const isAi = aiHandled[active.id];
  const composerDisabled = isAi || !draft.trim();

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
                          <span className="truncate text-sm font-semibold">{c.customer}</span>
                          <span className="shrink-0 text-[10px] text-muted-foreground">{c.time}</span>
                        </div>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">{c.preview}</p>
                        {c.status === "escalated" && (
                          <Badge variant="outline" className="mt-1.5 border-warning/30 bg-warning/10 text-[10px] text-warning">
                            <AlertCircle className="mr-1 h-2.5 w-2.5" /> Needs you
                          </Badge>
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
              {active.messages.map((m) => (
                <div key={m.id} className={`flex ${m.from === "customer" ? "justify-start" : "justify-end"}`}>
                  <div className="max-w-[75%]">
                    {m.from === "ai" && (
                      <div className="mb-1 flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground">
                        <Sparkles className="h-2.5 w-2.5 text-primary" /> AI replied
                      </div>
                    )}
                    <Card
                      className={`px-4 py-2.5 text-sm ${
                        m.from === "customer"
                          ? "rounded-2xl rounded-tl-sm border-transparent bg-bubble-in text-bubble-in-foreground"
                          : "rounded-2xl rounded-tr-sm border-transparent bg-bubble-out text-bubble-out-foreground"
                      }`}
                    >
                      {m.text}
                    </Card>
                    <div className={`mt-1 text-[10px] text-muted-foreground ${m.from === "customer" ? "text-left" : "text-right"}`}>
                      {m.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Composer */}
            <div className="border-t border-border/40 bg-card/30 p-4">
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
                  className="shrink-0 bg-gradient-primary text-primary-foreground"
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

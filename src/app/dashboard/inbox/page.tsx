"use client";

import { useState } from "react";
import { Phone, PhoneCall, Instagram, MessageCircle, Search, Send, Sparkles, AlertCircle, Paperclip, Smile, UserCheck } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { conversations, type Channel } from "@/lib/mock-data";

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

export default function InboxPage() {
  const [activeTab, setActiveTab] = useState<"all" | Channel>("all");
  const [activeId, setActiveId] = useState(conversations[0].id);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  // Track AI-handled flag per conversation (default: true unless escalated)
  const [aiHandled, setAiHandled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(conversations.map((c) => [c.id, c.status === "ai"])),
  );

  const handleTakeOver = (id: string, customer: string) => {
    setAiHandled((prev) => ({ ...prev, [id]: false }));
    toast.success("You're now handling this conversation", {
      description: `AI handoff complete for ${customer}.`,
    });
  };

  const filtered = conversations.filter((c) => {
    if (activeTab !== "all" && c.channel !== activeTab) return false;
    if (search && !c.customer.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const active = conversations.find((c) => c.id === activeId) ?? conversations[0];
  const ActiveChannelIcon = channelMeta[active.channel].icon;

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
          <div className="mt-5 flex flex-wrap gap-2">
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
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${channelMeta[active.channel].color}`}>
                  <ActiveChannelIcon className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold">{active.customer}</div>
                  <div className="text-xs text-muted-foreground">
                    via {channelMeta[active.channel].label}
                    {active.status === "escalated" && <span className="text-warning"> · escalated to you</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {aiHandled[active.id] ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTakeOver(active.id, active.customer)}
                    className="border-warning/40 bg-warning/5 text-warning hover:bg-warning/10"
                  >
                    <UserCheck className="h-3.5 w-3.5" /> Take over
                  </Button>
                ) : (
                  <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                    <UserCheck className="mr-1 h-2.5 w-2.5" /> You're handling
                  </Badge>
                )}
                <Button variant="outline" size="sm">View contact</Button>
              </div>
            </div>

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
              <div className="flex items-end gap-2 rounded-xl border border-border/60 bg-background p-2">
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Reply as yourself, or let AI handle it…"
                  className="border-0 focus-visible:ring-0"
                />
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button size="sm" className="shrink-0 bg-gradient-primary text-primary-foreground" disabled={!draft.trim()}>
                  <Send className="h-3.5 w-3.5" /> Send
                </Button>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-primary" /> AI is monitoring this thread
                </span>
                <span>Press ⌘⏎ to send</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}

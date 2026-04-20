"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, Send, Search, Pin, Plus, FileText, Settings as SettingsIcon } from "lucide-react";
import DashboardLayout from "../layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { emaThreads, emaQuickActions } from "@/lib/mock-data";

type Msg = { id: string; role: "ema" | "owner"; content: string; timestamp: string };

function fakeEmaReply(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("digest")) return "Today: 23 messages, 5 bookings, 0 escalations. Revenue pacing +14% vs avg.";
  if (m.includes("campaign")) return "I'll set that up — which segment? (regulars / lapsed / tourists)";
  if (m.includes("escal")) return "1 active: Kareem L. — private dinner question. Want me to draft a reply?";
  if (m.includes("week")) return "This week: 38 bookings (+8%), revenue EC$8,420 (+22%). Friday is your strongest night.";
  return "Got it! Let me look into that and circle back in a moment.";
}

export default function EmaChatPage() {
  const [activeId, setActiveId] = useState(emaThreads[0].id);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [threadMessages, setThreadMessages] = useState<Record<string, Msg[]>>(
    Object.fromEntries(emaThreads.map((t) => [t.id, t.messages])),
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  const active = emaThreads.find((t) => t.id === activeId) ?? emaThreads[0];
  const messages = threadMessages[active.id] ?? [];

  const filtered = emaThreads.filter(
    (t) => !search || t.title.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, activeId]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    setThreadMessages((prev) => ({
      ...prev,
      [active.id]: [
        ...(prev[active.id] ?? []),
        { id: `o${Date.now()}`, role: "owner", content: text, timestamp: now },
      ],
    }));
    setDraft("");
    setTimeout(() => {
      setThreadMessages((prev) => ({
        ...prev,
        [active.id]: [
          ...(prev[active.id] ?? []),
          { id: `e${Date.now()}`, role: "ema", content: fakeEmaReply(text), timestamp: now },
        ],
      }));
    }, 700);
  };

  return (
    <DashboardLayout currentPath="/dashboard/ema">
      <div className="flex h-screen flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/40 px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-ema shadow-ema">
              <Sparkles className="h-5 w-5 text-ema-foreground" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold leading-tight">Ema</h1>
              <p className="text-xs text-muted-foreground">Your AI chief of staff · always on WhatsApp</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="/dashboard/ema/reports"><FileText className="h-3.5 w-3.5" /> Reports</a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="/dashboard/ema/settings"><SettingsIcon className="h-3.5 w-3.5" /> Configure</a>
            </Button>
          </div>
        </div>

        {/* Split pane */}
        <div className="grid flex-1 grid-cols-1 overflow-hidden md:grid-cols-[300px_1fr]">
          {/* Thread list */}
          <aside className="flex flex-col border-r border-border/40 bg-sidebar/40">
            <div className="space-y-3 border-b border-border/40 p-3">
              <Button className="w-full justify-start gap-2 bg-gradient-ema text-ema-foreground hover:opacity-90" size="sm">
                <Plus className="h-3.5 w-3.5" /> New conversation
              </Button>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search threads…"
                  className="h-9 pl-9 text-sm"
                />
              </div>
            </div>
            <ul className="flex-1 overflow-y-auto p-2">
              {filtered.length === 0 && (
                <li className="px-3 py-8 text-center text-sm text-muted-foreground">No threads found</li>
              )}
              {filtered.map((t) => {
                const isActive = t.id === activeId;
                return (
                  <li key={t.id}>
                    <button
                      onClick={() => setActiveId(t.id)}
                      className={`flex w-full flex-col gap-0.5 rounded-md px-3 py-2.5 text-left transition-colors ${
                        isActive ? "bg-accent/60" : "hover:bg-accent/30"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 truncate text-sm font-medium">
                          {t.pinned && <Pin className="h-3 w-3 shrink-0 text-ema" />}
                          {t.title}
                        </span>
                        <span className="shrink-0 text-[10px] text-muted-foreground">{t.time}</span>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">{t.preview}</p>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Active thread */}
          <section className="flex min-w-0 flex-col bg-background">
            <div className="border-b border-border/40 px-6 py-3">
              <div className="flex items-center gap-2 text-sm">
                {active.pinned && <Pin className="h-3.5 w-3.5 text-ema" />}
                <span className="font-semibold">{active.title}</span>
                <span className="text-xs text-muted-foreground">· {active.time}</span>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "owner" ? "justify-end" : "justify-start"}`}>
                  <div className="flex max-w-[70%] items-start gap-2">
                    {m.role === "ema" && (
                      <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-ema">
                        <Sparkles className="h-3.5 w-3.5 text-ema-foreground" />
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm ${
                        m.role === "owner"
                          ? "rounded-tr-sm bg-bubble-out text-bubble-out-foreground"
                          : "rounded-tl-sm bg-bubble-in text-bubble-in-foreground"
                      }`}
                    >
                      <div>{m.content}</div>
                      <div
                        className={`mt-1 text-[10px] ${
                          m.role === "owner" ? "text-bubble-out-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        {m.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Composer */}
            <div className="border-t border-border/40 bg-card/30 px-4 py-3">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {emaQuickActions.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="rounded-full border border-border bg-accent/40 px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(draft);
                }}
                className="flex items-center gap-2 rounded-xl border border-border/60 bg-background p-1.5"
              >
                <Input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Ask Ema anything…"
                  className="border-0 focus-visible:ring-0"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="shrink-0 bg-gradient-ema text-ema-foreground hover:opacity-90"
                  disabled={!draft.trim()}
                >
                  <Send className="h-3.5 w-3.5" /> Send
                </Button>
              </form>
              <div className="mt-2 text-center text-[11px] text-muted-foreground">
                Ema runs on your WhatsApp Business number — replies here mirror to your phone.
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}

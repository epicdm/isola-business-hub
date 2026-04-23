import { useEffect, useRef, useState } from "react";
import { X, Send, ExternalLink, Plug } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { emaInitialMessages, emaQuickActions } from "@/lib/mock-data";
import { useOdooConnection, requiresOdoo } from "@/hooks/use-odoo-connection";
import { EmaOrb } from "@/components/brand/IsolaBrand";

type Msg = {
  id: string;
  role: "ema" | "owner";
  content: string;
  timestamp: string;
  cta?: { label: string; to: string };
};

const STORAGE_KEY = "isola.ema.widget.open";

function fakeEmaReply(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("digest")) return "Today: 23 messages, 5 bookings, 0 escalations. Revenue pacing +14% vs avg.";
  if (m.includes("campaign")) return "I'll set that up — which segment? (regulars / lapsed / tourists)";
  if (m.includes("escal")) return "1 active: Kareem L. — private dinner question. Want me to draft a reply?";
  return "Got it! Let me look into that and circle back in a moment.";
}

export default function EmaChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(emaInitialMessages as Msg[]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { connected } = useOdooConnection();
  const odooReady = connected === true;

  useEffect(() => {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "1") setOpen(true);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const ctx = (e as CustomEvent<{ cardTitle: string; summary: string; prompt: string }>).detail;
      if (!ctx) return;
      setOpen(true);
      const now = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      setMessages((prev) => [
        ...prev,
        { id: `ctx${Date.now()}`, role: "owner", content: ctx.prompt, timestamp: now },
        {
          id: `er${Date.now() + 1}`,
          role: "ema",
          content: `Re: ${ctx.cardTitle} — ${ctx.summary} What would you like me to do next?`,
          timestamp: now,
        },
      ]);
    };
    window.addEventListener("isola:ask-ema", handler as EventListener);
    return () => window.removeEventListener("isola:ask-ema", handler as EventListener);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, open ? "1" : "0");
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    setMessages((prev) => [
      ...prev,
      { id: `o${Date.now()}`, role: "owner", content: text, timestamp: now },
    ]);
    setInput("");
    setTimeout(() => {
      const needsOdoo = !odooReady && requiresOdoo(text);
      if (needsOdoo) {
        setMessages((prev) => [
          ...prev,
          {
            id: `e${Date.now()}`,
            role: "ema",
            content:
              "I'd love to help with that — I just need Odoo connected so I can look at your actual invoices, inventory, or expenses. Want me to walk you to setup?",
            timestamp: now,
            cta: { label: "Connect Odoo →", to: "/onboarding?step=6&resume=1" },
          },
          {
            id: `e2${Date.now()}`,
            role: "ema",
            content:
              "Or if this is something I can answer without Odoo, rephrase it like \"show me today's conversations\" and I'll do that.",
            timestamp: now,
          },
        ]);
        return;
      }
      setMessages((prev) => [
        ...prev,
        { id: `e${Date.now()}`, role: "ema", content: fakeEmaReply(text), timestamp: now },
      ]);
    }, 700);
  };

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="group fixed bottom-6 right-6 z-50 flex h-14 items-center gap-2 overflow-hidden rounded-full bg-gradient-ema pl-4 pr-5 shadow-ema transition-all hover:scale-105 sm:h-12"
            aria-label="Ask Ema"
          >
            <Sparkles className="h-5 w-5 shrink-0 text-ema-foreground" />
            <span className="hidden text-sm font-semibold text-ema-foreground sm:inline">
              Ask Ema
            </span>
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              1
            </span>
            <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-ema/30" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[400px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card"
          >
            <header className="flex items-center justify-between border-b border-border bg-gradient-ema px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-background/20 backdrop-blur">
                  <Sparkles className="h-4 w-4 text-ema-foreground" />
                  {connected !== null && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-ema ${
                              odooReady ? "bg-success" : "bg-warning"
                            }`}
                            aria-label={odooReady ? "Odoo connected" : "Odoo not connected"}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="text-xs">
                          {odooReady
                            ? "Odoo connected — full insights available"
                            : "Odoo not connected — some answers are limited"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-ema-foreground">Ema</div>
                  <div className="text-[11px] text-ema-foreground/70">your AI chief of staff</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-md p-1 text-ema-foreground/80 hover:bg-background/10">
                <X className="h-4 w-4" />
              </button>
            </header>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "owner" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm ${
                      m.role === "owner"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    }`}
                  >
                    <div>{m.content}</div>
                    {m.cta && (
                      <Link
                        to={m.cta.to as "/onboarding"}
                        search={{ step: 6, resume: 1, returnTo: typeof window !== "undefined" ? window.location.pathname : "/dashboard" }}
                        className="mt-2 inline-flex items-center gap-1 rounded-md bg-ema px-2.5 py-1 text-[11px] font-semibold text-ema-foreground hover:opacity-90"
                      >
                        <Plug className="h-3 w-3" /> {m.cta.label}
                      </Link>
                    )}
                    <div className={`mt-1 text-[10px] ${m.role === "owner" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {m.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border px-3 py-2">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {emaQuickActions.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="rounded-full border border-border bg-accent/40 px-3 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex items-center gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Ema anything…"
                  className="h-9"
                />
                <Button type="submit" size="icon" className="h-9 w-9 shrink-0 bg-gradient-ema text-ema-foreground hover:opacity-90">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <a href="/dashboard/ema" className="mt-2 flex items-center justify-center gap-1 text-[11px] text-muted-foreground hover:text-foreground">
                Open full view <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

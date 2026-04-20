"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, X, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

type Industry = "restaurant" | "hotel" | "clinic" | "default";

type Msg = {
  id: string;
  role: "customer" | "ema";
  content: string;
  timestamp: string;
};

const SCRIPTS: Record<Industry, { customer: string; messages: Msg[]; tag: string }> = {
  restaurant: {
    tag: "Reservation",
    customer: "Maya R. · WhatsApp",
    messages: [
      { id: "1", role: "customer", content: "Hi! Do you have a table for 4 tonight around 7:30?", timestamp: "7:14 PM" },
      { id: "2", role: "ema", content: "Hey Maya! 👋 Yes — I have a table for 4 at 7:30 PM tonight. Want me to book it?", timestamp: "7:14 PM" },
      { id: "3", role: "customer", content: "Yes please, name's Maya.", timestamp: "7:15 PM" },
      { id: "4", role: "ema", content: "Booked ✓ Table for 4 · tonight 7:30 PM under Maya. See you soon! 🍽️", timestamp: "7:15 PM" },
    ],
  },
  hotel: {
    tag: "Booking inquiry",
    customer: "James T. · WhatsApp",
    messages: [
      { id: "1", role: "customer", content: "Hi, do you have a room for 2 from Friday to Sunday?", timestamp: "3:02 PM" },
      { id: "2", role: "ema", content: "Hi James! 👋 Yes, I have a Deluxe Double available Fri–Sun at $185/night. Want me to hold it?", timestamp: "3:02 PM" },
      { id: "3", role: "customer", content: "Perfect, please hold it.", timestamp: "3:03 PM" },
      { id: "4", role: "ema", content: "Held ✓ Deluxe Double · Fri–Sun under James T. I'll send the confirmation link in a sec. 🏝️", timestamp: "3:03 PM" },
    ],
  },
  clinic: {
    tag: "Appointment",
    customer: "Sarah L. · WhatsApp",
    messages: [
      { id: "1", role: "customer", content: "Hi, can I book a check-up this week?", timestamp: "10:21 AM" },
      { id: "2", role: "ema", content: "Hi Sarah! 👋 I have Thursday at 2:30 PM or Friday at 11:00 AM. Which works?", timestamp: "10:21 AM" },
      { id: "3", role: "customer", content: "Thursday 2:30 works.", timestamp: "10:22 AM" },
      { id: "4", role: "ema", content: "Booked ✓ Check-up · Thursday 2:30 PM with Dr. Patel. You'll get a reminder the day before. 🩺", timestamp: "10:22 AM" },
    ],
  },
  default: {
    tag: "New inquiry",
    customer: "Alex M. · WhatsApp",
    messages: [
      { id: "1", role: "customer", content: "Hi! Are you open today?", timestamp: "11:08 AM" },
      { id: "2", role: "ema", content: "Hey Alex! 👋 Yes, we're open until 6 PM today. Anything I can help with?", timestamp: "11:08 AM" },
      { id: "3", role: "customer", content: "Just wanted to know your prices.", timestamp: "11:09 AM" },
      { id: "4", role: "ema", content: "I just sent you our service list — let me know if anything jumps out! 💬", timestamp: "11:09 AM" },
    ],
  },
};

function pickIndustry(raw: string | null | undefined): Industry {
  if (!raw) return "default";
  const v = raw.toLowerCase();
  if (v.includes("restaurant") || v.includes("food") || v.includes("cafe") || v.includes("bar")) return "restaurant";
  if (v.includes("hotel") || v.includes("villa") || v.includes("resort") || v.includes("lodge")) return "hotel";
  if (v.includes("clinic") || v.includes("health") || v.includes("dental") || v.includes("medical")) return "clinic";
  return "default";
}

interface Props {
  open: boolean;
  industry: Industry;
  onClose: () => void;
}

export default function FirstWinOverlay({ open, industry, onClose }: Props) {
  const script = SCRIPTS[industry] ?? SCRIPTS.default;
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (!open) return;
    setVisibleCount(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    script.messages.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleCount(i + 1), 600 + i * 850));
    });
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [open, industry, script.messages]);

  const particles = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        emoji: ["🎉", "✨", "🎊", "💜", "⭐"][i % 5],
        left: Math.random() * 100,
        delay: Math.random() * 0.4,
        duration: 1.8 + Math.random() * 1.0,
        rotate: Math.random() * 540 - 270,
      })),
    [open],
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-background/85 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="first-win-title"
        >
          {/* Confetti */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {particles.map((p) => (
              <span
                key={p.id}
                className="absolute -top-6 text-2xl"
                style={{
                  left: `${p.left}%`,
                  animation: `firstwin-fall ${p.duration}s ease-out ${p.delay}s forwards`,
                  transform: `rotate(${p.rotate}deg)`,
                }}
              >
                {p.emoji}
              </span>
            ))}
            <style>{`
              @keyframes firstwin-fall {
                0%   { transform: translateY(0) rotate(0); opacity: 1; }
                100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
              }
            `}</style>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.55, bounce: 0.25 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-ema/30 bg-gradient-to-br from-card via-card to-ema/5 shadow-ema"
          >
            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 z-10 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div className="flex flex-col items-center gap-3 px-6 pb-2 pt-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-ema shadow-ema">
                <Sparkles className="h-7 w-7 text-ema-foreground" />
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-ema/30 bg-ema/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-ema">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ema" />
                {script.tag}
              </div>
              <h2 id="first-win-title" className="font-display text-2xl font-bold leading-tight md:text-3xl">
                You just handled your first customer
              </h2>
              <p className="max-w-sm text-sm text-muted-foreground">
                While you were setting up, Ema fielded a real-style inquiry — here's how it went.
              </p>
            </div>

            {/* Mock chat replay */}
            <div className="mx-6 mt-4 rounded-2xl border border-border/50 bg-background/60 p-4">
              <div className="mb-3 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="font-medium text-foreground">{script.customer}</span>
                <span>just now</span>
              </div>
              <div className="space-y-2.5 min-h-[180px]">
                {script.messages.slice(0, visibleCount).map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${m.role === "ema" ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm ${
                        m.role === "ema"
                          ? "rounded-tl-sm bg-bubble-in text-bubble-in-foreground"
                          : "rounded-tr-sm bg-bubble-out text-bubble-out-foreground"
                      }`}
                    >
                      <div>{m.content}</div>
                      <div
                        className={`mt-1 text-[10px] ${
                          m.role === "ema" ? "text-muted-foreground" : "text-bubble-out-foreground/70"
                        }`}
                      >
                        {m.timestamp}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {visibleCount < script.messages.length && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-bubble-in px-3 py-2.5">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="px-6 pb-6 pt-5">
              <Button
                asChild
                className="w-full bg-gradient-ema text-ema-foreground hover:opacity-90"
                size="lg"
                onClick={onClose}
              >
                <Link to="/dashboard/inbox">
                  <Inbox className="h-4 w-4" />
                  See your inbox
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 block w-full text-center text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { pickIndustry };

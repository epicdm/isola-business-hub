"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Sparkles,
} from "lucide-react";
import type { SinceLastVisit as SinceLastVisitType } from "@/lib/home-data";
import { cn } from "@/lib/utils";

type Props = {
  data: SinceLastVisitType;
};

/**
 * Compact temporal strip — answers "what changed while I was away?"
 *
 * Sits directly under the executive header so the very first thing the
 * owner perceives after their identity-anchored greeting is *motion* —
 * the system was working without them. Each chip is one verifiable change,
 * colour-coded by emotional weight (positive / negative / neutral / info).
 *
 * Designed to read in <2s. Never more than 5 chips.
 */
export default function SinceLastVisit({ data }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Since you last checked in"
      className="relative overflow-hidden rounded-2xl border border-border/40 bg-card/40 px-5 py-3.5 shadow-card"
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
        <div className="flex items-center gap-2 shrink-0">
          <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-full bg-aqua/10 text-aqua">
            <Clock className="h-3 w-3" />
          </span>
          <div className="leading-tight">
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {data.firstVisit ? "Welcome back" : "While you were away"}
            </div>
            <div className="text-xs font-semibold text-foreground">
              {data.label}
            </div>
          </div>
        </div>

        <div className="h-6 w-px bg-border/40 hidden sm:block" />

        <ul className="flex flex-1 flex-wrap items-center gap-1.5">
          {data.changes.map((c, i) => (
            <li key={i}>
              <Chip kind={c.kind} text={c.text} />
            </li>
          ))}
        </ul>
      </div>
    </motion.section>
  );
}

function Chip({
  kind,
  text,
}: {
  kind: "positive" | "neutral" | "negative" | "info";
  text: string;
}) {
  const tone =
    kind === "positive"
      ? "border-success/30 bg-success/10 text-success"
      : kind === "negative"
        ? "border-ema/40 bg-ema/10 text-ema"
        : kind === "info"
          ? "border-violet/30 bg-violet/10 text-violet"
          : "border-border/40 bg-background/50 text-muted-foreground";

  const Icon =
    kind === "positive"
      ? TrendingUp
      : kind === "negative"
        ? TrendingDown
        : kind === "info"
          ? Sparkles
          : Activity;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
        tone,
      )}
    >
      <Icon className="h-3 w-3" />
      {text}
    </span>
  );
}

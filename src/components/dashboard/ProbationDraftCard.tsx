"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, SkipForward, Pencil, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import type { DraftCard } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Props = {
  draft: DraftCard;
  agentName?: string;
  onApprove: (id: string) => void;
  onCorrect: (id: string, newReply: string) => void;
  onSkip: (id: string) => void;
};

export default function ProbationDraftCard({ draft, agentName, onApprove, onCorrect, onSkip }: Props) {
  const [editing, setEditing] = useState(false);
  const [reply, setReply] = useState(draft.draftReply);
  const confidencePct = Math.round(draft.confidence * 100);
  const lowConfidence = draft.confidence < 0.7;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="border-border/40 bg-card/60 p-5">
        {/* Customer */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{draft.customerName}</span>
              {agentName && (
                <Badge
                  variant="outline"
                  className="border-amber-400/40 bg-amber-400/10 text-[10px] uppercase tracking-wider text-amber-500"
                >
                  🟡 {agentName}
                </Badge>
              )}
            </div>
            <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
              <Phone className="h-3 w-3" /> {draft.customerPhone} · {draft.receivedAt}
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "shrink-0 text-[10px] uppercase tracking-wider",
              lowConfidence
                ? "border-warning/40 bg-warning/10 text-warning"
                : "border-success/30 bg-success/10 text-success",
            )}
          >
            {confidencePct}% conf
          </Badge>
        </div>

        {/* Inbound message */}
        <div className="mb-3 rounded-lg bg-muted/40 px-3.5 py-2.5 text-sm">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Customer
          </div>
          <p className="mt-0.5">{draft.customerMessage}</p>
        </div>

        {/* Draft reply */}
        <div className="mb-4 rounded-lg border border-amber-400/30 bg-amber-400/5 px-3.5 py-2.5 text-sm">
          <div className="mb-1 flex items-center justify-between">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-500">
              Draft reply — pending approval
            </div>
            {!editing && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
              >
                <Pencil className="h-3 w-3" /> Edit
              </button>
            )}
          </div>
          {editing ? (
            <Textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={3}
              className="mt-1 bg-background/60"
            />
          ) : (
            <p>{draft.draftReply}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {editing ? (
            <>
              <Button
                size="sm"
                onClick={() => {
                  onCorrect(draft.id, reply);
                  setEditing(false);
                }}
                className="bg-primary text-primary-foreground hover:opacity-90"
              >
                <Check className="h-3.5 w-3.5" /> Send corrected reply
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setReply(draft.draftReply);
                  setEditing(false);
                }}
              >
                <X className="h-3.5 w-3.5" /> Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                onClick={() => onApprove(draft.id)}
                className="bg-success text-success-foreground hover:opacity-90"
              >
                <Check className="h-3.5 w-3.5" /> Approve & send
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
                <Pencil className="h-3.5 w-3.5" /> Correct
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onSkip(draft.id)}>
                <SkipForward className="h-3.5 w-3.5" /> Skip
              </Button>
            </>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

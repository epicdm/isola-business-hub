"use client";

import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence } from "framer-motion";
import { ShieldCheck, Inbox } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProbationDraftCard from "@/components/dashboard/ProbationDraftCard";
import { agents, type DraftCard } from "@/lib/mock-data";

type DraftWithAgent = DraftCard & { agentId: string; agentName: string };

export default function DraftsPage() {
  const initial: DraftWithAgent[] = useMemo(
    () =>
      agents
        .filter((a) => a.status === "on_probation")
        .flatMap((a) =>
          (a.probationDrafts ?? []).map((d) => ({ ...d, agentId: a.id, agentName: a.name })),
        ),
    [],
  );
  const [drafts, setDrafts] = useState<DraftWithAgent[]>(initial);

  const remove = (id: string) => setDrafts((prev) => prev.filter((d) => d.id !== id));

  return (
    <DashboardLayout currentPath="/dashboard/drafts">
      <div className="mx-auto max-w-4xl space-y-6 p-6 lg:p-8">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-500">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground">Probation queue</p>
            <h1 className="font-display text-2xl font-bold">Drafts on probation</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Replies from agents in their learning period. Approve to teach. Skip to dismiss. Each correction trains the next reply.
            </p>
          </div>
          <Badge variant="outline" className="border-amber-400/40 bg-amber-400/10 text-amber-500">
            {drafts.length} pending
          </Badge>
        </div>

        {drafts.length === 0 ? (
          <Card className="flex flex-col items-center gap-3 border-success/30 bg-success/5 p-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/15 text-success">
              <Inbox className="h-6 w-6" />
            </div>
            <h2 className="font-display text-xl font-semibold">All clear 🎉</h2>
            <p className="max-w-md text-sm text-muted-foreground">
              No drafts pending across your team. Your agents are learning fast.
            </p>
            <Link
              to="/dashboard/team"
              className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              ← Back to team
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {drafts.map((d) => (
                <ProbationDraftCard
                  key={d.id}
                  draft={d}
                  agentName={d.agentName}
                  onApprove={(id) => {
                    remove(id);
                    toast.success("Approved & sent", { description: `Logged for ${d.agentName}.` });
                  }}
                  onCorrect={(id) => {
                    remove(id);
                    toast.success("Correction sent", { description: `Trained ${d.agentName}.` });
                  }}
                  onSkip={(id) => {
                    remove(id);
                    toast("Skipped");
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

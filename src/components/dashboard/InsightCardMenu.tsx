"use client";

import { type ReactNode, useState } from "react";
import { MoreHorizontal, Sparkles, Bell, Users2 } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type InsightAction = {
  label: string;
  /** If provided, opens a confirmation dialog with this body before firing. */
  confirm?: { title: string; body: ReactNode; cta: string };
  /** Toast text shown after the action fires. */
  toast: string;
};

export type EmaContext = {
  cardTitle: string;
  summary: string;
  prompt: string;
};

export function dispatchAskEma(ctx: EmaContext) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("isola:ask-ema", { detail: ctx }));
}

const SNOOZE_OPTIONS = [
  { label: "Tomorrow 9:00 AM", value: "tomorrow" },
  { label: "Next Monday", value: "monday" },
  { label: "7 days", value: "7d" },
  { label: "Custom…", value: "custom" },
];

type Props = {
  cardTitle: string;
  actions: InsightAction[];
  emaContext: EmaContext;
  /** Wrap children with right-click context menu mirroring the dropdown. */
  children: ReactNode;
};

export default function InsightCardMenu({ cardTitle, actions, emaContext, children }: Props) {
  const [pending, setPending] = useState<InsightAction | null>(null);

  const fire = (a: InsightAction) => {
    if (a.confirm) {
      setPending(a);
    } else {
      toast.success(a.toast);
    }
  };

  const askEma = () => {
    dispatchAskEma(emaContext);
    toast("Ema is on it", { description: emaContext.prompt });
  };

  const snooze = (label: string) => {
    toast.success(`✓ "${cardTitle}" snoozed until ${label}`);
  };

  const shareDisabled = () => toast("Coming in Teams", { description: "Share-with-team launches with the Teams workspace." });

  // Shared menu items rendered into both Dropdown and ContextMenu
  const cardItems = actions.map((a) => (
    <DropdownMenuItem key={a.label} onSelect={() => fire(a)}>
      {a.label}
    </DropdownMenuItem>
  ));
  const ctxItems = actions.map((a) => (
    <ContextMenuItem key={a.label} onSelect={() => fire(a)}>
      {a.label}
    </ContextMenuItem>
  ));

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="relative h-full">
            {children}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label={`${cardTitle} actions`}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-md border border-border/40 bg-background/40 text-muted-foreground backdrop-blur transition hover:bg-accent hover:text-foreground"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground/80">
                  {cardTitle}
                </DropdownMenuLabel>
                {cardItems}
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={askEma}>
                  <Sparkles className="h-4 w-4 text-ema" /> Ask Ema about this
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Bell className="h-4 w-4" /> Snooze this insight until…
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {SNOOZE_OPTIONS.map((s) => (
                      <DropdownMenuItem key={s.value} onSelect={() => snooze(s.label)}>
                        {s.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem disabled onSelect={shareDisabled}>
                  <Users2 className="h-4 w-4" /> Share with team · Coming in Teams
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-60">
          <ContextMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground/80">
            {cardTitle}
          </ContextMenuLabel>
          {ctxItems}
          <ContextMenuSeparator />
          <ContextMenuItem onSelect={askEma}>
            <Sparkles className="h-4 w-4 text-ema" /> Ask Ema about this
          </ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <Bell className="h-4 w-4" /> Snooze this insight until…
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              {SNOOZE_OPTIONS.map((s) => (
                <ContextMenuItem key={s.value} onSelect={() => snooze(s.label)}>
                  {s.label}
                </ContextMenuItem>
              ))}
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuItem disabled onSelect={shareDisabled}>
            <Users2 className="h-4 w-4" /> Share with team · Coming in Teams
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <Dialog open={!!pending} onOpenChange={(o) => !o && setPending(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{pending?.confirm?.title}</DialogTitle>
            <DialogDescription className="pt-1 text-sm leading-relaxed">
              {pending?.confirm?.body}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPending(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const a = pending!;
                setPending(null);
                toast.success(a.toast);
              }}
            >
              {pending?.confirm?.cta}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

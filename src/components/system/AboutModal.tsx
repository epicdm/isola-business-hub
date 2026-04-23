"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { IsolaWordmark } from "@/components/brand/IsolaBrand";

export default function AboutModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm border-border/50 bg-card/95 text-center">
        <div className="mx-auto flex flex-col items-center gap-4 py-2">
          <IsolaWordmark size={48} showSub />
          <div>
            <DialogTitle className="font-display text-base">About Isola</DialogTitle>
            <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              v0.1.0 · Preview
            </div>
          </div>
          <DialogDescription className="max-w-[24ch] text-sm leading-snug text-foreground/80">
            Your AI business team on WhatsApp.
            <br />
            Built by EPIC Communications.
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  );
}

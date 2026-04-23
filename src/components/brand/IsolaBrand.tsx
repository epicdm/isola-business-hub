"use client";

import { Sparkles } from "lucide-react";

/**
 * IsolaMark — the signature wordmark/logomark.
 * A layered "I" inside a soft aurora-tinted square. Used wherever the
 * Sparkles icon was used as the brand glyph. More distinctive, more
 * memorable, and pairs with the wordmark.
 */
export function IsolaMark({ size = 32, className = "" }: { size?: number; className?: string }) {
  const s = size;
  return (
    <span
      aria-hidden
      className={`relative inline-flex shrink-0 items-center justify-center rounded-[10px] bg-gradient-aurora shadow-glow ${className}`}
      style={{ width: s, height: s }}
    >
      <span
        className="absolute inset-[2px] rounded-[8px] bg-sidebar/95"
        style={{ backdropFilter: "blur(2px)" }}
      />
      <svg
        viewBox="0 0 24 24"
        width={s * 0.55}
        height={s * 0.55}
        className="relative text-foreground"
      >
        <defs>
          <linearGradient id="isolaGrad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.86 0.18 150)" />
            <stop offset="55%" stopColor="oklch(0.78 0.13 195)" />
            <stop offset="100%" stopColor="oklch(0.72 0.22 295)" />
          </linearGradient>
        </defs>
        {/* Stylised "I" — two caps + a slim stroke */}
        <rect x="6" y="4" width="12" height="2.4" rx="1.2" fill="url(#isolaGrad)" />
        <rect x="10.6" y="6" width="2.8" height="12" rx="1.4" fill="url(#isolaGrad)" />
        <rect x="6" y="17.6" width="12" height="2.4" rx="1.2" fill="url(#isolaGrad)" />
      </svg>
    </span>
  );
}

/**
 * IsolaWordmark — mark + wordmark combo, the canonical brand lockup.
 */
export function IsolaWordmark({
  size = 32,
  className = "",
  showSub = false,
}: {
  size?: number;
  className?: string;
  showSub?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <IsolaMark size={size} />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.15em] font-bold tracking-tight">Isola</span>
        {showSub && (
          <span className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Business OS
          </span>
        )}
      </span>
    </span>
  );
}

/**
 * EmaOrb — Ema's signature visual identity.
 * A pulsing orb with an aurora ring and a soft inner glow. Use anywhere
 * we need to represent Ema (sidebar, FAB, hero, dashboards).
 */
export function EmaOrb({
  size = 48,
  pulse = true,
  className = "",
}: {
  size?: number;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      {/* aurora ring */}
      <span
        className="absolute inset-0 rounded-full aurora-ring"
        style={{ filter: `blur(${size / 14}px)`, opacity: 0.65 }}
      />
      {pulse && (
        <span className="absolute inset-0 animate-ping rounded-full bg-ema/20" />
      )}
      {/* core */}
      <span
        className="relative flex items-center justify-center rounded-full bg-gradient-ema shadow-ema"
        style={{ width: size * 0.78, height: size * 0.78 }}
      >
        <Sparkles className="text-ema-foreground" style={{ width: size * 0.36, height: size * 0.36 }} />
      </span>
    </span>
  );
}

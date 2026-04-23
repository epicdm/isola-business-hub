# Isola Business Hub

Isola is the AI operating system for Caribbean small businesses — WhatsApp, voice, bookings, payments, and an AI chief of staff named Ema, under one roof.

## What it is

Isola gives Caribbean SMBs a single command center where customer conversations, bookings, follow-ups, and back-office work live together. Ema, the built-in AI chief of staff, handles routine messages 24/7, drafts replies that need a human eye, surfaces what needs attention now, and keeps the business moving while the owner is busy serving customers in the real world. Built and operated by EPIC Communications.

## Stack

- [TanStack Start](https://tanstack.com/start) (full-stack React framework)
- React 19
- Tailwind CSS 4
- shadcn/ui (Radix primitives)
- Framer Motion
- TanStack Router (file-based routing)
- Cloudflare Workers / Wrangler (edge runtime + deploy)
- Vite 7, TypeScript, Vitest

## Local development

```bash
bun install
bun dev
```

The dev server runs on [http://localhost:5173](http://localhost:5173) by default.

Other scripts:

```bash
bun run build      # production build
bun run preview    # preview the built app
bun run lint       # eslint
bun test           # vitest
```

## Assets

- `public/og-image.png` — 1200×630 social share image. **Slot to be filled**: replace the placeholder with the final branded asset (dark card, Isola wordmark centered, aurora gradient glow). Referenced from `og:image` and `twitter:image` in `src/routes/__root.tsx`.

---

Built by [EPIC Communications](https://epiccommunications.com).

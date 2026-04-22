

# Agent-Centric Dashboard Pivot

Reframe the dashboard so the **agent is the atom**. Solo tenants see their one agent's workspace as "home"; multi-agent tenants see a team overview. Ema moves out of the sidebar into a floating button.

## 1. Mock data extensions (`src/lib/mock-data.ts`)

Extend `AgentStatus` to `"on_shift" | "paused" | "on_probation"` and add to each agent in the `agents[]` array:

- `status` → Receptionist becomes `"on_probation"`, Sales `"on_shift"`, Booking `"paused"`
- `heroKPI: { label, value, trend: number[7] }` — role-specific (receptionist = Auto-resolve rate 89%, sales = Pipeline value EC$4,820, booking = Bookings confirmed 47)
- `budget: { spent: number, cap: number, currency: "EC$" }`
- `probationDrafts: DraftCard[]` — 4 mock drafts on the Receptionist (customer name/phone, inbound message, AI draft reply, confidence 0–1)
- `knowledgeGaps: { id, question, askedCount, lastAsked }[]` — 3 unresolved questions per agent
- `standupSummary: string` — 1–2 sentence end-of-day summary per agent
- `tenantKnowledge` and per-agent `agentKnowledge` arrays (title + snippet)
- A status→pill mapping helper (`statusMeta`) used everywhere

Map legacy `"active" | "error"` to new statuses where existing pages still consume them, so `/dashboard/agents` and `/dashboard/agents/$id` keep compiling.

## 2. New routes

**`src/routes/dashboard.agent.$agentId.tsx`** → loads `src/app/dashboard/agent/[agentId]/page.tsx`

Hero header + 5-tab workspace:
- **Hero**: avatar, name, role label, status pill (with 🟡 On Probation variant), budget bar (`spent / cap`), hero KPI big number + 7-pt sparkline (reuse `Sparkline.tsx`), Pause/Resume switch
- **📥 Inbox**: probation banner (if on probation) → "🟡 {name} is on a learning period. {n} drafts need your approval." with `Review` anchor scrolling to `ProbationDrafts` list; below: live conversation list (filtered from existing inbox mock by agentId, fall back to all). For Receptionist, escalations pinned at top.
- **🎮 Playground**: chat sandbox (mocked echo + canned replies), tone slider preview, "Test a response" textarea + Send, collapsible "Reasoning trace" panel showing fake step-by-step (intent → tool used → confidence)
- **📚 Knowledge**: two stacked sections (`Tenant knowledge` read-only with lock icon, `Agent-specific knowledge` editable rows with add/delete) + "Knowledge gaps" list at the bottom with one-click "Add as FAQ" button (toast on add)
- **📊 Activity**: Pulse strip (today's counters: messages, bookings, escalations, auto-resolved), Hero KPI card (role-specific big number), Task feed (reuses `getAgentActivity`), Outcomes pie (booked/answered/escalated counts), 7-day sparkline
- **⚙ Settings**: identity (name, tone slider, welcome), channels, working hours, escalation rules, **Probation controls** (End probation button, confidence floor slider), scheduled routines list

**`src/routes/dashboard.team.tsx`** → loads `src/app/dashboard/team/page.tsx`

- "Today's standup" block at top — one row per agent, summary string + status dot
- Card grid (one per agent): role badge, status pill, hero KPI, messages today; framer-motion stagger animation; hover reveals "Open workspace →" linking to `/dashboard/agent/$agentId`
- Trailing dashed "+ Hire another agent" CTA card linking to `/dashboard/agents/new`

**`src/routes/dashboard.drafts.tsx`** → "Drafts on probation" cross-agent queue, listing every `probationDrafts[]` from any agent in `on_probation` state. Each card supports approve / correct (inline editor) / skip (the existing `ProbationDraftCard` swipe interactions if present, else click buttons).

## 3. Solo / Team router

Update `src/app/dashboard/page.tsx` (the `/dashboard` index) to:
1. Read `localStorage.getItem("isola.mockMode")` — default `"solo"`, persist on first visit
2. If `"solo"` → `navigate({ to: "/dashboard/agent/$agentId", params: { agentId: agents[0].id }, replace: true })`
3. If `"team"` → `navigate({ to: "/dashboard/team", replace: true })`
4. Render a tiny loading shell while redirecting

Add a small dev-only toggle in `DashboardHeader.tsx` (Solo ↔ Team) that flips the localStorage key and reloads, so we can demo both modes.

## 4. Sidebar rewrite (`src/components/dashboard/DashboardSidebar.tsx`)

Replace existing `sections` array. New groups:

**Your Agent** (solo) / **Your Team** (team mode) — label switches based on `isola.mockMode`
- Home → `/dashboard/agent/{firstAgentId}` (solo) or `/dashboard/team` (team)
- Drafts on probation → `/dashboard/drafts` (with red dot badge if pending count > 0)

**Workspace**
- Catalog, Bookings, Contacts, Hours, Knowledge (tenant-wide)

**Account**
- Channels, Integrations, Billing, Settings

Remove the entire **Ema** group and the `/dashboard/ema*` items from the sidebar. (Keep the route files — they still work via direct nav and the floating widget's "Open full view" link.)

## 5. Header copy

`DashboardHeader.tsx`: when on `/dashboard/agent/$agentId` in solo mode, show page title "**{agent.name} — your Isola**" instead of "Dashboard". When on `/dashboard/team`, show "**Your team**". Pass current agent name via context or read directly from path + mock data.

## 6. Ema as floating button

`EmaChatWidget.tsx` already renders a floating bottom-right Sparkles button. Add a small text label "**Ask Ema**" beside the icon when collapsed (pill shape on hover, icon-only on mobile). No behavioral change — drawer + Odoo dot stay as-is. Confirmed: this widget is already mounted in `DashboardLayout`, so removing Ema sidebar entries doesn't break access.

## 7. Copy rules enforcement

Global pass on the new files only:
- "Team" not "Agents" (in sidebar group label, page titles)
- "Hire another agent" not "Add agent" (CTA card, team view)
- "On Shift" / "Paused" / "On Probation" status labels (never "Active/Inactive")
- "Your Isola" in header on agent workspace
- Probation framed positively: "learning period", "still calibrating", "approve to teach"

## What stays untouched

Marketing pages, onboarding, FirstWinOverlay, OdooConnectionForm, Insights/Bookings/Inbox/Contacts/Catalog/etc page bodies, design tokens, shadcn primitives, `/dashboard/agents` and `/dashboard/agents/$id` (legacy detail page — kept as the deep config view, linked from agent workspace ⚙ Settings tab "Open full config" link).

## Files

**New** (5): `src/routes/dashboard.agent.$agentId.tsx`, `src/routes/dashboard.team.tsx`, `src/routes/dashboard.drafts.tsx`, `src/app/dashboard/agent/[agentId]/page.tsx`, `src/app/dashboard/team/page.tsx`, `src/app/dashboard/drafts/page.tsx`, plus `src/components/dashboard/ProbationDraftCard.tsx`, `src/components/dashboard/AgentHeroHeader.tsx`

**Edited** (4): `src/lib/mock-data.ts` (types + agent fields + helpers), `src/components/dashboard/DashboardSidebar.tsx` (new sections, mode-aware), `src/components/dashboard/DashboardHeader.tsx` (dynamic title + mock-mode toggle), `src/app/dashboard/page.tsx` (solo/team redirector), `src/components/dashboard/EmaChatWidget.tsx` ("Ask Ema" label on FAB)


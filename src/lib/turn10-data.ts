// ---------- Turn 10 mock data: outbound, channels, integrations, agent tools ----------

export type TenantTier = "starter" | "pro" | "business";
export const tenantTier: TenantTier = "pro";

// ---------- Outbound voice meter ----------
export const voiceMeter = {
  used: 234,
  limit: 500,
  paceProjection: 520,
  overageRateEC: 0.08, // EC$/min
};

// ---------- Outbound call records ----------

export type OutboundScript =
  | "Booking Confirmation"
  | "No-Show Recovery"
  | "Bill Reminder"
  | "Custom";

export type OutboundOutcome =
  | "Confirmed"
  | "Rescheduled"
  | "Cancelled"
  | "Voicemail"
  | "No-Answer"
  | "Human-Answered";

export type OutboundStatus = "Scheduled" | "Batch" | "Live" | "Completed" | "Cancelled";

export type OutboundCall = {
  id: string;
  target: string;
  phone: string;
  script: OutboundScript;
  agentId: string;
  agentName: string;
  scheduledFor: string;
  status: OutboundStatus;
  outcome?: OutboundOutcome;
  durationSec?: number;
  costEC?: number;
  batchSize?: number;
  note?: string;
  transcript?: { from: "ai" | "customer"; text: string; t: string }[];
};

export const outboundScheduled: OutboundCall[] = [
  {
    id: "ob-s1",
    target: "Marcus Charles",
    phone: "+1 767 123 4567",
    script: "Booking Confirmation",
    agentId: "ag-receptionist",
    agentName: "Maxine",
    scheduledFor: "Tomorrow · 6:00 PM",
    status: "Scheduled",
    note: "Tasting menu · Saturday 8pm · party of 4",
  },
  {
    id: "ob-s2",
    target: "Janelle Thomas",
    phone: "+1 767 999 8877",
    script: "Bill Reminder",
    agentId: "ag-aftersales",
    agentName: "Daniel",
    scheduledFor: "Tomorrow · 9:00 AM",
    status: "Scheduled",
    note: "Invoice #0042 · EC$340 outstanding · 12 days overdue",
  },
  {
    id: "ob-s3",
    target: "Batch · 4 no-shows from tonight",
    phone: "—",
    script: "No-Show Recovery",
    agentId: "ag-receptionist",
    agentName: "Maxine",
    scheduledFor: "In 15 minutes",
    status: "Batch",
    batchSize: 4,
    note: "Will call sequentially: Devon R., Tania B., Joelle M., Wesley F.",
  },
];

export const outboundLive: OutboundCall = {
  id: "ob-l1",
  target: "Aaliyah George",
  phone: "+1 767 245 1182",
  script: "Booking Confirmation",
  agentId: "ag-receptionist",
  agentName: "Maxine",
  scheduledFor: "Now",
  status: "Live",
  durationSec: 84,
  costEC: 0.12,
  transcript: [
    { from: "ai", text: "Hi, this is Maxine — an AI assistant calling on behalf of Coalpot Restaurant. Is this Aaliyah?", t: "0:02" },
    { from: "customer", text: "Yes speaking.", t: "0:08" },
    { from: "ai", text: "Great — I'm just calling to confirm your reservation tomorrow, Friday at 7pm, table for 4. One vegetarian guest noted. Does that still work for you?", t: "0:11" },
    { from: "customer", text: "Yes that's still good. Can you add one more person — we'll be 5.", t: "0:25" },
    { from: "ai", text: "Of course — I'll update that to a party of 5. Same time, 7pm. Anything else for the chef?", t: "0:34" },
    { from: "customer", text: "No that's all, thanks.", t: "1:18" },
  ],
};

export const outboundCompleted: OutboundCall[] = [
  { id: "ob-c1", target: "Solange P.", phone: "+1 758 488 7011", script: "Booking Confirmation", agentId: "ag-receptionist", agentName: "Maxine", scheduledFor: "Today · 2:14 PM", status: "Completed", outcome: "Confirmed", durationSec: 47, costEC: 0.07 },
  { id: "ob-c2", target: "Devon R.", phone: "+1 767 414 0091", script: "No-Show Recovery", agentId: "ag-receptionist", agentName: "Maxine", scheduledFor: "Today · 1:48 PM", status: "Completed", outcome: "Voicemail", durationSec: 22, costEC: 0.04 },
  { id: "ob-c3", target: "Wesley F.", phone: "+1 767 488 0011", script: "Booking Confirmation", agentId: "ag-receptionist", agentName: "Maxine", scheduledFor: "Today · 12:30 PM", status: "Completed", outcome: "Rescheduled", durationSec: 92, costEC: 0.14, note: "Moved Sat 6pm → Sat 8pm" },
  { id: "ob-c4", target: "Antoinette R.", phone: "+1 767 622 9087", script: "Bill Reminder", agentId: "ag-aftersales", agentName: "Daniel", scheduledFor: "Today · 11:05 AM", status: "Completed", outcome: "Confirmed", durationSec: 64, costEC: 0.10, note: "Will pay by EOD" },
  { id: "ob-c5", target: "Mireille A.", phone: "+1 758 311 6622", script: "Booking Confirmation", agentId: "ag-receptionist", agentName: "Maxine", scheduledFor: "Today · 10:22 AM", status: "Completed", outcome: "No-Answer", durationSec: 31, costEC: 0.05 },
  { id: "ob-c6", target: "Joelle M.", phone: "+1 767 220 4488", script: "No-Show Recovery", agentId: "ag-receptionist", agentName: "Maxine", scheduledFor: "Today · 9:48 AM", status: "Completed", outcome: "Cancelled", durationSec: 38, costEC: 0.06, note: "Customer cancelled — no fee" },
  { id: "ob-c7", target: "Cherise Joseph", phone: "+1 767 614 9920", script: "Booking Confirmation", agentId: "ag-receptionist", agentName: "Maxine", scheduledFor: "Yesterday · 7:12 PM", status: "Completed", outcome: "Human-Answered", durationSec: 118, costEC: 0.18, note: "Husband answered — passed message" },
  { id: "ob-c8", target: "Tania B.", phone: "+1 767 822 1140", script: "No-Show Recovery", agentId: "ag-receptionist", agentName: "Maxine", scheduledFor: "Yesterday · 9:14 PM", status: "Completed", outcome: "Voicemail", durationSec: 19, costEC: 0.03 },
];

export const outboundCancelled: OutboundCall[] = [
  { id: "ob-x1", target: "Kareem L.", phone: "+1 767 555 0143", script: "Bill Reminder", agentId: "ag-aftersales", agentName: "Daniel", scheduledFor: "Yesterday · 4:00 PM", status: "Cancelled", note: "Invoice paid before call window" },
  { id: "ob-x2", target: "Naomi C.", phone: "+1 767 244 9981", script: "Booking Confirmation", agentId: "ag-receptionist", agentName: "Maxine", scheduledFor: "Yesterday · 10:00 AM", status: "Cancelled", note: "Customer cancelled booking" },
];

export const outcomeMetaOutbound: Record<OutboundOutcome, { className: string; label: string }> = {
  Confirmed: { className: "border-emerald-400/40 bg-emerald-500/10 text-emerald-300", label: "Confirmed" },
  Voicemail: { className: "border-amber-400/40 bg-amber-500/10 text-amber-300", label: "Voicemail" },
  "No-Answer": { className: "border-slate-400/40 bg-slate-500/10 text-slate-300", label: "No-Answer" },
  Rescheduled: { className: "border-sky-400/40 bg-sky-500/10 text-sky-300", label: "Rescheduled" },
  Cancelled: { className: "border-rose-400/40 bg-rose-500/10 text-rose-300", label: "Cancelled" },
  "Human-Answered": { className: "border-violet/40 bg-violet/10 text-violet", label: "Human-Answered" },
};

// ---------- Channels hub status strip ----------

export type ChannelPillStatus = "connected" | "warning" | "offline";

export const channelPills = [
  { id: "wa", label: "WhatsApp", status: "connected" as ChannelPillStatus, detail: "2 numbers" },
  { id: "wa-voice", label: "WhatsApp voice", status: "connected" as ChannelPillStatus, detail: "Active" },
  { id: "ig", label: "Instagram", status: "connected" as ChannelPillStatus, detail: "@coalpot_dominica" },
  { id: "fb", label: "Facebook Messenger", status: "connected" as ChannelPillStatus, detail: "Coalpot Restaurant" },
  { id: "sip", label: "SIP Voice", status: "connected" as ChannelPillStatus, detail: "2 DIDs" },
  { id: "sms", label: "SMS", status: "warning" as ChannelPillStatus, detail: "Q3 2026" },
];

export const instagramAccount = {
  handle: "@coalpot_dominica",
  followers: 4280,
  lastPost: "3 hours ago",
  capabilities: ["DMs", "Comment auto-reply", "Story mention reply"],
  weeklyDms: 12,
  weeklyComments: 34,
};

export const facebookPage = {
  pageName: "Coalpot Restaurant",
  likes: 8920,
  lastPost: "Yesterday",
  capabilities: ["Messenger", "Page comment auto-reply"],
  weeklyThreads: 8,
  weeklyComments: 17,
};

export type VoiceDid = {
  id: string;
  number: string;
  agentName: string;
  inbound: boolean;
  outbound: boolean;
  minutesUsed: number;
  minutesLimit: number;
};

export const voiceDids: VoiceDid[] = [
  { id: "did-1", number: "+1 767 818 3741", agentName: "Maxine (Receptionist)", inbound: true, outbound: true, minutesUsed: 187, minutesLimit: 500 },
  { id: "did-2", number: "+1 767 818 3852", agentName: "Daniel (After-hours Sales)", inbound: true, outbound: true, minutesUsed: 47, minutesLimit: 500 },
];

// ---------- Integration grid (Turn 10 · Section 5) ----------

export type IntegrationCardKind =
  | "meta"
  | "odoo"
  | "fiserv"
  | "reloadly"
  | "gcal"
  | "uploadthing"
  | "stripe"
  | "chatwoot";

export type IntegrationCard = {
  id: IntegrationCardKind;
  name: string;
  desc: string;
  status: "operational" | "connected";
  account: string;
  details: { label: string; value: string }[];
  stats: { label: string; value: string }[];
  actions: { label: string; href?: string; external?: boolean; primary?: boolean }[];
  tierGate?: "pro";
};

export const integrationGrid: IntegrationCard[] = [
  {
    id: "meta",
    name: "Meta Business",
    desc: "WhatsApp + Instagram + Facebook, all under one Meta business account.",
    status: "operational",
    account: "Eric Giraud · EPIC Communications",
    details: [
      { label: "WhatsApp", value: "✓ 2 numbers connected" },
      { label: "Instagram", value: "✓ @coalpot_dominica" },
      { label: "Facebook Page", value: "✓ Coalpot Restaurant" },
    ],
    stats: [{ label: "Last sync", value: "2 min ago" }],
    actions: [
      { label: "Manage in Meta Business Suite", href: "https://business.facebook.com", external: true, primary: true },
      { label: "Refresh tokens" },
      { label: "Disconnect" },
    ],
  },
  {
    id: "odoo",
    name: "Odoo ERP",
    desc: "Live sync of customers, products, invoices and expenses.",
    status: "connected",
    account: "coalpot.odoo.com · Odoo 17 · DB coalpot-prod",
    details: [
      { label: "Last poll", value: "3 min ago" },
      { label: "Next poll", value: "in 2 min" },
      { label: "Records synced", value: "247 customers · 1,832 products · 89 open invoices" },
    ],
    stats: [],
    actions: [
      { label: "Test connection", primary: true },
      { label: "Edit credentials" },
      { label: "Disconnect" },
    ],
    tierGate: "pro",
  },
  {
    id: "fiserv",
    name: "Fiserv Payments",
    desc: "EPIC Payment Gateway · XCD-native, no Stripe decline issues.",
    status: "operational",
    account: "EPIC Payment Gateway · Fiserv",
    details: [
      { label: "Gateway", value: "api01.epic.dm" },
      { label: "Last health check", value: "30s ago · 180ms" },
      { label: "Currencies", value: "USD, XCD" },
    ],
    stats: [
      { label: "This month", value: "47 successful · 2 declined" },
      { label: "Processed", value: "EC$14,320" },
    ],
    actions: [
      { label: "Run health check", primary: true },
      { label: "View transactions", external: true },
    ],
  },
  {
    id: "reloadly",
    name: "Reloadly",
    desc: "Airtime top-ups, bill payments, and mobile money for Caribbean customers.",
    status: "connected",
    account: "Wallet · $142.30 USD",
    details: [
      { label: "Services", value: "Airtime (140 countries) · Bill pay (Dominica utilities) · Mobile money" },
    ],
    stats: [
      { label: "This month", value: "18 airtime top-ups" },
      { label: "Bill payments", value: "4" },
    ],
    actions: [
      { label: "Top up wallet", primary: true },
      { label: "Transaction history" },
      { label: "Disconnect" },
    ],
    tierGate: "pro",
  },
  {
    id: "gcal",
    name: "Google Calendar",
    desc: "All bookings push to your calendar in real time.",
    status: "connected",
    account: "eric@epic.dm",
    details: [],
    stats: [{ label: "Bookings pushed this month", value: "89" }],
    actions: [{ label: "Disconnect" }],
  },
  {
    id: "uploadthing",
    name: "UploadThing",
    desc: "File storage for menus, intake forms, and media you share over WhatsApp.",
    status: "connected",
    account: "epic-coalpot project",
    details: [],
    stats: [
      { label: "Storage", value: "1.2 GB used" },
      { label: "Files", value: "340" },
    ],
    actions: [{ label: "Manage files", primary: true }, { label: "Disconnect" }],
  },
  {
    id: "stripe",
    name: "Stripe (subscription billing)",
    desc: "Stripe handles your Isola subscription. Customer payments go through Fiserv.",
    status: "connected",
    account: "Subscription billing only",
    details: [{ label: "Role", value: "Backup · subscription billing only" }],
    stats: [],
    actions: [
      { label: "View in Stripe", href: "https://dashboard.stripe.com", external: true, primary: true },
      { label: "Manage subscription" },
    ],
  },
  {
    id: "chatwoot",
    name: "Chatwoot",
    desc: "Unified inbox engine — runs invisibly behind /dashboard/inbox.",
    status: "connected",
    account: "inbox.epic.dm",
    details: [{ label: "Role", value: "Unified inbox backend (internal)" }],
    stats: [],
    actions: [{ label: "Open Chatwoot", href: "https://inbox.epic.dm", external: true, primary: true }],
  },
];

// ---------- Agent tool registry (Turn 10 · Section 4) ----------

export type ToolCategory = "core" | "bookings" | "payments" | "odoo" | "reloadly" | "outbound";

export type ToolDef = {
  id: string;
  category: ToolCategory;
  label: string;
  desc: string;
};

export const toolCategories: { id: ToolCategory; label: string; gated?: "pro"; defaultOpen?: boolean }[] = [
  { id: "core", label: "Core", defaultOpen: true },
  { id: "bookings", label: "Bookings", defaultOpen: true },
  { id: "payments", label: "Payments" },
  { id: "odoo", label: "Odoo", gated: "pro" },
  { id: "reloadly", label: "Caribbean payments (Reloadly)", gated: "pro" },
  { id: "outbound", label: "Outbound voice", gated: "pro" },
];

export const allTools: ToolDef[] = [
  // Core
  { id: "catalog_browse", category: "core", label: "Catalog browse", desc: "Lookup products and menu items." },
  { id: "get_business_hours", category: "core", label: "Get business hours", desc: "Answer 'are you open?' questions." },
  { id: "escalate_to_human", category: "core", label: "Escalate to human", desc: "Route conversation to the owner." },
  { id: "contact_qualify", category: "core", label: "Contact qualify", desc: "Mark a contact as Lead / Customer / Blocked." },
  // Bookings
  { id: "get_booking_slots", category: "bookings", label: "Get booking slots", desc: "Show available times." },
  { id: "create_booking", category: "bookings", label: "Create booking", desc: "Confirm an appointment." },
  { id: "cancel_booking", category: "bookings", label: "Cancel booking", desc: "Let customer cancel via chat." },
  { id: "reschedule_booking", category: "bookings", label: "Reschedule booking", desc: "Move an existing booking." },
  // Payments
  { id: "create_payment_link", category: "payments", label: "Create payment link", desc: "Send a Fiserv payment link in XCD." },
  { id: "send_template", category: "payments", label: "Send template", desc: "Send an approved HSM template." },
  // Odoo
  { id: "invoices.create", category: "odoo", label: "invoices.create", desc: "Create an invoice for this customer." },
  { id: "invoices.mark_paid", category: "odoo", label: "invoices.mark_paid", desc: "Mark an existing invoice as paid." },
  { id: "invoices.send_reminder", category: "odoo", label: "invoices.send_reminder", desc: "Send overdue payment reminder via WA template." },
  { id: "products.update_stock", category: "odoo", label: "products.update_stock", desc: "Update inventory count." },
  { id: "expenses.approve", category: "odoo", label: "expenses.approve", desc: "Approve a pending expense." },
  { id: "expenses.reject", category: "odoo", label: "expenses.reject", desc: "Reject a pending expense." },
  { id: "partners.create", category: "odoo", label: "partners.create", desc: "Create a new customer record in Odoo." },
  // Reloadly
  { id: "send_airtime", category: "reloadly", label: "send_airtime", desc: "Send mobile airtime to a customer's phone." },
  { id: "pay_bill", category: "reloadly", label: "pay_bill", desc: "Pay a utility bill (DOMLEC, WASA, etc.) on customer's behalf." },
  { id: "check_reloadly_balance", category: "reloadly", label: "check_reloadly_balance", desc: "Check this tenant's Reloadly wallet." },
  // Outbound
  { id: "schedule_outbound_call", category: "outbound", label: "schedule_outbound_call", desc: "Schedule an outbound AI call to a customer." },
  { id: "schedule_followup", category: "outbound", label: "schedule_followup", desc: "Queue a follow-up message (text or voice) for X hours from now." },
];

export const roleDefaultTools: Record<string, string[]> = {
  receptionist: ["catalog_browse", "get_business_hours", "escalate_to_human", "contact_qualify", "send_template"],
  booker: ["get_booking_slots", "create_booking", "cancel_booking", "reschedule_booking", "get_business_hours", "escalate_to_human", "send_template", "schedule_outbound_call"],
  seller: ["catalog_browse", "create_payment_link", "contact_qualify", "escalate_to_human", "send_template", "invoices.create", "send_airtime"],
  support: ["catalog_browse", "get_business_hours", "escalate_to_human", "send_template"],
  custom: [],
};

/** Map agent template key to a role for default tool selection. */
export function roleForTemplate(template: string): keyof typeof roleDefaultTools {
  if (template === "booking") return "booker";
  if (template === "sales") return "seller";
  if (template === "support") return "support";
  if (template === "concierge" || template === "receptionist") return "receptionist";
  return "custom";
}

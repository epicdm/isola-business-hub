// Pure mock data — no backend, no API. Imported directly by page components.

export const verticals = [
  { slug: "restaurants", label: "Restaurants" },
  { slug: "hotels", label: "Hotels" },
  { slug: "clinics", label: "Clinics" },
] as const;

export const trustedLogos = [
  "Coalpot",
  "Fort Young",
  "Dr. Alvarez Clinic",
  "Roseau Bay Co.",
  "Kalinago Tours",
];

export const homeFeatures = [
  { icon: "Phone", title: "Inbound voice (AI receptionist)", desc: "Local Dominican number. AI answers, books, transfers — 24/7." },
  { icon: "PhoneCall", title: "Outbound voice (AI calls out)", desc: "Confirms tomorrow's bookings, recovers no-shows, chases invoices." },
  { icon: "Instagram", title: "Instagram DMs, comments, stories", desc: "Reply to every comment. Sell from a story. Capture every lead." },
  { icon: "MessageCircle", title: "Facebook Messenger + page comments", desc: "Page messages and post comments — never missed, always on-brand." },
  { icon: "Calendar", title: "Odoo-aware bookings", desc: "Sees inventory, takes deposit via Fiserv XCD, books to Google Calendar." },
  { icon: "Sparkles", title: "Ema, your AI chief-of-staff", desc: "Reads everything overnight. Briefs you at 7am. Runs commands by chat." },
] as const;

export const testimonials = [
  {
    name: "Marcus Joseph",
    role: "Chef-Owner, Coalpot Restaurant",
    location: "Roseau, Dominica",
    quote: "Fridays used to be brutal. Phone never stopped. Now Isola books the tables, reminds the customers, and I cook. We captured 30% more reservations in month one.",
  },
  {
    name: "Janelle Rose",
    role: "GM, Fort Young Hotel",
    location: "Roseau, Dominica",
    quote: "Our concierge agent handles excursion bookings in three languages. Guest satisfaction jumped 15 points. And it paid for itself the first month.",
  },
  {
    name: "Dr. Alvarez",
    role: "Founder, Pediatric Clinic",
    location: "Castries, Saint Lucia",
    quote: "We added 40 appointments a week without hiring anyone. Isola confirms every booking by voice the day before. No-shows dropped 60%.",
  },
];

export const faqs = [
  { q: "How is Isola different from Wati or Respond.io?", a: "They rent Twilio. We own our telco. They do WhatsApp. We do WhatsApp + Instagram + Messenger + voice + Odoo + payments + airtime. They're US-focused. We're Caribbean-native." },
  { q: "Do I need to use Odoo?", a: "No. Isola works on WhatsApp alone at Starter. Pro and Business unlock Odoo integration — huge leverage for tracking sales, stock, and invoices. You can connect later if you're not on Odoo yet." },
  { q: "What does the AI actually say? Won't it sound like a robot?", a: "You configure tone (Friendly, Formal, Casual, Warm, Professional), name each agent, and write their welcome message. They're your brand, not ours. Every call opens with 'I'm an AI assistant calling on behalf of {business}' — customers can always reach a human by replying HUMAN." },
  { q: "What happens if the internet goes down?", a: "Voice keeps working over PSTN — we own the telephone network. Text resumes when internet returns, with a backfill of messages received during downtime." },
  { q: "Can my customers pay in XCD?", a: "Yes. Fiserv, via our own gateway, clears XCD natively. No conversion fees. No mysterious Stripe declines on Caribbean-issued cards." },
  { q: "How long does setup take?", a: "Ten minutes to your first AI-answered WhatsApp message. Three days to full Odoo + Fiserv + voice stack." },
];

export const pricingTiers = [
  {
    name: "Starter",
    price: 149,
    annual: 119,
    badge: null,
    desc: "Try it on WhatsApp.",
    features: [
      "1 AI agent + 1 Ema number",
      "WhatsApp text only",
      "100 voice minutes/mo (inbound receptionist)",
      "Fiserv payments (XCD + USD)",
      "Ema chief-of-staff",
      "Email support",
    ],
    cta: "Start free trial",
  },
  {
    name: "Pro",
    price: 249,
    annual: 199,
    badge: "Most Popular",
    desc: "The full operating system.",
    features: [
      "Everything in Starter, plus:",
      "All Meta channels (IG DMs, comments, stories, FB Messenger)",
      "Outbound AI voice calls (confirms, no-show recovery)",
      "500 voice minutes/mo",
      "Odoo integration (invoices, inventory, P&L)",
      "Reloadly (airtime, bill pay, mobile money)",
      "Priority email support",
    ],
    cta: "Start free trial",
  },
  {
    name: "Business",
    price: 449,
    annual: 359,
    badge: null,
    desc: "Multi-location or high-volume.",
    features: [
      "Everything in Pro, plus:",
      "3 agent numbers (not 1)",
      "Unlimited voice minutes",
      "Dedicated support line + WhatsApp",
      "Custom onboarding",
      "Multi-location migration (Phase 3, free)",
    ],
    cta: "Book a demo",
  },
];

// ---------- Dashboard ----------

export const kpis = [
  { label: "Messages today", value: "147", delta: "+12%", trend: "up" as const },
  { label: "Bookings this week", value: "38", delta: "+8%", trend: "up" as const },
  { label: "Avg response time", value: "2.4s", delta: "-0.3s", trend: "up" as const },
  { label: "Revenue this week", value: "EC$8,420", delta: "+22%", trend: "up" as const },
];

export const recentActivity = [
  { id: 1, channel: "whatsapp", customer: "Aaliyah George", action: "Booked table for 4", time: "2m ago" },
  { id: 2, channel: "voice", customer: "Marcus Phillip", action: "Asked about hours", time: "8m ago" },
  { id: 3, channel: "instagram", customer: "@island_eats_dom", action: "DM about menu", time: "14m ago" },
  { id: 4, channel: "whatsapp", customer: "Cherise Joseph", action: "Confirmed reservation", time: "22m ago" },
  { id: 5, channel: "messenger", customer: "Tania B.", action: "Asked location", time: "31m ago" },
  { id: 6, channel: "whatsapp", customer: "Kareem L.", action: "Escalated to owner", time: "44m ago" },
  { id: 7, channel: "whatsapp", customer: "Solange P.", action: "Booked tour", time: "1h ago" },
  { id: 8, channel: "voice", customer: "Unknown", action: "Voicemail captured", time: "1h ago" },
  { id: 9, channel: "instagram", customer: "@dominica_eats", action: "Story reply", time: "2h ago" },
  { id: 10, channel: "whatsapp", customer: "Joelle M.", action: "Cancellation", time: "2h ago" },
];

export const emaInitialMessages = [
  {
    id: "m1",
    role: "ema" as const,
    content: "Good morning ☀️ Yesterday: 14 messages handled, 3 bookings, 1 escalation needs you (Kareem L. asked about a private dinner — I drafted a reply, want to send?).",
    timestamp: "7:00 AM",
  },
  {
    id: "m2",
    role: "owner" as const,
    content: "Send the draft. What's the booking forecast looking like?",
    timestamp: "7:14 AM",
  },
  {
    id: "m3",
    role: "ema" as const,
    content: "Sent ✓ Forecast: 38 bookings this week (+8% vs last week). Friday is filling up fast — only 2 tables left for 7pm.",
    timestamp: "7:14 AM",
  },
];

export const emaQuickActions = ["Today's digest", "How's this week?", "Launch campaign", "Show escalations"];

// Past Ema conversations — for /dashboard/ema thread sidebar
export const emaThreads = [
  {
    id: "t1",
    title: "Today's digest",
    preview: "14 messages, 3 bookings, 1 escalation needs you…",
    time: "7:00 AM",
    pinned: true,
    messages: emaInitialMessages,
  },
  {
    id: "t2",
    title: "Friday forecast",
    preview: "Friday is filling fast — only 2 tables left for 7pm.",
    time: "Yesterday",
    pinned: false,
    messages: [
      { id: "f1", role: "owner" as const, content: "What does Friday look like?", timestamp: "5:42 PM" },
      { id: "f2", role: "ema" as const, content: "Friday: 22 covers booked across 14 reservations. Only 2 tables open at 7pm. Want me to push a 'last seats' WhatsApp blast to your VIP list?", timestamp: "5:42 PM" },
      { id: "f3", role: "owner" as const, content: "Yes, but cap it at 8 people — don't want to overbook.", timestamp: "5:43 PM" },
      { id: "f4", role: "ema" as const, content: "Sent to top 12 VIPs with a 2-hour expiry on the offer. I'll stop the blast the moment we hit 8 confirmations.", timestamp: "5:43 PM" },
    ],
  },
  {
    id: "t3",
    title: "Launch Mother's Day menu",
    preview: "Drafted a 3-message campaign for the regular list.",
    time: "Mon",
    pinned: false,
    messages: [
      { id: "m1", role: "owner" as const, content: "I want to launch the Mother's Day prix fixe to our regulars.", timestamp: "10:12 AM" },
      { id: "m2", role: "ema" as const, content: "Got it. I drafted a 3-message sequence: tease (Wed), reveal + booking link (Fri), last-call (Sun). Want to preview?", timestamp: "10:12 AM" },
    ],
  },
  {
    id: "t4",
    title: "Weekly recap",
    preview: "+22% revenue, top channel was WhatsApp (78%).",
    time: "Sun",
    pinned: false,
    messages: [
      { id: "w1", role: "ema" as const, content: "Weekly recap is in your inbox. TL;DR: +22% revenue, 78% via WhatsApp, Aaliyah George visited 3 times this week.", timestamp: "8:00 AM" },
    ],
  },
  {
    id: "t5",
    title: "Lapsed customers",
    preview: "12 regulars haven't visited in 60+ days.",
    time: "Apr 14",
    pinned: false,
    messages: [
      { id: "l1", role: "owner" as const, content: "Who's gone quiet?", timestamp: "2:30 PM" },
      { id: "l2", role: "ema" as const, content: "12 regulars haven't visited in 60+ days. Top 3 by lifetime spend: Wesley F. (EC$1,620), Antoinette R. (EC$3,150), Cherise Joseph (EC$2,180). Want me to draft a 'we miss you' message?", timestamp: "2:30 PM" },
    ],
  },
];

// Daily / weekly digest archive — for /dashboard/ema/reports
export const emaReports = [
  {
    id: "r1",
    type: "daily" as const,
    date: "Today · Apr 20",
    title: "Morning digest",
    summary: "14 messages handled · 3 new bookings · 1 escalation",
    highlights: ["Friday 7pm fully booked", "Kareem L. needs callback re: private dinner", "Revenue pacing +14%"],
    metrics: { messages: 14, bookings: 3, revenue: 1240, escalations: 1 },
  },
  {
    id: "r2",
    type: "daily" as const,
    date: "Yesterday · Apr 19",
    title: "Morning digest",
    summary: "22 messages handled · 5 bookings · 0 escalations",
    highlights: ["Sunday brunch sold out", "3 new VIP signups via IG", "Avg response time 2.1s"],
    metrics: { messages: 22, bookings: 5, revenue: 1820, escalations: 0 },
  },
  {
    id: "r3",
    type: "weekly" as const,
    date: "Week of Apr 14",
    title: "Weekly recap",
    summary: "147 messages · 38 bookings · EC$8,420 revenue · +22% WoW",
    highlights: ["WhatsApp = 78% of channel mix", "Top guest: Aaliyah George (3 visits)", "12 lapsed regulars identified"],
    metrics: { messages: 147, bookings: 38, revenue: 8420, escalations: 4 },
  },
  {
    id: "r4",
    type: "daily" as const,
    date: "Apr 18",
    title: "Morning digest",
    summary: "19 messages handled · 4 bookings · 1 escalation",
    highlights: ["Solange P. booked tour group of 6", "1 cancellation recovered", "Revenue pacing flat"],
    metrics: { messages: 19, bookings: 4, revenue: 1410, escalations: 1 },
  },
  {
    id: "r5",
    type: "campaign" as const,
    date: "Apr 17",
    title: "Mother's Day teaser results",
    summary: "Sent to 84 regulars · 38 opens · 12 bookings captured",
    highlights: ["45% open rate", "31% booking conversion", "EC$2,160 attributed revenue"],
    metrics: { messages: 84, bookings: 12, revenue: 2160, escalations: 0 },
  },
  {
    id: "r6",
    type: "weekly" as const,
    date: "Week of Apr 7",
    title: "Weekly recap",
    summary: "121 messages · 31 bookings · EC$6,890 revenue",
    highlights: ["First full week with IG enabled", "2 escalations resolved <1hr", "Avg party size: 3.4"],
    metrics: { messages: 121, bookings: 31, revenue: 6890, escalations: 2 },
  },
];

export type Channel = "whatsapp" | "voice" | "instagram" | "messenger" | "facebook";

/** Sub-type for channels that can carry both private DMs and public comments. */
export type ChannelSubType = "dm" | "comment" | "page_comment" | "story";


// ---------- Inbox ----------

export const conversations = [
  {
    id: "c1",
    channel: "whatsapp" as Channel,
    customer: "Aaliyah George",
    preview: "Perfect, see you Friday at 7!",
    time: "2m ago",
    unread: 0,
    status: "ai" as const,
    messages: [
      { id: 1, from: "customer" as const, text: "Hi! Do you have a table for 4 on Friday at 7pm?", time: "7:42 PM" },
      { id: 2, from: "ai" as const, text: "Hi Aaliyah! 🌴 Yes, we have a table for 4 available at 7:00 PM Friday. Any dietary preferences I should note?", time: "7:42 PM" },
      { id: 3, from: "customer" as const, text: "One of us is vegetarian. Also, do you do birthday cakes?", time: "7:43 PM" },
      { id: 4, from: "ai" as const, text: "Noted — 1 vegetarian. We don't bake cakes in-house, but we'll happily plate any cake you bring (no fee). Want me to lock in the reservation?", time: "7:43 PM" },
      {
        id: "card-catalog-1",
        from: "ai" as const,
        text: "Here's our most-loved Friday-night dish, in case you'd like to pre-order:",
        time: "7:43 PM",
        card: {
          kind: "catalog" as const,
          itemId: "m4",
          name: "Pan-seared snapper",
          price: 64,
          desc: "Whole snapper, creole sauce, breadfruit mash. Our signature.",
          emoji: "🐟",
          tapped: true,
        },
      },
      { id: 5, from: "customer" as const, text: "Yes please, under Aaliyah George.", time: "7:44 PM" },
      { id: 6, from: "ai" as const, text: "Booked ✓ Table for 4, Friday 7:00 PM, under Aaliyah George. We'll send a reminder Friday morning. See you then!", time: "7:44 PM" },
      {
        id: "card-booking-1",
        from: "ai" as const,
        text: "",
        time: "7:44 PM",
        card: {
          kind: "booking" as const,
          service: "Dinner reservation",
          date: "Friday, Apr 24",
          time: "7:00 PM",
          party: 4,
          notes: "1 vegetarian · cake plating arranged",
        },
      },
      {
        id: "card-payment-1",
        from: "ai" as const,
        text: "Securing the table with a small deposit — refundable up to 4 hours before:",
        time: "7:44 PM",
        card: {
          kind: "payment" as const,
          amount: 50,
          description: "Friday 7pm · party of 4 · refundable deposit",
          status: "paid" as const,
          paidAt: "7:45 PM",
          provider: "Stripe",
        },
      },
      { id: 7, from: "customer" as const, text: "Perfect, see you Friday at 7!", time: "7:45 PM" },
      { id: 8, from: "whisper" as const, text: "FYI — Aaliyah usually orders the snapper. Pre-stage a vegetarian alternative for her plus-one.", time: "7:46 PM", ownerName: "Marcus", teachAi: false },
      { id: 9, from: "whisper" as const, text: "If anyone in her party asks for cake plating, no fee — confirmed by chef. AI should remember this for VIPs.", time: "7:47 PM", ownerName: "Marcus", teachAi: true },
    ],
  },
  {
    id: "c2",
    channel: "whatsapp" as Channel,
    customer: "Kareem L.",
    preview: "Can you do a private dinner for 12?",
    time: "44m ago",
    unread: 2,
    status: "escalated" as const,
    messages: [
      { id: 1, from: "customer" as const, text: "Hi, I'd like to host a private dinner for 12 people next Saturday. Is that something you do?", time: "6:58 PM" },
      { id: 2, from: "ai" as const, text: "Hi Kareem! Private dinners are something the chef arranges personally. Let me flag this for Marcus and he'll be in touch shortly with options and pricing.", time: "6:58 PM" },
      { id: 3, from: "customer" as const, text: "Can you do a private dinner for 12?", time: "7:01 PM" },
    ],
  },
  {
    id: "c3",
    channel: "instagram" as Channel,
    customer: "@island_eats_dom",
    preview: "Loved the snapper last night!",
    time: "14m ago",
    unread: 0,
    status: "ai" as const,
    messages: [
      { id: 1, from: "customer" as const, text: "Loved the snapper last night! 🐟", time: "8:12 PM" },
      { id: 2, from: "ai" as const, text: "So glad you enjoyed it 🌊 Tag us next time and we'll feature your photo on our story!", time: "8:12 PM" },
    ],
  },
  {
    id: "c4",
    channel: "voice" as Channel,
    customer: "Marcus Phillip",
    preview: "Voice transcript: asked about hours",
    time: "8m ago",
    unread: 0,
    status: "ai" as const,
    messages: [
      { id: 1, from: "customer" as const, text: "[Voice] Hello, what time you all close tonight?", time: "8:32 PM" },
      { id: 2, from: "ai" as const, text: "[Voice] Good evening! We're open until 10:30 PM tonight, last seating at 9:45. Would you like to reserve a table?", time: "8:32 PM" },
      { id: 3, from: "customer" as const, text: "[Voice] No that's fine, just walking in. Thanks!", time: "8:32 PM" },
    ],
  },
  {
    id: "c5",
    channel: "messenger" as Channel,
    customer: "Tania B.",
    preview: "Where are you located exactly?",
    time: "31m ago",
    unread: 0,
    status: "ai" as const,
    messages: [
      { id: 1, from: "customer" as const, text: "Where are you located exactly?", time: "8:08 PM" },
      { id: 2, from: "ai" as const, text: "We're at 23 Castle St, Roseau — right by the bay. Here's a Google Maps link: maps.google.com/coalpot 🗺️", time: "8:08 PM" },
    ],
  },
  {
    id: "c6",
    channel: "whatsapp" as Channel,
    customer: "Marcus Charles",
    preview: "🙌",
    time: "5m ago",
    unread: 0,
    status: "ai" as const,
    messages: [
      { id: 1, from: "customer" as const, text: "Hey I want to book a table for 4 tonight at 8pm", time: "7:02 PM" },
      { id: 2, from: "ai" as const, text: "Hi Marcus! Let me check. 🎉 Yes, 8pm for 4 is available. Would you like to pre-order from tonight's tasting menu? It's been really popular.", time: "7:02 PM" },
      { id: 3, from: "customer" as const, text: "what's on it", time: "7:03 PM" },
      {
        id: "card-catalog-c6",
        from: "ai" as const,
        text: "",
        time: "7:03 PM",
        card: {
          kind: "catalog" as const,
          itemId: "tasting-menu",
          name: "Tasting Menu (7 courses)",
          price: 180,
          desc: "Chef's Caribbean tasting — lobster, jerk lamb, rum cake finale.",
          emoji: "🍽️",
          tapped: true,
        },
      },
      { id: 4, from: "customer" as const, text: "lets do it for all 4 of us", time: "7:05 PM" },
      { id: 5, from: "ai" as const, text: "Perfect — EC$720 for 4 guests. I'll send a payment link to hold the reservation.", time: "7:05 PM" },
      {
        id: "card-payment-c6-pending",
        from: "ai" as const,
        text: "",
        time: "7:05 PM",
        card: {
          kind: "payment" as const,
          amount: 720,
          description: "Tasting menu — 4 guests, Saturday 8pm",
          status: "pending" as const,
          provider: "Stripe",
        },
      },
      { id: 6, from: "customer" as const, text: "paid", time: "7:14 PM" },
      {
        id: "card-payment-c6-paid",
        from: "ai" as const,
        text: "",
        time: "7:14 PM",
        card: {
          kind: "payment" as const,
          amount: 720,
          description: "Tasting menu — 4 guests, Saturday 8pm",
          status: "paid" as const,
          paidAt: "7:14 PM",
          provider: "Stripe",
        },
      },
      {
        id: "card-booking-c6",
        from: "ai" as const,
        text: "",
        time: "7:14 PM",
        card: {
          kind: "booking" as const,
          service: "Tasting menu pre-ordered",
          date: "Saturday",
          time: "8:00 PM",
          party: 4,
          notes: "7-course tasting · paid in full",
        },
      },
      { id: 7, from: "customer" as const, text: "🙌", time: "7:15 PM" },
    ],
  },
  // ---------- Turn 10 · Section 1 — IG + FB conversations ----------
  {
    id: "c7",
    channel: "instagram" as Channel,
    subType: "dm" as ChannelSubType,
    customer: "Sarah Mitchell",
    handle: "@sarahm_travels",
    preview: "paid!",
    time: "3:45 PM",
    unread: 0,
    status: "ai" as const,
    messages: [
      { id: 1, from: "customer" as const, text: "hey saw your post about the ocean suite, is it free dec 22-26?", time: "3:20 PM" },
      { id: 2, from: "ai" as const, text: "Hi Sarah! Let me check — yes, the Ocean Suite is open Dec 22-26 (4 nights).", time: "3:21 PM" },
      {
        id: "card-catalog-c7",
        from: "ai" as const,
        text: "",
        time: "3:21 PM",
        card: {
          kind: "catalog" as const,
          itemId: "ocean-suite",
          name: "Ocean Suite",
          price: 1200,
          desc: "Private balcony, king bed, ocean view, breakfast incl.",
          emoji: "🌊",
          tapped: true,
        },
      },
      { id: 3, from: "customer" as const, text: "how do i book", time: "3:28 PM" },
      { id: 4, from: "ai" as const, text: "I'll send a payment link for the first night as a deposit (EC$1,200). Balance due at check-in.", time: "3:29 PM" },
      {
        id: "card-payment-c7-pending",
        from: "ai" as const,
        text: "",
        time: "3:29 PM",
        card: {
          kind: "payment" as const,
          amount: 1200,
          description: "Ocean Suite deposit · Dec 22-26",
          status: "pending" as const,
          provider: "Fiserv",
        },
      },
      { id: 5, from: "customer" as const, text: "paid!", time: "3:38 PM" },
      {
        id: "card-booking-c7",
        from: "ai" as const,
        text: "",
        time: "3:39 PM",
        card: {
          kind: "booking" as const,
          service: "Ocean Suite",
          date: "Dec 22-26",
          time: "Check-in 3pm",
          party: 2,
          notes: "4 nights · deposit EC$1,200 paid",
        },
      },
    ],
  },
  {
    id: "c8",
    channel: "instagram" as Channel,
    subType: "comment" as ChannelSubType,
    parentPost: "Tonight's special — lobster thermidor",
    customer: "Andre Joseph",
    handle: "@andrejxo",
    preview: "EC$145/person tonight. DM us to reserve 🦞",
    time: "7:15 PM",
    unread: 0,
    status: "ai" as const,
    messages: [
      { id: 1, from: "customer" as const, text: "how much?", time: "7:12 PM" },
      { id: 2, from: "ai" as const, text: "Hi Andre! EC$145/person tonight. DM us to reserve 🦞", time: "7:13 PM" },
      { id: 3, from: "ai" as const, text: "Hey Andre — saw you asked about tonight's lobster thermidor. EC$145/person, want me to hold a table?", time: "7:15 PM" },
    ],
  },
  {
    id: "c9",
    channel: "messenger" as Channel,
    subType: "dm" as ChannelSubType,
    customer: "Monica Charles",
    handle: "Monica Charles",
    preview: "Wed 10am · Thu 2pm · Fri 9am · Fri 3pm",
    time: "10:18 AM",
    unread: 1,
    status: "ai" as const,
    messages: [
      { id: 1, from: "customer" as const, text: "Hi, I need to book my son for a check-up this week", time: "10:05 AM" },
      { id: 2, from: "ai" as const, text: "Hi Monica! Happy to help. Is this with Dr. Alvarez?", time: "10:06 AM" },
      { id: 3, from: "customer" as const, text: "yes", time: "10:14 AM" },
      { id: 4, from: "ai" as const, text: "Dr. Alvarez has these slots open:", time: "10:15 AM" },
      { id: 5, from: "ai" as const, text: "Wed 10am · Thu 2pm · Fri 9am · Fri 3pm", time: "10:16 AM" },
      { id: 6, from: "ai" as const, text: "Which works best? Or I can text more options.", time: "10:18 AM" },
    ],
  },
  {
    id: "c10",
    channel: "facebook" as Channel,
    subType: "page_comment" as ChannelSubType,
    parentPost: "We're closed tomorrow for staff training",
    customer: "Kareem Louis",
    handle: "@kareeml_84",
    preview: "Hi Kareem — we've sent you a DM to help sort that out.",
    time: "11:43 AM",
    unread: 0,
    status: "ai" as const,
    messages: [
      { id: 1, from: "customer" as const, text: "what about my reservation at 7 tomorrow", time: "11:43 AM" },
      { id: 2, from: "ai" as const, text: "Hi Kareem — we've sent you a DM to help sort that out.", time: "11:43 AM" },
      { id: 3, from: "ai" as const, text: "Hi Kareem — I see you have a 7pm booking tomorrow (party of 3). Want me to move it to Thursday 7pm or Saturday 7pm? Or cancel with no fee.", time: "11:44 AM" },
    ],
  },
];


// ---------- Bookings ----------

export const bookings = [
  { id: "b1", guest: "Aaliyah George", party: 4, date: "2026-04-24", time: "7:00 PM", channel: "whatsapp" as Channel, status: "confirmed" as const, notes: "1 vegetarian" },
  { id: "b2", guest: "Cherise Joseph", party: 2, date: "2026-04-21", time: "6:30 PM", channel: "whatsapp" as Channel, status: "confirmed" as const, notes: "" },
  { id: "b3", guest: "Joelle M.", party: 3, date: "2026-04-22", time: "8:00 PM", channel: "whatsapp" as Channel, status: "cancelled" as const, notes: "Cancelled — rebooking next week" },
  { id: "b4", guest: "Solange P.", party: 6, date: "2026-04-25", time: "7:30 PM", channel: "whatsapp" as Channel, status: "confirmed" as const, notes: "Birthday — bringing cake" },
  { id: "b5", guest: "Devon R.", party: 2, date: "2026-04-23", time: "8:15 PM", channel: "instagram" as Channel, status: "pending" as const, notes: "Awaiting deposit" },
  { id: "b6", guest: "Mireille A.", party: 5, date: "2026-04-26", time: "1:00 PM", channel: "messenger" as Channel, status: "confirmed" as const, notes: "Sunday brunch" },
  { id: "b7", guest: "Kareem L.", party: 12, date: "2026-04-27", time: "7:00 PM", channel: "whatsapp" as Channel, status: "pending" as const, notes: "Private dinner — needs chef approval" },
  { id: "b8", guest: "Tania B.", party: 2, date: "2026-04-21", time: "8:30 PM", channel: "messenger" as Channel, status: "confirmed" as const, notes: "" },
  { id: "b9", guest: "Wesley F.", party: 4, date: "2026-04-24", time: "6:00 PM", channel: "voice" as Channel, status: "confirmed" as const, notes: "Window table requested" },
  { id: "b10", guest: "Antoinette R.", party: 8, date: "2026-04-28", time: "7:00 PM", channel: "whatsapp" as Channel, status: "confirmed" as const, notes: "Anniversary" },
];

export type BookingStatus = "confirmed" | "pending" | "cancelled";

// ---------- Contacts ----------

export const contacts = [
  { id: "p1", name: "Aaliyah George", phone: "+1 767 245 1182", channel: "whatsapp" as Channel, visits: 7, lastSeen: "2m ago", spend: 1240, tags: ["regular", "vegetarian"], notes: "Loves the snapper. Always books Fridays." },
  { id: "p2", name: "Cherise Joseph", phone: "+1 767 614 9920", channel: "whatsapp" as Channel, visits: 12, lastSeen: "22m ago", spend: 2180, tags: ["vip", "regular"], notes: "Anniversary in November. Husband is gluten-free." },
  { id: "p3", name: "Kareem L.", phone: "+1 767 555 0143", channel: "whatsapp" as Channel, visits: 2, lastSeen: "44m ago", spend: 480, tags: ["new"], notes: "Inquired about private dinners. Big spender potential." },
  { id: "p4", name: "Solange P.", phone: "+1 758 488 7011", channel: "whatsapp" as Channel, visits: 4, lastSeen: "1h ago", spend: 920, tags: ["regular"], notes: "Tour group operator — repeat referrer." },
  { id: "p5", name: "Joelle M.", phone: "+1 767 220 4488", channel: "whatsapp" as Channel, visits: 3, lastSeen: "2h ago", spend: 360, tags: [], notes: "" },
  { id: "p6", name: "Devon R.", phone: "@devonr", channel: "instagram" as Channel, visits: 1, lastSeen: "3h ago", spend: 0, tags: ["new"], notes: "Found us via IG." },
  { id: "p7", name: "Mireille A.", phone: "+1 758 311 6622", channel: "messenger" as Channel, visits: 5, lastSeen: "5h ago", spend: 740, tags: ["regular"], notes: "Sunday brunch regular." },
  { id: "p8", name: "Wesley F.", phone: "+1 767 488 0011", channel: "voice" as Channel, visits: 9, lastSeen: "1d ago", spend: 1620, tags: ["regular", "vip"], notes: "Requests window table. Tips well." },
  { id: "p9", name: "Antoinette R.", phone: "+1 767 622 9087", channel: "whatsapp" as Channel, visits: 14, lastSeen: "2d ago", spend: 3150, tags: ["vip"], notes: "Hosts annual anniversary dinner — table of 8." },
  { id: "p10", name: "Tania B.", phone: "@taniab", channel: "messenger" as Channel, visits: 1, lastSeen: "31m ago", spend: 0, tags: ["new"], notes: "Walked in after asking for directions." },
  { id: "p11", name: "Marcus Charles", phone: "+1 767 123 4567", channel: "whatsapp" as Channel, visits: 6, lastSeen: "5m ago", spend: 1480, tags: ["vip", "regular"], notes: "Anniversary regular. Price-insensitive — always pre-orders the tasting menu." },
];

// ---------- Catalog ----------

export type CatalogCategory = "Food" | "Drinks" | "Services" | "Rooms" | "Other";

export const catalogCategories: CatalogCategory[] = ["Food", "Drinks", "Services", "Rooms", "Other"];

export type CatalogItem = {
  id: string;
  name: string;
  category: CatalogCategory;
  price: number;
  available: boolean;
  desc: string;
  tags: string[];
  /** Emoji thumbnail used as a no-image placeholder. */
  emoji: string;
};

export const catalogItems: CatalogItem[] = [
  // Food — restaurant
  { id: "m1", name: "Grilled callaloo stack", category: "Food", price: 45, available: true, desc: "Charred callaloo, dasheen rosti, coconut cream, scotch bonnet drizzle.", tags: ["vegetarian", "signature"], emoji: "🥬" },
  { id: "m2", name: "Breadfruit salad", category: "Food", price: 35, available: true, desc: "Roasted breadfruit, citrus vinaigrette, pickled onion, herbs.", tags: ["vegan"], emoji: "🥗" },
  { id: "m3", name: "Dasheen curry", category: "Food", price: 55, available: true, desc: "Slow-braised dasheen leaf, coconut milk, garam masala, basmati.", tags: ["vegetarian"], emoji: "🍛" },
  { id: "m4", name: "Pan-seared snapper", category: "Food", price: 64, available: true, desc: "Whole snapper, creole sauce, breadfruit mash.", tags: ["signature"], emoji: "🐟" },
  { id: "m5", name: "Coalpot oxtail", category: "Food", price: 58, available: true, desc: "Slow-braised, butter beans, dumpling.", tags: ["signature"], emoji: "🍲" },
  { id: "m6", name: "Saltfish accras", category: "Food", price: 22, available: true, desc: "Crisp salt-cod fritters, tamarind dip.", tags: [], emoji: "🥟" },
  { id: "m7", name: "Mountain chicken", category: "Food", price: 78, available: false, desc: "Seasonal — currently unavailable.", tags: ["seasonal"], emoji: "🍗" },
  { id: "m8", name: "Provision plate", category: "Food", price: 16, available: true, desc: "Yam, dasheen, breadfruit, plantain.", tags: ["vegetarian", "vegan"], emoji: "🍠" },
  { id: "m9", name: "Cassava pone", category: "Food", price: 14, available: true, desc: "Spiced coconut-cassava cake, rum cream.", tags: ["dessert"], emoji: "🍰" },

  // Drinks
  { id: "m10", name: "Sea moss punch", category: "Drinks", price: 10, available: true, desc: "House blend, vanilla, nutmeg.", tags: ["non-alcoholic"], emoji: "🥛" },
  { id: "m11", name: "Dominica rum flight", category: "Drinks", price: 32, available: true, desc: "Macoucherie, Bois Bandé, Soca.", tags: ["alcoholic"], emoji: "🥃" },
  { id: "m12", name: "Sorrel cooler", category: "Drinks", price: 12, available: true, desc: "Hibiscus, ginger, lime, cane syrup.", tags: ["non-alcoholic"], emoji: "🍹" },
  { id: "m13", name: "Coconut espresso", category: "Drinks", price: 14, available: true, desc: "Double espresso, fresh coconut cream.", tags: ["non-alcoholic"], emoji: "☕" },
  { id: "m14", name: "House Riesling (glass)", category: "Drinks", price: 28, available: true, desc: "Crisp, off-dry — pairs with snapper.", tags: ["alcoholic"], emoji: "🍷" },

  // Rooms — hotel
  { id: "r1", name: "Garden View Standard", category: "Rooms", price: 250, available: true, desc: "Queen bed, garden view, AC, free wifi. /night.", tags: ["1-2 guests"], emoji: "🛏️" },
  { id: "r2", name: "Ocean View Deluxe", category: "Rooms", price: 320, available: true, desc: "King bed, balcony, ocean view. /night.", tags: ["2 guests", "popular"], emoji: "🌊" },
  { id: "r3", name: "Family Suite", category: "Rooms", price: 395, available: true, desc: "2 bedrooms, kitchenette, sofa bed. /night.", tags: ["up to 5 guests"], emoji: "👨‍👩‍👧" },
  { id: "r4", name: "Honeymoon Suite", category: "Rooms", price: 450, available: true, desc: "Plunge pool, ocean view, complimentary champagne. /night.", tags: ["2 guests", "premium"], emoji: "💕" },
  { id: "r5", name: "Day Use Room", category: "Rooms", price: 120, available: true, desc: "9am–6pm, ideal for cruise day guests. /day.", tags: [], emoji: "🛎️" },

  // Services — clinic
  { id: "s1", name: "General consultation", category: "Services", price: 150, available: true, desc: "30-minute visit with attending physician.", tags: ["walk-in ok"], emoji: "🩺" },
  { id: "s2", name: "Pediatric visit", category: "Services", price: 175, available: true, desc: "0–17 years. Includes growth check.", tags: ["pediatric"], emoji: "👶" },
  { id: "s3", name: "Annual physical", category: "Services", price: 300, available: true, desc: "Full screening, bloodwork add-on available.", tags: ["preventive"], emoji: "📋" },
  { id: "s4", name: "Telehealth follow-up", category: "Services", price: 90, available: true, desc: "20-minute video consult, prescription refills.", tags: ["virtual"], emoji: "💻" },
  { id: "s5", name: "Vaccination", category: "Services", price: 75, available: true, desc: "Routine vaccines, travel vaccines extra.", tags: ["walk-in ok"], emoji: "💉" },
  { id: "s6", name: "Lab — basic panel", category: "Services", price: 220, available: true, desc: "CBC, lipid, glucose. Results next-day.", tags: ["lab"], emoji: "🧪" },

  // Services — hospitality / tours
  { id: "s7", name: "Airport transfer", category: "Services", price: 85, available: true, desc: "Roseau ↔ Douglas-Charles, AC vehicle.", tags: ["transport"], emoji: "🚐" },
  { id: "s8", name: "Champagne breakfast", category: "Services", price: 95, available: true, desc: "In-room, 2 guests. 24h notice.", tags: ["add-on"], emoji: "🥂" },
  { id: "s9", name: "Boiling Lake hike (guided)", category: "Services", price: 220, available: true, desc: "Full day, lunch + transport included.", tags: ["popular"], emoji: "🥾" },
  { id: "s10", name: "Whale watching tour", category: "Services", price: 180, available: true, desc: "3-hour boat tour, snacks included.", tags: ["seasonal"], emoji: "🐋" },

  // Other
  { id: "o1", name: "Private dining buyout", category: "Other", price: 3500, available: true, desc: "Full restaurant buyout, 6pm–11pm. Menu by chef.", tags: ["events"], emoji: "🎉" },
  { id: "o2", name: "Birthday cake plating", category: "Other", price: 0, available: true, desc: "Bring your own cake — no fee, candles included.", tags: ["complimentary"], emoji: "🎂" },
  { id: "o3", name: "Corkage fee", category: "Other", price: 50, available: true, desc: "EC$50/bottle. Max 2 bottles per table.", tags: [], emoji: "🍾" },
  { id: "o4", name: "Late checkout", category: "Other", price: 60, available: true, desc: "Until 4pm, subject to availability.", tags: ["add-on"], emoji: "⏰" },
  { id: "o5", name: "Pet fee", category: "Other", price: 40, available: true, desc: "Per night. Up to 2 small pets per room.", tags: [], emoji: "🐶" },
];

// ---------- Hours ----------

export const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const defaultHours = [
  { day: "Monday", closed: false, open: "11:00", close: "22:00" },
  { day: "Tuesday", closed: false, open: "11:00", close: "22:00" },
  { day: "Wednesday", closed: false, open: "11:00", close: "22:00" },
  { day: "Thursday", closed: false, open: "11:00", close: "22:00" },
  { day: "Friday", closed: false, open: "11:00", close: "00:00" },
  { day: "Saturday", closed: false, open: "11:00", close: "00:00" },
  { day: "Sunday", closed: false, open: "12:00", close: "21:00" },
];

export const holidays = [
  { id: "h1", date: "2026-12-25", label: "Christmas Day", closed: true },
  { id: "h2", date: "2026-01-01", label: "New Year's Day", closed: false, open: "14:00", close: "20:00" },
  { id: "h3", date: "2026-05-04", label: "Carnival Monday", closed: true },
  { id: "h4", date: "2026-11-03", label: "Independence Day", closed: false, open: "16:00", close: "23:00" },
];

// ---------- Knowledge ----------

export type KnowledgeCategory =
  | "Hours"
  | "Reservations"
  | "Location"
  | "Payments"
  | "Policies"
  | "Menu"
  | "Events";

export const knowledgeCategories: KnowledgeCategory[] = [
  "Hours",
  "Reservations",
  "Location",
  "Payments",
  "Policies",
  "Menu",
  "Events",
];

export type KnowledgeFaq = {
  id: string;
  category: KnowledgeCategory;
  q: string;
  a: string;
  uses: number;
  lastUpdated: string;
};

export const knowledgeEntries: KnowledgeFaq[] = [
  { id: "k1", category: "Hours", q: "What are your hours?", a: "Monday–Thursday 11am–10pm, Friday–Saturday 11am–midnight, Sunday 12pm–9pm. Closed Christmas Day; New Year's Day 2pm–8pm.", uses: 311, lastUpdated: "Apr 14" },
  { id: "k2", category: "Reservations", q: "Do you take reservations?", a: "Yes — for tables of 4 or more we strongly recommend booking. Walk-ins are welcome any other time.", uses: 198, lastUpdated: "Apr 12" },
  { id: "k3", category: "Reservations", q: "What's your largest party size?", a: "We seat parties up to 10 in the main room. Anything larger is a private dinner — flag for chef.", uses: 142, lastUpdated: "Apr 12" },
  { id: "k4", category: "Location", q: "Is parking available?", a: "Yes — free street parking on Bath Rd and a paid lot directly opposite (EC$5 flat).", uses: 167, lastUpdated: "Apr 11" },
  { id: "k5", category: "Location", q: "Where are you exactly?", a: "23 Castle St, Roseau — by the bay, opposite the cruise terminal.", uses: 211, lastUpdated: "Mar 28" },
  { id: "k6", category: "Payments", q: "Do you accept cash?", a: "Yes — cash (XCD or USD), all major cards, Stripe links over WhatsApp, and Apple Pay.", uses: 134, lastUpdated: "Apr 9" },
  { id: "k7", category: "Policies", q: "What's your cancellation policy?", a: "Free up to 4 hours before your reservation. Parties of 6+ require a deposit, refundable up to 24h before.", uses: 89, lastUpdated: "Apr 10" },
  { id: "k8", category: "Menu", q: "Do you have vegetarian / vegan options?", a: "Yes — grilled callaloo stack, breadfruit salad, dasheen curry, provision plate. Vegan items are marked.", uses: 76, lastUpdated: "Apr 14" },
  { id: "k9", category: "Menu", q: "Do you accommodate allergies?", a: "Yes — please tell us when booking. We can adapt most dishes (gluten-free, nut-free, dairy-free).", uses: 64, lastUpdated: "Apr 7" },
  { id: "k10", category: "Menu", q: "Do you bake birthday cakes?", a: "We don't bake cakes in-house, but you're welcome to bring one — no plating fee.", uses: 54, lastUpdated: "Apr 2" },
  { id: "k11", category: "Policies", q: "Do you have a dress code?", a: "Smart casual. No beachwear after 6pm.", uses: 47, lastUpdated: "Apr 3" },
  { id: "k12", category: "Events", q: "Do you do private events?", a: "Yes — full buyout from EC$3,500, half-room from EC$1,800. Chef approves all menus.", uses: 41, lastUpdated: "Apr 6" },
  { id: "k13", category: "Hours", q: "Are you open on holidays?", a: "Open most public holidays. Closed Christmas Day. New Year's Day reduced hours (2pm–8pm).", uses: 38, lastUpdated: "Apr 5" },
  { id: "k14", category: "Location", q: "Is the venue wheelchair accessible?", a: "Yes — ground floor, ramp at main entrance, accessible restroom.", uses: 29, lastUpdated: "Mar 30" },
  { id: "k15", category: "Policies", q: "Is there a corkage fee?", a: "EC$50 per bottle, max 2 bottles per table.", uses: 23, lastUpdated: "Apr 1" },
  { id: "k16", category: "Reservations", q: "Can I book over WhatsApp?", a: "Yes! Message us anytime — Ema confirms in seconds, or we'll text you back if it needs a human eye.", uses: 86, lastUpdated: "Apr 13" },
];

export type KnowledgeDocument = {
  id: string;
  filename: string;
  ext: "pdf" | "docx" | "xlsx" | "txt" | "image";
  sizeKb: number;
  uploadedAt: string;
};

export const knowledgeDocuments: KnowledgeDocument[] = [
  { id: "d1", filename: "menu.pdf", ext: "pdf", sizeKb: 842, uploadedAt: "Apr 14" },
  { id: "d2", filename: "allergens.pdf", ext: "pdf", sizeKb: 214, uploadedAt: "Apr 11" },
  { id: "d3", filename: "terms.pdf", ext: "pdf", sizeKb: 318, uploadedAt: "Apr 6" },
  { id: "d4", filename: "cancellation-policy.pdf", ext: "pdf", sizeKb: 96, uploadedAt: "Apr 4" },
  { id: "d5", filename: "wifi-password.txt", ext: "txt", sizeKb: 1, uploadedAt: "Mar 28" },
  { id: "d6", filename: "wine-list.pdf", ext: "pdf", sizeKb: 488, uploadedAt: "Mar 22" },
];

// ---------- WhatsApp ----------

export type WhatsAppLineStatus = "active" | "registering" | "failed";

export const whatsappLines = {
  customer: {
    label: "Customer-facing number",
    number: "+1 767-818-3741",
    waLink: "https://wa.me/17678183741",
    displayName: "Coalpot Restaurant",
    status: "active" as WhatsAppLineStatus,
    lastMessage: "2 minutes ago",
    description: "Customers reach your AI agents on this number.",
  },
  ema: {
    label: "Ema's number",
    number: "+1 767-818-3742",
    waLink: "https://wa.me/17678183742",
    displayName: "Ema · Chief of Staff",
    status: "active" as WhatsAppLineStatus,
    lastMessage: "Pinged you 7 min ago with the morning digest.",
    description: "Your private line to Ema. Only you and your team see this.",
  },
};

export const whatsappStatus = {
  number: "+1 767-818-3741",
  displayName: "Coalpot Restaurant",
  verified: true,
  verifiedTier: "Green tick · Official Business Account",
  qualityRating: "High" as const,
  messagingLimit: "Tier 3 · 100K unique users / 24h",
  conversations24h: 1284,
  templatesApproved: 14,
  templatesPending: 1,
  webhookHealthy: true,
  lastSync: "12s ago",
};

export const whatsappTemplates = [
  { id: "t1", name: "booking_confirmed", category: "Utility", language: "en", status: "approved" as const },
  { id: "t2", name: "booking_reminder", category: "Utility", language: "en", status: "approved" as const },
  { id: "t3", name: "vip_birthday", category: "Marketing", language: "en", status: "approved" as const },
  { id: "t4", name: "lapsed_reengage", category: "Marketing", language: "en", status: "pending" as const },
];

// ---------- Integrations ----------

export const integrations = [
  { id: "stripe", name: "Stripe", desc: "Take deposits and accept payments for bookings.", connected: true, account: "acct_1Q…J7", category: "Payments" },
  { id: "instagram", name: "Instagram", desc: "Reply to DMs, story mentions, and post comments.", connected: true, account: "@coalpot_dom", category: "Social" },
  { id: "messenger", name: "Facebook Messenger", desc: "Page messages handled automatically.", connected: true, account: "Coalpot Restaurant", category: "Social" },
  { id: "google", name: "Google Business Profile", desc: "Sync hours, respond to Q&A and reviews.", connected: false, account: null, category: "Listings" },
  { id: "opentable", name: "OpenTable", desc: "Push reservations to your OpenTable calendar.", connected: false, account: null, category: "Bookings" },
  { id: "mailchimp", name: "Mailchimp", desc: "Sync VIP segments to email campaigns.", connected: false, account: null, category: "Marketing" },
  { id: "zapier", name: "Zapier", desc: "Trigger 6,000+ apps from inbox events.", connected: false, account: null, category: "Automation" },
  { id: "pos", name: "Square POS", desc: "Match WhatsApp bookings to in-store covers.", connected: false, account: null, category: "Operations" },
];

// ---------- Billing ----------

export const billingPlan = {
  name: "Pro",
  price: 249,
  currency: "USD",
  interval: "month",
  renewsOn: "May 12, 2026",
  seats: 5,
  features: [
    "Unlimited WhatsApp conversations",
    "Voice via WhatsApp Calling",
    "Instagram + Messenger",
    "Ema AI chief of staff",
    "Priority support",
  ],
  usage: {
    conversations: { used: 1284, limit: 5000 },
    aiMessages: { used: 8420, limit: 20000 },
    seats: { used: 3, limit: 5 },
  },
};

export const invoices = [
  { id: "INV-2026-04", date: "Apr 12, 2026", amount: 249, currency: "EC$", status: "paid" as const, period: "Apr 12 — May 12" },
  { id: "INV-2026-03", date: "Mar 12, 2026", amount: 249, currency: "EC$", status: "paid" as const, period: "Mar 12 — Apr 12" },
  { id: "INV-2026-02", date: "Feb 12, 2026", amount: 249, currency: "EC$", status: "paid" as const, period: "Feb 12 — Mar 12" },
  { id: "INV-2026-01", date: "Jan 12, 2026", amount: 249, currency: "EC$", status: "paid" as const, period: "Jan 12 — Feb 12" },
  { id: "INV-2025-12", date: "Dec 12, 2025", amount: 249, currency: "EC$", status: "paid" as const, period: "Dec 12 — Jan 12" },
  { id: "INV-2025-11", date: "Nov 12, 2025", amount: 249, currency: "EC$", status: "paid" as const, period: "Nov 12 — Dec 12" },
];

export const voiceUsage = {
  used: 347,
  limit: 500,
  topupPriceEC: 89,
  topupMinutes: 250,
};

// ---------- Read-only integrations list (Turn 5) ----------

export type IntegrationStatus = "connected" | "available" | "phase2";

export const integrationCards = [
  { id: "chatwoot", name: "Chatwoot", desc: "Unified inbox powering all conversations.", status: "connected" as IntegrationStatus, action: "View inbox", actionHref: "https://inbox.epic.dm", category: "Inbox" },
  { id: "wa", name: "WhatsApp Business API", desc: "Customer + Ema lines, via Meta.", status: "connected" as IntegrationStatus, action: "Manage", actionHref: "/dashboard/whatsapp", category: "Messaging" },
  { id: "stripe", name: "Stripe", desc: "Deposits and payment links inside chat.", status: "connected" as IntegrationStatus, action: "Open dashboard", actionHref: "https://dashboard.stripe.com", category: "Payments" },
  { id: "gcal", name: "Google Calendar", desc: "Push bookings to your calendar.", status: "available" as IntegrationStatus, action: "Connect", actionHref: "#", category: "Calendar" },
  { id: "odoo", name: "Odoo", desc: "Sync customers + invoices to your ERP.", status: "phase2" as IntegrationStatus, action: "Coming soon", actionHref: "#", category: "ERP" },
  { id: "instagram", name: "Instagram", desc: "DMs, story replies, comment automation.", status: "phase2" as IntegrationStatus, action: "Coming soon", actionHref: "#", category: "Social" },
  { id: "facebook", name: "Facebook Pages", desc: "Page comments + reviews handled.", status: "phase2" as IntegrationStatus, action: "Coming soon", actionHref: "#", category: "Social" },
  { id: "messenger", name: "Facebook Messenger", desc: "Page messages answered automatically.", status: "phase2" as IntegrationStatus, action: "Coming soon", actionHref: "#", category: "Social" },
];

// ---------- Settings (account) ----------

export const accountDefaults = {
  businessName: "Coalpot Restaurant",
  ownerName: "Marcus Joseph",
  email: "marcus@coalpot.dm",
  phone: "+1 767 245 7811",
  timezone: "America/Dominica (AST)",
  currency: "XCD — East Caribbean Dollar",
  toneOfVoice: "Warm & friendly",
  brandVoice: "Caribbean hospitality, never stuffy. We use 'we' and 'our' — never 'the restaurant.'",
};

export const teamMembers = [
  { id: "u1", name: "Marcus Joseph", email: "marcus@coalpot.dm", role: "Owner", avatar: "MJ" },
  { id: "u2", name: "Cherise Joseph", email: "cherise@coalpot.dm", role: "Manager", avatar: "CJ" },
  { id: "u3", name: "Devon Andrew", email: "devon@coalpot.dm", role: "Staff", avatar: "DA" },
];

// ---------- Agents (Turn 6) ----------

export type AgentTemplateKey =
  | "receptionist"
  | "sales"
  | "support"
  | "concierge"
  | "booking"
  | "custom";

export type AgentStatus = "active" | "paused" | "error";
export type AgentChannel = "whatsapp" | "voice" | "instagram" | "messenger";
export type AgentSchedule = "always" | "business" | "after" | "custom";

export type AgentRoutingRule = {
  id: string;
  type: "tag" | "time" | "fallback";
  label: string;
};

export type Agent = {
  id: string;
  name: string;
  template: AgentTemplateKey;
  templateLabel: string;
  status: AgentStatus;
  channels: AgentChannel[];
  schedule: AgentSchedule;
  scheduleLabel: string;
  tone: number; // 0 formal, 1 friendly, 2 casual
  welcome: string;
  escalationKeywords: string[];
  escalationContact: string;
  examples: { question: string; answer: string }[];
  routing: AgentRoutingRule[];
  messagesThisWeek: number;
};

export const agentTemplates: Array<{
  key: AgentTemplateKey;
  emoji: string;
  label: string;
  desc: string;
}> = [
  { key: "receptionist", emoji: "👋", label: "Receptionist", desc: "Greets customers, answers FAQs, routes questions." },
  { key: "sales", emoji: "💰", label: "Sales", desc: "Answers product questions, shares pricing, takes orders." },
  { key: "support", emoji: "🛠️", label: "Support / Helpdesk", desc: "Handles complaints, tracks issues, escalates." },
  { key: "concierge", emoji: "🎩", label: "Concierge", desc: "Hotels-focused: check-in, excursions, room service." },
  { key: "booking", emoji: "📅", label: "Booking", desc: "Takes appointments, manages calendar, sends reminders." },
  { key: "custom", emoji: "✨", label: "Custom", desc: "Start from scratch with a blank agent." },
];

export type AgentActivityOutcome = "booked" | "answered" | "escalated";

export type AgentActivityEntry = {
  id: string;
  conversationId: string; // links into /dashboard/inbox
  channel: AgentChannel;
  customer: string;
  outcome: AgentActivityOutcome;
  preview: string;
  time: string; // relative
};

const activityCustomers = [
  "Aaliyah George", "Marcus Phillip", "Cherise Joseph", "Kareem L.", "Solange P.",
  "Tania B.", "Joelle M.", "Wesley F.", "Antoinette R.", "Devon R.",
  "Mireille A.", "Janelle Rose", "Dr. Alvarez", "@island_eats_dom", "@dominica_eats",
  "Naomi C.", "Ravi P.", "Sabine D.", "Theo K.", "Yannick B.",
  "Imani O.", "Leon V.", "Priya N.", "Estella M.", "Quincy R.",
];

const activityChannels: AgentChannel[] = ["whatsapp", "voice", "instagram", "messenger"];
const activityOutcomes: AgentActivityOutcome[] = ["booked", "answered", "answered", "answered", "escalated"];
const activityPreviews: Record<AgentActivityOutcome, string[]> = {
  booked: [
    "Booked table for 4, Friday 7pm",
    "Reservation confirmed — Sat 6:30 PM",
    "Locked in birthday dinner for 8",
    "Brunch booked for Sunday, party of 3",
    "Tour group of 6 scheduled",
  ],
  answered: [
    "Answered question about closing time",
    "Shared menu and pricing",
    "Confirmed location + parking",
    "Explained dietary options",
    "Replied with directions",
    "Sent today's specials",
  ],
  escalated: [
    "Escalated — private dinner request",
    "Escalated — refund inquiry",
    "Handed off — manager requested",
    "Escalated — bulk order pricing",
  ],
};

// Deterministic per-agent activity feed (50 entries). Pure UI mock.
export function getAgentActivity(agentId: string): AgentActivityEntry[] {
  // Tiny seeded PRNG so results are stable per agent across renders.
  let seed = 0;
  for (let i = 0; i < agentId.length; i++) seed = (seed * 31 + agentId.charCodeAt(i)) >>> 0;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0xffffffff;
  };
  const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
  const realConvIds = ["c1", "c2", "c3", "c4", "c5", "c6"];

  const entries: AgentActivityEntry[] = [];
  for (let i = 0; i < 50; i++) {
    const channel = pick(activityChannels);
    const outcome = pick(activityOutcomes);
    const customer = pick(activityCustomers);
    const preview = pick(activityPreviews[outcome]);
    // First 6 link to real inbox conversations; the rest reuse them round-robin.
    const conversationId = i < realConvIds.length ? realConvIds[i] : realConvIds[i % realConvIds.length];
    const minutesAgo = Math.floor(2 + i * 17 + rand() * 12);
    const time =
      minutesAgo < 60
        ? `${minutesAgo}m ago`
        : minutesAgo < 60 * 24
          ? `${Math.floor(minutesAgo / 60)}h ago`
          : `${Math.floor(minutesAgo / (60 * 24))}d ago`;
    entries.push({
      id: `${agentId}-act-${i}`,
      conversationId,
      channel,
      customer,
      outcome,
      preview,
      time,
    });
  }
  return entries;
}

export const agents: Agent[] = [
  {
    id: "ag-receptionist",
    name: "Main Receptionist",
    template: "receptionist",
    templateLabel: "Receptionist",
    status: "active",
    channels: ["whatsapp", "voice"],
    schedule: "always",
    scheduleLabel: "Always on · 24/7",
    tone: 1,
    welcome: "Hi 🌴 Welcome to Coalpot. How can I help today?",
    escalationKeywords: ["complaint", "manager", "refund", "urgent"],
    escalationContact: "+1 767 245 7811",
    examples: [
      { question: "What time do you close tonight?", answer: "We're open until 10pm tonight, last seating at 9:15. Want me to book you a table?" },
      { question: "Do you take reservations?", answer: "Yes — for parties of 4+ I'd recommend it. What date were you thinking?" },
    ],
    routing: [
      { id: "r1", type: "tag", label: "Route VIP customers to me first" },
      { id: "r2", type: "fallback", label: "If Booking Assistant is busy, take over" },
    ],
    messagesThisWeek: 412,
  },
  {
    id: "ag-aftersales",
    name: "After-hours Sales",
    template: "sales",
    templateLabel: "Sales",
    status: "active",
    channels: ["whatsapp"],
    schedule: "after",
    scheduleLabel: "9pm – 9am",
    tone: 2,
    welcome: "Hey! 👋 We're closed for the night but I can still take orders and answer questions.",
    escalationKeywords: ["price match", "wholesale", "bulk"],
    escalationContact: "+1 767 245 7811",
    examples: [
      { question: "Are you still serving?", answer: "Kitchen's closed for tonight, but I can lock in a reservation for tomorrow — want me to grab a time?" },
      { question: "How much for the snapper?", answer: "Pan-seared snapper is EC$64. It's our signature — comes with breadfruit mash and creole sauce." },
    ],
    routing: [
      { id: "r1", type: "time", label: "Only handle messages between 9pm and 9am" },
    ],
    messagesThisWeek: 87,
  },
  {
    id: "ag-booking",
    name: "Booking Assistant",
    template: "booking",
    templateLabel: "Booking",
    status: "paused",
    channels: ["whatsapp"],
    schedule: "business",
    scheduleLabel: "During business hours",
    tone: 1,
    welcome: "Hi! Let's get your reservation locked in. What date were you thinking?",
    escalationKeywords: ["large group", "private dinner", "buyout"],
    escalationContact: "+1 767 245 7811",
    examples: [
      { question: "Friday at 7 for 4?", answer: "Booked ✓ table for 4, Friday 7pm. We'll text you a reminder Friday morning." },
      { question: "Can I cancel?", answer: "Of course — free up to 4 hours before. Want me to cancel now?" },
    ],
    routing: [
      { id: "r1", type: "time", label: "Only during business hours" },
      { id: "r2", type: "tag", label: "Anything tagged #booking comes here" },
    ],
    messagesThisWeek: 134,
  },
];

// ---------- Rich message cards (Turn 7 · Feature 4) ----------

export type CatalogMessageCard = {
  kind: "catalog";
  itemId: string;
  name: string;
  price: number; // EC$
  desc: string;
  emoji: string;
  tapped?: boolean;
};

export type PaymentStatus = "pending" | "paid" | "expired";

export type PaymentMessageCard = {
  kind: "payment";
  amount: number; // EC$
  description: string;
  status: PaymentStatus;
  paidAt?: string;
  provider: "Stripe" | "Fiserv";
};

export type BookingMessageCard = {
  kind: "booking";
  service: string;
  date: string;
  time: string;
  party: number;
  notes?: string;
};

export type MessageCard = CatalogMessageCard | PaymentMessageCard | BookingMessageCard;

// ---------- AI suggested replies (Turn 7 · Feature 2) ----------
// Mock POST /api/inbox/conversations/[id]/suggestions.
// Returns 3 short reply suggestions tailored to the last customer message.
export const suggestionSeeds: Record<string, string[][]> = {
  c1: [
    [
      "Wonderful — see you Friday! I'll have the vegetarian options ready.",
      "Looking forward to it. Anything else I can prep for the table?",
      "Perfect ✓ I've added a note for the chef about your guest.",
    ],
    [
      "🌴 Can't wait to host you. Our snapper is fresh in this morning.",
      "All set! I'll text you Friday morning with a quick reminder.",
      "See you then! Want me to reserve a window seat if one's free?",
    ],
  ],
  c2: [
    [
      "Yes — private dinners for 12 are absolutely something we do. Let me grab you a chef's quote.",
      "Hi Kareem — sorry for the wait. Marcus is reviewing dates now and will reply within the hour.",
      "Happy to help with this. A few quick questions: any dietary needs and a preferred wine budget?",
    ],
    [
      "Confirmed availability for next Saturday. Sending you a chef's menu draft + EC$1,800 deposit link.",
      "Yes — chef Marcus will design a 5-course tasting. Want it plated or family-style?",
      "We've held next Saturday for you provisionally. Replying within 30 min with full pricing.",
    ],
  ],
  c3: [
    [
      "So happy you loved it 🐟 Tag us next time and we'll feature your photo!",
      "Thank you! That snapper is our chef's pride. See you again soon?",
      "🌊 Means the world. We're running a Mother's Day prix fixe — want details?",
    ],
  ],
  c4: [
    [
      "Glad I could help — see you soon!",
      "Walk-ins welcome anytime before 9:45. We'll save a seat at the bar.",
      "Anytime! Tonight's special is the oxtail if you'd like to know.",
    ],
  ],
  c5: [
    [
      "We're at 23 Castle St — the bay-side patio. Want me to send a pin?",
      "Easy to find — opposite the cruise terminal. Free parking on Bath Rd.",
      "Right on the bay — here's a Maps pin: maps.google.com/coalpot 📍",
    ],
  ],
  c6: [
    [
      "Glad it went through! See you Saturday at 8 — ask for Marcus at the door.",
      "Payment received ✓ Anything special I should flag for the kitchen?",
      "Locked in. Want me to add a wine pairing to the tasting menu?",
    ],
  ],
};

export function getSuggestions(conversationId: string, rotation = 0): string[] {
  const sets = suggestionSeeds[conversationId] ?? [
    [
      "Thanks for reaching out — I'll get back to you right away.",
      "Happy to help! Could you share a bit more detail?",
      "On it — give me one moment.",
    ],
  ];
  return sets[rotation % sets.length];
}

// ---------- Ema conversation chat (Turn 7 · Feature 1) ----------
// Mock POST /api/ema/conversation-chat — Ema gives advice about a specific inbox conversation.

export type EmaConvChatMsg = {
  id: string;
  from: "ema" | "owner";
  text: string;
  time: string;
  /** When Ema returns a draft reply, this is the suggested text the owner can insert into the composer. */
  draftReply?: string;
};

export const emaConvQuickActions = [
  "Summarize this",
  "What does the customer want?",
  "Draft a reply",
  "Should I escalate?",
] as const;

export type EmaConvQuickAction = (typeof emaConvQuickActions)[number];

// Per-conversation canned answers. If a key is missing we fall back to generic templates.
const emaConvAnswers: Record<string, Partial<Record<EmaConvQuickAction, { text: string; draftReply?: string }>>> = {
  c1: {
    "Summarize this": {
      text: "Aaliyah George booked a table for 4 on Friday at 7pm. One vegetarian guest, and she asked about birthday cake plating — confirmed no fee. Deposit of EC$50 paid via Stripe. She's a regular (7 visits, EC$1,240 lifetime).",
    },
    "What does the customer want?": {
      text: "A confirmed Friday 7pm reservation with a vegetarian option and the option to bring her own cake. She's already paid the deposit — she's locked in.",
    },
    "Draft a reply": {
      text: "Here's a warm follow-up that nudges her toward pre-ordering:",
      draftReply:
        "Hi Aaliyah! Quick heads up — chef has the snapper coming in fresh Friday morning. Want me to pre-stage a portion for you and a vegetarian dasheen curry for your guest?",
    },
    "Should I escalate?": {
      text: "No — the agent handled this beautifully. She's confirmed, paid, and a known regular. I'll flag you only if she changes party size or cancels.",
    },
  },
  c2: {
    "Summarize this": {
      text: "Kareem L. is asking about a private dinner for 12 next Saturday. The agent flagged it for Marcus but no follow-up has gone out yet — Kareem nudged again 2 minutes later. He's tagged 'new' (2 visits, EC$480 spend) but his note says 'big spender potential'.",
    },
    "What does the customer want?": {
      text: "A private dinner for 12 next Saturday. He needs pricing and confirmation that it's possible — quickly. The 'can you do' phrasing suggests he's comparing options.",
    },
    "Draft a reply": {
      text: "Here's a fast holding reply that buys time without losing the lead:",
      draftReply:
        "Hi Kareem — yes, private dinners for 12 are absolutely something we do. Chef Marcus is putting together a quick menu + price for next Saturday and will reply within 30 minutes. Any dietary needs I should pass along?",
    },
    "Should I escalate?": {
      text: "Yes — Marcus should reply personally within the hour. Kareem already nudged once; another 30 min of silence and he'll book elsewhere. I've drafted a holding reply you can send now.",
    },
  },
  c3: {
    "Summarize this": {
      text: "@island_eats_dom (Instagram) loved the snapper last night. Pure praise — no question to answer. The agent thanked her and asked her to tag the restaurant.",
    },
    "What does the customer want?": {
      text: "Nothing transactional — she's giving a compliment. The opportunity is to convert her into a UGC source by getting her to tag your account.",
    },
    "Draft a reply": {
      text: "Here's a friendly reply that doubles down on the moment:",
      draftReply:
        "So glad you loved it 🌊 If you snapped a photo, tag @coalpot_dom and we'll feature you on our story this week. P.S. — Mother's Day prix fixe drops Friday, want first-look access?",
    },
    "Should I escalate?": {
      text: "No — pure social good news. The agent reply was on-brand. No action needed from you.",
    },
  },
};

const emaGenericAnswers: Record<EmaConvQuickAction, string> = {
  "Summarize this":
    "Customer reached out via {{channel}}. The agent has been handling the thread and is currently {{status}}. Nothing flagged so far.",
  "What does the customer want?":
    "From the thread, the customer wants a quick, accurate answer. The agent is on track — no clarifying question outstanding.",
  "Draft a reply":
    "Want me to draft something specific? Tap one of the chips above and I'll give you a ready-to-send reply.",
  "Should I escalate?":
    "No — the agent is handling this within normal range. I'll ping you only if something changes.",
};

export function emaConversationReply(
  conversationId: string,
  message: string,
): { text: string; draftReply?: string } {
  const trimmed = message.trim();
  const quick = (emaConvQuickActions as readonly string[]).find((q) => q === trimmed) as
    | EmaConvQuickAction
    | undefined;
  if (quick) {
    const specific = emaConvAnswers[conversationId]?.[quick];
    if (specific) return specific;
    return { text: emaGenericAnswers[quick] };
  }
  // Free-text fallback
  return {
    text: `On it — looking at ${conversationId} now. (In the live build I'd answer "${trimmed}" with full context from the thread.)`,
  };
}

// ---------- Pending approval queue (Turn 7 · Feature 3 · Review mode) ----------

export type PendingDraft = {
  id: string;
  conversationId: string;
  agentId: string;
  customer: string;
  channel: Channel;
  customerMessage: string;
  customerTime: string;
  draft: string;
  draftTime: string;
};

// ---------- Labels (Turn 8 · Feature 1) ----------
// Tenant-global label registry. CRUD lives in /dashboard/settings → Labels tab.

export type LabelColor =
  | "rose"
  | "amber"
  | "emerald"
  | "sky"
  | "violet"
  | "fuchsia"
  | "slate"
  | "orange";

export type LabelDef = {
  id: string;
  name: string;
  color: LabelColor;
};

/** 8-swatch palette tied to design tokens. UI only — Tailwind classes are picked from a map. */
export const labelPalette: LabelColor[] = [
  "rose",
  "amber",
  "emerald",
  "sky",
  "violet",
  "fuchsia",
  "slate",
  "orange",
];

export const tenantLabels: LabelDef[] = [
  { id: "lb-vip", name: "VIP", color: "violet" },
  { id: "lb-complaint", name: "Complaint", color: "rose" },
  { id: "lb-booking", name: "Booking", color: "emerald" },
  { id: "lb-lead", name: "Lead", color: "sky" },
  { id: "lb-customer", name: "Customer", color: "fuchsia" },
  { id: "lb-urgent", name: "Urgent", color: "orange" },
  { id: "lb-support", name: "Support", color: "amber" },
];


// ---------- Conversation status + per-conversation labels (Turn 8 · Feature 1) ----------
// Mock storage for the editable status/labels/last-customer-message-age, keyed by conversation id.

export type ConversationStatus = "open" | "pending" | "snoozed" | "resolved";

export type ConversationMeta = {
  status: ConversationStatus;
  /** ISO date string. Only set when status = "snoozed". */
  snoozeUntil?: string;
  /** Label IDs from `tenantLabels`. */
  labels: string[];
  /** Hours since the customer's last inbound message — drives the 24h template-only banner. */
  hoursSinceLastInbound: number;
};

export const conversationMeta: Record<string, ConversationMeta> = {
  c1: { status: "open", labels: ["lb-vip", "lb-booking"], hoursSinceLastInbound: 0.05 },
  c2: { status: "pending", labels: ["lb-lead", "lb-urgent"], hoursSinceLastInbound: 0.7 },
  c3: { status: "resolved", labels: [], hoursSinceLastInbound: 0.25 },
  // Marcus Phillip (voice) — last customer reply was 26 hours ago. Triggers template-only banner.
  c4: { status: "open", labels: ["lb-support"], hoursSinceLastInbound: 26 },
  c5: { status: "open", labels: ["lb-lead"], hoursSinceLastInbound: 0.5 },
  c6: { status: "open", labels: ["lb-vip", "lb-booking"], hoursSinceLastInbound: 0.08 },
  // Turn 10 · Section 1 — IG / FB seeds
  c7: { status: "open", labels: ["lb-lead"], hoursSinceLastInbound: 0.12 },
  c8: { status: "resolved", labels: [], hoursSinceLastInbound: 0.05 },
  c9: { status: "pending", labels: ["lb-customer"], hoursSinceLastInbound: 0.3 },
  c10: { status: "resolved", labels: ["lb-support"], hoursSinceLastInbound: 0.4 },
};


export const statusMeta: Record<
  ConversationStatus,
  { label: string; dot: string; pill: string }
> = {
  open: {
    label: "Open",
    dot: "bg-emerald-400",
    pill: "border-emerald-400/40 bg-emerald-500/10 text-emerald-300",
  },
  pending: {
    label: "Pending",
    dot: "bg-amber-400",
    pill: "border-amber-400/40 bg-amber-500/10 text-amber-300",
  },
  snoozed: {
    label: "Snoozed",
    dot: "bg-violet",
    pill: "border-violet/40 bg-violet/10 text-violet",
  },
  resolved: {
    label: "Resolved",
    dot: "bg-slate-400",
    pill: "border-slate-400/40 bg-slate-500/10 text-slate-300",
  },
};

/** Tailwind class bundles per palette swatch — used by chips and the picker. */
export const labelColorClasses: Record<
  LabelColor,
  { chip: string; dot: string; swatch: string }
> = {
  rose: {
    chip: "border-rose-400/40 bg-rose-500/10 text-rose-300",
    dot: "bg-rose-400",
    swatch: "bg-rose-500",
  },
  amber: {
    chip: "border-amber-400/40 bg-amber-500/10 text-amber-300",
    dot: "bg-amber-400",
    swatch: "bg-amber-500",
  },
  emerald: {
    chip: "border-emerald-400/40 bg-emerald-500/10 text-emerald-300",
    dot: "bg-emerald-400",
    swatch: "bg-emerald-500",
  },
  sky: {
    chip: "border-sky-400/40 bg-sky-500/10 text-sky-300",
    dot: "bg-sky-400",
    swatch: "bg-sky-500",
  },
  violet: {
    chip: "border-violet/40 bg-violet/10 text-violet",
    dot: "bg-violet",
    swatch: "bg-violet",
  },
  fuchsia: {
    chip: "border-fuchsia-400/40 bg-fuchsia-500/10 text-fuchsia-300",
    dot: "bg-fuchsia-400",
    swatch: "bg-fuchsia-500",
  },
  slate: {
    chip: "border-slate-400/40 bg-slate-500/10 text-slate-300",
    dot: "bg-slate-400",
    swatch: "bg-slate-500",
  },
  orange: {
    chip: "border-orange-400/40 bg-orange-500/10 text-orange-300",
    dot: "bg-orange-400",
    swatch: "bg-orange-500",
  },
};

// ---------- Media messages (Turn 8 · Feature 3) ----------
// Inbound/outbound media beyond text + cards. Rendered inline inside chat bubbles.

export type ImageMedia = {
  kind: "image";
  url: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
};

export type AudioMedia = {
  kind: "audio";
  /** Duration in seconds. */
  duration: number;
  /** Pseudo-waveform — array of bar heights 0..1. */
  waveform: number[];
};

export type DocumentMedia = {
  kind: "document";
  filename: string;
  ext: "pdf" | "docx" | "xlsx" | "txt";
  sizeKb: number;
};

export type LocationMedia = {
  kind: "location";
  address: string;
  /** Decimal lat/lng — used only for the "Open in Maps" link. */
  lat: number;
  lng: number;
};

export type MessageMedia = ImageMedia | AudioMedia | DocumentMedia | LocationMedia;

/** Out-of-band media added to specific conversations as a demo seed. */
export const conversationMedia: Record<
  string,
  Array<{ id: string; from: "customer" | "ai" | "owner"; time: string; media: MessageMedia; text?: string }>
> = {
  c2: [
    {
      id: "med-c2-1",
      from: "customer",
      time: "6:59 PM",
      text: "Here's the venue we hosted at last year — vibe we're going for.",
      media: {
        kind: "image",
        url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=70",
        alt: "Restaurant private-dining room",
        caption: "Last year's anniversary dinner — 12 guests.",
        width: 600,
        height: 400,
      },
    },
    {
      id: "med-c2-2",
      from: "customer",
      time: "7:00 PM",
      media: {
        kind: "audio",
        duration: 18,
        waveform: [0.2, 0.5, 0.3, 0.7, 0.9, 0.6, 0.4, 0.8, 0.5, 0.3, 0.7, 0.6, 0.4, 0.5, 0.8, 0.6, 0.3, 0.5, 0.4, 0.7, 0.5, 0.3, 0.6, 0.4],
      },
    },
    {
      id: "med-c2-3",
      from: "customer",
      time: "7:00 PM",
      text: "Dietary list attached.",
      media: {
        kind: "document",
        filename: "private-dinner-dietary-2026.pdf",
        ext: "pdf",
        sizeKb: 124,
      },
    },
    {
      id: "med-c2-4",
      from: "customer",
      time: "7:01 PM",
      media: {
        kind: "location",
        address: "Hilltop Estate · Mero, Dominica",
        lat: 15.45,
        lng: -61.36,
      },
    },
  ],
};

// ---------- Message templates (Turn 8 · Feature 2) ----------
// Mock GET /api/templates. Variables use {{1}} {{2}} placeholders + smart names.

export type TemplateCategory = "Marketing" | "Utility" | "Authentication";

export type MessageTemplate = {
  id: string;
  name: string;
  category: TemplateCategory;
  language: string;
  body: string;
  /** Smart names for each {{N}} placeholder, in order. */
  variables: string[];
};

export const messageTemplates: MessageTemplate[] = [
  {
    id: "tpl-booking-reminder",
    name: "Booking reminder",
    category: "Utility",
    language: "en",
    body: "Hi {{1}}, this is a reminder about your {{2}} on {{3}}. Reply YES to confirm or RESCHEDULE if you need to change.",
    variables: ["customer_name", "service", "date_time"],
  },
  {
    id: "tpl-order-confirmation",
    name: "Order confirmation",
    category: "Utility",
    language: "en",
    body: "Hi {{1}} — your order #{{2}} is confirmed. Total: EC${{3}}. We'll message again when it's ready.",
    variables: ["customer_name", "order_id", "total_amount"],
  },
  {
    id: "tpl-welcome",
    name: "Welcome",
    category: "Marketing",
    language: "en",
    body: "Hey {{1}} 🌴 Welcome to {{2}}. We're glad to have you. Reply MENU to see what's on today.",
    variables: ["customer_name", "business_name"],
  },
  {
    id: "tpl-reengage",
    name: "Re-engagement",
    category: "Marketing",
    language: "en",
    body: "Hi {{1}}, it's been a while! Come back this {{2}} and we'll save your usual table. ✨",
    variables: ["customer_name", "weekday"],
  },
  {
    id: "tpl-payment-received",
    name: "Payment received",
    category: "Utility",
    language: "en",
    body: "Hi {{1}}, we received your payment of EC${{2}} for {{3}}. Thank you! Receipt: {{4}}",
    variables: ["customer_name", "amount", "service", "receipt_url"],
  },
];

export function renderTemplate(body: string, values: Record<number, string>): string {
  return body.replace(/\{\{(\d+)\}\}/g, (_, n) => {
    const v = values[Number(n)];
    return v && v.trim() ? v : `{{${n}}}`;
  });
}

export const pendingDrafts: PendingDraft[] = [
  {
    id: "pd1",
    conversationId: "c2",
    agentId: "ag-receptionist",
    customer: "Kareem L.",
    channel: "whatsapp",
    customerMessage: "Can you do a private dinner for 12?",
    customerTime: "7:01 PM",
    draft:
      "Hi Kareem! Private dinners for 12 are absolutely something we do — chef designs a custom 5-course tasting (EC$180/pp + drinks). Want me to lock in next Saturday provisionally while we confirm the menu?",
    draftTime: "just now",
  },
  {
    id: "pd2",
    conversationId: "c5",
    agentId: "ag-receptionist",
    customer: "Tania B.",
    channel: "messenger",
    customerMessage: "Where are you located exactly?",
    customerTime: "8:08 PM",
    draft:
      "We're at 23 Castle St, Roseau — right on the bay, opposite the cruise terminal. Free street parking on Bath Rd or a paid lot directly across (EC$5 flat). Here's a pin: maps.google.com/coalpot 📍",
    draftTime: "just now",
  },
];

// ============================================================================
// Turn 11 — Insights super-dashboard (restaurant vertical) + global alerts
// ============================================================================

export type SparkPoint = { d: string; v: number };

export const insightsMockData = {
  vertical: "restaurants" as const,
  lastSyncedMinutesAgo: 2,
  cards: {
    todaysSales: {
      amount: 3240,
      currency: "EC$",
      trendPct: 18,
      compare: "vs yesterday",
      orders: 47,
      avgTicket: 68,
      sparkline: [
        { d: "Apr 6", v: 2100 }, { d: "Apr 7", v: 2380 }, { d: "Apr 8", v: 2640 },
        { d: "Apr 9", v: 2210 }, { d: "Apr 10", v: 2890 }, { d: "Apr 11", v: 3110 },
        { d: "Apr 12", v: 3520 }, { d: "Apr 13", v: 2740 }, { d: "Apr 14", v: 2580 },
        { d: "Apr 15", v: 2950 }, { d: "Apr 16", v: 2820 }, { d: "Apr 17", v: 3060 },
        { d: "Apr 18", v: 2740 }, { d: "Apr 19", v: 3240 },
      ] as SparkPoint[],
      hourly: [
        { h: "11a", v: 180 }, { h: "12p", v: 420 }, { h: "1p", v: 510 },
        { h: "2p", v: 290 }, { h: "3p", v: 110 }, { h: "4p", v: 90 },
        { h: "5p", v: 180 }, { h: "6p", v: 360 }, { h: "7p", v: 540 },
        { h: "8p", v: 460 }, { h: "9p", v: 100 },
      ],
      topOrders: [
        { id: "O-2241", customer: "Janelle Thomas", service: "dine-in", total: 312, time: "8:14 PM" },
        { id: "O-2240", customer: "Marcus Charles", service: "dine-in", total: 248, time: "8:02 PM" },
        { id: "O-2239", customer: "Tania Bellot", service: "delivery", total: 184, time: "7:47 PM" },
        { id: "O-2238", customer: "Walk-in T.4", service: "dine-in", total: 156, time: "7:30 PM" },
        { id: "O-2237", customer: "Kareem Louis", service: "takeout", total: 92, time: "7:18 PM" },
      ],
    },
    openTabs: {
      tableCount: 6,
      total: 890,
      seatedOver45: 4,
      oldest: { table: "T.7", minutes: 83, total: 210, server: "Maria" },
      tabs: [
        { table: "T.7", minutes: 83, total: 210, server: "Maria" },
        { table: "T.3", minutes: 62, total: 178, server: "Devon" },
        { table: "T.12", minutes: 54, total: 148, server: "Maria" },
        { table: "T.5", minutes: 48, total: 132, server: "Karine" },
        { table: "T.9", minutes: 31, total: 124, server: "Devon" },
        { table: "T.2", minutes: 18, total: 98, server: "Karine" },
      ],
    },
    outstandingInvoices: {
      total: 4320,
      count: 8,
      overdue: 2,
      buckets: { d0_30: 2100, d30_60: 1440, d60p: 780 },
      invoices: [
        { id: "INV/2026/0047", customer: "Marcus Charles", amount: 1240, daysOverdue: 42, lastReminder: "5d ago", status: "overdue" },
        { id: "INV/2026/0051", customer: "Bayside Catering Co.", amount: 860, daysOverdue: 18, lastReminder: "2d ago", status: "overdue" },
        { id: "INV/2026/0058", customer: "Roseau Tours Ltd.", amount: 720, daysOverdue: 0, lastReminder: "—", status: "due" },
        { id: "INV/2026/0061", customer: "Dr. Alvarez Clinic", amount: 480, daysOverdue: 0, lastReminder: "—", status: "due" },
        { id: "INV/2026/0063", customer: "Janelle Thomas", amount: 420, daysOverdue: 0, lastReminder: "—", status: "due" },
        { id: "INV/2026/0064", customer: "Sarah Mitchell", amount: 280, daysOverdue: 0, lastReminder: "—", status: "due" },
        { id: "INV/2026/0066", customer: "Kareem Louis", amount: 180, daysOverdue: 0, lastReminder: "—", status: "due" },
        { id: "INV/2026/0067", customer: "Walk-in event", amount: 140, daysOverdue: 0, lastReminder: "—", status: "due" },
      ],
    },
    topCustomers: [
      { name: "Janelle Thomas", spent: 1240, visits: 9, segment: "VIP" },
      { name: "Marcus Charles", spent: 890, visits: 6, segment: "VIP" },
      { name: "Dr. Alvarez", spent: 720, visits: 4, segment: "Regular" },
      { name: "Sarah Mitchell", spent: 680, visits: 3, segment: "Regular" },
      { name: "Kareem Louis", spent: 540, visits: 7, segment: "Regular" },
      { name: "Tania Bellot", spent: 460, visits: 5, segment: "Regular" },
      { name: "Devon Greene", spent: 380, visits: 3, segment: "Regular" },
      { name: "Maria Joseph", spent: 320, visits: 4, segment: "Regular" },
    ],
    menuPerformance: {
      best: [
        { name: "Tasting Menu", orders: 42, revenue: 7560 },
        { name: "Lobster Thermidor", orders: 38, revenue: 5320 },
        { name: "Jerk Lamb", orders: 31, revenue: 3410 },
      ],
      worst: [
        { name: "Caesar Salad", orders: 2, revenue: 60 },
        { name: "Grilled Vegetables", orders: 3, revenue: 84 },
        { name: "Quinoa Bowl", orders: 4, revenue: 132 },
      ],
    },
    lowStock: [
      { name: "Rum punch mix", qty: 3, unit: "btl", reorderAt: 10, severity: "red", supplier: "Caribbean Spirits Ltd." },
      { name: "Bread flour", qty: 2, unit: "kg", reorderAt: 20, severity: "red", supplier: "Roseau Wholesale" },
      { name: "Lobster tails", qty: 8, unit: "ea", reorderAt: 15, severity: "amber", supplier: "Bayside Seafood" },
      { name: "Goat cheese", qty: 0.4, unit: "kg", reorderAt: 1, severity: "amber", supplier: "Mountain Dairy Co." },
    ],
    staffTips: {
      pool: 486,
      diffVsLastWeek: 62,
      servers: [
        { name: "Maria J.", share: 124, shifts: 1 },
        { name: "Devon G.", share: 108, shifts: 1 },
        { name: "Karine S.", share: 96, shifts: 1 },
        { name: "Tyrell B.", share: 84, shifts: 1 },
        { name: "Anika R.", share: 74, shifts: 1 },
      ],
      avg30d: 412,
    },
    cashBalance: {
      total: 28490,
      cashOnHand: 1240,
      bank: 27250,
      payrollDueDays: 3,
      payrollAmount: 12400,
      supplierDue: 3200,
      sparkline: [
        { d: "M", v: 24800 }, { d: "T", v: 25300 }, { d: "W", v: 26100 },
        { d: "T", v: 26450 }, { d: "F", v: 27800 }, { d: "S", v: 28200 }, { d: "S", v: 28490 },
      ] as SparkPoint[],
      transactions: [
        { kind: "deposit", label: "Fiserv batch clear", amount: 2840, time: "Today 6:02 AM" },
        { kind: "expense", label: "Bayside Seafood", amount: -780, time: "Yesterday" },
        { kind: "deposit", label: "Cash drop — Friday", amount: 1480, time: "2d ago" },
        { kind: "expense", label: "Caribbean Spirits PO #441", amount: -540, time: "3d ago" },
        { kind: "deposit", label: "Fiserv batch clear", amount: 3120, time: "3d ago" },
      ],
    },
  },
};

// ----- Hotel vertical -------------------------------------------------------

export const hotelInsightsMockData = {
  vertical: "hotels" as const,
  lastSyncedMinutesAgo: 2,
  cards: {
    // CARD 1 — RevPAR today (revenue per available room)
    revpar: {
      amount: 312, // EC$
      currency: "EC$",
      trendPct: 9,
      compare: "vs yesterday",
      occupancyPct: 78,
      adr: 400,
      sparkline: [
        { d: "Apr 6", v: 248 }, { d: "Apr 7", v: 264 }, { d: "Apr 8", v: 290 },
        { d: "Apr 9", v: 271 }, { d: "Apr 10", v: 304 }, { d: "Apr 11", v: 318 },
        { d: "Apr 12", v: 356 }, { d: "Apr 13", v: 298 }, { d: "Apr 14", v: 282 },
        { d: "Apr 15", v: 295 }, { d: "Apr 16", v: 288 }, { d: "Apr 17", v: 306 },
        { d: "Apr 18", v: 286 }, { d: "Apr 19", v: 312 },
      ] as SparkPoint[],
      hourly: [
        { h: "12a", v: 0 }, { h: "3a", v: 0 }, { h: "6a", v: 80 },
        { h: "9a", v: 220 }, { h: "12p", v: 410 }, { h: "3p", v: 540 },
        { h: "6p", v: 380 }, { h: "9p", v: 220 },
      ],
      topOrders: [
        { id: "RES-8841", customer: "Anders Family (Suite 401)", service: "5-night stay", total: 4200, time: "Check-in 3:14 PM" },
        { id: "RES-8840", customer: "Marcus Charles (Room 212)", service: "2-night stay", total: 1240, time: "Check-in 2:50 PM" },
        { id: "RES-8839", customer: "Janelle Thomas (Room 308)", service: "3-night stay", total: 1860, time: "Check-in 1:20 PM" },
        { id: "RES-8838", customer: "Kareem Louis (Room 105)", service: "1-night stay", total: 540, time: "Check-in 12:48 PM" },
        { id: "RES-8837", customer: "Devon Greene (Room 203)", service: "Day pass", total: 180, time: "10:14 AM" },
      ],
    },
    // CARD 2 — Arrivals & departures (live front desk)
    frontDesk: {
      tableCount: 14, // arrivals today
      total: 9, // departures today
      seatedOver45: 3, // arrivals not yet checked in
      oldest: { table: "RES-8842", minutes: 95, total: 2400, server: "Karine" }, // late arrival
      tabs: [
        { table: "RES-8842", minutes: 95, total: 2400, server: "Karine (front desk)" },
        { table: "RES-8841", minutes: 62, total: 4200, server: "Maria" },
        { table: "RES-8840", minutes: 48, total: 1240, server: "Devon" },
        { table: "RES-8843", minutes: 30, total: 860, server: "Karine" },
        { table: "RES-8844", minutes: 18, total: 1480, server: "Maria" },
        { table: "RES-8845", minutes: 6, total: 720, server: "Devon" },
      ],
    },
    // CARD 3 — Outstanding folios
    outstandingInvoices: {
      total: 6840,
      count: 11,
      overdue: 3,
      buckets: { d0_30: 3200, d30_60: 2240, d60p: 1400 },
      invoices: [
        { id: "FOL/2026/0091", customer: "Caribbean Tours Ltd. (Group)", amount: 2400, daysOverdue: 38, lastReminder: "4d ago", status: "overdue" },
        { id: "FOL/2026/0094", customer: "Marcus Charles (Suite 401)", amount: 1240, daysOverdue: 22, lastReminder: "2d ago", status: "overdue" },
        { id: "FOL/2026/0097", customer: "Anders Family", amount: 920, daysOverdue: 12, lastReminder: "1d ago", status: "overdue" },
        { id: "FOL/2026/0101", customer: "Bayside Wedding Co.", amount: 720, daysOverdue: 0, lastReminder: "—", status: "due" },
        { id: "FOL/2026/0103", customer: "Dr. Alvarez", amount: 540, daysOverdue: 0, lastReminder: "—", status: "due" },
        { id: "FOL/2026/0105", customer: "Janelle Thomas", amount: 480, daysOverdue: 0, lastReminder: "—", status: "due" },
        { id: "FOL/2026/0107", customer: "Sarah Mitchell", amount: 280, daysOverdue: 0, lastReminder: "—", status: "due" },
        { id: "FOL/2026/0108", customer: "Kareem Louis", amount: 180, daysOverdue: 0, lastReminder: "—", status: "due" },
      ],
    },
    // CARD 4 — Top guests (last 30 days by total folio)
    topCustomers: [
      { name: "Anders Family", spent: 4200, visits: 2, segment: "VIP repeat" },
      { name: "Caribbean Tours Ltd.", spent: 3840, visits: 4, segment: "Corporate" },
      { name: "Marcus Charles", spent: 2480, visits: 3, segment: "VIP" },
      { name: "Bayside Wedding Co.", spent: 1980, visits: 1, segment: "Group" },
      { name: "Janelle Thomas", spent: 1860, visits: 2, segment: "Repeat" },
      { name: "Dr. Alvarez", spent: 1240, visits: 2, segment: "Repeat" },
      { name: "Sarah Mitchell", spent: 920, visits: 1, segment: "New" },
      { name: "Kareem Louis", spent: 540, visits: 1, segment: "New" },
    ],
    // CARD 5 — Excursion / room-type performance
    menuPerformance: {
      best: [
        { name: "Whale-watching tour", orders: 38, revenue: 5320 },
        { name: "Ocean View Suite", orders: 24, revenue: 9600 },
        { name: "Boiling Lake hike", orders: 21, revenue: 2940 },
      ],
      worst: [
        { name: "Spa day-pass", orders: 2, revenue: 240 },
        { name: "Standard Garden room", orders: 3, revenue: 540 },
        { name: "Sunset cocktail tasting", orders: 4, revenue: 320 },
      ],
    },
    // CARD 6 — Housekeeping / amenity stock
    lowStock: [
      { name: "Premium bath towels", qty: 6, unit: "ea", reorderAt: 30, severity: "red", supplier: "Caribbean Linens" },
      { name: "Mini-bar rum (375ml)", qty: 4, unit: "btl", reorderAt: 15, severity: "red", supplier: "Caribbean Spirits Ltd." },
      { name: "King bedsheets", qty: 8, unit: "set", reorderAt: 20, severity: "amber", supplier: "Caribbean Linens" },
      { name: "Shampoo bottles", qty: 12, unit: "btl", reorderAt: 30, severity: "amber", supplier: "Roseau Wholesale" },
    ],
    // CARD 7 — Staff tips (concierge + bell + housekeeping pool)
    staffTips: {
      pool: 624,
      diffVsLastWeek: 88,
      servers: [
        { name: "Karine S. (concierge)", share: 168, shifts: 1 },
        { name: "Maria J. (front desk)", share: 142, shifts: 1 },
        { name: "Devon G. (bell)", share: 124, shifts: 1 },
        { name: "Tyrell B. (housekeeping)", share: 102, shifts: 1 },
        { name: "Anika R. (concierge)", share: 88, shifts: 1 },
      ],
      avg30d: 540,
    },
    // CARD 8 — Cash + bank
    cashBalance: {
      total: 64200,
      cashOnHand: 2400,
      bank: 61800,
      payrollDueDays: 5,
      payrollAmount: 28400,
      supplierDue: 6800,
      sparkline: [
        { d: "M", v: 58200 }, { d: "T", v: 59400 }, { d: "W", v: 60800 },
        { d: "T", v: 61500 }, { d: "F", v: 62800 }, { d: "S", v: 63600 }, { d: "S", v: 64200 },
      ] as SparkPoint[],
      transactions: [
        { kind: "deposit", label: "Fiserv batch clear (folio settlements)", amount: 4820, time: "Today 6:02 AM" },
        { kind: "expense", label: "Caribbean Linens", amount: -1240, time: "Yesterday" },
        { kind: "deposit", label: "Group deposit — Bayside Wedding", amount: 2400, time: "2d ago" },
        { kind: "expense", label: "Mountain Dairy (breakfast supply)", amount: -680, time: "3d ago" },
        { kind: "deposit", label: "Fiserv batch clear", amount: 5320, time: "3d ago" },
      ],
    },
  },
};

// ----- Clinic vertical ------------------------------------------------------

export const clinicInsightsMockData = {
  vertical: "clinics" as const,
  lastSyncedMinutesAgo: 2,
  cards: {
    // CARD 1 — Appointments today (revenue + count + avg consult)
    appointments: {
      amount: 2840, // EC$ billed today
      currency: "EC$",
      trendPct: 12,
      compare: "vs yesterday",
      orders: 28, // appointments
      avgTicket: 102, // avg per consult
      sparkline: [
        { d: "Apr 6", v: 1980 }, { d: "Apr 7", v: 2160 }, { d: "Apr 8", v: 2380 },
        { d: "Apr 9", v: 2040 }, { d: "Apr 10", v: 2540 }, { d: "Apr 11", v: 2720 },
        { d: "Apr 12", v: 0 }, { d: "Apr 13", v: 0 }, { d: "Apr 14", v: 2480 },
        { d: "Apr 15", v: 2620 }, { d: "Apr 16", v: 2580 }, { d: "Apr 17", v: 2760 },
        { d: "Apr 18", v: 2540 }, { d: "Apr 19", v: 2840 },
      ] as SparkPoint[],
      hourly: [
        { h: "8a", v: 320 }, { h: "9a", v: 420 }, { h: "10a", v: 380 },
        { h: "11a", v: 410 }, { h: "12p", v: 180 }, { h: "1p", v: 90 },
        { h: "2p", v: 360 }, { h: "3p", v: 320 }, { h: "4p", v: 280 },
        { h: "5p", v: 80 },
      ],
      topOrders: [
        { id: "APT-3341", customer: "Janelle Thomas", service: "Annual physical", total: 240, time: "9:00 AM" },
        { id: "APT-3342", customer: "Marcus Charles (peds)", service: "Vaccination", total: 180, time: "9:30 AM" },
        { id: "APT-3343", customer: "Sarah Mitchell", service: "Follow-up consult", total: 120, time: "10:15 AM" },
        { id: "APT-3344", customer: "Kareem Louis", service: "Lab review", total: 90, time: "11:00 AM" },
        { id: "APT-3345", customer: "Devon Greene", service: "Telehealth consult", total: 80, time: "2:30 PM" },
      ],
    },
    // CARD 2 — No-show rate (today's at-risk slots)
    noShows: {
      tableCount: 4, // at-risk slots today
      total: 480, // potential revenue at risk EC$
      seatedOver45: 2, // unconfirmed within 4h of slot
      oldest: { table: "APT-3360", minutes: 185, total: 240, server: "Dr. Alvarez" },
      tabs: [
        { table: "APT-3360 (3:30 PM)", minutes: 185, total: 240, server: "Dr. Alvarez · annual physical" },
        { table: "APT-3358 (2:45 PM)", minutes: 120, total: 120, server: "Dr. Phillip · follow-up" },
        { table: "APT-3355 (2:00 PM)", minutes: 75, total: 80, server: "Dr. Alvarez · telehealth" },
        { table: "APT-3354 (1:30 PM)", minutes: 45, total: 40, server: "Nurse Karine · vitals only" },
      ],
    },
    // CARD 3 — Outstanding co-pays & insurance claims
    outstandingInvoices: {
      total: 5240,
      count: 14,
      overdue: 4,
      buckets: { d0_30: 2400, d30_60: 1840, d60p: 1000 },
      invoices: [
        { id: "INV/PT/0042", customer: "BlueCross claim · Marcus Charles", amount: 1240, daysOverdue: 52, lastReminder: "7d ago", status: "overdue" },
        { id: "INV/PT/0048", customer: "Sagicor claim · Janelle Thomas", amount: 860, daysOverdue: 28, lastReminder: "3d ago", status: "overdue" },
        { id: "INV/PT/0051", customer: "Co-pay · Sarah Mitchell", amount: 280, daysOverdue: 14, lastReminder: "2d ago", status: "overdue" },
        { id: "INV/PT/0054", customer: "Co-pay · Kareem Louis", amount: 180, daysOverdue: 8, lastReminder: "1d ago", status: "overdue" },
        { id: "INV/PT/0058", customer: "Co-pay · Tania Bellot", amount: 240, daysOverdue: 0, lastReminder: "—", status: "due" },
        { id: "INV/PT/0061", customer: "Co-pay · Devon Greene", amount: 180, daysOverdue: 0, lastReminder: "—", status: "due" },
        { id: "INV/PT/0063", customer: "BlueCross claim · Dr. Alvarez fam", amount: 540, daysOverdue: 0, lastReminder: "—", status: "due" },
        { id: "INV/PT/0064", customer: "Co-pay · Anders Family", amount: 120, daysOverdue: 0, lastReminder: "—", status: "due" },
      ],
    },
    // CARD 4 — Top patients (last 30 days)
    topCustomers: [
      { name: "Janelle Thomas", spent: 1240, visits: 6, segment: "Chronic care" },
      { name: "Marcus Charles fam", spent: 980, visits: 5, segment: "Family plan" },
      { name: "Sarah Mitchell", spent: 720, visits: 4, segment: "Regular" },
      { name: "Anders Family", spent: 680, visits: 4, segment: "Family plan" },
      { name: "Kareem Louis", spent: 540, visits: 3, segment: "Regular" },
      { name: "Tania Bellot", spent: 420, visits: 3, segment: "Regular" },
      { name: "Devon Greene", spent: 320, visits: 2, segment: "New" },
      { name: "Maria Joseph", spent: 280, visits: 2, segment: "New" },
    ],
    // CARD 5 — Service performance (best & worst-billed services)
    menuPerformance: {
      best: [
        { name: "Annual physical", orders: 42, revenue: 10080 },
        { name: "Vaccination panel", orders: 36, revenue: 6480 },
        { name: "Telehealth consult", orders: 31, revenue: 2480 },
      ],
      worst: [
        { name: "Allergy panel", orders: 2, revenue: 360 },
        { name: "Sports physical", orders: 3, revenue: 540 },
        { name: "Dietitian consult", orders: 4, revenue: 480 },
      ],
    },
    // CARD 6 — Low supplies (vaccines, PPE, lab)
    lowStock: [
      { name: "MMR vaccine doses", qty: 4, unit: "dose", reorderAt: 20, severity: "red", supplier: "Caribbean MedSupply" },
      { name: "Nitrile gloves (M)", qty: 1, unit: "box", reorderAt: 8, severity: "red", supplier: "Roseau Medical" },
      { name: "Lab vacutainers", qty: 18, unit: "ea", reorderAt: 50, severity: "amber", supplier: "Caribbean MedSupply" },
      { name: "Saline IV bags", qty: 6, unit: "bag", reorderAt: 15, severity: "amber", supplier: "Roseau Medical" },
    ],
    // CARD 7 — Staff payroll (provider + nurse hours)
    staffTips: {
      pool: 1840, // today's billable provider hours $
      diffVsLastWeek: 220,
      servers: [
        { name: "Dr. Alvarez", share: 720, shifts: 1 },
        { name: "Dr. Phillip", share: 540, shifts: 1 },
        { name: "Nurse Karine", share: 280, shifts: 1 },
        { name: "Nurse Tyrell", share: 180, shifts: 1 },
        { name: "Reception · Anika", share: 120, shifts: 1 },
      ],
      avg30d: 1620,
    },
    // CARD 8 — Cash + bank
    cashBalance: {
      total: 42800,
      cashOnHand: 1820,
      bank: 40980,
      payrollDueDays: 4,
      payrollAmount: 18600,
      supplierDue: 4200,
      sparkline: [
        { d: "M", v: 38400 }, { d: "T", v: 39200 }, { d: "W", v: 40100 },
        { d: "T", v: 40850 }, { d: "F", v: 41600 }, { d: "S", v: 42200 }, { d: "S", v: 42800 },
      ] as SparkPoint[],
      transactions: [
        { kind: "deposit", label: "BlueCross claim batch settled", amount: 3840, time: "Today 7:14 AM" },
        { kind: "expense", label: "Caribbean MedSupply", amount: -1180, time: "Yesterday" },
        { kind: "deposit", label: "Patient co-pays — Friday", amount: 1240, time: "2d ago" },
        { kind: "expense", label: "Roseau Medical (PPE)", amount: -640, time: "3d ago" },
        { kind: "deposit", label: "Sagicor claim batch settled", amount: 2820, time: "3d ago" },
      ],
    },
  },
};

// Vertical → dataset map. Page reads from this based on dropdown.
export const insightsByVertical = {
  restaurants: insightsMockData,
  hotels: hotelInsightsMockData,
  clinics: clinicInsightsMockData,
} as const;

export type InsightsVertical = keyof typeof insightsByVertical;

// ----- Global alert tray -----------------------------------------------------

export type AlertCategory = "critical" | "escalation" | "system" | "ema" | "snoozed";
export type AlertItem = {
  id: string;
  category: AlertCategory;
  icon: string;
  title: string;
  body?: string;
  createdAt: string; // relative label
  read: boolean;
  actions: Array<"review" | "dismiss" | "snooze" | "ask-ema" | "takeover" | "call">;
};

export const globalAlerts: AlertItem[] = [
  {
    id: "al-1",
    category: "critical",
    icon: "🚨",
    title: "Meta quality dropped to AMBER on +1 (767) 818-1234 (Maxine)",
    body: "4 customer blocks in 24h. Review conversations to recover quality score.",
    createdAt: "12 min ago",
    read: false,
    actions: ["review", "ask-ema", "snooze"],
  },
  {
    id: "al-2",
    category: "critical",
    icon: "🚨",
    title: "Voice overage in 3 days — 78% of 500 min used",
    body: "At current pace you'll exceed your plan minutes by Saturday. Top up now to avoid throttling.",
    createdAt: "34 min ago",
    read: false,
    actions: ["review", "dismiss", "snooze"],
  },
  {
    id: "al-3",
    category: "escalation",
    icon: "⚠️",
    title: "Marcus Charles flagged 'frustrated' in WhatsApp thread",
    body: "3h since last reply. Sentiment trending negative across last 4 turns.",
    createdAt: "1h ago",
    read: false,
    actions: ["takeover", "ask-ema", "snooze"],
  },
  {
    id: "al-4",
    category: "escalation",
    icon: "⚠️",
    title: "Booking 8pm tonight (party of 6) unconfirmed",
    body: "Outbound voice attempted 2x — no answer. Manual call recommended.",
    createdAt: "2h ago",
    read: false,
    actions: ["call", "dismiss", "snooze"],
  },
  {
    id: "al-5",
    category: "escalation",
    icon: "⚠️",
    title: "Odoo invoice INV/2026/0047 overdue 42 days",
    body: "Marcus Charles · EC$1,240 · last reminder sent 5 days ago.",
    createdAt: "3h ago",
    read: false,
    actions: ["review", "ask-ema", "snooze"],
  },
  {
    id: "al-6",
    category: "system",
    icon: "ℹ️",
    title: "New tenant sign-up: Bayside Café",
    body: "Provisioning 80% complete (awaiting Meta verification).",
    createdAt: "4h ago",
    read: true,
    actions: ["review", "dismiss"],
  },
  {
    id: "al-7",
    category: "system",
    icon: "ℹ️",
    title: "DID +1 (767) 818-1239 allocated from Magnus pool",
    body: "Assigned to Bayside Café. Voice routing active.",
    createdAt: "4h ago",
    read: true,
    actions: ["dismiss"],
  },
  {
    id: "al-8",
    category: "system",
    icon: "ℹ️",
    title: "Odoo poll completed",
    body: "12 new invoices synced · 3 products updated · 0 conflicts.",
    createdAt: "6h ago",
    read: true,
    actions: ["dismiss"],
  },
  {
    id: "al-9",
    category: "system",
    icon: "ℹ️",
    title: "Fiserv gateway health: 180ms",
    body: "All clearing channels green. No declined-card spikes detected.",
    createdAt: "7h ago",
    read: true,
    actions: ["dismiss"],
  },
  {
    id: "al-10",
    category: "ema",
    icon: "✨",
    title: "Your regulars haven't been in for 2+ weeks",
    body: "Janelle, Marcus, Dr. Alvarez. Want a win-back WhatsApp campaign?",
    createdAt: "8h ago",
    read: false,
    actions: ["ask-ema", "dismiss", "snooze"],
  },
  {
    id: "al-11",
    category: "ema",
    icon: "✨",
    title: "Sunday dinner orders up 34% vs last Sunday",
    body: "Consider adding Sunday specials to your WhatsApp template library.",
    createdAt: "yesterday",
    read: false,
    actions: ["ask-ema", "dismiss"],
  },
  {
    id: "al-12",
    category: "snoozed",
    icon: "😴",
    title: "Low stock: Rum punch mix",
    body: "Snoozed until Monday 9:00 AM.",
    createdAt: "yesterday",
    read: true,
    actions: ["review", "dismiss"],
  },
];

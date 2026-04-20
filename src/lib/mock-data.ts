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
  { icon: "Phone", title: "24/7 WhatsApp answering", desc: "Never miss a message — every customer gets a reply in under 3 seconds." },
  { icon: "PhoneCall", title: "Voice calls via WhatsApp", desc: "AI receptionist on WhatsApp Business Calling, routes to your team." },
  { icon: "Instagram", title: "Instagram DMs & comments", desc: "Stories, comments, and DMs handled — Pro tier." },
  { icon: "MessageCircle", title: "Facebook Messenger", desc: "Page messages answered automatically — Pro tier." },
  { icon: "Calendar", title: "Bookings captured", desc: "Reservations, appointments, room nights — straight to your calendar." },
  { icon: "Sparkles", title: "Ema, your AI chief-of-staff", desc: "Daily digests, reports, and commands — over WhatsApp." },
] as const;

export const testimonials = [
  {
    name: "Marcus Joseph",
    role: "Chef-Owner, Coalpot Restaurant",
    location: "Roseau, Dominica",
    quote: "We captured 30% more reservations in month one. Isola never sleeps and never says the wrong thing about our menu.",
  },
  {
    name: "Janelle Rose",
    role: "GM, Fort Young Hotel",
    location: "Roseau, Dominica",
    quote: "Guest satisfaction jumped 15 points. Late-night booking questions are no longer a problem.",
  },
  {
    name: "Dr. Alvarez",
    role: "Founder, Pediatric Clinic",
    location: "Castries, Saint Lucia",
    quote: "We added 40 appointments per week without adding any staff. Ema's morning digest tells me everything.",
  },
];

export const faqs = [
  { q: "Does it work in Caribbean Creole / French / Spanish?", a: "Yes. Isola handles English, Kwéyòl, French, and Spanish out of the box." },
  { q: "How fast can we go live?", a: "Most businesses are live within 48 hours of signup, including WhatsApp Business verification." },
  { q: "What happens if the AI doesn't know the answer?", a: "It escalates to you on WhatsApp instantly with full context, and Ema follows up if you're unavailable." },
  { q: "Do I keep my existing phone number?", a: "We provision a new WhatsApp Business number for your customers and a separate one for Ema (your private line)." },
  { q: "Can it take payments?", a: "Yes — Stripe integration on Pro and Business tiers, with deposits and full payment links." },
  { q: "Is my customer data safe?", a: "All data is encrypted at rest and in transit, hosted in compliance with GDPR and Caribbean data laws." },
];

export const pricingTiers = [
  {
    name: "Starter",
    price: 149,
    annual: 119,
    badge: null,
    desc: "For solo operators getting started.",
    features: ["1 WhatsApp number", "100 voice minutes/mo", "WhatsApp only", "Ema chief-of-staff", "Email support"],
    cta: "Start free trial",
  },
  {
    name: "Pro",
    price: 249,
    annual: 199,
    badge: "Most Popular",
    desc: "For growing teams across channels.",
    features: ["1 WhatsApp number", "500 voice minutes/mo", "WhatsApp + IG + FB + Voice", "Ema chief-of-staff", "Priority support", "Stripe payments"],
    cta: "Start free trial",
  },
  {
    name: "Business",
    price: 449,
    annual: 359,
    badge: null,
    desc: "For multi-location operations.",
    features: ["3 WhatsApp numbers", "Unlimited voice minutes", "All channels + custom integrations", "Ema chief-of-staff", "Dedicated success manager", "Custom workflows"],
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

export type Channel = "whatsapp" | "voice" | "instagram" | "messenger";

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
      "Confirmed ✓ See you tomorrow at 6:30!",
      "All set — table for 2, tomorrow 6:30 PM. Anything special I should note?",
      "Lovely. Want me to set aside our window table tomorrow?",
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
  c6: { status: "resolved", labels: ["lb-booking"], hoursSinceLastInbound: 0.4 },
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

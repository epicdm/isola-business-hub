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

export type Channel = "whatsapp" | "voice" | "instagram" | "messenger";

"use client";

import { useState } from "react";
import {
  Sparkles,
  Save,
  Clock,
  AlertTriangle,
  MessageSquare,
  Languages,
  Bell,
  Phone,
  Zap,
} from "lucide-react";
import DashboardLayout from "../../layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const tones = ["Warm & friendly", "Professional", "Playful", "Direct"];
const digestTimes = ["6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM"];

export default function EmaSettingsPage() {
  // Local state — pure UI, no persistence
  const [tone, setTone] = useState("Warm & friendly");
  const [responseSpeed, setResponseSpeed] = useState([3]); // 1-5: deliberate → instant
  const [emojiLevel, setEmojiLevel] = useState([2]); // 0-5
  const [proactivity, setProactivity] = useState([4]); // how often Ema volunteers info
  const [autoReply, setAutoReply] = useState(true);
  const [escalateAfterMin, setEscalateAfterMin] = useState([5]);
  const [escalateOnComplaint, setEscalateOnComplaint] = useState(true);
  const [escalateOnVip, setEscalateOnVip] = useState(true);
  const [escalateOnLargeParty, setEscalateOnLargeParty] = useState(true);
  const [largePartySize, setLargePartySize] = useState("8");
  const [dailyDigest, setDailyDigest] = useState(true);
  const [digestTime, setDigestTime] = useState("7:00 AM");
  const [weeklyRecap, setWeeklyRecap] = useState(true);
  const [campaignAlerts, setCampaignAlerts] = useState(true);
  const [languages, setLanguages] = useState({ english: true, kweyol: true, french: false, spanish: false });
  const [systemPrompt, setSystemPrompt] = useState(
    "You are Coalpot Restaurant's AI receptionist. Warm, Caribbean hospitality. Always confirm reservations with date, time, and party size. If asked about menu items not in the catalog, say you'll check with the chef.",
  );
  const [signature, setSignature] = useState("— sent by Ema 🌴");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardLayout currentPath="/dashboard/ema/settings">
      <div className="px-6 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-ema shadow-ema">
              <Sparkles className="h-5 w-5 text-ema-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold leading-tight">Configure Ema</h1>
              <p className="text-sm text-muted-foreground">Tone, escalation rules, digests, and language.</p>
            </div>
          </div>
          <Button onClick={handleSave} className="bg-gradient-primary text-primary-foreground">
            <Save className="h-3.5 w-3.5" /> {saved ? "Saved ✓" : "Save changes"}
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column — main settings */}
          <div className="space-y-6 lg:col-span-2">
            {/* Personality */}
            <Section icon={MessageSquare} title="Personality" subtitle="How Ema sounds when she replies.">
              <Field label="Tone of voice">
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger><SelectValue placeholder="Select tone" /></SelectTrigger>
                  <SelectContent>
                    {tones.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>

              <SliderField
                label="Response speed"
                hint={["Considered", "Quick"]}
                value={responseSpeed}
                onChange={setResponseSpeed}
                max={5}
              />
              <SliderField
                label="Emoji usage"
                hint={["None", "Lots 🎉"]}
                value={emojiLevel}
                onChange={setEmojiLevel}
                max={5}
              />
              <SliderField
                label="Proactivity"
                hint={["Reactive only", "Volunteers ideas"]}
                value={proactivity}
                onChange={setProactivity}
                max={5}
              />

              <Field label="System prompt" hint="Ema's core instructions. Be specific about your brand.">
                <Textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  rows={5}
                  className="resize-none"
                />
              </Field>

              <Field label="Signature">
                <Input value={signature} onChange={(e) => setSignature(e.target.value)} />
              </Field>
            </Section>

            {/* Escalation rules */}
            <Section icon={AlertTriangle} title="Escalation rules" subtitle="When Ema should hand a conversation to you.">
              <ToggleRow
                label="Auto-reply enabled"
                desc="Turn off to send everything to you instead."
                checked={autoReply}
                onChange={setAutoReply}
              />

              <SliderField
                label="Escalate after no response for"
                hint={[`${escalateAfterMin[0]} min`, ""]}
                value={escalateAfterMin}
                onChange={setEscalateAfterMin}
                max={30}
                min={1}
                step={1}
              />

              <ToggleRow
                label="Escalate on complaint detection"
                desc="Words like 'unhappy', 'refund', 'manager' trigger a handoff."
                checked={escalateOnComplaint}
                onChange={setEscalateOnComplaint}
              />
              <ToggleRow
                label="Escalate VIP customers"
                desc="Anyone tagged VIP gets routed to you for a personal touch."
                checked={escalateOnVip}
                onChange={setEscalateOnVip}
              />

              <ToggleRow
                label="Escalate large party requests"
                desc="Bookings above the size below need your approval."
                checked={escalateOnLargeParty}
                onChange={setEscalateOnLargeParty}
              />
              {escalateOnLargeParty && (
                <Field label="Large party threshold">
                  <Input
                    type="number"
                    value={largePartySize}
                    onChange={(e) => setLargePartySize(e.target.value)}
                    className="max-w-32"
                  />
                </Field>
              )}
            </Section>

            {/* Digests */}
            <Section icon={Bell} title="Digests & reports" subtitle="When and how Ema briefs you.">
              <ToggleRow
                label="Daily morning digest"
                desc="A WhatsApp message every morning summarizing the prior day."
                checked={dailyDigest}
                onChange={setDailyDigest}
              />
              {dailyDigest && (
                <Field label="Digest delivery time">
                  <Select value={digestTime} onValueChange={setDigestTime}>
                    <SelectTrigger className="max-w-40"><SelectValue placeholder="Pick a time" /></SelectTrigger>
                    <SelectContent>
                      {digestTimes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
              )}
              <ToggleRow
                label="Weekly recap (Sunday)"
                desc="Revenue, top guests, channel breakdown."
                checked={weeklyRecap}
                onChange={setWeeklyRecap}
              />
              <ToggleRow
                label="Campaign result alerts"
                desc="Ema messages you when a campaign hits its targets."
                checked={campaignAlerts}
                onChange={setCampaignAlerts}
              />
            </Section>

            {/* Languages */}
            <Section icon={Languages} title="Languages" subtitle="Ema auto-detects, but you can limit her to specific ones.">
              <div className="grid gap-3 sm:grid-cols-2">
                <ToggleRow label="English" checked={languages.english} onChange={(v) => setLanguages({ ...languages, english: v })} compact />
                <ToggleRow label="Kwéyòl (Creole)" checked={languages.kweyol} onChange={(v) => setLanguages({ ...languages, kweyol: v })} compact />
                <ToggleRow label="Français" checked={languages.french} onChange={(v) => setLanguages({ ...languages, french: v })} compact />
                <ToggleRow label="Español" checked={languages.spanish} onChange={(v) => setLanguages({ ...languages, spanish: v })} compact />
              </div>
            </Section>
          </div>

          {/* Right column — status + tips */}
          <div className="space-y-6">
            <Card className="border-ema/30 bg-ema/5 p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-ema">
                  <Sparkles className="h-4 w-4 text-ema-foreground" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Ema is live</div>
                  <div className="text-xs text-muted-foreground">Reachable on +1 767 555 0142</div>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <Stat label="Conversations handled" value="1,284" />
                <Stat label="Avg response time" value="2.4s" />
                <Stat label="Escalations this week" value="4" />
                <Stat label="Customer satisfaction" value="94%" highlight />
              </div>
            </Card>

            <Card className="border-border/40 bg-card/60 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <div className="text-sm font-semibold">Test Ema</div>
              </div>
              <p className="mb-3 text-xs text-muted-foreground">
                Send a test message to your own WhatsApp to preview how Ema sounds with these settings.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <Zap className="h-3.5 w-3.5" /> Send test message
              </Button>
            </Card>

            <Card className="border-border/40 bg-card/60 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-warning" />
                <div className="text-sm font-semibold">Quiet hours</div>
              </div>
              <p className="mb-3 text-xs text-muted-foreground">
                Ema replies 24/7 by default. Set quiet hours to send "we'll be back at X" messages overnight.
              </p>
              <Badge variant="outline" className="border-warning/30 bg-warning/10 text-warning">
                Not configured
              </Badge>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Section({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: typeof MessageSquare;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-border/40 bg-card/60 p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h2 className="font-display text-base font-semibold">{title}</h2>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-5">{children}</div>
    </Card>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground/80">{hint}</p>}
    </div>
  );
}

function SliderField({
  label,
  hint,
  value,
  onChange,
  max,
  min = 0,
  step = 1,
}: {
  label: string;
  hint: [string, string];
  value: number[];
  onChange: (v: number[]) => void;
  max: number;
  min?: number;
  step?: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</Label>
        <span className="text-xs font-semibold text-primary">{value[0]}</span>
      </div>
      <Slider value={value} onValueChange={onChange} max={max} min={min} step={step} />
      <div className="flex justify-between text-[10px] text-muted-foreground/70">
        <span>{hint[0]}</span>
        <span>{hint[1]}</span>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  desc,
  checked,
  onChange,
  compact = false,
}: {
  label: string;
  desc?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  compact?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between gap-4 ${compact ? "" : "border-b border-border/30 pb-4 last:border-0 last:pb-0"}`}>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium">{label}</div>
        {desc && <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function Stat({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border/20 py-1.5 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-semibold ${highlight ? "text-ema" : "text-foreground"}`}>{value}</span>
    </div>
  );
}

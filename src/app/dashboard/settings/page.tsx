"use client";

import { useState } from "react";
import {
  Settings as SettingsIcon,
  User,
  Building2,
  Globe,
  MessageSquare,
  Users,
  Shield,
  Plus,
} from "lucide-react";
import DashboardLayout from "../layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { accountDefaults, teamMembers } from "@/lib/mock-data";

const tones = ["Warm & friendly", "Professional", "Playful", "Direct"];
const timezones = [
  "America/Dominica (AST)",
  "America/New_York (EST)",
  "America/Port_of_Spain (AST)",
  "Europe/London (GMT)",
];
const currencies = ["XCD — East Caribbean Dollar", "USD — US Dollar", "EUR — Euro"];

export default function SettingsPage() {
  const [businessName, setBusinessName] = useState(accountDefaults.businessName);
  const [ownerName, setOwnerName] = useState(accountDefaults.ownerName);
  const [email, setEmail] = useState(accountDefaults.email);
  const [phone, setPhone] = useState(accountDefaults.phone);
  const [timezone, setTimezone] = useState(accountDefaults.timezone);
  const [currency, setCurrency] = useState(accountDefaults.currency);
  const [tone, setTone] = useState(accountDefaults.toneOfVoice);
  const [brandVoice, setBrandVoice] = useState(accountDefaults.brandVoice);

  return (
    <DashboardLayout currentPath="/dashboard/settings">
      <div className="px-6 py-8 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
              <SettingsIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold leading-tight">Settings</h1>
              <p className="text-sm text-muted-foreground">
                Account, team, and brand voice.
              </p>
            </div>
          </div>
          <Button size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
            Save changes
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {/* Business */}
            <Section icon={Building2} title="Business" subtitle="Public-facing details Ema uses in replies.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Business name">
                  <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
                </Field>
                <Field label="Phone">
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                </Field>
                <Field label="Timezone">
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pick a timezone">{timezone}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Currency">
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pick a currency">{currency}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </Section>

            {/* Account */}
            <Section icon={User} title="Account" subtitle="Your owner profile and login.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name">
                  <Input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
                </Field>
                <Field label="Email">
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </Field>
              </div>
              <Button variant="outline" size="sm" className="mt-2">
                Change password
              </Button>
            </Section>

            {/* Brand voice */}
            <Section
              icon={MessageSquare}
              title="Tone of voice"
              subtitle="How Ema and the AI inbox sound when replying to customers."
            >
              <Field label="Default tone">
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pick a tone">{tone}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field
                label="Brand voice notes"
                hint="Specifics beat clever. Tell Ema how you sound — slang, do's, don'ts."
              >
                <Textarea
                  value={brandVoice}
                  onChange={(e) => setBrandVoice(e.target.value)}
                  className="min-h-[100px]"
                />
              </Field>
            </Section>

            {/* Team */}
            <Section icon={Users} title="Team" subtitle="People with access to this Isola workspace.">
              <div className="space-y-2">
                {teamMembers.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between gap-3 rounded-md border border-border/40 bg-background/40 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-xs font-semibold">
                        {m.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{m.name}</div>
                        <div className="text-xs text-muted-foreground">{m.email}</div>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        m.role === "Owner"
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border/60 text-muted-foreground"
                      }`}
                    >
                      {m.role}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-3">
                <Plus className="h-3.5 w-3.5" /> Invite teammate
              </Button>
            </Section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <Card className="border-border/40 bg-card/40 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                <h3 className="font-display text-sm font-semibold">Languages</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["English", "Kwéyòl", "French", "Spanish"].map((lang) => (
                  <Badge
                    key={lang}
                    variant="outline"
                    className="border-primary/30 bg-primary/10 text-[10px] text-primary"
                  >
                    {lang}
                  </Badge>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Ema auto-detects the customer's language.
              </p>
            </Card>

            <Card className="border-destructive/30 bg-destructive/5 p-5">
              <div className="mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4 text-destructive" />
                <h3 className="font-display text-sm font-semibold">Danger zone</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Permanently delete this workspace and all of its data. This cannot be undone.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-3 w-full border-destructive/40 text-destructive hover:bg-destructive/10"
              >
                Delete workspace
              </Button>
            </Card>
          </aside>
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
  icon: typeof User;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-border/40 bg-card/40 p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </Card>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground/80">{hint}</p>}
    </div>
  );
}

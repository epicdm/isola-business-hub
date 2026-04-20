"use client";

import { useEffect, useRef, useState } from "react";
import {
  Settings as SettingsIcon,
  Building2,
  Sparkles,
  Bell,
  User,
  Upload,
  X,
  LogOut,
  Trash2,
  ShieldAlert,
  Tag,
  Pencil,
  Plus,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import DashboardLayout from "../layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { accountDefaults, tenantLabels as seedLabels, labelPalette, labelColorClasses, type LabelDef, type LabelColor } from "@/lib/mock-data";
import { clearProfile, readProfile } from "@/lib/profile";

const verticals = ["Restaurant", "Hotel", "Clinic", "Tour operator", "Retail", "Other"];
const TONE_LABELS = ["Formal", "Balanced", "Casual"];
const TONE_HINTS = [
  "Polished, complete sentences. 'Good evening, how may we assist?'",
  "Warm but professional. The default — works for most businesses.",
  "Conversational, emoji ok. 'Hey 👋 what can I get sorted for ya?'",
];

const LOGO_KEY = "isola.business.logo";

export default function SettingsPage() {
  const navigate = useNavigate();

  // Business
  const [businessName, setBusinessName] = useState(accountDefaults.businessName);
  const [vertical, setVertical] = useState("Restaurant");
  const [location, setLocation] = useState("Roseau, Dominica");
  const [logo, setLogo] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Agent personality
  const [toneIdx, setToneIdx] = useState(1);
  const [welcome, setWelcome] = useState(
    "Hi 👋 thanks for messaging Coalpot. How can we help today?",
  );
  const [escalationKeywords, setEscalationKeywords] = useState<string[]>([
    "manager",
    "complaint",
    "refund",
    "urgent",
  ]);
  const [keywordDraft, setKeywordDraft] = useState("");
  const [escalationPhone, setEscalationPhone] = useState("+1 767 245 7811");

  // Notifications
  const [pushEnabled, setPushEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [digestWa, setDigestWa] = useState(true);

  // Account
  const [ownerEmail, setOwnerEmail] = useState(accountDefaults.email);
  const [ownerName, setOwnerName] = useState(accountDefaults.ownerName);
  const [pwOpen, setPwOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [delStep, setDelStep] = useState<1 | 2>(1);
  const [delConfirm, setDelConfirm] = useState("");

  // ---- Labels CRUD (Section 6) ----
  const [labels, setLabels] = useState<LabelDef[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem("isola.labels");
        if (raw) return JSON.parse(raw) as LabelDef[];
      } catch {
        /* ignore */
      }
    }
    return seedLabels;
  });
  const [labelDialogOpen, setLabelDialogOpen] = useState(false);
  const [editingLabel, setEditingLabel] = useState<LabelDef | null>(null);
  const [labelDraftName, setLabelDraftName] = useState("");
  const [labelDraftColor, setLabelDraftColor] = useState<LabelColor>("emerald");
  const [confirmDeleteLabel, setConfirmDeleteLabel] = useState<LabelDef | null>(null);

  // Persist labels — inbox re-reads on focus/storage events.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("isola.labels", JSON.stringify(labels));
      // Notify same-tab listeners (storage event only fires across tabs).
      window.dispatchEvent(new Event("storage"));
    } catch {
      /* ignore */
    }
  }, [labels]);

  useEffect(() => {
    const p = readProfile();
    if (p.businessName) setBusinessName(p.businessName);
    if (p.contactName) setOwnerName(p.contactName);
    if (p.email) setOwnerEmail(p.email);
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem(LOGO_KEY);
      if (saved) setLogo(saved);
    }
  }, []);

  const onLogoPick = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      setLogo(dataUrl);
      try {
        window.localStorage.setItem(LOGO_KEY, dataUrl);
      } catch {
        /* quota — ignore */
      }
      toast.success("Logo updated");
    };
    reader.readAsDataURL(file);
  };

  const addKeyword = () => {
    const k = keywordDraft.trim().toLowerCase();
    if (!k || escalationKeywords.includes(k)) return;
    setEscalationKeywords([...escalationKeywords, k]);
    setKeywordDraft("");
  };

  const requestPushPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      toast.error("Browser push not supported");
      return;
    }
    try {
      const result = await Notification.requestPermission();
      const granted = result === "granted";
      setPushEnabled(granted);
      toast[granted ? "success" : "error"](
        granted ? "Push notifications enabled" : "Push permission denied",
      );
    } catch {
      toast.error("Couldn't request permission");
    }
  };

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("mockLoggedIn");
    }
    clearProfile();
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  const handleDelete = () => {
    if (delStep === 1) {
      setDelStep(2);
      return;
    }
    if (delConfirm !== "DELETE") {
      toast.error("Type DELETE to confirm");
      return;
    }
    if (typeof window !== "undefined") {
      window.localStorage.clear();
    }
    toast.success("Account deleted (mock)");
    setDelOpen(false);
    navigate({ to: "/" });
  };

  return (
    <DashboardLayout currentPath="/dashboard/settings">
      <div className="px-6 py-8 lg:px-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
            <SettingsIcon className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold leading-tight">Settings</h1>
            <p className="text-sm text-muted-foreground">
              Business, agent personality, notifications, and account.
            </p>
          </div>
        </div>

        <Tabs defaultValue="business" className="w-full">
          <TabsList className="mb-6 w-full justify-start overflow-x-auto">
            <TabsTrigger value="business">
              <Building2 className="h-3.5 w-3.5" /> Business Info
            </TabsTrigger>
            <TabsTrigger value="agent">
              <Sparkles className="h-3.5 w-3.5" /> Agent Personality
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-3.5 w-3.5" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="labels">
              <Tag className="h-3.5 w-3.5" /> Labels
            </TabsTrigger>
            <TabsTrigger value="account">
              <User className="h-3.5 w-3.5" /> Account
            </TabsTrigger>
          </TabsList>

          {/* BUSINESS */}
          <TabsContent value="business">
            <Card className="border-border/40 bg-card/40 p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Business name">
                  <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
                </Field>
                <Field label="Vertical">
                  <Select value={vertical} onValueChange={setVertical}>
                    <SelectTrigger>
                      <SelectValue>{vertical}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {verticals.map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Location">
                  <Input value={location} onChange={(e) => setLocation(e.target.value)} />
                </Field>
                <Field label="Logo">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-background/40">
                      {logo ? (
                        <img src={logo} alt="Logo" className="h-full w-full object-cover" />
                      ) : (
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) onLogoPick(f);
                      }}
                    />
                    <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                      <Upload className="h-3.5 w-3.5" /> Upload
                    </Button>
                    {logo && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setLogo(null);
                          window.localStorage.removeItem(LOGO_KEY);
                        }}
                      >
                        <X className="h-3.5 w-3.5" /> Remove
                      </Button>
                    )}
                  </div>
                </Field>
              </div>
              <SaveBar onSave={() => toast.success("Business info saved")} />
            </Card>
          </TabsContent>

          {/* AGENT PERSONALITY */}
          <TabsContent value="agent">
            <Card className="border-border/40 bg-card/40 p-6">
              <div className="space-y-6">
                <div>
                  <Label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Tone of voice
                  </Label>
                  <div className="rounded-lg border border-border/40 bg-background/30 p-4">
                    <div className="mb-3 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Formal</span>
                      <span className="font-display font-semibold text-primary">
                        {TONE_LABELS[toneIdx]}
                      </span>
                      <span className="text-muted-foreground">Casual</span>
                    </div>
                    <Slider
                      value={[toneIdx]}
                      onValueChange={(v) => setToneIdx(v[0] ?? 1)}
                      min={0}
                      max={2}
                      step={1}
                    />
                    <p className="mt-3 rounded-md bg-accent/30 px-3 py-2 text-xs italic text-muted-foreground">
                      {TONE_HINTS[toneIdx]}
                    </p>
                  </div>
                </div>

                <Field label="Welcome message" hint="The first thing a new customer sees on WhatsApp.">
                  <Textarea
                    value={welcome}
                    onChange={(e) => setWelcome(e.target.value)}
                    className="min-h-[88px]"
                  />
                </Field>

                <div>
                  <Label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Escalation trigger keywords
                  </Label>
                  <div className="flex flex-wrap gap-2 rounded-md border border-border/60 bg-background/30 p-3">
                    {escalationKeywords.map((k) => (
                      <Badge
                        key={k}
                        className="gap-1 bg-primary/15 text-primary hover:bg-primary/20"
                      >
                        {k}
                        <button
                          type="button"
                          onClick={() =>
                            setEscalationKeywords(escalationKeywords.filter((x) => x !== k))
                          }
                          aria-label={`Remove ${k}`}
                          className="ml-0.5 rounded hover:bg-primary/20"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    <input
                      value={keywordDraft}
                      onChange={(e) => setKeywordDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                          e.preventDefault();
                          addKeyword();
                        }
                      }}
                      placeholder="Type and press Enter…"
                      className="flex-1 min-w-[140px] bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground/80">
                    When a customer uses any of these, the AI hands the conversation to a human.
                  </p>
                </div>

                <Field
                  label="Escalation contact phone"
                  hint="Where the AI sends an SMS/WhatsApp ping when escalating."
                >
                  <Input value={escalationPhone} onChange={(e) => setEscalationPhone(e.target.value)} />
                </Field>
              </div>
              <SaveBar onSave={() => toast.success("Agent personality saved")} />
            </Card>
          </TabsContent>

          {/* NOTIFICATIONS */}
          <TabsContent value="notifications">
            <Card className="border-border/40 bg-card/40 p-6">
              <div className="space-y-3">
                <NotifRow
                  title="Browser push"
                  desc="Get a desktop notification when an escalation comes in."
                  checked={pushEnabled}
                  onToggle={(v) => {
                    if (v) requestPushPermission();
                    else setPushEnabled(false);
                  }}
                />
                <NotifRow
                  title="Email notifications"
                  desc="Daily summary + escalations to your inbox."
                  checked={emailEnabled}
                  onToggle={setEmailEnabled}
                />
                <NotifRow
                  title="Daily digest via WhatsApp"
                  desc={
                    <>
                      Ema sends your morning digest on WhatsApp. Configure timing in{" "}
                      <a className="text-primary hover:underline" href="/dashboard/ema/settings">
                        /dashboard/ema/settings
                      </a>
                      .
                    </>
                  }
                  checked={digestWa}
                  onToggle={setDigestWa}
                />
              </div>
              <SaveBar onSave={() => toast.success("Notification preferences saved")} />
            </Card>
          </TabsContent>

          {/* LABELS */}
          <TabsContent value="labels">
            <Card className="border-border/40 bg-card/40 p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-semibold">Labels</h3>
                  <p className="text-xs text-muted-foreground">
                    Tag conversations in the inbox. Changes appear instantly.
                  </p>
                </div>
                <Button
                  size="sm"
                  className="bg-gradient-primary text-primary-foreground hover:opacity-90"
                  onClick={() => {
                    setEditingLabel(null);
                    setLabelDraftName("");
                    setLabelDraftColor("emerald");
                    setLabelDialogOpen(true);
                  }}
                >
                  <Plus className="h-3.5 w-3.5" /> Add label
                </Button>
              </div>

              {labels.length === 0 && (
                <div className="rounded-md border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
                  No labels yet. Create one to get started.
                </div>
              )}

              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {labels.map((l) => {
                  const cls = labelColorClasses[l.color];
                  return (
                    <div
                      key={l.id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-border/40 bg-background/30 p-3"
                    >
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${cls.chip}`}>
                        <span className={`h-2 w-2 rounded-full ${cls.dot}`} />
                        {l.name}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          aria-label={`Edit ${l.name}`}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                          onClick={() => {
                            setEditingLabel(l);
                            setLabelDraftName(l.name);
                            setLabelDraftColor(l.color);
                            setLabelDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          aria-label={`Delete ${l.name}`}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => setConfirmDeleteLabel(l)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          {/* ACCOUNT */}
          <TabsContent value="account">
            <Card className="border-border/40 bg-card/40 p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Email" hint="Read-only — contact support to change.">
                  <Input value={ownerEmail} disabled readOnly />
                </Field>
                <Field label="Name">
                  <Input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
                </Field>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => setPwOpen(true)}>
                  Change password
                </Button>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-3.5 w-3.5" /> Sign out
                </Button>
              </div>

              <div className="mt-8 rounded-lg border border-destructive/30 bg-destructive/5 p-5">
                <div className="mb-2 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-destructive" />
                  <h3 className="font-display text-sm font-semibold">Danger zone</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Permanently delete your account and all workspace data. This cannot be undone.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 border-destructive/40 text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    setDelStep(1);
                    setDelConfirm("");
                    setDelOpen(true);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete account
                </Button>
              </div>

              <SaveBar onSave={() => toast.success("Account saved")} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Change password dialog */}
      <Dialog open={pwOpen} onOpenChange={setPwOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
            <DialogDescription>You'll be signed out of other devices.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Field label="Current password">
              <Input type="password" placeholder="••••••••" />
            </Field>
            <Field label="New password">
              <Input type="password" placeholder="At least 8 characters" />
            </Field>
            <Field label="Confirm new password">
              <Input type="password" placeholder="Repeat new password" />
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setPwOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-gradient-primary text-primary-foreground hover:opacity-90"
              onClick={() => {
                setPwOpen(false);
                toast.success("Password updated");
              }}
            >
              Update password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete account dialog (2-step) */}
      <Dialog
        open={delOpen}
        onOpenChange={(open) => {
          setDelOpen(open);
          if (!open) {
            setDelStep(1);
            setDelConfirm("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="h-5 w-5" />
              {delStep === 1 ? "Delete your account?" : "Final confirmation"}
            </DialogTitle>
            <DialogDescription>
              {delStep === 1
                ? "This will permanently delete your workspace, conversations, bookings, contacts, and Ema history. This cannot be undone."
                : "Type DELETE in capital letters to confirm."}
            </DialogDescription>
          </DialogHeader>
          {delStep === 2 && (
            <Input
              value={delConfirm}
              onChange={(e) => setDelConfirm(e.target.value)}
              placeholder="DELETE"
              autoFocus
            />
          )}
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDelOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-destructive/40 text-destructive hover:bg-destructive/10"
              onClick={handleDelete}
              disabled={delStep === 2 && delConfirm !== "DELETE"}
            >
              <Trash2 className="h-3.5 w-3.5" />
              {delStep === 1 ? "Continue" : "Delete forever"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
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

function NotifRow({
  title,
  desc,
  checked,
  onToggle,
}: {
  title: string;
  desc: React.ReactNode;
  checked: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-md border border-border/40 bg-background/30 p-4">
      <div className="min-w-0">
        <div className="text-sm font-medium">{title}</div>
        <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onToggle} />
    </div>
  );
}

function SaveBar({ onSave }: { onSave: () => void }) {
  return (
    <div className="mt-6 flex justify-end border-t border-border/30 pt-4">
      <Button
        size="sm"
        className="bg-gradient-primary text-primary-foreground hover:opacity-90"
        onClick={onSave}
      >
        Save changes
      </Button>
    </div>
  );
}

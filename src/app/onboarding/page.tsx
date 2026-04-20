"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import {
  Sparkles,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Check,
  Building2,
  Briefcase,
  Clock,
  MessageSquare,
  Rocket,
  Database,
  Eye,
  EyeOff,
  ExternalLink,
  PlayCircle,
  RefreshCw,
  AlertTriangle,
  Plug,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { saveProfile } from "@/lib/profile";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 6;

interface StepDef {
  id: number;
  title: string;
  subtitle: string;
  icon: typeof Building2;
}

const STEPS: StepDef[] = [
  { id: 1, title: "Business basics", subtitle: "Tell us who you are", icon: Building2 },
  { id: 2, title: "What you offer", subtitle: "Industry & services", icon: Briefcase },
  { id: 3, title: "Operating hours", subtitle: "When Ema replies live", icon: Clock },
  { id: 4, title: "Voice & tone", subtitle: "How Ema should sound", icon: MessageSquare },
  { id: 5, title: "Connect WhatsApp", subtitle: "Almost done", icon: Rocket },
  { id: 6, title: "Connect Odoo", subtitle: "Unlock Insights & invoicing", icon: Database },
];

interface OnboardingData {
  businessName: string;
  contactName: string;
  country: string;
  industry: string;
  services: string;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
  openTime: string;
  closeTime: string;
  tone: "friendly" | "professional" | "playful";
  language: string;
  greeting: string;
  whatsappNumber: string;
  notifyOnHandoff: boolean;
  odooUrl: string;
  odooDb: string;
  odooApiKey: string;
  odooUsername: string;
}

const defaultData: OnboardingData = {
  businessName: "",
  contactName: "",
  country: "",
  industry: "",
  services: "",
  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: false,
  sunday: false,
  openTime: "09:00",
  closeTime: "18:00",
  tone: "friendly",
  language: "en",
  greeting: "Hi! 👋 Thanks for reaching out — how can I help today?",
  whatsappNumber: "",
  notifyOnHandoff: true,
  odooUrl: "",
  odooDb: "",
  odooApiKey: "",
  odooUsername: "",
};

const step1Schema = z.object({
  businessName: z.string().trim().min(2, "Add your business name").max(80),
  contactName: z.string().trim().min(2, "Tell us your name").max(80),
  country: z.string().min(1, "Pick a country"),
});

const step2Schema = z.object({
  industry: z.string().min(1, "Pick an industry"),
  services: z.string().trim().min(10, "Describe what you offer (10+ chars)").max(500),
});

const step3Schema = z
  .object({
    monday: z.boolean(),
    tuesday: z.boolean(),
    wednesday: z.boolean(),
    thursday: z.boolean(),
    friday: z.boolean(),
    saturday: z.boolean(),
    sunday: z.boolean(),
    openTime: z.string().min(1),
    closeTime: z.string().min(1),
  })
  .refine(
    (d) =>
      d.monday || d.tuesday || d.wednesday || d.thursday || d.friday || d.saturday || d.sunday,
    { message: "Pick at least one day", path: ["monday"] },
  );

const step4Schema = z.object({
  tone: z.enum(["friendly", "professional", "playful"]),
  language: z.string().min(1),
  greeting: z.string().trim().min(5, "Greeting is too short").max(280),
});

const step5Schema = z.object({
  whatsappNumber: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s\-()]{7,20}$/, "Enter a valid phone number"),
});

const step6Schema = z.object({
  odooUrl: z
    .string()
    .trim()
    .url("Enter a valid URL (e.g. https://your.odoo.com)"),
  odooDb: z.string().trim().min(1, "Database name is required"),
  odooApiKey: z.string().trim().min(12, "API key looks too short"),
});

type ConnectionResult =
  | { state: "idle" }
  | { state: "testing" }
  | { state: "ok"; version: string; customers: number; products: number }
  | { state: "error"; message: string };

function evaluateOdooConnection(d: { odooUrl: string; odooDb: string; odooApiKey: string }): Exclude<ConnectionResult, { state: "idle" } | { state: "testing" }> {
  if (!d.odooApiKey || d.odooApiKey.trim().length < 12) {
    return {
      state: "error",
      message:
        "Invalid API key. Generate a new one in Odoo Settings → Users & Companies → Users → API Keys.",
    };
  }
  if (d.odooUrl.toLowerCase().includes("invalid")) {
    return { state: "error", message: "Couldn't reach Odoo. Double-check the URL." };
  }
  if (d.odooDb.toLowerCase().includes("wrong")) {
    return {
      state: "error",
      message: "Database not found. Check the name in Odoo under Settings → Manage Databases.",
    };
  }
  try {
    new URL(d.odooUrl);
  } catch {
    return { state: "error", message: "Couldn't reach Odoo. Double-check the URL." };
  }
  return { state: "ok", version: "17.0", customers: 247, products: 1832 };
}

interface OnboardingPageProps {
  step: number;
  setStep: (n: number) => void;
  resumeMode?: boolean;
  returnTo?: string;
}

const STORAGE_KEY = "ema:onboarding:draft";

export default function OnboardingPage({ step, setStep, resumeMode = false, returnTo = "/dashboard" }: OnboardingPageProps) {
  const navigate = useNavigate();
  const [data, setData] = useState<OnboardingData>(defaultData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [connection, setConnection] = useState<ConnectionResult>({ state: "idle" });
  const [skipDialogOpen, setSkipDialogOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate from localStorage after mount (SSR-safe)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<OnboardingData>;
        setData((d) => ({ ...d, ...parsed }));
        // Only nudge the user if there's something meaningful to resume.
        const hasMeaningfulDraft = Object.entries(parsed).some(([key, value]) => {
          if (typeof value !== "string") return false;
          if (key === "openTime" || key === "closeTime" || key === "greeting" || key === "language") {
            return false; // these have non-empty defaults; ignore
          }
          return value.trim().length > 0;
        });
        if (hasMeaningfulDraft) {
          toast("Resumed your draft", {
            description: "We restored your previous answers.",
            duration: 3000,
          });
        }
      }
    } catch {
      // ignore corrupt draft
    }
    setHydrated(true);
  }, []);

  // Autosave whenever data changes (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setSavedFlash(true);
      if (flashTimer.current) clearTimeout(flashTimer.current);
      flashTimer.current = setTimeout(() => setSavedFlash(false), 1400);
    } catch {
      // ignore quota errors
    }
  }, [data, hydrated]);

  useEffect(() => {
    return () => {
      if (flashTimer.current) clearTimeout(flashTimer.current);
    };
  }, []);

  // Force step 6 in resume mode
  useEffect(() => {
    if (resumeMode && step !== 6) setStep(6);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeMode]);

  const current = useMemo(
    () => STEPS.find((s) => s.id === step) ?? STEPS[0],
    [step],
  );
  const progress = (step / TOTAL_STEPS) * 100;

  const update = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    if (errors[key as string]) {
      setErrors((e) => {
        const next = { ...e };
        delete next[key as string];
        return next;
      });
    }
  };

  const validateCurrent = (): boolean => {
    const schemas: Record<number, z.ZodTypeAny> = {
      1: step1Schema,
      2: step2Schema,
      3: step3Schema,
      4: step4Schema,
      5: step5Schema,
      6: step6Schema,
    };
    const result = schemas[step].safeParse(data);
    if (result.success) {
      setErrors({});
      return true;
    }
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    setErrors(fieldErrors);
    return false;
  };

  const handleNext = () => {
    if (!validateCurrent()) {
      toast.error("Please fix the highlighted fields");
      return;
    }
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleStartOver = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setData(defaultData);
    setErrors({});
    setStep(1);
    toast.success("Wizard reset — starting fresh");
  };

  const handleTestConnection = async () => {
    if (!validateCurrent()) {
      toast.error("Please fix the highlighted fields");
      return;
    }
    setConnection({ state: "testing" });
    await new Promise((r) => setTimeout(r, 1800));
    setConnection(evaluateOdooConnection(data));
  };

  const finalizeOnboarding = async (odooConnected: boolean) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    window.localStorage.setItem("mockLoggedIn", "true");
    window.localStorage.setItem("mockOnboarded", "true");
    if (odooConnected && connection.state === "ok") {
      const meta = {
        url: data.odooUrl,
        database: data.odooDb,
        version: connection.version,
        customers: connection.customers,
        products: connection.products,
        openInvoices: 89,
        lastSync: new Date().toISOString(),
      };
      window.localStorage.setItem("odooConnected", "true");
      window.localStorage.setItem("isola.odoo.meta", JSON.stringify(meta));
      window.dispatchEvent(new CustomEvent("isola:odoo-changed"));
    } else {
      window.localStorage.setItem("odooConnected", "false");
      window.localStorage.removeItem("isola.odoo.meta");
      window.dispatchEvent(new CustomEvent("isola:odoo-changed"));
    }
    saveProfile({ contactName: data.contactName, businessName: data.businessName });
    window.localStorage.removeItem(STORAGE_KEY);
    // First-win activation moment — only on the *initial* completion, never on resume
    if (!resumeMode) {
      window.localStorage.setItem("isola.firstWinPending", "true");
      window.localStorage.setItem("isola.firstWinIndustry", data.industry || "");
    }
    if (odooConnected) {
      setShowConfetti(true);
      toast.success("✓ Odoo connected. Welcome to Isola.");
      await new Promise((r) => setTimeout(r, 900));
    } else {
      toast("ℹ Onboarding complete. Connect Odoo to unlock Insights.", { duration: 5000 });
    }
    setSubmitting(false);
    // Honor returnTo if provided (resume flow from /dashboard or /dashboard/integrations)
    const dest = (resumeMode && returnTo) ? returnTo : "/dashboard";
    navigate({ to: dest });
  };

  const handleFinish = async () => {
    if (step === 6) {
      if (connection.state !== "ok") {
        toast.error("Test the connection before finishing.");
        return;
      }
      await finalizeOnboarding(true);
      return;
    }
    if (!validateCurrent()) {
      toast.error("Please fix the highlighted fields");
      return;
    }
    await finalizeOnboarding(false);
  };

  const handleSkipOdoo = async () => {
    setSkipDialogOpen(false);
    await finalizeOnboarding(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      {/* Header */}
      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-semibold">Ema</span>
          </Link>
          <div className="flex items-center gap-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Start over
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Start over?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This clears your saved answers and sends you back to step 1. This
                    can't be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleStartOver}>
                    Yes, start over
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Link
              to="/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Skip for now
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-4 py-10">
        {resumeMode ? (
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight">Complete your setup</h1>
              <p className="text-sm text-muted-foreground">One quick step to unlock Insights and AI invoicing.</p>
            </div>
            <Link to={returnTo as "/dashboard"} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
          </div>
        ) : (
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">
                  Step {step} of {TOTAL_STEPS}
                </span>
                <span
                  aria-live="polite"
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary transition-opacity duration-300",
                    savedFlash ? "animate-fade-in opacity-100" : "pointer-events-none opacity-0",
                  )}
                >
                  <Check className="h-3 w-3" />
                  Saved
                </span>
              </div>
              <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="mt-6 hidden items-center justify-between md:flex">
              {STEPS.map((s) => {
                const done = s.id < step;
                const active = s.id === step;
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => s.id < step && setStep(s.id)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 transition-opacity",
                      s.id > step && "cursor-not-allowed opacity-40",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors",
                      done && "border-primary bg-primary text-primary-foreground",
                      active && "border-primary bg-background text-primary",
                      !done && !active && "border-border bg-background text-muted-foreground",
                    )}
                  >
                    {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span
                    className={cn(
                      "text-xs",
                      active ? "font-medium text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {s.title}
                  </span>
                </button>
              );
              })}
            </div>
          </div>
        )}

        {/* Step card */}
        <Card className="overflow-hidden border-border/60 shadow-sm">
          <div className="border-b border-border/60 bg-muted/30 px-6 py-5">
            <h1 className="text-xl font-semibold tracking-tight">{current.title}</h1>
            <p className="text-sm text-muted-foreground">{current.subtitle}</p>
          </div>

          <div className="space-y-6 px-6 py-6">
            {step === 1 && (
              <Step1
                data={data}
                errors={errors}
                update={update}
              />
            )}
            {step === 2 && (
              <Step2
                data={data}
                errors={errors}
                update={update}
              />
            )}
            {step === 3 && (
              <Step3
                data={data}
                errors={errors}
                update={update}
              />
            )}
            {step === 4 && (
              <Step4
                data={data}
                errors={errors}
                update={update}
              />
            )}
            {step === 5 && (
              <Step5
                data={data}
                errors={errors}
                update={update}
              />
            )}
            {step === 6 && (
              <Step6
                data={data}
                errors={errors}
                update={update}
                connection={connection}
                onTest={handleTestConnection}
                onReset={() => setConnection({ state: "idle" })}
              />
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border/60 bg-muted/20 px-6 py-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleBack}
              disabled={step === 1 || submitting}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            {step < TOTAL_STEPS ? (
              <Button type="button" onClick={handleNext}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setSkipDialogOpen(true)}
                  disabled={submitting}
                >
                  Skip for now
                </Button>
                <Button
                  type="button"
                  onClick={handleFinish}
                  disabled={submitting || connection.state !== "ok"}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Setting up…
                    </>
                  ) : (
                    <>
                      Connect &amp; finish
                      <Rocket className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Skip-Odoo confirmation */}
        <AlertDialog open={skipDialogOpen} onOpenChange={setSkipDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Skip Odoo setup?</AlertDialogTitle>
              <AlertDialogDescription>
                You can finish onboarding without it, but{" "}
                <span className="font-semibold text-foreground">Insights</span>,{" "}
                <span className="font-semibold text-foreground">invoicing</span>, and{" "}
                <span className="font-semibold text-foreground">inventory-aware AI</span>{" "}
                will be locked until you connect. You can do this anytime from
                Settings or by completing the orange banner on your dashboard.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Go back</AlertDialogCancel>
              <AlertDialogAction onClick={handleSkipOdoo}>Skip anyway</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Confetti burst on Odoo-connected finish */}
        {showConfetti && <ConfettiBurst />}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          You can change all of this later in settings.
        </p>
      </main>
    </div>
  );
}

interface StepProps {
  data: OnboardingData;
  errors: Record<string, string>;
  update: <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => void;
}

function FieldError({ msg }: { msg?: string }): ReactNode {
  if (!msg) return null;
  return <p className="text-xs text-destructive">{msg}</p>;
}

function Step1({ data, errors, update }: StepProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="businessName">Business name</Label>
        <Input
          id="businessName"
          placeholder="Cafe Bonjour"
          value={data.businessName}
          onChange={(e) => update("businessName", e.target.value)}
        />
        <FieldError msg={errors.businessName} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contactName">Your name</Label>
        <Input
          id="contactName"
          placeholder="Alex Martin"
          value={data.contactName}
          onChange={(e) => update("contactName", e.target.value)}
        />
        <FieldError msg={errors.contactName} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Select value={data.country} onValueChange={(v) => update("country", v)}>
          <SelectTrigger id="country">
            <SelectValue placeholder="Pick a country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="us">United States</SelectItem>
            <SelectItem value="gb">United Kingdom</SelectItem>
            <SelectItem value="fr">France</SelectItem>
            <SelectItem value="es">Spain</SelectItem>
            <SelectItem value="de">Germany</SelectItem>
            <SelectItem value="br">Brazil</SelectItem>
            <SelectItem value="mx">Mexico</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <FieldError msg={errors.country} />
      </div>
    </>
  );
}

function Step2({ data, errors, update }: StepProps) {
  const industries = [
    { value: "restaurant", label: "Restaurant / Cafe" },
    { value: "hotel", label: "Hotel / Hospitality" },
    { value: "clinic", label: "Clinic / Healthcare" },
    { value: "salon", label: "Salon / Beauty" },
    { value: "retail", label: "Retail / E-commerce" },
    { value: "services", label: "Professional services" },
    { value: "other", label: "Other" },
  ];
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="industry">Industry</Label>
        <Select value={data.industry} onValueChange={(v) => update("industry", v)}>
          <SelectTrigger id="industry">
            <SelectValue placeholder="Pick your industry" />
          </SelectTrigger>
          <SelectContent>
            {industries.map((i) => (
              <SelectItem key={i.value} value={i.value}>
                {i.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError msg={errors.industry} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="services">What do you offer?</Label>
        <Textarea
          id="services"
          placeholder="We're a small Italian restaurant — pizza, pasta, dine-in and delivery. Open for lunch and dinner."
          rows={5}
          value={data.services}
          onChange={(e) => update("services", e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Ema uses this to answer customer questions accurately.
        </p>
        <FieldError msg={errors.services} />
      </div>
    </>
  );
}

function Step3({ data, errors, update }: StepProps) {
  const days: Array<{ key: keyof OnboardingData; label: string }> = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ];
  return (
    <>
      <div className="space-y-3">
        <Label>Open days</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {days.map((d) => {
            const checked = data[d.key] as boolean;
            return (
              <label
                key={d.key}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                  checked
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-foreground/30",
                )}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={(v) => update(d.key, Boolean(v) as never)}
                />
                {d.label}
              </label>
            );
          })}
        </div>
        <FieldError msg={errors.monday} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="openTime">Opens</Label>
          <Input
            id="openTime"
            type="time"
            value={data.openTime}
            onChange={(e) => update("openTime", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="closeTime">Closes</Label>
          <Input
            id="closeTime"
            type="time"
            value={data.closeTime}
            onChange={(e) => update("closeTime", e.target.value)}
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Outside these hours, Ema replies with an away message and offers a callback.
      </p>
    </>
  );
}

function Step4({ data, errors, update }: StepProps) {
  const tones: Array<{ value: OnboardingData["tone"]; label: string; desc: string }> = [
    { value: "friendly", label: "Friendly", desc: "Warm, casual, like a helpful neighbor." },
    { value: "professional", label: "Professional", desc: "Polished, neutral, gets to the point." },
    { value: "playful", label: "Playful", desc: "Fun, emoji-light, a bit cheeky." },
  ];
  return (
    <>
      <div className="space-y-3">
        <Label>Tone of voice</Label>
        <RadioGroup
          value={data.tone}
          onValueChange={(v) => update("tone", v as OnboardingData["tone"])}
          className="grid gap-2"
        >
          {tones.map((t) => (
            <label
              key={t.value}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors",
                data.tone === t.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-foreground/30",
              )}
            >
              <RadioGroupItem value={t.value} className="mt-1" />
              <div>
                <div className="text-sm font-medium">{t.label}</div>
                <div className="text-xs text-muted-foreground">{t.desc}</div>
              </div>
            </label>
          ))}
        </RadioGroup>
      </div>
      <div className="space-y-2">
        <Label htmlFor="language">Primary language</Label>
        <Select value={data.language} onValueChange={(v) => update("language", v)}>
          <SelectTrigger id="language">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
            <SelectItem value="pt">Portuguese</SelectItem>
            <SelectItem value="de">German</SelectItem>
            <SelectItem value="it">Italian</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="greeting">First message Ema sends</Label>
        <Textarea
          id="greeting"
          rows={3}
          value={data.greeting}
          onChange={(e) => update("greeting", e.target.value)}
        />
        <FieldError msg={errors.greeting} />
      </div>
    </>
  );
}

function Step5({ data, errors, update }: StepProps) {
  const firstName = (data.contactName?.trim().split(/\s+/)[0]) || "there";
  const emaPhone = "+1 767-818-3742";
  const fullMessage = `Hi ${firstName}! I'm Ema — your Epic Management Agent. Think of me as your chief of staff. Every morning I'll send you a digest of what happened overnight. Whenever you want a report, a campaign, a reminder, just ask. I'm on ${emaPhone} on WhatsApp, or right here in the dashboard. Want to try me? Ask 'What should I do today?'`;

  // Type the message character-by-character ~3s total. Restart only when name changes.
  const [typed, setTyped] = useState("");
  useEffect(() => {
    setTyped("");
    const total = fullMessage.length;
    const intervalMs = Math.max(8, Math.floor(3000 / total));
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(fullMessage.slice(0, i));
      if (i >= total) clearInterval(id);
    }, intervalMs);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstName]);

  const done = typed.length >= fullMessage.length;

  return (
    <>
      {/* Ema's first message — typed */}
      <div className="rounded-2xl border border-ema/30 bg-gradient-to-br from-ema/10 via-background to-background p-5 shadow-ema">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-ema text-ema-foreground shadow-ema">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold">Ema</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Your chief of staff
            </div>
          </div>
        </div>
        <p
          className="text-sm leading-relaxed text-foreground"
          aria-live="polite"
          aria-busy={!done}
        >
          {typed}
          {!done && <span className="ml-0.5 inline-block h-3.5 w-1 -mb-0.5 animate-pulse bg-ema align-middle" />}
        </p>
      </div>

      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <p className="text-sm font-medium">Connect WhatsApp Business</p>
        <p className="mt-1 text-xs text-muted-foreground">
          We'll send a one-time code to verify the number. You can swap it later.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="whatsappNumber">WhatsApp number</Label>
        <Input
          id="whatsappNumber"
          placeholder="+1 555 123 4567"
          value={data.whatsappNumber}
          onChange={(e) => update("whatsappNumber", e.target.value)}
        />
        <FieldError msg={errors.whatsappNumber} />
      </div>
      <div className="flex items-start justify-between gap-4 rounded-lg border border-border px-4 py-3">
        <div>
          <Label htmlFor="notify" className="text-sm font-medium">
            Notify me on handoff
          </Label>
          <p className="text-xs text-muted-foreground">
            Get a ping when Ema escalates a chat to a human.
          </p>
        </div>
        <Switch
          id="notify"
          checked={data.notifyOnHandoff}
          onCheckedChange={(v) => update("notifyOnHandoff", v)}
        />
      </div>
    </>
  );
}

interface Step6Props extends StepProps {
  connection: ConnectionResult;
  onTest: () => void;
  onReset: () => void;
}

function Step6({ data, errors, update, connection, onTest, onReset }: Step6Props) {
  const [showKey, setShowKey] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const lead = useMemo(() => {
    switch (data.industry) {
      case "restaurant":
        return "For restaurants, this powers: inventory-aware menu (agent stops offering 86'd items), live sales dashboard, invoice payment via Fiserv, supplier POs.";
      case "hotel":
        return "For hotels, this powers: room availability sync, guest folio charges, excursion booking Odoo records, post-stay invoice.";
      case "clinic":
        return "For clinics, this powers: patient records, appointment billing, insurance card intake.";
      default:
        return "Powers your invoicing, inventory, customer records, and AI-assisted ops.";
    }
  }, [data.industry]);

  const isOk = connection.state === "ok";
  const isTesting = connection.state === "testing";
  const isError = connection.state === "error";

  return (
    <>
      {/* Lead copy + Odoo badge */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold tracking-tight">Connect your Odoo</h2>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-500">
            <Database className="h-3 w-3" /> Odoo
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Unlock real-time insights, AI-assisted invoicing, and inventory-aware
          agents. Your Odoo stays your source of truth — we only read what's
          needed and write what you authorize.
        </p>
        <p className="rounded-lg border border-violet-500/20 bg-violet-500/5 px-3 py-2 text-xs text-foreground">
          {lead}
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="odooUrl">Odoo URL</Label>
          <Input
            id="odooUrl"
            type="url"
            placeholder="https://coalpot.odoo.com"
            value={data.odooUrl}
            onChange={(e) => {
              update("odooUrl", e.target.value);
              if (connection.state !== "idle") onReset();
            }}
          />
          <FieldError msg={errors.odooUrl} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="odooDb">Database name</Label>
          <Input
            id="odooDb"
            placeholder="coalpot-prod"
            value={data.odooDb}
            onChange={(e) => {
              update("odooDb", e.target.value);
              if (connection.state !== "idle") onReset();
            }}
          />
          <p className="text-[11px] text-muted-foreground">
            Find this in Odoo under <span className="font-mono">Settings → Manage Databases</span>.
          </p>
          <FieldError msg={errors.odooDb} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="odooApiKey">API key</Label>
          <div className="relative">
            <Input
              id="odooApiKey"
              type={showKey ? "text" : "password"}
              placeholder="••••••••••••••••"
              className="pr-10 font-mono"
              value={data.odooApiKey}
              onChange={(e) => {
                update("odooApiKey", e.target.value);
                if (connection.state !== "idle") onReset();
              }}
            />
            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
              aria-label={showKey ? "Hide API key" : "Show API key"}
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Generate in Odoo <span className="font-mono">Settings → Users &amp; Companies → Users → API Keys</span>.
          </p>
          <FieldError msg={errors.odooApiKey} />
        </div>

        {/* More options */}
        <button
          type="button"
          onClick={() => setMoreOpen((v) => !v)}
          className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowRight
            className={cn(
              "h-3 w-3 transition-transform",
              moreOpen && "rotate-90",
            )}
          />
          More options
        </button>
        {moreOpen && (
          <div className="space-y-2 rounded-md border border-border/60 bg-muted/20 p-3">
            <Label htmlFor="odooUsername" className="text-xs">
              Username (optional — for API-key auto-generation)
            </Label>
            <Input
              id="odooUsername"
              placeholder="alex@coalpot.dm"
              value={data.odooUsername}
              onChange={(e) => update("odooUsername", e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Test connection */}
      <div className="space-y-3">
        <Button
          type="button"
          onClick={onTest}
          disabled={isTesting || isOk}
          className={cn(
            "w-full",
            isOk && "bg-success text-success-foreground hover:bg-success/90",
          )}
        >
          {isTesting && (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing…
            </>
          )}
          {isOk && (
            <>
              <Check className="mr-2 h-4 w-4" />
              Connected · Odoo {connection.version}
            </>
          )}
          {!isTesting && !isOk && (
            <>
              <Plug className="mr-2 h-4 w-4" />
              Test connection
            </>
          )}
        </Button>

        {isOk && (
          <div className="flex items-center gap-2 rounded-md border border-success/30 bg-success/5 px-3 py-2 text-xs text-foreground">
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-success" />
            <span>
              Detected{" "}
              <span className="font-semibold">{connection.customers.toLocaleString()} customers</span>
              {" "}and{" "}
              <span className="font-semibold">{connection.products.toLocaleString()} products</span>.
              Live sync is now armed.
            </span>
          </div>
        )}

        {isError && (
          <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-xs text-destructive">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="space-y-1">
              <p className="font-medium">{connection.message}</p>
              <button
                type="button"
                className="underline-offset-2 hover:underline"
                onClick={() => toast("Troubleshoot guide opened (mock)")}
              >
                Troubleshoot →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Help me find these */}
      <div className="rounded-lg border border-border/60">
        <button
          type="button"
          onClick={() => setHelpOpen((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium hover:bg-muted/30"
        >
          <span>Help me find these</span>
          <ArrowRight
            className={cn("h-4 w-4 transition-transform", helpOpen && "rotate-90")}
          />
        </button>
        {helpOpen && (
          <div className="space-y-3 border-t border-border/60 px-4 py-4">
            <HelpMock label="Where to find Odoo URL" hint="Browser address bar when logged into Odoo." />
            <HelpMock label="Where to find database name" hint="Settings → Manage Databases." />
            <HelpMock label="Where to generate API key" hint="Settings → Users & Companies → Users → API Keys → New." />
            <button
              type="button"
              onClick={() => toast("Setup video — coming soon")}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
            >
              <PlayCircle className="h-3.5 w-3.5" />
              Watch 60-sec setup video
            </button>
          </div>
        )}
      </div>

      {/* Tertiary link */}
      <button
        type="button"
        onClick={() => toast("EPIC-hosted Odoo — coming soon")}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ExternalLink className="h-3 w-3" />
        I don't have Odoo — help me set one up →
      </button>
    </>
  );
}

function HelpMock({ label, hint }: { label: string; hint: string }) {
  return (
    <div className="overflow-hidden rounded-md border border-border/60">
      <div className="flex h-24 items-center justify-center bg-gradient-to-br from-muted/40 to-muted/10 text-[10px] uppercase tracking-wider text-muted-foreground">
        Screenshot preview
      </div>
      <div className="border-t border-border/60 bg-background/40 px-3 py-2">
        <p className="text-xs font-medium">{label}</p>
        <p className="text-[11px] text-muted-foreground">{hint}</p>
      </div>
    </div>
  );
}

function ConfettiBurst() {
  // Simple emoji-particle confetti — no extra deps
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        emoji: ["🎉", "✨", "🎊", "💜"][i % 4],
        left: Math.random() * 100,
        delay: Math.random() * 0.3,
        duration: 1.6 + Math.random() * 0.8,
        rotate: Math.random() * 540 - 270,
      })),
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute -top-6 text-2xl"
          style={{
            left: `${p.left}%`,
            animation: `confetti-fall ${p.duration}s ease-out ${p.delay}s forwards`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        >
          {p.emoji}
        </span>
      ))}
      <style>{`
        @keyframes confetti-fall {
          0%   { transform: translateY(0) rotate(0); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

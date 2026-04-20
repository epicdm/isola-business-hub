"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { z } from "zod";
import { Sparkles, Loader2, Mail, Lock, User, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { saveProfile } from "@/lib/profile";
import { toast } from "sonner";

type AuthVariant = "sign-in" | "sign-up" | "forgot-password" | "magic-link";

const emailSchema = z
  .string()
  .trim()
  .min(1, { message: "Email is required" })
  .email({ message: "Enter a valid email" })
  .max(255);

const passwordSchema = z
  .string()
  .min(8, { message: "At least 8 characters" })
  .max(72, { message: "Too long" });

const nameSchema = z
  .string()
  .trim()
  .min(2, { message: "Tell us your name" })
  .max(80);

const businessSchema = z
  .string()
  .trim()
  .min(2, { message: "Add your business name" })
  .max(80);

interface AuthShellProps {
  variant: AuthVariant;
}

export default function AuthShell({ variant }: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <BackgroundDecor />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 lg:flex-row lg:gap-12">
        <header className="mb-8 flex items-center justify-between lg:absolute lg:inset-x-6 lg:top-6 lg:mb-0">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight">Isola</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to site
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center lg:pt-16">
          <div className="w-full max-w-md">
            <FormForVariant variant={variant} />
          </div>
        </div>

        <aside className="hidden flex-1 items-center justify-center lg:flex lg:pt-16">
          <SidePanel variant={variant} />
        </aside>
      </div>
    </div>
  );
}

function FormForVariant({ variant }: { variant: AuthVariant }) {
  if (variant === "sign-in") return <SignInForm />;
  if (variant === "sign-up") return <SignUpForm />;
  if (variant === "forgot-password") return <ForgotPasswordForm />;
  return <MagicLinkForm />;
}

/* -------------------------------------------------------------------------- */
/* Shared helpers                                                             */
/* -------------------------------------------------------------------------- */

function mockLogin(
  navigate: ReturnType<typeof useNavigate>,
  destination: "/dashboard" | "/onboarding" = "/dashboard",
) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("mockLoggedIn", "true");
  }
  navigate({ to: destination });
}

function FormCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <Card className="border-border/40 bg-card/60 p-7 shadow-elegant backdrop-blur-xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold leading-tight">{title}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {children}
      {footer && <div className="mt-6 border-t border-border/40 pt-5 text-center text-xs text-muted-foreground">{footer}</div>}
    </Card>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-destructive">{message}</p>;
}

/* -------------------------------------------------------------------------- */
/* Sign in                                                                    */
/* -------------------------------------------------------------------------- */

function SignInForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = z
      .object({ email: emailSchema, password: passwordSchema })
      .safeParse({ email, password });
    if (!parsed.success) {
      const fe: typeof errors = {};
      for (const issue of parsed.error.issues) {
        fe[issue.path[0] as keyof typeof errors] = issue.message;
      }
      setErrors(fe);
      return;
    }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 850));
    toast.success("Welcome back to Isola");
    mockLogin(navigate);
  };

  return (
    <FormCard
      title="Welcome back"
      subtitle="Sign in to your Isola workspace."
      footer={
        <>
          New here?{" "}
          <Link to="/auth/$pathname" params={{ pathname: "sign-up" }} className="text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">
            Email
          </Label>
          <div className="relative mt-1.5">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@coalpot.dm"
              className="h-11 pl-9"
              disabled={loading}
            />
          </div>
          <FieldError message={errors.email} />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground">
              Password
            </Label>
            <Link
              to="/auth/$pathname"
              params={{ pathname: "forgot-password" }}
              className="text-xs text-primary hover:underline"
            >
              Forgot?
            </Link>
          </div>
          <div className="relative mt-1.5">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 pl-9"
              disabled={loading}
            />
          </div>
          <FieldError message={errors.password} />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
        </Button>

        <div className="relative py-2 text-center">
          <span className="bg-card/0 px-2 text-[11px] uppercase tracking-wider text-muted-foreground">
            or
          </span>
        </div>

        <Button type="button" variant="outline" className="h-11 w-full" disabled={loading} asChild>
          <Link to="/auth/$pathname" params={{ pathname: "magic-link" }}>
            Email me a magic link
          </Link>
        </Button>
      </form>
    </FormCard>
  );
}

/* -------------------------------------------------------------------------- */
/* Sign up                                                                    */
/* -------------------------------------------------------------------------- */

function SignUpForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = z
      .object({
        name: nameSchema,
        business: businessSchema,
        email: emailSchema,
        password: passwordSchema,
      })
      .safeParse({ name, business, email, password });
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const issue of parsed.error.issues) fe[issue.path[0] as string] = issue.message;
      setErrors(fe);
      return;
    }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 950));
    // Seed the onboarding draft with what they just told us so step 1 is prefilled.
    if (typeof window !== "undefined") {
      try {
        const STORAGE_KEY = "ema:onboarding:draft";
        const raw = window.localStorage.getItem(STORAGE_KEY);
        const existing = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
        const merged = {
          ...existing,
          contactName: name.trim(),
          businessName: business.trim(),
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch {
        // ignore quota / parse errors — onboarding will still load with defaults
      }
    }
    toast.success("Account created — let's set up Isola");
    mockLogin(navigate, "/onboarding");
  };

  return (
    <FormCard
      title="Start your free trial"
      subtitle="14 days, no card. Bring your WhatsApp number."
      footer={
        <>
          Already on Isola?{" "}
          <Link to="/auth/$pathname" params={{ pathname: "sign-in" }} className="text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name" className="text-xs uppercase tracking-wider text-muted-foreground">
              Your name
            </Label>
            <div className="relative mt-1.5">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Marcus Joseph"
                className="h-11 pl-9"
                disabled={loading}
              />
            </div>
            <FieldError message={errors.name} />
          </div>
          <div>
            <Label htmlFor="business" className="text-xs uppercase tracking-wider text-muted-foreground">
              Business
            </Label>
            <Input
              id="business"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              placeholder="Coalpot Restaurant"
              className="mt-1.5 h-11"
              disabled={loading}
            />
            <FieldError message={errors.business} />
          </div>
        </div>

        <div>
          <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">
            Work email
          </Label>
          <div className="relative mt-1.5">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@coalpot.dm"
              className="h-11 pl-9"
              disabled={loading}
            />
          </div>
          <FieldError message={errors.email} />
        </div>

        <div>
          <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground">
            Password
          </Label>
          <div className="relative mt-1.5">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="h-11 pl-9"
              disabled={loading}
            />
          </div>
          <FieldError message={errors.password} />
        </div>

        <p className="text-[11px] leading-relaxed text-muted-foreground">
          By creating an account you agree to our{" "}
          <Link to="/terms" className="text-foreground/80 hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-foreground/80 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
        </Button>
      </form>
    </FormCard>
  );
}

/* -------------------------------------------------------------------------- */
/* Forgot password                                                            */
/* -------------------------------------------------------------------------- */

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message);
      return;
    }
    setError(undefined);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSent(true);
    toast.success("Reset link sent");
  };

  return (
    <FormCard
      title="Reset your password"
      subtitle="We'll email you a secure link to set a new one."
      footer={
        <>
          Remembered it?{" "}
          <Link to="/auth/$pathname" params={{ pathname: "sign-in" }} className="text-primary hover:underline">
            Back to sign in
          </Link>
        </>
      }
    >
      {sent ? (
        <div className="space-y-4 rounded-lg border border-primary/30 bg-primary/5 p-5 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
          <div>
            <p className="text-sm font-semibold">Check your inbox</p>
            <p className="mt-1 text-xs text-muted-foreground">
              We sent a reset link to <span className="font-mono text-foreground">{email}</span>. It expires in 1 hour.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setSent(false)}>
            Use a different email
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">
              Email
            </Label>
            <div className="relative mt-1.5">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@coalpot.dm"
                className="h-11 pl-9"
                disabled={loading}
              />
            </div>
            <FieldError message={error} />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send reset link"}
          </Button>
        </form>
      )}
    </FormCard>
  );
}

/* -------------------------------------------------------------------------- */
/* Magic link                                                                 */
/* -------------------------------------------------------------------------- */

function MagicLinkForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message);
      return;
    }
    setError(undefined);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSent(true);
    toast.success("Magic link sent");
  };

  const continueAsDemo = () => {
    toast.success("Signed in via magic link");
    mockLogin(navigate);
  };

  return (
    <FormCard
      title="Sign in with a magic link"
      subtitle="No password — we'll email you a one-tap link."
      footer={
        <>
          Prefer a password?{" "}
          <Link to="/auth/$pathname" params={{ pathname: "sign-in" }} className="text-primary hover:underline">
            Sign in normally
          </Link>
        </>
      }
    >
      {sent ? (
        <div className="space-y-4 rounded-lg border border-primary/30 bg-primary/5 p-5 text-center">
          <Mail className="mx-auto h-10 w-10 text-primary" />
          <div>
            <p className="text-sm font-semibold">Magic link on the way</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Tap the link we sent to <span className="font-mono text-foreground">{email}</span> to sign in.
            </p>
          </div>
          <Button
            onClick={continueAsDemo}
            className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
            size="sm"
          >
            Continue (demo)
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">
              Email
            </Label>
            <div className="relative mt-1.5">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@coalpot.dm"
                className="h-11 pl-9"
                disabled={loading}
              />
            </div>
            <FieldError message={error} />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send magic link"}
          </Button>
        </form>
      )}
    </FormCard>
  );
}

/* -------------------------------------------------------------------------- */
/* Decorative side panel                                                      */
/* -------------------------------------------------------------------------- */

function SidePanel({ variant }: { variant: AuthVariant }) {
  const copy = {
    "sign-in": {
      kicker: "Welcome back",
      title: "Your Caribbean concierge is awake.",
      body: "Inbox, bookings, contacts and Ema are all in sync. Pick up exactly where you left off.",
    },
    "sign-up": {
      kicker: "Start free for 14 days",
      title: "Reply on WhatsApp at island speed.",
      body: "Bring your existing number. Ema handles 80% of routine questions so you can run the floor.",
    },
    "forgot-password": {
      kicker: "Quick recovery",
      title: "We'll have you back in two minutes.",
      body: "Reset links expire after 1 hour for safety. You can keep all your existing chats and bookings.",
    },
    "magic-link": {
      kicker: "Passwordless",
      title: "One tap from your inbox.",
      body: "Magic links work great on phones. Most owners sign in this way from the floor.",
    },
  }[variant];

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute -inset-6 rounded-[2rem] bg-gradient-primary opacity-20 blur-3xl" />
      <Card className="relative overflow-hidden border-border/40 bg-card/40 p-8 backdrop-blur-xl">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
          {copy.kicker}
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold leading-tight">{copy.title}</h2>
        <p className="mt-3 text-sm text-muted-foreground">{copy.body}</p>

        <div className="mt-7 space-y-3">
          <ChatBubble side="in" name="Asha" text="Hi! Do you have a table for 4 at 7pm tonight?" />
          <ChatBubble side="out" name="Ema · Coalpot" text="We do — 7:00 by the window, under Asha. Want me to lock it in? 🌴" />
          <ChatBubble side="in" name="Asha" text="Yes please!" />
        </div>

        <div className="mt-7 grid grid-cols-3 gap-3 border-t border-border/40 pt-5 text-center">
          <Stat value="80%" label="auto-handled" />
          <Stat value="<2m" label="response time" />
          <Stat value="14d" label="free trial" />
        </div>
      </Card>
    </div>
  );
}

function ChatBubble({ side, name, text }: { side: "in" | "out"; name: string; text: string }) {
  const isOut = side === "out";
  return (
    <div className={`flex ${isOut ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-sm ${
          isOut
            ? "rounded-br-sm bg-bubble-out text-bubble-out-foreground"
            : "rounded-bl-sm bg-bubble-in text-bubble-in-foreground"
        }`}
      >
        <div className="mb-0.5 text-[10px] font-semibold opacity-70">{name}</div>
        {text}
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-xl font-bold text-primary">{value}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function BackgroundDecor() {
  return (
    <>
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-primary/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-ema/10 blur-[120px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
    </>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import OnboardingPage from "@/app/onboarding/page";

const searchSchema = z.object({
  step: z.number().int().min(1).max(6).catch(1).default(1),
  resume: z.coerce.number().int().min(0).max(1).catch(0).default(0),
  returnTo: z.string().catch("/dashboard").default("/dashboard"),
});

export const Route = createFileRoute("/onboarding")({
  validateSearch: (input: Record<string, unknown>) => searchSchema.parse(input),
  head: () => ({
    meta: [
      { title: "Get started — Ema" },
      { name: "description", content: "Set up your Ema assistant in 6 quick steps." },
      { property: "og:title", content: "Get started — Ema" },
      { property: "og:description", content: "Set up your Ema assistant in 6 quick steps." },
    ],
  }),
  component: OnboardingRoute,
});

function OnboardingRoute() {
  const { step, resume, returnTo } = Route.useSearch();
  const navigate = useNavigate({ from: "/onboarding" });

  const setStep = (n: number) => {
    navigate({ search: (prev) => ({ ...prev, step: n }) });
  };

  return <OnboardingPage step={step} setStep={setStep} resumeMode={resume === 1} returnTo={returnTo} />;
}

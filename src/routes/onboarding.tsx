import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import OnboardingPage from "@/app/onboarding/page";

const searchSchema = z.object({
  step: fallback(z.number().int().min(1).max(5), 1).default(1),
});

export const Route = createFileRoute("/onboarding")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Get started — Ema" },
      { name: "description", content: "Set up your Ema assistant in 5 quick steps." },
      { property: "og:title", content: "Get started — Ema" },
      {
        property: "og:description",
        content: "Set up your Ema assistant in 5 quick steps.",
      },
    ],
  }),
  component: OnboardingRoute,
});

function OnboardingRoute() {
  const { step } = Route.useSearch();
  const navigate = useNavigate({ from: "/onboarding" });

  const setStep = (n: number) => {
    navigate({ search: { step: n } });
  };

  return <OnboardingPage step={step} setStep={setStep} />;
}

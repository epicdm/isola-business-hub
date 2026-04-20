import { createFileRoute, notFound } from "@tanstack/react-router";
import AuthShell from "../app/auth/[pathname]/page";

const VALID = ["sign-in", "sign-up", "forgot-password", "magic-link"] as const;
type Variant = (typeof VALID)[number];

const TITLES: Record<Variant, { title: string; description: string }> = {
  "sign-in": {
    title: "Sign in — Isola",
    description: "Sign in to your Isola WhatsApp concierge workspace.",
  },
  "sign-up": {
    title: "Start your free trial — Isola",
    description: "Create an Isola account and reply on WhatsApp at island speed.",
  },
  "forgot-password": {
    title: "Reset password — Isola",
    description: "Get a secure link to reset your Isola password.",
  },
  "magic-link": {
    title: "Magic link sign in — Isola",
    description: "Sign in to Isola with a one-tap email magic link.",
  },
};

export const Route = createFileRoute("/auth/$pathname")({
  beforeLoad: ({ params }) => {
    if (!VALID.includes(params.pathname as Variant)) throw notFound();
  },
  head: ({ params }) => {
    const variant = params.pathname as Variant;
    const meta = TITLES[variant] ?? TITLES["sign-in"];
    return {
      meta: [
        { title: meta.title },
        { name: "description", content: meta.description },
        { property: "og:title", content: meta.title },
        { property: "og:description", content: meta.description },
      ],
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = Route.useParams();
  return <AuthShell variant={pathname as Variant} />;
}

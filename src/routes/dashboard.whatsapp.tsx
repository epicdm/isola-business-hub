import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/whatsapp")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/channels" });
  },
});

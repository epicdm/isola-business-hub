import { createFileRoute } from "@tanstack/react-router";
import Page from "../app/dashboard/agents/[id]/page";

export const Route = createFileRoute("/dashboard/agents/$id")({ component: Page });

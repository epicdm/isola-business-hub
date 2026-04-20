import { createFileRoute } from "@tanstack/react-router";
import Page from "../app/dashboard/agents/page";

export const Route = createFileRoute("/dashboard/agents/")({ component: Page });

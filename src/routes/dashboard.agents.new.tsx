import { createFileRoute } from "@tanstack/react-router";
import Page from "../app/dashboard/agents/new/page";

export const Route = createFileRoute("/dashboard/agents/new")({ component: Page });

import { createFileRoute } from "@tanstack/react-router";
import Page from "../app/dashboard/billing/page";

export const Route = createFileRoute("/dashboard/billing")({ component: Page });

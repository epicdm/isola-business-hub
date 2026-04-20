import { createFileRoute } from "@tanstack/react-router";
import Page from "../app/dashboard/insights/page";

export const Route = createFileRoute("/dashboard/insights")({ component: Page });

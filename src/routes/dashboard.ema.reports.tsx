import { createFileRoute } from "@tanstack/react-router";
import Page from "../app/dashboard/ema/reports/page";

export const Route = createFileRoute("/dashboard/ema/reports")({ component: Page });

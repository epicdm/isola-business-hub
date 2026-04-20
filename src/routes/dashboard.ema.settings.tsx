import { createFileRoute } from "@tanstack/react-router";
import Page from "../app/dashboard/ema/settings/page";

export const Route = createFileRoute("/dashboard/ema/settings")({ component: Page });

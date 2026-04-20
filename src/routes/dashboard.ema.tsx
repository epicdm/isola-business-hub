import { createFileRoute } from "@tanstack/react-router";
import Page from "../app/dashboard/ema/page";

export const Route = createFileRoute("/dashboard/ema")({ component: Page });

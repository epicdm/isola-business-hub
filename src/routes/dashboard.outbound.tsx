import { createFileRoute } from "@tanstack/react-router";
import Page from "../app/dashboard/outbound/page";

export const Route = createFileRoute("/dashboard/outbound")({ component: Page });

import { createFileRoute } from "@tanstack/react-router";
import Page from "../app/dashboard/drafts/page";

export const Route = createFileRoute("/dashboard/drafts")({ component: Page });

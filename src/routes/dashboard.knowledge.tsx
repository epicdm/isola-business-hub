import { createFileRoute } from "@tanstack/react-router";
import Page from "../app/dashboard/knowledge/page";

export const Route = createFileRoute("/dashboard/knowledge")({ component: Page });

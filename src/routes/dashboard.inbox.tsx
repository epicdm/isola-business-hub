import { createFileRoute } from "@tanstack/react-router";
import Page from "../app/dashboard/inbox/page";

export const Route = createFileRoute("/dashboard/inbox")({ component: Page });

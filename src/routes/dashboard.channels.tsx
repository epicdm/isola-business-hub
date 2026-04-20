import { createFileRoute } from "@tanstack/react-router";
import Page from "../app/dashboard/channels/page";

export const Route = createFileRoute("/dashboard/channels")({ component: Page });

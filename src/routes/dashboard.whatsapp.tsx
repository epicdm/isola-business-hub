import { createFileRoute } from "@tanstack/react-router";
import Page from "../app/dashboard/whatsapp/page";

export const Route = createFileRoute("/dashboard/whatsapp")({ component: Page });

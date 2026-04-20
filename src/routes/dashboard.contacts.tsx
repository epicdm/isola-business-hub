import { createFileRoute } from "@tanstack/react-router";
import Page from "../app/dashboard/contacts/page";

export const Route = createFileRoute("/dashboard/contacts")({ component: Page });

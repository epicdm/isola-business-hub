import { createFileRoute } from "@tanstack/react-router";
import Page from "../app/dashboard/integrations/page";

export const Route = createFileRoute("/dashboard/integrations")({ component: Page });

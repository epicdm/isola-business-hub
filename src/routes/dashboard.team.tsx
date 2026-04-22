import { createFileRoute } from "@tanstack/react-router";
import Page from "../app/dashboard/team/page";

export const Route = createFileRoute("/dashboard/team")({ component: Page });

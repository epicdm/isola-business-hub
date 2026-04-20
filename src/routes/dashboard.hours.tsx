import { createFileRoute } from "@tanstack/react-router";
import Page from "../app/dashboard/hours/page";

export const Route = createFileRoute("/dashboard/hours")({ component: Page });

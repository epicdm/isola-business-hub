import { createFileRoute } from "@tanstack/react-router";
import Page from "../app/dashboard/catalog/page";

export const Route = createFileRoute("/dashboard/catalog")({ component: Page });

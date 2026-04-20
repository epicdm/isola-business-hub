import { createFileRoute } from "@tanstack/react-router";
import Page from "../app/pricing/page";

export const Route = createFileRoute("/pricing")({ component: Page });

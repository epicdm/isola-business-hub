import { createFileRoute } from "@tanstack/react-router";
import Page from "../app/terms/page";

export const Route = createFileRoute("/terms")({ component: Page });

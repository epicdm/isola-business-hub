import { createFileRoute } from "@tanstack/react-router";
import Page from "../app/for/clinics/page";

export const Route = createFileRoute("/for/clinics")({ component: Page });

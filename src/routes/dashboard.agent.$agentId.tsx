import { createFileRoute } from "@tanstack/react-router";
import Page from "../app/dashboard/agent/[agentId]/page";

export const Route = createFileRoute("/dashboard/agent/$agentId")({ component: Page });

import { createFileRoute } from "@tanstack/react-router";
import HomePage from "../app/dashboard/home/page";

export const Route = createFileRoute("/dashboard/home")({
  component: HomePage,
});

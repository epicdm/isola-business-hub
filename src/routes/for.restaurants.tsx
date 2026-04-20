import { createFileRoute } from "@tanstack/react-router";
import RestaurantsPage from "../app/for/restaurants/page";

export const Route = createFileRoute("/for/restaurants")({
  component: RestaurantsPage,
});

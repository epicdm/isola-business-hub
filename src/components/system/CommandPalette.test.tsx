import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { RouterProvider, createRouter, createRootRoute, createRoute, createMemoryHistory, Outlet } from "@tanstack/react-router";
import CommandPalette from "./CommandPalette";
import EmaChatWidget from "@/components/dashboard/EmaChatWidget";

// Minimal router so navigate() inside the palette doesn't blow up and the
// EmaChatWidget's <Link> resolves.
function renderWithRouter(ui: React.ReactNode) {
  const rootRoute = createRootRoute({ component: () => <>{ui}<Outlet /></> });
  const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: () => null });
  const onboarding = createRoute({ getParentRoute: () => rootRoute, path: "/onboarding", component: () => null });
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute, onboarding]),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  return render(<RouterProvider router={router} />);
}

describe("CommandPalette → EmaChatWidget Ask Ema wiring", () => {
  beforeEach(() => {
    window.localStorage.clear();
    // Widget reads this on mount; ensure it starts closed so we can assert it opens.
    window.localStorage.setItem("isola.ema.widget.open", "0");
  });

  it("dispatches isola:ask-ema with the typed query and the widget renders the prompt", async () => {
    const spy = vi.fn();
    const listener = (e: Event) => spy((e as CustomEvent).detail);
    window.addEventListener("isola:ask-ema", listener);

    renderWithRouter(
      <>
        <CommandPalette />
        <EmaChatWidget />
      </>,
    );

    // Open palette via the global event the header/sidebar use.
    await act(async () => {
      window.dispatchEvent(new Event("isola:cmdk-open"));
    });
    await new Promise((r) => setTimeout(r, 50));
    // eslint-disable-next-line no-console
    console.log("BODY HTML:", document.body.innerHTML.slice(0, 2000));

    const input = await screen.findByPlaceholderText(/Ask Ema or jump to anything/i, {}, { timeout: 3000 });
    fireEvent.change(input, { target: { value: "what's pacing this week" } });

    // The "Ask Ema: '<query>'" row appears as soon as there's text.
    const askRow = await screen.findByText(/Ask Ema:/i);
    fireEvent.click(askRow);

    // Event fired with the trimmed query as both summary and prompt.
    await waitFor(() => expect(spy).toHaveBeenCalledTimes(1));
    expect(spy.mock.calls[0][0]).toMatchObject({
      cardTitle: "From command palette",
      summary: "what's pacing this week",
      prompt: "what's pacing this week",
    });

    // Widget opened and rendered the user prompt as an owner bubble.
    await waitFor(() => {
      expect(screen.getByText("what's pacing this week")).toBeInTheDocument();
    });

    window.removeEventListener("isola:ask-ema", listener);
  });
});

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import {
  RouterProvider,
  createRouter,
  createRootRoute,
  createRoute,
  createMemoryHistory,
  Outlet,
} from "@tanstack/react-router";

// Mock home-data BEFORE importing the component so the module-level binding
// inside SystemStatusBar picks up our controlled events list.
const getAllActivityMock = vi.fn();
const getAttentionQueueMock = vi.fn(() => []);
vi.mock("@/lib/home-data", () => ({
  getAllActivity: (...args: unknown[]) => getAllActivityMock(...args),
  getAttentionQueue: (...args: unknown[]) => getAttentionQueueMock(...args),
}));

// Mock DnD/SLA flags so we can flip DnD per test without touching localStorage.
const readDndMock = vi.fn(() => false);
vi.mock("@/lib/system-flags", () => ({
  DND_EVENT: "isola:dnd-changed",
  readDnd: () => readDndMock(),
}));

import SystemStatusBar from "./SystemStatusBar";

function renderBar() {
  const rootRoute = createRootRoute({
    component: () => (
      <>
        <SystemStatusBar />
        <Outlet />
      </>
    ),
  });
  const home = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => null,
  });
  const dashHome = createRoute({
    getParentRoute: () => rootRoute,
    path: "/dashboard/home",
    component: () => null,
  });
  const inbox = createRoute({
    getParentRoute: () => rootRoute,
    path: "/dashboard/inbox",
    component: () => null,
  });
  const team = createRoute({
    getParentRoute: () => rootRoute,
    path: "/dashboard/team",
    component: () => null,
  });
  const settings = createRoute({
    getParentRoute: () => rootRoute,
    path: "/dashboard/settings",
    component: () => null,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([home, dashHome, inbox, team, settings]),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  return render(<RouterProvider router={router} />);
}

describe("SystemStatusBar — AmbientTicker idle vs active", () => {
  beforeEach(() => {
    window.localStorage.clear();
    getAllActivityMock.mockReset();
    getAttentionQueueMock.mockReset().mockReturnValue([]);
    readDndMock.mockReset().mockReturnValue(false);
  });

  it("shows the idle 'Quiet moment' copy at 60% opacity when there are no events", async () => {
    getAllActivityMock.mockReturnValue([]);

    renderBar();
    // Let mount effects flush.
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    const idle = screen.getByText(/Quiet moment\. All agents standing by\./i);
    expect(idle).toBeInTheDocument();
    // Idle styling — the design contract: bar exhales when nothing is happening.
    expect(idle.className).toMatch(/opacity-60/);
  });

  it("renders the active event row (no idle copy, no opacity-60) when events exist", async () => {
    getAllActivityMock.mockReturnValue([
      {
        id: "agent-maya-act-1",
        channel: "whatsapp",
        customer: "Joana M.",
        preview: "Confirmed dinner for 4 at 8pm tonight.",
        time: "2m ago",
        outcome: "resolved",
      },
    ]);

    renderBar();
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    // Active state: the event preview is shown, idle copy is gone.
    expect(screen.getByText("Joana M.")).toBeInTheDocument();
    expect(
      screen.getByText(/Confirmed dinner for 4 at 8pm tonight\./i),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/Quiet moment\. All agents standing by\./i),
    ).toBeNull();
    // Sanity: the active row container should NOT carry the idle opacity hook.
    const preview = screen.getByText(/Confirmed dinner for 4 at 8pm tonight\./i);
    // Walk a few ancestors looking for opacity-60; it must not be present on the row.
    let node: HTMLElement | null = preview;
    for (let i = 0; i < 4 && node; i += 1) {
      expect(node.className ?? "").not.toMatch(/opacity-60/);
      node = node.parentElement;
    }
  });

  it("transitions from idle → active when an event arrives via re-render", async () => {
    // Start idle.
    getAllActivityMock.mockReturnValue([]);
    const { rerender, unmount } = renderBar();
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
    expect(
      screen.getByText(/Quiet moment\. All agents standing by\./i),
    ).toBeInTheDocument();

    // The ticker memoizes events at mount, so to verify the active path renders
    // after a transition we unmount and remount with new mock data — this
    // simulates the next page visit when activity has arrived.
    unmount();
    getAllActivityMock.mockReturnValue([
      {
        id: "agent-maya-act-2",
        channel: "voice",
        customer: "Carlos R.",
        preview: "Booked a table for tomorrow.",
        time: "1m ago",
        outcome: "resolved",
      },
    ]);

    renderBar();
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(screen.getByText("Carlos R.")).toBeInTheDocument();
    expect(screen.getByText(/Booked a table for tomorrow\./i)).toBeInTheDocument();
    expect(
      screen.queryByText(/Quiet moment\. All agents standing by\./i),
    ).toBeNull();
    // Mark rerender as used (kept for clarity in case future tests need it).
    void rerender;
  });

  it("shows the DnD 'Quiet mode' copy (still at opacity-60) when DnD is on, even with events", async () => {
    readDndMock.mockReturnValue(true);
    getAllActivityMock.mockReturnValue([
      {
        id: "agent-maya-act-3",
        channel: "whatsapp",
        customer: "Joana M.",
        preview: "Should not be shown while DnD is on.",
        time: "2m ago",
        outcome: "resolved",
      },
    ]);

    renderBar();
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    const dndCopy = screen.getByText(/Quiet mode — agents paused\./i);
    expect(dndCopy).toBeInTheDocument();
    expect(dndCopy.className).toMatch(/opacity-60/);
    // Active event preview must NOT leak through.
    expect(
      screen.queryByText(/Should not be shown while DnD is on\./i),
    ).toBeNull();
  });
});

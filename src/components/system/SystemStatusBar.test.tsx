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
const getAttentionQueueMock = vi.fn<(...args: unknown[]) => unknown[]>(() => []);
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

  it("transitions from idle → active with the expected CSS/DOM class shape", async () => {
    // ---- Idle frame ---------------------------------------------------------
    getAllActivityMock.mockReturnValue([]);
    const { rerender, unmount } = renderBar();
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    const idle = screen.getByText(/Quiet moment\. All agents standing by\./i);
    // Idle DOM contract: a plain <div> (NOT a button) carrying the calm
    // opacity-60 hook plus the centered, truncated layout classes. This is
    // what makes the bar "exhale" when nothing is happening.
    expect(idle.tagName).toBe("DIV");
    expect(idle.className).toMatch(/opacity-60/);
    expect(idle.className).toMatch(/text-center/);
    expect(idle.className).toMatch(/truncate/);
    expect(idle.className).toMatch(/flex-1/);
    // No active-state machinery should be in the DOM yet.
    expect(screen.queryByTitle(/open inbox/i)).toBeNull();

    // ---- Transition to active ----------------------------------------------
    // The ticker memoizes events at mount, so remounting with new mock data
    // simulates the next render tick when activity has arrived.
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

    // ---- Active frame -------------------------------------------------------
    // Idle copy is gone.
    expect(
      screen.queryByText(/Quiet moment\. All agents standing by\./i),
    ).toBeNull();

    // Active DOM contract: the ticker is now a focusable <button> wrapping the
    // event row, and the row itself is the framer-motion node carrying the
    // smooth-transition layout classes.
    const triggerBtn = screen.getByTitle(/open inbox/i);
    expect(triggerBtn.tagName).toBe("BUTTON");
    // The button must NOT carry the idle opacity hook — the bar is "alive" now.
    expect(triggerBtn.className).not.toMatch(/opacity-60/);
    expect(triggerBtn.className).toMatch(/flex-1/);
    expect(triggerBtn.className).toMatch(/overflow-hidden/);

    // The motion row is the direct child of the button; assert the transition
    // layout primitives that make the swap read as "smooth" rather than janky:
    // centered flex, no-wrap, ellipsis truncation.
    const customerEl = screen.getByText("Carlos R.");
    const motionRow = customerEl.closest("[class*='justify-center']") as HTMLElement | null;
    expect(motionRow).not.toBeNull();
    expect(motionRow!.className).toMatch(/flex/);
    expect(motionRow!.className).toMatch(/items-center/);
    expect(motionRow!.className).toMatch(/justify-center/);
    expect(motionRow!.className).toMatch(/whitespace-nowrap/);
    expect(motionRow!.className).toMatch(/overflow-hidden/);
    expect(motionRow!.className).toMatch(/text-ellipsis/);
    // And of course the actual content is rendered.
    expect(screen.getByText(/Booked a table for tomorrow\./i)).toBeInTheDocument();

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

  it("never wraps the ticker preview at small widths (overflow-hidden + whitespace-nowrap contract)", async () => {
    // A deliberately long preview — if wrapping were allowed, this would push
    // the 36px bar to two lines on narrow viewports. The contract below
    // guarantees the row stays a single ellipsised line at any width.
    getAllActivityMock.mockReturnValue([
      {
        id: "agent-maya-act-9",
        channel: "whatsapp",
        customer: "Joana M.",
        preview:
          "This is an intentionally very long preview that would absolutely wrap onto a second line if the ticker container ever lost its no-wrap contract at small widths.",
        time: "1m ago",
        outcome: "resolved",
      },
    ]);

    renderBar();
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    // 1. The center ticker SLOT itself (the wrapper that holds AmbientTicker)
    //    must be hidden below md so the right cluster owns the bar on mobile.
    //    This is the first line of defense against wrapping at small widths:
    //    on phones the ticker simply isn't rendered visually.
    const customerEl = screen.getByText("Joana M.");
    const slot = customerEl.closest("div.hidden.md\\:flex") as HTMLElement | null;
    expect(slot).not.toBeNull();
    expect(slot!.className).toMatch(/hidden/);
    expect(slot!.className).toMatch(/md:flex/);
    // Slot must constrain width so the inner button/row can truncate against it.
    expect(slot!.className).toMatch(/min-w-0/);
    expect(slot!.className).toMatch(/flex-1/);

    // 2. The ticker BUTTON (the AmbientTicker root when active) must clip
    //    overflow so a long preview cannot push the 36px bar taller.
    const triggerBtn = screen.getByTitle(/open inbox/i);
    expect(triggerBtn.tagName).toBe("BUTTON");
    expect(triggerBtn.className).toMatch(/overflow-hidden/);
    expect(triggerBtn.className).toMatch(/min-w-0/);
    expect(triggerBtn.className).toMatch(/flex-1/);

    // 3. The motion ROW inside the button must forbid wrapping and ellipsise.
    const motionRow = customerEl.closest(
      "[class*='justify-center']",
    ) as HTMLElement | null;
    expect(motionRow).not.toBeNull();
    expect(motionRow!.className).toMatch(/whitespace-nowrap/);
    expect(motionRow!.className).toMatch(/overflow-hidden/);
    expect(motionRow!.className).toMatch(/text-ellipsis/);

    // 4. The inner <span> that actually carries the long text must ALSO carry
    //    the no-wrap + ellipsis contract, otherwise the text node could wrap
    //    inside the row even if the row itself doesn't.
    const innerSpan = customerEl.parentElement as HTMLElement | null;
    expect(innerSpan).not.toBeNull();
    expect(innerSpan!.tagName).toBe("SPAN");
    expect(innerSpan!.className).toMatch(/whitespace-nowrap/);
    expect(innerSpan!.className).toMatch(/overflow-hidden/);
    expect(innerSpan!.className).toMatch(/text-ellipsis/);
  });
});

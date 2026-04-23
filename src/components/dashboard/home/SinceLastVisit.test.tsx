import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SinceLastVisit from "@/components/dashboard/home/SinceLastVisit";
import { REBASE_AFTER_MIN } from "@/lib/home-data";

const baseData = {
  label: "Since you stepped away 2h ago",
  gapMinutes: 120,
  changes: [{ kind: "positive" as const, text: "3 bookings confirmed" }],
  firstVisit: false,
};

describe("SinceLastVisit tooltip", () => {
  it("exposes an info trigger with an accessible label", () => {
    render(<SinceLastVisit data={baseData} />);
    expect(
      screen.getByRole("button", { name: /how the baseline is calculated/i }),
    ).toBeInTheDocument();
  });

  it("shows the inactivity-based rebase explanation on hover", async () => {
    const user = userEvent.setup();
    render(<SinceLastVisit data={baseData} />);

    await user.hover(
      screen.getByRole("button", { name: /how the baseline is calculated/i }),
    );

    const tip = await screen.findAllByText(
      new RegExp(`${REBASE_AFTER_MIN} minutes of inactivity`, "i"),
    );
    expect(tip.length).toBeGreaterThan(0);
    expect(tip[0]).toHaveTextContent(/baseline rebases/i);
  });

  it("uses the first-visit copy when no prior baseline exists", async () => {
    const user = userEvent.setup();
    render(<SinceLastVisit data={{ ...baseData, firstVisit: true }} />);

    await user.hover(
      screen.getByRole("button", { name: /how the baseline is calculated/i }),
    );

    const tip = await screen.findAllByText(/first session on this device/i);
    expect(tip[0]).toHaveTextContent(
      new RegExp(`${REBASE_AFTER_MIN} minutes of inactivity`, "i"),
    );
  });
});

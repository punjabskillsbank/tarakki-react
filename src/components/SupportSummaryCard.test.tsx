import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SupportSummaryCard } from "./SupportSummaryCard";

describe("SupportSummaryCard", () => {
  const defaultProps = {
    icon: <span data-testid="summary-icon">Icon</span>,
    value: 12,
    label: "Total Tickets",
    iconBackground: "bg-blue-50",
    iconColor: "text-blue-600",
  };

  // Renders the summary value
  it("renders the summary value", () => {
    render(<SupportSummaryCard {...defaultProps} />);

    expect(screen.getByText("12")).toBeInTheDocument();
  });

  // Renders the summary label
  it("renders the summary label", () => {
    render(<SupportSummaryCard {...defaultProps} />);

    expect(screen.getByText("Total Tickets")).toBeInTheDocument();
  });

  // Renders the provided icon
  it("renders the provided icon", () => {
    render(<SupportSummaryCard {...defaultProps} />);

    expect(screen.getByTestId("summary-icon")).toBeInTheDocument();
  });

  // Applies the provided icon background
  it("applies the provided icon background", () => {
    render(<SupportSummaryCard {...defaultProps} />);

    expect(screen.getByTestId("summary-icon").parentElement).toHaveClass(
      "bg-blue-50"
    );
  });

  // Applies the provided icon color
  it("applies the provided icon color", () => {
    render(<SupportSummaryCard {...defaultProps} />);

    expect(screen.getByTestId("summary-icon").parentElement).toHaveClass(
      "text-blue-600"
    );
  });

  // Renders zero as a valid summary value
  it("renders zero as a valid summary value", () => {
    render(
      <SupportSummaryCard
        {...defaultProps}
        value={0}
      />
    );

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  // Renders different summary values and labels
  it("renders different summary values and labels", () => {
    render(
      <SupportSummaryCard
        {...defaultProps}
        value={5}
        label="Open Tickets"
      />
    );

    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("Open Tickets")).toBeInTheDocument();
  });
});

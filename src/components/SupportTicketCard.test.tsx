import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SupportTicketCard } from "./SupportTicketCard";
import userEvent from "@testing-library/user-event";
import { mockTickets } from "../test-utils/factories";

describe("SupportTicketCard", () => {
  const mockTicket = mockTickets[0];

  const defaultProps = {
    title: mockTicket.subject,
    description: mockTicket.message,
    category: mockTicket.issueCategory,
    status: mockTicket.ticketStatus,
    createdAt: "Oct 13, 2026",
    updatedAt: "Oct 13, 2026",
  };

  // Renders the ticket title
  it("renders the ticket title", () => {
    render(<SupportTicketCard {...defaultProps} />);

    expect(
      screen.getByRole("heading", { name: "Unable to log in" })
    ).toBeInTheDocument();
  });

  // Renders the ticket description
  it("renders the ticket description", () => {
    render(<SupportTicketCard {...defaultProps} />);

    expect(
      screen.getByText("I cannot log in to my account.")
    ).toBeInTheDocument();
  });

  // Renders the ticket category
  it("renders the ticket category", () => {
    render(<SupportTicketCard {...defaultProps} />);

    expect(screen.getByText("ACCOUNT")).toBeInTheDocument();
  });

  // Renders created and updated dates
  it("renders the created and updated dates", () => {
    render(<SupportTicketCard {...defaultProps} />);

    expect(screen.getByText("Created Oct 13, 2026")).toBeInTheDocument();

    expect(screen.getByText("Updated Oct 13, 2026")).toBeInTheDocument();
  });

  // Renders the ticket status
  it("renders the ticket status", () => {
    render(<SupportTicketCard {...defaultProps} />);

    expect(screen.getByText("OPEN")).toBeInTheDocument();
  });

  // Applies the correct styling for each ticket status
  it.each([
    ["OPEN", "bg-blue-50", "text-blue-600"],
    ["PENDING", "bg-yellow-50", "text-yellow-600"],
    ["IN_PROGRESS", "bg-purple-50", "text-purple-600"],
    ["RESOLVED", "bg-green-50", "text-green-600"],
    ["CLOSED", "bg-red-100", "text-gray-600"],
  ])("applies correct styling for %s status", (status, bgClass, textClass) => {
    render(
      <SupportTicketCard
        {...defaultProps}
        status={status}
      />
    );

    const statusElement = screen.getByText(status);

    expect(statusElement).toHaveClass(bgClass, textClass);
  });

  // Handles lowercase ticket status
  it("handles lowercase ticket status", () => {
    render(
      <SupportTicketCard
        {...defaultProps}
        status="open"
      />
    );

    expect(screen.getByText("open")).toHaveClass("bg-blue-50", "text-blue-600");
  });

  // Applies default styling for an unknown status
  it("applies default styling for an unknown status", () => {
    render(
      <SupportTicketCard
        {...defaultProps}
        status="UNKNOWN"
      />
    );

    expect(screen.getByText("UNKNOWN")).toHaveClass(
      "bg-gray-100",
      "text-gray-600"
    );
  });

  // Renders the View Details button
  it("renders the View Details button", () => {
    render(<SupportTicketCard {...defaultProps} />);

    expect(
      screen.getByRole("button", { name: "View Details" })
    ).toBeInTheDocument();
  });

  // View Details button is clickable
  it("allows clicking the View Details button", async () => {
    const user = userEvent.setup();

    render(<SupportTicketCard {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: "View Details" }));

    expect(
      screen.getByRole("button", { name: "View Details" })
    ).toBeInTheDocument();
  });
});

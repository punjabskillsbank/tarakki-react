import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

import { UserSupportPageFAQ } from "./UserSupportPageFAQ";

describe("UserSupportPageFAQ", () => {
  // Renders the FAQ section
  it("renders the FAQ heading and description", () => {
    render(<UserSupportPageFAQ />);

    expect(screen.getByText("Frequently Asked Questions")).toBeInTheDocument();

    expect(
      screen.getByText("Find quick answers to common questions.")
    ).toBeInTheDocument();
  });

  // Renders all FAQ questions
  it("renders all four FAQ questions", () => {
    render(<UserSupportPageFAQ />);

    expect(
      screen.getByRole("button", {
        name: "How do I create a board?",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "How do I invite members to my organization?",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "How can I reset my password?",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "How do I change my organization settings?",
      })
    ).toBeInTheDocument();
  });

  // Displays the correct answer
  it("shows the correct answer when a question is clicked", async () => {
    const user = userEvent.setup();

    render(<UserSupportPageFAQ />);

    await user.click(
      screen.getByRole("button", {
        name: "How do I invite members to my organization?",
      })
    );

    expect(
      screen.getByText(
        "Go to your organization settings and invite members using their email address."
      )
    ).toBeInTheDocument();
  });

  // Keeps answers hidden until opened
  it("hides FAQ answers initially", () => {
    render(<UserSupportPageFAQ />);

    expect(
      screen.queryByText("You can create a board from the Boards section.")
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("You can reset your password from the login page.")
    ).not.toBeInTheDocument();
  });

  // Opens different FAQ answers independently
  it("allows multiple FAQ answers to remain open", async () => {
    const user = userEvent.setup();

    render(<UserSupportPageFAQ />);

    await user.click(
      screen.getByRole("button", {
        name: "How do I create a board?",
      })
    );

    await user.click(
      screen.getByRole("button", {
        name: "How can I reset my password?",
      })
    );

    expect(
      screen.getByText("You can create a board from the Boards section.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("You can reset your password from the login page.")
    ).toBeInTheDocument();
  });
});

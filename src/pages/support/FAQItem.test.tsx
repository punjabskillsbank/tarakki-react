import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

import { FAQItem } from "./FAQItem";

describe("FAQItem", () => {
  // Renders question without showing answer initially
  it("renders the question and hides the answer initially", () => {
    render(
      <FAQItem
        question="How do I create a board?"
        answer="You can create a board from the Boards section."
      />
    );

    expect(screen.getByText("How do I create a board?")).toBeInTheDocument();

    expect(
      screen.queryByText("You can create a board from the Boards section.")
    ).not.toBeInTheDocument();
  });

  // Opens the answer
  it("shows the answer when the question is clicked", async () => {
    const user = userEvent.setup();

    render(
      <FAQItem
        question="How do I create a board?"
        answer="You can create a board from the Boards section."
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: "How do I create a board?",
      })
    );

    expect(
      screen.getByText("You can create a board from the Boards section.")
    ).toBeInTheDocument();
  });

  // Closes the answer
  it("hides the answer when the question is clicked again", async () => {
    const user = userEvent.setup();

    render(
      <FAQItem
        question="How do I reset my password?"
        answer="You can reset your password from the login page."
      />
    );

    const questionButton = screen.getByRole("button", {
      name: "How do I reset my password?",
    });

    await user.click(questionButton);

    expect(
      screen.getByText("You can reset your password from the login page.")
    ).toBeInTheDocument();

    await user.click(questionButton);

    expect(
      screen.queryByText("You can reset your password from the login page.")
    ).not.toBeInTheDocument();
  });

  // Renders React nodes
  it("renders React elements passed as question and answer", async () => {
    const user = userEvent.setup();

    render(
      <FAQItem
        question={<span>Custom question</span>}
        answer={<span>Custom answer</span>}
      />
    );

    expect(screen.getByText("Custom question")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Custom question",
      })
    );

    expect(screen.getByText("Custom answer")).toBeInTheDocument();
  });
});

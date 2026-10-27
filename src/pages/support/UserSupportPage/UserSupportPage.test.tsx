import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { UserSupportPage } from "./UserSupportPage";

jest.mock("../../../components/PageBackground", () => ({
  PageBackground: () => <div data-testid="page-background" />,
}));

jest.mock("../../../components/PageHeader", () => ({
  PageHeader: ({ title, subtitle }: { title: string; subtitle: string }) => (
    <header>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  ),
}));

jest.mock("./UserSupportPageForm", () => ({
  UserSupportPageForm: () => <div data-testid="support-form">Support Form</div>,
}));

jest.mock("./UserSupportPageFAQ", () => ({
  UserSupportPageFAQ: () => <div data-testid="support-faq">FAQ Section</div>,
}));

describe("UserSupportPage", () => {
  // Renders the page header
  it("renders the User Support heading and subtitle", () => {
    render(<UserSupportPage />);

    expect(
      screen.getByRole("heading", {
        name: "User Support",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Need help? Submit a support request, browse frequently asked questions, or review your previous support conversations."
      )
    ).toBeInTheDocument();
  });

  // Renders the page background
  it("renders the page background", () => {
    render(<UserSupportPage />);

    expect(screen.getByTestId("page-background")).toBeInTheDocument();
  });

  // Renders the Support History button
  it("renders the Support History button", () => {
    render(<UserSupportPage />);

    expect(
      screen.getByRole("button", {
        name: "Support History",
      })
    ).toBeInTheDocument();
  });

  // Renders the support form and FAQ
  it("renders the support form and FAQ section", () => {
    render(<UserSupportPage />);

    expect(screen.getByTestId("support-form")).toBeInTheDocument();

    expect(screen.getByTestId("support-faq")).toBeInTheDocument();
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import { OrganizationDecision } from "./OrganizationDecision";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

// Mock motion to avoid animation-related issues in tests
jest.mock("motion/react", () => ({
  motion: {
    div: ({ children, onClick, className, style }: any) => (
      <div
        onClick={onClick}
        className={className}
        style={style}>
        {children}
      </div>
    ),
    h1: ({ children, className }: any) => (
      <h1 className={className}>{children}</h1>
    ),
    p: ({ children, className }: any) => (
      <p className={className}>{children}</p>
    ),
    button: ({ children, onClick, className, disabled }: any) => (
      <button
        onClick={onClick}
        className={className}
        disabled={disabled}>
        {children}
      </button>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe("OrganizationDecision", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    localStorage.clear();
    jest.spyOn(Storage.prototype, "getItem");
  });

  it("renders the organization decision options with personalized title", () => {
    localStorage.setItem("firstName", "John");
    render(
      <MemoryRouter>
        <OrganizationDecision />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Choose Your Path Forward, John")
    ).toBeInTheDocument();
    expect(screen.getByText("Join an Organization")).toBeInTheDocument();
    expect(screen.getByText("Create an Organization")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /continue/i })
    ).toBeInTheDocument();
  });

  it("renders a generic title when firstName is missing from localStorage", () => {
    render(
      <MemoryRouter>
        <OrganizationDecision />
      </MemoryRouter>
    );

    expect(screen.getByText("Choose Your Path Forward,")).toBeInTheDocument();
  });

  it("initially disables the continue button", () => {
    render(
      <MemoryRouter>
        <OrganizationDecision />
      </MemoryRouter>
    );

    const continueButton = screen
      .getByRole("button", { name: /continue/i })
      .closest("button");
    expect(continueButton).toBeDisabled();
  });

  it('enables the continue button when "Join an Organization" is selected', () => {
    render(
      <MemoryRouter>
        <OrganizationDecision />
      </MemoryRouter>
    );

    const joinCard = screen.getByText("Join an Organization").closest("button");
    fireEvent.click(joinCard!);

    const continueButton = screen
      .getByRole("button", { name: /continue/i })
      .closest("button");
    expect(continueButton).not.toBeDisabled();
  });

  it('enables the continue button when "Create an Organization" is selected', () => {
    render(
      <MemoryRouter>
        <OrganizationDecision />
      </MemoryRouter>
    );

    const createCard = screen
      .getByText("Create an Organization")
      .closest("button");
    fireEvent.click(createCard!);

    const continueButton = screen
      .getByRole("button", { name: /continue/i })
      .closest("button");
    expect(continueButton).not.toBeDisabled();
  });

  it('navigates to /create-organization when "Create an Organization" is selected and Continue is clicked', () => {
    render(
      <MemoryRouter>
        <OrganizationDecision />
      </MemoryRouter>
    );

    const createCard = screen
      .getByText("Create an Organization")
      .closest("button");
    fireEvent.click(createCard!);

    const continueButton = screen.getByRole("button", { name: /continue/i });
    fireEvent.click(continueButton);

    expect(mockNavigate).toHaveBeenCalledWith("/create-organization");
  });

  it('does not navigate when "Join an Organization" is selected and Continue is clicked', () => {
    render(
      <MemoryRouter>
        <OrganizationDecision />
      </MemoryRouter>
    );

    const joinCard = screen.getByText("Join an Organization").closest("button");
    fireEvent.click(joinCard!);

    const continueButton = screen.getByRole("button", { name: /continue/i });
    fireEvent.click(continueButton);

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

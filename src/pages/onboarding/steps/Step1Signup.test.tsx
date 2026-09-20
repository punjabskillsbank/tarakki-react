import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Step1Signup } from "./Step1Signup";
import "@testing-library/jest-dom";
import MemberServices from "../../../services/MemberServices";
import {
  memberFactory,
  STEP1_INPUT_PLACEHOLDER,
  MOCK_PASSWORD,
  MOCK_INVALID_PASSWORD,
  MOCK_DIFFERENT_PASSWORD,
  MOCK_SHORT_PASSWORD,
  PASSWORD_LABEL,
  CONFIRM_PASSWORD_LABEL,
} from "../../../test-utils/factories";

jest.mock("../../../services/MemberServices");
const mockedMemberServices = MemberServices as jest.Mocked<
  typeof MemberServices
>;

describe("Step1Signup", () => {
  const onNext = jest.fn();
  const setEmail = jest.fn();
  const setPassword = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props: Partial<React.ComponentProps<typeof Step1Signup>> = {}) => {
    return render(
      <MemoryRouter>
        <Step1Signup
          onNext={onNext}
          email=""
          setEmail={setEmail}
          password=""
          setPassword={setPassword}
          {...props}
        />
      </MemoryRouter>
    );
  };

  it("renders correctly", () => {
    renderComponent();
    expect(screen.getByText("Welcome to Tarakki")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(STEP1_INPUT_PLACEHOLDER)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(PASSWORD_LABEL)).toBeInTheDocument();
    expect(screen.getByLabelText(CONFIRM_PASSWORD_LABEL)).toBeInTheDocument();
  });

  it("calls onNext without looking the email up, because a new user has no token yet", async () => {
    renderComponent();
    const member = memberFactory();
    const input = screen.getByPlaceholderText(STEP1_INPUT_PLACEHOLDER);
    const passwordInput = screen.getByLabelText(PASSWORD_LABEL);
    const confirmPasswordInput = screen.getByLabelText(CONFIRM_PASSWORD_LABEL);
    const button = screen.getByRole("button", { name: /^continue$/i });

    const user = userEvent.setup();
    await user.type(input, member.email);
    await user.type(passwordInput, MOCK_PASSWORD);
    await user.type(confirmPasswordInput, MOCK_PASSWORD);
    await user.click(button);

    expect(setEmail).toHaveBeenCalledWith(member.email);
    expect(setPassword).toHaveBeenCalledWith(MOCK_PASSWORD);
    await waitFor(() => expect(onNext).toHaveBeenCalledTimes(1));
    expect(mockedMemberServices.getMemberByEmail).not.toHaveBeenCalled();
  });

  it("shows error for invalid email", async () => {
    renderComponent();
    const input = screen.getByPlaceholderText(STEP1_INPUT_PLACEHOLDER);
    const button = screen.getByRole("button", { name: /^continue$/i });

    const user = userEvent.setup();
    await user.type(input, "invalid-email");
    await user.click(button);

    expect(
      screen.getByText("Please enter a valid email address")
    ).toBeInTheDocument();
    expect(onNext).not.toHaveBeenCalled();
  });

  it("shows error for empty password", async () => {
    renderComponent();
    const member = memberFactory();
    const input = screen.getByPlaceholderText(STEP1_INPUT_PLACEHOLDER);
    const button = screen.getByRole("button", { name: /^continue$/i });

    const user = userEvent.setup();
    await user.type(input, member.email);
    await user.click(button);

    expect(
      screen.getByText("Please enter a password")
    ).toBeInTheDocument();
    expect(onNext).not.toHaveBeenCalled();
  });

  it("shows error for short password", async () => {
    renderComponent();
    const member = memberFactory();
    const input = screen.getByPlaceholderText(STEP1_INPUT_PLACEHOLDER);
    const passwordInput = screen.getByLabelText(PASSWORD_LABEL);
    const button = screen.getByRole("button", { name: /^continue$/i });

    const user = userEvent.setup();
    await user.type(input, member.email);
    await user.type(passwordInput, MOCK_SHORT_PASSWORD);
    await user.click(button);

    expect(
      screen.getByText("Password must be at least 8 characters long")
    ).toBeInTheDocument();
    expect(onNext).not.toHaveBeenCalled();
  });

  it("shows error for password failing complexity requirements", async () => {
    renderComponent();
    const member = memberFactory();
    const input = screen.getByPlaceholderText(STEP1_INPUT_PLACEHOLDER);
    const passwordInput = screen.getByLabelText(PASSWORD_LABEL);
    const confirmPasswordInput = screen.getByLabelText(CONFIRM_PASSWORD_LABEL);
    const button = screen.getByRole("button", { name: /^continue$/i });

    const user = userEvent.setup();
    await user.type(input, member.email);
    await user.type(passwordInput, MOCK_INVALID_PASSWORD);
    await user.type(confirmPasswordInput, MOCK_INVALID_PASSWORD);
    await user.click(button);

    expect(
      screen.getByText("Password must contain at least one uppercase letter, one number, and one special character")
    ).toBeInTheDocument();
    expect(onNext).not.toHaveBeenCalled();
  });

  it("shows error when passwords do not match", async () => {
    renderComponent();
    const member = memberFactory();
    const input = screen.getByPlaceholderText(STEP1_INPUT_PLACEHOLDER);
    const passwordInput = screen.getByLabelText(PASSWORD_LABEL);
    const confirmPasswordInput = screen.getByLabelText(CONFIRM_PASSWORD_LABEL);
    const button = screen.getByRole("button", { name: /^continue$/i });

    const user = userEvent.setup();
    await user.type(input, member.email);
    await user.type(passwordInput, MOCK_PASSWORD);
    await user.type(confirmPasswordInput, MOCK_DIFFERENT_PASSWORD);
    await user.click(button);

    expect(
      screen.getByText("Passwords do not match")
    ).toBeInTheDocument();
    expect(onNext).not.toHaveBeenCalled();
  });

  it("shows the duplicate-email error passed back from the profile step", () => {
    renderComponent({ externalError: "Member with this email already exists." });

    expect(
      screen.getByText("Member with this email already exists.")
    ).toBeInTheDocument();
    expect(onNext).not.toHaveBeenCalled();
  });
});

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
  MOCK_NETWORK_ERROR,
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
      <Step1Signup
        onNext={onNext}
        email=""
        setEmail={setEmail}
        password=""
        setPassword={setPassword}
        {...props}
      />
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

  it("validates email and calls onNext when email does not exist", async () => {
    mockedMemberServices.getMemberByEmail.mockRejectedValueOnce({
      response: { status: 404 },
    } as any);

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
    await waitFor(() => expect(onNext).toHaveBeenCalledTimes(1));
    expect(mockedMemberServices.getMemberByEmail).toHaveBeenCalledWith(
      member.email
    );
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

  it("shows error if member with email already exists", async () => {
    const member = memberFactory();
    mockedMemberServices.getMemberByEmail.mockResolvedValueOnce(member);

    renderComponent();
    const input = screen.getByPlaceholderText(STEP1_INPUT_PLACEHOLDER);
    const passwordInput = screen.getByLabelText(PASSWORD_LABEL);
    const confirmPasswordInput = screen.getByLabelText(CONFIRM_PASSWORD_LABEL);
    const button = screen.getByRole("button", { name: /^continue$/i });

    const user = userEvent.setup();
    await user.type(input, member.email);
    await user.type(passwordInput, MOCK_PASSWORD);
    await user.type(confirmPasswordInput, MOCK_PASSWORD);
    await user.click(button);

    expect(
      await screen.findByText("Member with this email already exist")
    ).toBeInTheDocument();
    expect(onNext).not.toHaveBeenCalled();
    expect(mockedMemberServices.getMemberByEmail).toHaveBeenCalledWith(
      member.email
    );
  });

  it("shows a generic error when the email check service fails", async () => {
    mockedMemberServices.getMemberByEmail.mockRejectedValueOnce(
      new Error(MOCK_NETWORK_ERROR)
    );

    renderComponent();
    const input = screen.getByPlaceholderText(STEP1_INPUT_PLACEHOLDER);
    const passwordInput = screen.getByLabelText(PASSWORD_LABEL);
    const confirmPasswordInput = screen.getByLabelText(CONFIRM_PASSWORD_LABEL);
    const button = screen.getByRole("button", { name: /^continue$/i });

    const member = memberFactory();
    const user = userEvent.setup();
    await user.type(input, member.email);
    await user.type(passwordInput, MOCK_PASSWORD);
    await user.type(confirmPasswordInput, MOCK_PASSWORD);
    await user.click(button);

    expect(
      await screen.findByText(
        "Something went wrong while checking your email. Please try again."
      )
    ).toBeInTheDocument();
    expect(onNext).not.toHaveBeenCalled();
  });
});

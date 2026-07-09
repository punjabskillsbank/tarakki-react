import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PasswordInput } from "./PasswordInput";
import "@testing-library/jest-dom";
import { PASSWORD_LABEL, MOCK_VALIDATION_ERROR, PASSWORD_TYPE, TEXT_TYPE } from "../test-utils/factories";

describe("PasswordInput", () => {
  it("renders correctly with label", () => {
    render(<PasswordInput id="test-password" label={PASSWORD_LABEL} value="" onChange={() => {}} />);
    expect(screen.getByText(PASSWORD_LABEL)).toBeInTheDocument();
    const input = screen.getByLabelText(PASSWORD_LABEL);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", PASSWORD_TYPE);
  });

  it("toggles password visibility when the button is clicked", async () => {
    render(<PasswordInput id="test-password" label={PASSWORD_LABEL} value="" onChange={() => {}} />);
    const input = screen.getByLabelText(PASSWORD_LABEL);
    const toggleButton = screen.getByRole("button", { name: /show password/i });

    expect(input).toHaveAttribute("type", PASSWORD_TYPE);

    const user = userEvent.setup();
    await user.click(toggleButton);

    expect(input).toHaveAttribute("type", TEXT_TYPE);
    expect(screen.getByRole("button", { name: /hide password/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /hide password/i }));
    expect(input).toHaveAttribute("type", PASSWORD_TYPE);
  });

  it("keeps input focused when clicking the toggle button", async () => {
    render(<PasswordInput id="test-password" label={PASSWORD_LABEL} value="" onChange={() => {}} />);
    const input = screen.getByLabelText(PASSWORD_LABEL);
    const toggleButton = screen.getByRole("button", { name: /show password/i });

    const user = userEvent.setup();
    input.focus();
    expect(input).toHaveFocus();

    await user.click(toggleButton);
    expect(input).toHaveFocus();
  });

  it("displays error message when error prop is provided", () => {
    render(<PasswordInput id="test-password" label={PASSWORD_LABEL} error={MOCK_VALIDATION_ERROR} value="" onChange={() => {}} />);
    expect(screen.getByText(MOCK_VALIDATION_ERROR)).toBeInTheDocument();
  });
});

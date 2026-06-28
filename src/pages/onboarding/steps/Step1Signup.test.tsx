import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Step1Signup } from "./Step1Signup";
import "@testing-library/jest-dom";
import MemberServices from "../../../services/MemberServices";
import { memberFactory } from "../../../test-utils/factories";

jest.mock("../../../services/MemberServices");
const mockedMemberServices = MemberServices as jest.Mocked<
  typeof MemberServices
>;

describe("Step1Signup", () => {
  const onNext = jest.fn();
  const setEmail = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    render(
      <Step1Signup
        onNext={onNext}
        email={""}
        setEmail={setEmail}
      />
    );
    expect(screen.getByText("Welcome to Tarakki")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("name@company.com")).toBeInTheDocument();
  });

  it("validates email and calls onNext when email does not exist", async () => {
    mockedMemberServices.getMemberByEmail.mockRejectedValueOnce({
      response: { status: 404 },
    } as any);

    render(
      <Step1Signup
        onNext={onNext}
        email={""}
        setEmail={setEmail}
      />
    );
    const member = memberFactory();
    const input = screen.getByPlaceholderText("name@company.com");
    const button = screen.getByRole("button", { name: /^continue$/i });

    const user = userEvent.setup();
    await user.type(input, member.email);
    await user.click(button);

    expect(setEmail).toHaveBeenCalledWith(member.email);
    await waitFor(() => expect(onNext).toHaveBeenCalledTimes(1));
    expect(mockedMemberServices.getMemberByEmail).toHaveBeenCalledWith(
      member.email
    );
  });

  it("shows error for invalid email", async () => {
    render(
      <Step1Signup
        onNext={onNext}
        email={""}
        setEmail={setEmail}
      />
    );
    const input = screen.getByPlaceholderText("name@company.com");
    const button = screen.getByRole("button", { name: /^continue$/i });

    const user = userEvent.setup();
    await user.type(input, "invalid-email");
    await user.click(button);

    expect(
      screen.getByText("Please enter a valid email address")
    ).toBeInTheDocument();
    expect(onNext).not.toHaveBeenCalled();
  });

  it("shows error if member with email already exists", async () => {
    const member = memberFactory();
    mockedMemberServices.getMemberByEmail.mockResolvedValueOnce(member);

    render(
      <Step1Signup
        onNext={onNext}
        email={""}
        setEmail={setEmail}
      />
    );
    const input = screen.getByPlaceholderText("name@company.com");
    const button = screen.getByRole("button", { name: /^continue$/i });

    const user = userEvent.setup();
    await user.type(input, member.email);
    await user.click(button);

    expect(
      await screen.findByText("Member with this email already exist")
    ).toBeInTheDocument();
    expect(onNext).not.toHaveBeenCalled();
    expect(mockedMemberServices.getMemberByEmail).toHaveBeenCalledWith(
      member.email
    );
  });

  it("calls on Next when email not exist", async () => {
    mockedMemberServices.getMemberByEmail.mockRejectedValueOnce({
      response: { status: 404 },
    } as any);

    render(
      <Step1Signup
        onNext={onNext}
        email={""}
        setEmail={setEmail}
      />
    );
    const member = memberFactory();
    const input = screen.getByPlaceholderText("name@company.com");
    const button = screen.getByRole("button", { name: /^continue$/i });

    const user = userEvent.setup();
    await user.type(input, member.email);
    await user.click(button);

    expect(setEmail).toHaveBeenCalledWith(member.email);
    await waitFor(() => expect(onNext).toHaveBeenCalledTimes(1));
    expect(mockedMemberServices.getMemberByEmail).toHaveBeenCalledWith(
      member.email
    );
  });

  it("shows a generic error when the email check service fails", async () => {
    mockedMemberServices.getMemberByEmail.mockRejectedValueOnce(
      new Error("Network Error")
    );

    render(
      <Step1Signup
        onNext={onNext}
        email={""}
        setEmail={setEmail}
      />
    );
    const input = screen.getByPlaceholderText("name@company.com");
    const button = screen.getByRole("button", { name: /^continue$/i });

    const member = memberFactory();
    const user = userEvent.setup();
    await user.type(input, member.email);
    await user.click(button);

    expect(
      await screen.findByText(
        "Something went wrong while checking your email. Please try again."
      )
    ).toBeInTheDocument();
    expect(onNext).not.toHaveBeenCalled();
  });
});

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Step1Signup } from "./Step1Signup";
import "@testing-library/jest-dom";
import MemberServices from "../../../services/MemberServices";

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
    const input = screen.getByPlaceholderText("name@company.com");
    const button = screen.getByRole("button", { name: /^continue$/i });

    fireEvent.change(input, { target: { value: "test@example.com" } });
    fireEvent.click(button);

    expect(setEmail).toHaveBeenCalledWith("test@example.com");
    await waitFor(() => expect(onNext).toHaveBeenCalledTimes(1));
    expect(mockedMemberServices.getMemberByEmail).toHaveBeenCalledWith(
      "test@example.com"
    );
  });

  it("shows error for invalid email", () => {
    render(
      <Step1Signup
        onNext={onNext}
        email={""}
        setEmail={setEmail}
      />
    );
    const input = screen.getByPlaceholderText("name@company.com");
    const button = screen.getByRole("button", { name: /^continue$/i });

    fireEvent.change(input, { target: { value: "invalid-email" } });
    fireEvent.click(button);

    expect(
      screen.getByText("Please enter a valid email address")
    ).toBeInTheDocument();
    expect(onNext).not.toHaveBeenCalled();
  });

  it("shows error if member with email already exists", async () => {
    mockedMemberServices.getMemberByEmail.mockResolvedValueOnce({
      id: "123",
      email: "existing@example.com",
    } as any);

    render(
      <Step1Signup
        onNext={onNext}
        email={""}
        setEmail={setEmail}
      />
    );
    const input = screen.getByPlaceholderText("name@company.com");
    const button = screen.getByRole("button", { name: /^continue$/i });

    fireEvent.change(input, { target: { value: "existing@example.com" } });
    fireEvent.click(button);

    expect(
      await screen.findByText("Member with this email already exist")
    ).toBeInTheDocument();
    expect(onNext).not.toHaveBeenCalled();
    expect(mockedMemberServices.getMemberByEmail).toHaveBeenCalledWith(
      "existing@example.com"
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
    const input = screen.getByPlaceholderText("name@company.com");
    const button = screen.getByRole("button", { name: /^continue$/i });

    fireEvent.change(input, { target: { value: "newuser@example.com" } });
    fireEvent.click(button);

    expect(setEmail).toHaveBeenCalledWith("newuser@example.com");
    await waitFor(() => expect(onNext).toHaveBeenCalledTimes(1));
    expect(mockedMemberServices.getMemberByEmail).toHaveBeenCalledWith(
      "newuser@example.com"
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

    fireEvent.change(input, { target: { value: "service@example.com" } });
    fireEvent.click(button);

    expect(
      await screen.findByText(
        "Something went wrong while checking your email. Please try again."
      )
    ).toBeInTheDocument();
    expect(onNext).not.toHaveBeenCalled();
  });
});

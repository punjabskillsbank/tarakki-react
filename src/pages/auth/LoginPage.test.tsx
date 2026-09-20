import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import toast from "react-hot-toast";
import { LoginPage } from "./LoginPage";
import AuthService from "../../services/AuthService";
import { getToken, getStoredMemberId } from "../../utils/authStorage";
import { loginCredentialsFactory, loginResponseFactory } from "../../test-utils/factories";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("react-hot-toast");

jest.mock("../../services/AuthService", () => ({
  __esModule: true,
  default: {
    login: jest.fn(),
  },
}));

const mockLogin = AuthService.login as jest.Mock;

const renderWithRouter = () => render(<MemoryRouter><LoginPage /></MemoryRouter>);

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    localStorage.clear();
  });

  it("renders the email and password fields", () => {
    renderWithRouter();

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
  });

  it("shows validation errors and does not call AuthService when submitted empty", async () => {
    const user = userEvent.setup();
    renderWithRouter();

    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(await screen.findByText(/please enter your email address/i)).toBeInTheDocument();
    expect(screen.getByText(/please enter your password/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("calls AuthService.login with the typed credentials and stores the token on success", async () => {
    const user = userEvent.setup();
    const credentials = loginCredentialsFactory();
    const response = loginResponseFactory();
    mockLogin.mockResolvedValueOnce(response);

    renderWithRouter();

    await user.type(screen.getByLabelText(/email address/i), credentials.email);
    await user.type(screen.getByLabelText(/^password$/i), credentials.password);
    await user.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: credentials.email,
        password: credentials.password,
      });
    });

    expect(getToken()).toBe(response.token);
    expect(getStoredMemberId()).toBe(response.member.memberId);
    expect(toast.success).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalled();
  });

  it("shows the error banner and does not store a token on invalid credentials", async () => {
    const user = userEvent.setup();
    const credentials = loginCredentialsFactory();
    mockLogin.mockRejectedValueOnce(new Error("Invalid email or password"));

    renderWithRouter();

    await user.type(screen.getByLabelText(/email address/i), credentials.email);
    await user.type(screen.getByLabelText(/^password$/i), credentials.password);
    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();
    expect(getToken()).toBe("");
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

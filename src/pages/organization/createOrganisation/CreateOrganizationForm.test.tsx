import { render, screen, waitFor } from "@testing-library/react";
import CreateOrganizationForm from "./CreateOrganizationForm";
import "@testing-library/jest-dom";
import OrganizationServices from "../../../services/OrganizationServices";
import { MemoryRouter } from "react-router-dom";
import toast from "react-hot-toast";
import userEvent from "@testing-library/user-event";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("react-hot-toast");
import {
  MOCK_MEMBER_ID,
  mockOrgFormData,
  mockOrgPayload,
  mockOrgSuccessResponse,
  mockOrgValidationError,
} from "../../../test-utils/factories";

// ── Mock OrganizationServices ──────────────────────────────────────────────
jest.mock("../../../services/OrganizationServices", () => ({
  __esModule: true,
  default: {
    createOrganization: jest.fn(),
  },
}));

// ── Typed reference to the mocked method ──────────────────────────────────
const mockCreateOrganization =
  OrganizationServices.createOrganization as jest.Mock;

// ─── Helper: fill all form fields using factory data ──────────────────────
const fillForm = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByPlaceholderText("Enter organization name"), mockOrgFormData.orgName);
  await user.type(screen.getByPlaceholderText("Describe your organization"), mockOrgFormData.orgDesc);
  await user.type(screen.getByPlaceholderText("Street address"), mockOrgFormData.orgAddress);
  await user.type(screen.getByPlaceholderText("City"), mockOrgFormData.orgCity);
  await user.type(screen.getByPlaceholderText("State"), mockOrgFormData.orgState);
  await user.type(screen.getByPlaceholderText("e.g. 132001"), mockOrgFormData.orgPostalCode);
  await user.type(screen.getByPlaceholderText("Country"), mockOrgFormData.orgCountry);
};

// ─── Helper: render with router context ───────────────────────────────────
const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

// ─── Tests ────────────────────────────────────────────────────────────────
describe("CreateOrganizationForm", () => {
  const onCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    localStorage.clear();
    // memberId mocked from test-utils
    localStorage.setItem("memberId", MOCK_MEMBER_ID);
  });

  // ── 1. Renders all form fields and buttons ─────────────────────────────
  it("renders the create organization form fields and buttons", () => {
    renderWithRouter(<CreateOrganizationForm onCancel={onCancel} />);

    expect(
      screen.getByRole("heading", { name: "Create Organization" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create Organization" })
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter organization name")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Describe your organization")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Street address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("City")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("State")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("e.g. 132001")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Country")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  // ── 2. Cancel button calls onCancel ───────────────────────────────────
  it("calls onCancel when cancel button is clicked", async () => {
    const user = userEvent.setup();
    renderWithRouter(<CreateOrganizationForm onCancel={onCancel} />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("navigates to /organization-decision when cancel button is clicked and onCancel is not provided", async () => {
    const user = userEvent.setup();
    renderWithRouter(<CreateOrganizationForm />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(mockNavigate).toHaveBeenCalledWith("/organization-decision");
  });

  // ── 3. Validation errors on empty submit ──────────────────────────────
  it("shows validation errors when submitting an empty form", async () => {
    const user = userEvent.setup();
    renderWithRouter(<CreateOrganizationForm onCancel={onCancel} />);

    await user.click(
      screen.getByRole("button", { name: "Create Organization" })
    );

    await waitFor(() => {
      expect(
        screen.getByText("Organization name is required")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Organization description is required")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Street address is required")
      ).toBeInTheDocument();
      expect(screen.getByText("City is required")).toBeInTheDocument();
      expect(screen.getByText("State is required")).toBeInTheDocument();
      expect(screen.getByText("Postal code is required")).toBeInTheDocument();
      expect(screen.getByText("Country is required")).toBeInTheDocument();
    });
  });

  // ── 4. Successful submission ──────────────────────────────────────────
  it("submits the form successfully and shows a success toast", async () => {
    const user = userEvent.setup();
    // Use the mocked API (not fetch), with factory success response
    mockCreateOrganization.mockResolvedValueOnce(mockOrgSuccessResponse);

    renderWithRouter(<CreateOrganizationForm onCancel={onCancel} />);

    await fillForm(user);

    await user.click(
      screen.getByRole("button", { name: "Create Organization" })
    );

    await waitFor(() => {
      // Verify service called with factory payload (includes ownerId from MOCK_MEMBER_ID)
      expect(mockCreateOrganization).toHaveBeenCalledWith(mockOrgPayload);
      expect(toast.success).toHaveBeenCalledWith(
        "Organization created successfully!"
      );
      expect(mockNavigate).toHaveBeenCalledWith("/create-board");
    });
  });

  // ── 5. API validation error (400) with error status ───────────────────
  it("shows a global error and field-level error when the API returns validation errors", async () => {
    const user = userEvent.setup();
    // Factory includes status 400 + field errors + global message
    mockCreateOrganization.mockRejectedValueOnce(mockOrgValidationError);

    renderWithRouter(<CreateOrganizationForm onCancel={onCancel} />);

    await fillForm(user);

    await user.click(
      screen.getByRole("button", { name: "Create Organization" })
    );

    await waitFor(() => {
      expect(screen.getByText("Validation failed")).toBeInTheDocument();
      expect(screen.getByText("Name already exists")).toBeInTheDocument();
      expect(toast.error).toHaveBeenCalledWith("Validation failed");
    });
  });

  // ── 6. Network error ───────────────────────────────────────────────────
  it("shows a global error and toast error on network failure", async () => {
    const user = userEvent.setup();
    mockCreateOrganization.mockRejectedValueOnce(new Error("Network Error"));

    renderWithRouter(<CreateOrganizationForm onCancel={onCancel} />);

    await fillForm(user);

    await user.click(
      screen.getByRole("button", { name: "Create Organization" })
    );

    await waitFor(() => {
      expect(
        screen.getByText("Network error. Please check your connection and try again.")
      ).toBeInTheDocument();
      expect(toast.error).toHaveBeenCalledWith(
        "Network error. Please check your connection and try again."
      );
    });
  });
});

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateOrganizationForm from "./CreateOrganizationForm";
import "@testing-library/jest-dom";
import OrganizationServices from "../../../services/OrganizationServices";
import { MemoryRouter } from "react-router-dom";
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
const fillForm = () => {
  fireEvent.change(screen.getByPlaceholderText("Enter organization name"), {
    target: { value: mockOrgFormData.orgName },
  });
  fireEvent.change(screen.getByPlaceholderText("Describe your organization"), {
    target: { value: mockOrgFormData.orgDesc },
  });
  fireEvent.change(screen.getByPlaceholderText("Street address"), {
    target: { value: mockOrgFormData.orgAddress },
  });
  fireEvent.change(screen.getByPlaceholderText("City"), {
    target: { value: mockOrgFormData.orgCity },
  });
  fireEvent.change(screen.getByPlaceholderText("State"), {
    target: { value: mockOrgFormData.orgState },
  });
  fireEvent.change(screen.getByPlaceholderText("e.g. 132001"), {
    target: { value: mockOrgFormData.orgPostalCode },
  });
  fireEvent.change(screen.getByPlaceholderText("Country"), {
    target: { value: mockOrgFormData.orgCountry },
  });
};

// ─── Helper: render with router context ───────────────────────────────────
const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

// ─── Tests ────────────────────────────────────────────────────────────────
describe("CreateOrganizationForm", () => {
  const onCancel = jest.fn();
  const mockAlert = jest.spyOn(window, "alert").mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    // memberId mocked from test-utils
    localStorage.setItem("memberId", MOCK_MEMBER_ID);
  });

  afterEach(() => {
    mockAlert.mockClear();
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
  it("calls onCancel when cancel button is clicked", () => {
    renderWithRouter(<CreateOrganizationForm onCancel={onCancel} />);

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  // ── 3. Validation errors on empty submit ──────────────────────────────
  it("shows validation errors when submitting an empty form", async () => {
    renderWithRouter(<CreateOrganizationForm onCancel={onCancel} />);

    fireEvent.click(
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
  it("submits the form successfully and shows an alert", async () => {
   
    renderWithRouter(<CreateOrganizationForm onCancel={onCancel} />);

    fillForm();

    fireEvent.click(
      screen.getByRole("button", { name: "Create Organization" })
    );

    await waitFor(() => {
     
      expect(window.alert).toHaveBeenCalledWith(
        "Organization created successfully!"
      );
    });
  });

 
});

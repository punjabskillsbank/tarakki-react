import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateOrganizationForm from "./CreateOrganizationForm";
import "@testing-library/jest-dom";

describe("CreateOrganizationForm", () => {
  const onCancel = jest.fn();
  const mockAlert = jest.spyOn(window, "alert").mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem("memberId", "550e8400-e29b-41d4-a716-446655440000");
    (globalThis as any).fetch = jest.fn();
  });

  afterEach(() => {
    mockAlert.mockClear();
  });

  it("renders the create organization form fields and buttons", () => {
    render(<CreateOrganizationForm onCancel={onCancel} />);

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

  it("calls onCancel when cancel button is clicked", () => {
    render(<CreateOrganizationForm onCancel={onCancel} />);

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("shows validation errors when submitting an empty form", async () => {
    render(<CreateOrganizationForm onCancel={onCancel} />);

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

  it("submits the form successfully and shows an alert", async () => {
    (globalThis as any).fetch.mockResolvedValueOnce({ ok: true });

    render(<CreateOrganizationForm onCancel={onCancel} />);

    fireEvent.change(screen.getByPlaceholderText("Enter organization name"), {
      target: { value: "Test Organization" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Describe your organization"),
      {
        target: { value: "A test organization description" },
      }
    );
    fireEvent.change(screen.getByPlaceholderText("Street address"), {
      target: { value: "123 Main St" },
    });
    fireEvent.change(screen.getByPlaceholderText("City"), {
      target: { value: "Test City" },
    });
    fireEvent.change(screen.getByPlaceholderText("State"), {
      target: { value: "State" },
    });
    fireEvent.change(screen.getByPlaceholderText("e.g. 132001"), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByPlaceholderText("Country"), {
      target: { value: "Test Country" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Create Organization" })
    );

    await waitFor(() => {
      expect((globalThis as any).fetch).toHaveBeenCalledWith(
        "/api/organizations",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orgName: "Test Organization",
            orgDesc: "A test organization description",
            ownerId: "550e8400-e29b-41d4-a716-446655440000",
            orgAddress: "123 Main St",
            orgCity: "Test City",
            orgState: "State",
            orgPostalCode: "123456",
            orgCountry: "Test Country",
          }),
        }
      );
      expect(window.alert).toHaveBeenCalledWith(
        "Organization created successfully!"
      );
    });
  });

  it("shows a global error and field-level error when the API returns validation errors", async () => {
    const errorResponse = {
      errors: {
        orgName: "Name already exists",
      },
      message: "Validation failed",
    };

    (globalThis as any).fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValueOnce(errorResponse),
    });

    render(<CreateOrganizationForm onCancel={onCancel} />);

    fireEvent.change(screen.getByPlaceholderText("Enter organization name"), {
      target: { value: "Test Organization" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Describe your organization"),
      {
        target: { value: "A test organization description" },
      }
    );
    fireEvent.change(screen.getByPlaceholderText("Street address"), {
      target: { value: "123 Main St" },
    });
    fireEvent.change(screen.getByPlaceholderText("City"), {
      target: { value: "Test City" },
    });
    fireEvent.change(screen.getByPlaceholderText("State"), {
      target: { value: "State" },
    });
    fireEvent.change(screen.getByPlaceholderText("e.g. 132001"), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByPlaceholderText("Country"), {
      target: { value: "Test Country" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Create Organization" })
    );

    await waitFor(() => {
      expect(screen.getByText("Validation failed")).toBeInTheDocument();
      expect(screen.getByText("Name already exists")).toBeInTheDocument();
    });
  });
});

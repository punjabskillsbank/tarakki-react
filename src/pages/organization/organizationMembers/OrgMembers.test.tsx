import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import toast from "react-hot-toast";

import { OrgMembers } from "./OrgMembers";
import OrganizationService from "../../../services/OrganizationServices";
import config from "../../../config/indexConfig";
import {
  MOCK_ORG_ID,
  mockInviteMember,
  mockInvitePayload,
} from "../../../test-utils/factories";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => ({
    orgId: MOCK_ORG_ID,
  }),
}));

jest.mock("react-hot-toast");

jest.mock("../../../services/OrganizationServices", () => ({
  __esModule: true,
  default: {
    inviteMember: jest.fn(),
  },
}));

const mockInviteMemberService = OrganizationService.inviteMember as jest.Mock;

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe("OrgMembers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Renders page correctly
  it("renders invite members page", () => {
    renderWithRouter(<OrgMembers />);

    expect(
      screen.getByRole("heading", {
        name: "Invite Organization Members",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Skip for Now",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Invite Members",
      })
    ).toBeDisabled();

    expect(screen.getByText("Add another Member")).toBeInTheDocument();
  });

  //Skip button navigates
  it("navigates when skip button is clicked", async () => {
    const user = userEvent.setup();

    renderWithRouter(<OrgMembers />);

    await user.click(
      screen.getByRole("button", {
        name: "Skip for Now",
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      config.routes.createBoardWithOrgId(MOCK_ORG_ID)
    );
  });

  // Add member row
  it("adds a member row", async () => {
    const user = userEvent.setup();

    renderWithRouter(<OrgMembers />);

    await user.click(screen.getByText("Add another Member"));

    expect(screen.getByPlaceholderText("Email Address")).toBeInTheDocument();

    expect(screen.getByDisplayValue("")).toBeInTheDocument();
  });

  // Validation errors
  it("shows validation errors when submitting empty member", async () => {
    const user = userEvent.setup();

    renderWithRouter(<OrgMembers />);

    await user.click(screen.getByText("Add another Member"));

    await user.click(
      screen.getByRole("button", {
        name: "Invite Members",
      })
    );

    await waitFor(() => {
      expect(
        screen.getByText("Email address is required.")
      ).toBeInTheDocument();

      expect(screen.getByText("Please select a role.")).toBeInTheDocument();
    });
  });

  // Invalid email
  it("shows invalid email validation", async () => {
    const user = userEvent.setup();

    renderWithRouter(<OrgMembers />);

    await user.click(screen.getByText("Add another Member"));

    await user.type(
      screen.getByPlaceholderText("Email Address"),
      "invalid-email"
    );

    await user.click(
      screen.getByRole("button", {
        name: "Invite Members",
      })
    );

    await waitFor(() => {
      expect(screen.getByText("Invalid email address.")).toBeInTheDocument();
    });
  });

  //Duplicate email
  it("shows duplicate email validation", async () => {
    const user = userEvent.setup();

    renderWithRouter(<OrgMembers />);

    await user.click(screen.getByText("Add another Member"));
    await user.click(screen.getByText("Add another Member"));

    const inputs = screen.getAllByPlaceholderText("Email Address");

    await user.type(inputs[0], "abc@test.com");
    await user.type(inputs[1], "abc@test.com");

    const selects = screen.getAllByRole("combobox");

    await user.selectOptions(selects[0], "ORG_MEMBER");
    await user.selectOptions(selects[1], "ORG_MEMBER");

    await user.click(
      screen.getByRole("button", {
        name: "Invite Members",
      })
    );

    await waitFor(() => {
      expect(
        screen.getAllByText("Duplicate Email Address").length
      ).toBeGreaterThan(0);
    });
  });

  //Delete member
  it("deletes a member row", async () => {
    const user = userEvent.setup();

    renderWithRouter(<OrgMembers />);

    await user.click(screen.getByText("Add another Member"));

    expect(screen.getByPlaceholderText("Email Address")).toBeInTheDocument();

    const deleteButton = screen.getAllByRole("button")[0];
    await user.click(deleteButton);

    expect(
      screen.queryByPlaceholderText("Email Address")
    ).not.toBeInTheDocument();
  });

  // Successful invite
  it("invites members successfully", async () => {
    const user = userEvent.setup();

    mockInviteMemberService.mockResolvedValue({});

    renderWithRouter(<OrgMembers />);

    await user.click(screen.getByText("Add another Member"));

    await user.type(
      screen.getByPlaceholderText("Email Address"),
      mockInviteMember.email
    );

    await user.selectOptions(
      screen.getByRole("combobox"),
      mockInviteMember.role
    );

    await user.click(
      screen.getByRole("button", {
        name: "Invite Members",
      })
    );

    await waitFor(() => {
      expect(mockInviteMemberService).toHaveBeenCalledWith(
        MOCK_ORG_ID,
        mockInvitePayload
      );

      expect(toast.success).toHaveBeenCalledWith("Invites sent successfully!");

      expect(mockNavigate).toHaveBeenCalledWith(
        config.routes.createBoardWithOrgId(MOCK_ORG_ID)
      );
    });
  });

  //API failure
  it("shows error toast when invite fails", async () => {
    const user = userEvent.setup();

    mockInviteMemberService.mockRejectedValue(new Error());

    renderWithRouter(<OrgMembers />);

    await user.click(screen.getByText("Add another Member"));

    await user.type(
      screen.getByPlaceholderText("Email Address"),
      mockInviteMember.email
    );

    await user.selectOptions(
      screen.getByRole("combobox"),
      mockInviteMember.role
    );

    await user.click(
      screen.getByRole("button", {
        name: "Invite Members",
      })
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to send invites");
    });
  });
});

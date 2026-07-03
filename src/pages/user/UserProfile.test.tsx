import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserProfile } from "./UserProfile";
import MemberServices from "../../services/MemberServices";
import { memberFactory, MOCK_MEMBER_ID } from "../../test-utils/factories";
import "@testing-library/jest-dom";

jest.mock("../../services/MemberServices");
const mockedMemberServices = MemberServices as jest.Mocked<
  typeof MemberServices
>;

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

const setupSuccessfulFetch = (member = memberFactory()) => {
  localStorage.setItem("memberId", MOCK_MEMBER_ID);

  mockedMemberServices.getMemberById.mockResolvedValue(member);
  return member;
};

describe("UserProfile", () => {
  it("shows error when memberId is missing", async () => {
    render(<UserProfile />);
    const errorMessage = await screen.findByText(
      /Error:\s*Member ID not found/i
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("displays member details after successful fetch", async () => {
    const member = setupSuccessfulFetch();
    render(<UserProfile />);
    expect(
      await screen.findByDisplayValue(member.firstName)
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue(member.lastName)).toBeInTheDocument();
    expect(screen.getByDisplayValue(member.email)).toBeInTheDocument();
  });

  it("shows error when member fetch fails", async () => {
    localStorage.setItem("memberId", MOCK_MEMBER_ID);
    mockedMemberServices.getMemberById.mockRejectedValue(
      new Error("Failed to load member")
    );
    render(<UserProfile />);
    expect(
      await screen.findByText(/Failed to load member profile/i)
    ).toBeInTheDocument();
  });

  it("enters edit mode when Edit Profile is clicked", async () => {
    const user = userEvent.setup();
    setupSuccessfulFetch();
    render(<UserProfile />);
    const editButton = await screen.findByRole("button", {
      name: /Edit Profile/i,
    });
    await user.click(editButton);
    expect(
      screen.getByRole("button", {
        name: /Cancel/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /Save changes/i,
      })
    ).toBeInTheDocument();
  });

  it("restores original values when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const member = setupSuccessfulFetch();
    render(<UserProfile />);
    await user.click(
      await screen.findByRole("button", {
        name: /Edit Profile/i,
      })
    );
    const firstNameInput = screen.getByDisplayValue(member.firstName);
    await user.clear(firstNameInput);
    await user.type(firstNameInput, "Alice");
    expect(screen.getByDisplayValue("Alice")).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", {
        name: /Cancel/i,
      })
    );
    expect(screen.getByDisplayValue(member.firstName)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Edit Profile/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: /Cancel/i,
      })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: /Save changes/i,
      })
    ).not.toBeInTheDocument();
  });

  it("updates displayed values when Save changes is clicked", async () => {
    const user = userEvent.setup();
    const member = setupSuccessfulFetch();
    render(<UserProfile />);
    await user.click(
      await screen.findByRole("button", {
        name: /Edit Profile/i,
      })
    );
    const firstNameInput = screen.getByDisplayValue(member.firstName);
    await user.clear(firstNameInput);
    await user.type(firstNameInput, "Alice");
    expect(screen.getByDisplayValue("Alice")).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", {
        name: /Save changes/i,
      })
    );
    expect(screen.getByDisplayValue("Alice")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Edit Profile/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: /Cancel/i,
      })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: /Save changes/i,
      })
    ).not.toBeInTheDocument();
  });

  it("shows success alert after saving", async () => {
    const user = userEvent.setup();
    const mockAlert = jest.spyOn(window, "alert").mockImplementation(() => {});
    setupSuccessfulFetch();
    render(<UserProfile />);
    await user.click(
      await screen.findByRole("button", {
        name: /Edit Profile/i,
      })
    );
    await user.click(
      screen.getByRole("button", {
        name: /Save changes/i,
      })
    );
    expect(mockAlert).toHaveBeenCalledWith("Profile updated successfully!");
    mockAlert.mockRestore();
  });
});

import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import toast from "react-hot-toast";

import { UserSupportPageForm } from "./UserSupportPageForm";
import SupportServices from "../../../services/SupportServices";

jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("../../../services/SupportServices", () => ({
  __esModule: true,
  default: {
    createTicket: jest.fn(),
    createTicketMessage: jest.fn(),
  },
}));

const mockCreateTicket = SupportServices.createTicket as jest.Mock;
const mockCreateTicketMessage =
  SupportServices.createTicketMessage as jest.Mock;

const MOCK_MEMBER_ID = "member-123";
const MOCK_TICKET_ID = "ticket-123";

const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByPlaceholderText("Enter your first name"), "Ansh");

  await user.type(
    screen.getByPlaceholderText("Enter your last name"),
    "Sharma"
  );

  await user.type(
    screen.getByPlaceholderText("Enter your email"),
    "ansh@example.com"
  );

  await user.type(
    screen.getByPlaceholderText("Briefly describe your issue"),
    "Unable to log in"
  );

  const selects = screen.getAllByRole("combobox");

  await user.selectOptions(selects[0], "ACCOUNT");
  await user.selectOptions(selects[1], "LOGIN_ISSUE");

  await user.type(
    screen.getByPlaceholderText("Explain your issue in detail..."),
    "I cannot log in to my account."
  );
};

describe("UserSupportPageForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem("memberId", MOCK_MEMBER_ID);
  });

  // Renders the form
  it("renders all support form fields", () => {
    render(<UserSupportPageForm />);

    expect(screen.getByText("Submit a Support Request")).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Enter your first name")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Enter your last name")
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Briefly describe your issue")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Explain your issue in detail...")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Submit Request",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Attach screenshots or supporting files")
    ).toBeInTheDocument();
  });

  // Shows validation errors
  it("shows validation errors when the empty form is submitted", async () => {
    const user = userEvent.setup();

    render(<UserSupportPageForm />);

    await user.click(
      screen.getByRole("button", {
        name: "Submit Request",
      })
    );

    expect(
      await screen.findByText("First name is required.")
    ).toBeInTheDocument();

    expect(screen.getByText("Last name is required.")).toBeInTheDocument();

    expect(screen.getByText("Email address is required.")).toBeInTheDocument();

    expect(screen.getByText("Subject is required.")).toBeInTheDocument();

    expect(screen.getByText("Please select a category.")).toBeInTheDocument();

    expect(
      screen.getByText("Please select an issue type.")
    ).toBeInTheDocument();

    expect(screen.getByText("Message is required.")).toBeInTheDocument();

    expect(mockCreateTicket).not.toHaveBeenCalled();
    expect(mockCreateTicketMessage).not.toHaveBeenCalled();
  });

  // Validates email format
  it("shows an error for an invalid email address", async () => {
    const user = userEvent.setup();

    render(<UserSupportPageForm />);

    await user.type(
      screen.getByPlaceholderText("Enter your first name"),
      "Ansh"
    );

    await user.type(
      screen.getByPlaceholderText("Enter your last name"),
      "Sharma"
    );

    await user.type(
      screen.getByPlaceholderText("Enter your email"),
      "invalid-email"
    );

    await user.type(
      screen.getByPlaceholderText("Briefly describe your issue"),
      "Login problem"
    );

    const selects = screen.getAllByRole("combobox");

    await user.selectOptions(selects[0], "ACCOUNT");
    await user.selectOptions(selects[1], "LOGIN_ISSUE");

    await user.type(
      screen.getByPlaceholderText("Explain your issue in detail..."),
      "Unable to log in."
    );

    await user.click(
      screen.getByRole("button", {
        name: "Submit Request",
      })
    );

    expect(
      await screen.findByText("Invalid email address.")
    ).toBeInTheDocument();

    expect(mockCreateTicket).not.toHaveBeenCalled();
  });

  // Handles a missing member ID
  it("shows an error when the member ID is missing", async () => {
    const user = userEvent.setup();

    localStorage.removeItem("memberId");

    render(<UserSupportPageForm />);

    await user.click(
      screen.getByRole("button", {
        name: "Submit Request",
      })
    );

    expect(toast.error).toHaveBeenCalledWith("Member ID not found.");

    expect(mockCreateTicket).not.toHaveBeenCalled();
    expect(mockCreateTicketMessage).not.toHaveBeenCalled();
  });

  // Updates issue types according to the selected category
  it("displays issue types based on the selected category", async () => {
    const user = userEvent.setup();

    render(<UserSupportPageForm />);

    const selects = screen.getAllByRole("combobox");

    await user.selectOptions(selects[0], "ACCOUNT");

    expect(
      screen.getByRole("option", {
        name: "Login Issue",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "Signup Error",
      })
    ).toBeInTheDocument();

    await user.selectOptions(selects[0], "TEAM");

    expect(
      screen.getByRole("option", {
        name: "Member Invite Issue",
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("option", {
        name: "Login Issue",
      })
    ).not.toBeInTheDocument();
  });

  // Resets issue type when category changes
  it("resets the selected issue type when the category changes", async () => {
    const user = userEvent.setup();

    render(<UserSupportPageForm />);

    const selects = screen.getAllByRole("combobox");
    const categorySelect = selects[0];
    const issueTypeSelect = selects[1];

    await user.selectOptions(categorySelect, "ACCOUNT");
    await user.selectOptions(issueTypeSelect, "LOGIN_ISSUE");

    expect(issueTypeSelect).toHaveValue("LOGIN_ISSUE");

    await user.selectOptions(categorySelect, "TEAM");

    expect(issueTypeSelect).toHaveValue("");
  });

  // Successfully creates a ticket and its first message
  it("creates a ticket and its first message successfully", async () => {
    const user = userEvent.setup();

    mockCreateTicket.mockResolvedValue({
      ticketId: MOCK_TICKET_ID,
    });

    mockCreateTicketMessage.mockResolvedValue({});

    render(<UserSupportPageForm />);

    await fillValidForm(user);

    await user.click(
      screen.getByRole("button", {
        name: "Submit Request",
      })
    );

    await waitFor(() => {
      expect(mockCreateTicket).toHaveBeenCalledWith({
        memberId: MOCK_MEMBER_ID,
        firstName: "Ansh",
        lastName: "Sharma",
        email: "ansh@example.com",
        subject: "Unable to log in",
        issueCategory: "ACCOUNT",
        issueType: "LOGIN_ISSUE",
        message: "I cannot log in to my account.",
      });

      expect(mockCreateTicketMessage).toHaveBeenCalledWith({
        ticketId: MOCK_TICKET_ID,
        userId: MOCK_MEMBER_ID,
        messageBody: "I cannot log in to my account.",
      });

      expect(toast.success).toHaveBeenCalledWith(
        "Support request submitted successfully!"
      );
    });

    expect(screen.getByPlaceholderText("Enter your first name")).toHaveValue(
      ""
    );

    expect(screen.getByPlaceholderText("Enter your email")).toHaveValue("");

    expect(
      screen.getByPlaceholderText("Explain your issue in detail...")
    ).toHaveValue("");
  });

  // Handles ticket creation failure
  it("shows an error when ticket creation fails", async () => {
    const user = userEvent.setup();

    mockCreateTicket.mockRejectedValue(
      new Error("Failed to create support ticket")
    );

    render(<UserSupportPageForm />);

    await fillValidForm(user);

    await user.click(
      screen.getByRole("button", {
        name: "Submit Request",
      })
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to create support ticket"
      );
    });

    expect(mockCreateTicketMessage).not.toHaveBeenCalled();

    expect(toast.success).not.toHaveBeenCalled();
  });

  // Handles a missing ticket ID
  it("does not create a message when the ticket ID is missing", async () => {
    const user = userEvent.setup();

    mockCreateTicket.mockResolvedValue({});

    render(<UserSupportPageForm />);

    await fillValidForm(user);

    await user.click(
      screen.getByRole("button", {
        name: "Submit Request",
      })
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Ticket was created, but its ID was not returned by the API."
      );
    });

    expect(mockCreateTicketMessage).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
  });

  // Handles message creation failure
  it("shows an error when creating the first message fails", async () => {
    const user = userEvent.setup();

    mockCreateTicket.mockResolvedValue({
      ticketId: MOCK_TICKET_ID,
    });

    mockCreateTicketMessage.mockRejectedValue(
      new Error("Failed to create support ticket message")
    );

    render(<UserSupportPageForm />);

    await fillValidForm(user);

    await user.click(
      screen.getByRole("button", {
        name: "Submit Request",
      })
    );

    await waitFor(() => {
      expect(mockCreateTicketMessage).toHaveBeenCalledWith({
        ticketId: MOCK_TICKET_ID,
        userId: MOCK_MEMBER_ID,
        messageBody: "I cannot log in to my account.",
      });

      expect(toast.error).toHaveBeenCalledWith(
        "Failed to create support ticket message"
      );
    });

    expect(toast.success).not.toHaveBeenCalled();
  });

  // Trims whitespace before submitting
  it("trims whitespace from the submitted form values", async () => {
    const user = userEvent.setup();

    mockCreateTicket.mockResolvedValue({
      ticketId: MOCK_TICKET_ID,
    });

    mockCreateTicketMessage.mockResolvedValue({});

    render(<UserSupportPageForm />);

    await user.type(
      screen.getByPlaceholderText("Enter your first name"),
      "  Ansh  "
    );

    await user.type(
      screen.getByPlaceholderText("Enter your last name"),
      "  Sharma  "
    );

    await user.type(
      screen.getByPlaceholderText("Enter your email"),
      "ansh@example.com"
    );

    await user.type(
      screen.getByPlaceholderText("Briefly describe your issue"),
      "  Login issue  "
    );

    const selects = screen.getAllByRole("combobox");

    await user.selectOptions(selects[0], "ACCOUNT");
    await user.selectOptions(selects[1], "LOGIN_ISSUE");

    await user.type(
      screen.getByPlaceholderText("Explain your issue in detail..."),
      "  Please help me.  "
    );

    await user.click(
      screen.getByRole("button", {
        name: "Submit Request",
      })
    );

    await waitFor(() => {
      expect(mockCreateTicket).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: "Ansh",
          lastName: "Sharma",
          subject: "Login issue",
          message: "Please help me.",
        })
      );

      expect(mockCreateTicketMessage).toHaveBeenCalledWith({
        ticketId: MOCK_TICKET_ID,
        userId: MOCK_MEMBER_ID,
        messageBody: "Please help me.",
      });
    });
  });
});

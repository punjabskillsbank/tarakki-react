import { render, screen, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { UserSupportHistoryPage } from "./UserSupportHistoryPage";
import SupportServices from "../../services/SupportServices";
import toast from "react-hot-toast";
import config from "../../config/indexConfig";
import type { SupportTicket } from "../../types/support";
import { MOCK_MEMBER_ID, mockTickets } from "../../test-utils/factories";

// ── Mock navigation ───────────────────────────────────────────────────────
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// ── Mock toast ────────────────────────────────────────────────────────────
jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// ── Mock SupportServices ──────────────────────────────────────────────────
jest.mock("../../services/SupportServices", () => ({
  __esModule: true,
  default: {
    getMemberSupportTickets: jest.fn(),
  },
}));

// ── Mock child components ─────────────────────────────────────────────────
jest.mock("../../components/Navbar", () => ({
  Navbar: () => <nav>Navbar</nav>,
}));

jest.mock("../../components/PageBackground", () => ({
  PageBackground: () => <div data-testid="page-background" />,
}));

jest.mock("../../components/PageHeader", () => ({
  PageHeader: ({ title, subtitle }: any) => (
    <div>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  ),
}));

jest.mock("../../components/SupportSummaryCard", () => ({
  SupportSummaryCard: ({ value, label }: any) => (
    <div>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  ),
}));

jest.mock("../../components/PrimaryButton", () => ({
  PrimaryButton: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

jest.mock("../../components/SupportTicketCard", () => ({
  SupportTicketCard: ({
    title,
    description,
    category,
    status,
    createdAt,
    updatedAt,
  }: any) => (
    <article>
      <h3>{title}</h3>
      <p>{description}</p>
      <span>{category}</span>
      <span>{status}</span>
      <span>{createdAt}</span>
      <span>{updatedAt}</span>
    </article>
  ),
}));

// ── Mock filters with accessible controls ─────────────────────────────────
jest.mock("../../components/SupportHistoryFilters", () => ({
  SupportHistoryFilters: ({
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    selectedCategory,
    setSelectedCategory,
    selectedDate,
    setSelectedDate,
  }: any) => (
    <div>
      <input
        aria-label="Search support requests"
        placeholder="Search tickets"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <select
        aria-label="Filter by status"
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}>
        <option value="ALL">All Statuses</option>
        <option value="OPEN">Open</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="RESOLVED">Resolved</option>
        <option value="CLOSED">Closed</option>
      </select>

      <select
        aria-label="Filter by category"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}>
        <option value="ALL">All Categories</option>
        <option value="ACCOUNT">Account</option>
        <option value="BOARDS">Boards</option>
        <option value="GENERAL">General</option>
      </select>

      <input
        type="date"
        aria-label="Filter by date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />
    </div>
  ),
}));

// ── Typed mocked service ──────────────────────────────────────────────────
const mockGetMemberSupportTickets =
  SupportServices.getMemberSupportTickets as jest.Mock;

// ── Helper: render with router context ────────────────────────────────────
const renderWithRouter = () =>
  render(
    <MemoryRouter>
      <UserSupportHistoryPage />
    </MemoryRouter>
  );

// ── Tests ─────────────────────────────────────────────────────────────────
describe("UserSupportHistoryPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    localStorage.setItem("memberId", MOCK_MEMBER_ID);

    mockGetMemberSupportTickets.mockResolvedValue(mockTickets);
  });

  // ── 1. Render page elements ────────────────────────────────────────────
  it("renders the support history page with its main elements", async () => {
    renderWithRouter();

    expect(screen.getByText("Navbar")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Support History" })
    ).toBeInTheDocument();

    expect(
      screen.getByText("View and manage your previous support requests.")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /New Support Ticket/i })
    ).toBeInTheDocument();

    expect(screen.getByTestId("page-background")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(mockTickets[0].subject)).toBeInTheDocument();
    });
  });

  // ── 2. Fetch tickets using memberId ───────────────────────────────────
  it("fetches support tickets for the logged-in member", async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(mockGetMemberSupportTickets).toHaveBeenCalledTimes(1);
      expect(mockGetMemberSupportTickets).toHaveBeenCalledWith(MOCK_MEMBER_ID);
    });
  });

  // ── 3. Loading state ──────────────────────────────────────────────────
  it("displays loading state while fetching support tickets", async () => {
    let resolveTickets!: (value: SupportTicket[]) => void;

    mockGetMemberSupportTickets.mockReturnValue(
      new Promise<SupportTicket[]>((resolve) => {
        resolveTickets = resolve;
      })
    );

    renderWithRouter();

    expect(screen.getByText("Loading support history...")).toBeInTheDocument();

    // Resolve the API response and wait for React state updates
    await act(async () => {
      resolveTickets(mockTickets);
    });

    expect(
      screen.queryByText("Loading support history...")
    ).not.toBeInTheDocument();

    expect(screen.getByText(mockTickets[0].subject)).toBeInTheDocument();
  });

  // ── 4. Missing memberId ───────────────────────────────────────────────
  it("shows an error toast when memberId is not available", async () => {
    localStorage.removeItem("memberId");

    renderWithRouter();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Member ID not found.");
    });

    expect(screen.getByText("No support requests yet")).toBeInTheDocument();

    expect(mockGetMemberSupportTickets).not.toHaveBeenCalled();
  });

  // ── 5. API failure ────────────────────────────────────────────────────
  it("shows an error toast when fetching support tickets fails", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockGetMemberSupportTickets.mockRejectedValueOnce(
      new Error("Network Error")
    );

    renderWithRouter();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to fetch support history."
      );
    });

    expect(screen.getByText("No support requests yet")).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  // ── 6. Empty ticket list ──────────────────────────────────────────────
  it("displays an empty state when the member has no support requests", async () => {
    mockGetMemberSupportTickets.mockResolvedValueOnce([]);

    renderWithRouter();

    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          name: "No support requests yet",
        })
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText("Your submitted support requests will appear here.")
    ).toBeInTheDocument();
  });

  // ── 7. Summary card calculations ──────────────────────────────────────
  it("displays the correct support ticket summary values", async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(mockTickets[0].subject)).toBeInTheDocument();
    });

    expect(screen.getByText("All Requests").parentElement).toHaveTextContent(
      "2"
    );

    expect(
      screen.getByText("Awaiting Response").parentElement
    ).toHaveTextContent("1");

    expect(screen.getByText("Completed").parentElement).toHaveTextContent("0");
  });

  // ── 8. Display all support tickets ────────────────────────────────────
  it("displays all fetched support tickets", async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(mockTickets[0].subject)).toBeInTheDocument();
      expect(screen.getByText(mockTickets[1].subject)).toBeInTheDocument();
    });

    expect(screen.getByText(mockTickets[0].message)).toBeInTheDocument();

    expect(screen.getByText(mockTickets[1].message)).toBeInTheDocument();
  });

  // ── 9. Format category and status labels ──────────────────────────────
  it("formats ticket categories and statuses correctly", async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText("Account")).toBeInTheDocument();
      expect(screen.getByText("Boards")).toBeInTheDocument();
      expect(screen.getByText("Open")).toBeInTheDocument();
      expect(screen.getByText("In Progress")).toBeInTheDocument();
    });
  });

  // ── 10. Navigate to new support ticket page ───────────────────────────
  it("navigates to the new support ticket page when the button is clicked", async () => {
    const user = userEvent.setup();

    renderWithRouter();

    await user.click(
      screen.getByRole("button", { name: /New Support Ticket/i })
    );

    expect(mockNavigate).toHaveBeenCalledWith(config.routes.userSupport);
  });

  // 11. Search tickets by subject
  it("filters support tickets based on the search query", async () => {
    const user = userEvent.setup();
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(mockTickets[0].subject)).toBeInTheDocument();
    });

    await user.type(
      screen.getByRole("textbox", { name: "Search support requests" }),
      "upload"
    );

    expect(screen.getByText(mockTickets[1].subject)).toBeInTheDocument();
    expect(screen.queryByText(mockTickets[0].subject)).not.toBeInTheDocument();
  });

  // 12. Search tickets by message
  it("filters support tickets based on the ticket message", async () => {
    const user = userEvent.setup();
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(mockTickets[0].subject)).toBeInTheDocument();
    });

    await user.type(
      screen.getByRole("textbox", { name: "Search support requests" }),
      "account"
    );

    expect(screen.getByText(mockTickets[0].subject)).toBeInTheDocument();
    expect(screen.queryByText(mockTickets[1].subject)).not.toBeInTheDocument();
  });

  // 13. Search tickets by ticket ID
  it("filters support tickets based on the ticket ID", async () => {
    const user = userEvent.setup();
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(mockTickets[0].subject)).toBeInTheDocument();
    });

    await user.type(
      screen.getByRole("textbox", { name: "Search support requests" }),
      mockTickets[1].ticketId
    );

    expect(screen.getByText(mockTickets[1].subject)).toBeInTheDocument();
    expect(screen.queryByText(mockTickets[0].subject)).not.toBeInTheDocument();
  });

  // 14. Filter tickets by status
  it("filters support tickets by their status", async () => {
    const user = userEvent.setup();
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(mockTickets[0].subject)).toBeInTheDocument();
    });

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Filter by status" }),
      "OPEN"
    );

    expect(screen.getByText(mockTickets[0].subject)).toBeInTheDocument();
    expect(screen.queryByText(mockTickets[1].subject)).not.toBeInTheDocument();
  });

  // 15. Filter tickets by category
  it("filters support tickets by their category", async () => {
    const user = userEvent.setup();
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(mockTickets[0].subject)).toBeInTheDocument();
    });

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Filter by category" }),
      "BOARDS"
    );

    expect(screen.getByText(mockTickets[1].subject)).toBeInTheDocument();
    expect(screen.queryByText(mockTickets[0].subject)).not.toBeInTheDocument();
  });

  // 16. Filter tickets by creation date
  it("filters support tickets by their creation date", async () => {
    const user = userEvent.setup();
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(mockTickets[0].subject)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText("Filter by date"), "2026-10-14");

    expect(screen.getByText(mockTickets[1].subject)).toBeInTheDocument();
    expect(screen.queryByText(mockTickets[0].subject)).not.toBeInTheDocument();
  });

  // ── 17. Combined filters ───────────────────────────────────────────────
  it("applies search, status and category filters together", async () => {
    const user = userEvent.setup();
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(mockTickets[0].subject)).toBeInTheDocument();
    });

    await user.type(
      screen.getByRole("textbox", { name: "Search support requests" }),
      "Board"
    );

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Filter by status" }),
      "IN_PROGRESS"
    );

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Filter by category" }),
      "BOARDS"
    );

    expect(screen.getByText(mockTickets[1].subject)).toBeInTheDocument();

    expect(screen.queryByText(mockTickets[0].subject)).not.toBeInTheDocument();
  });
});

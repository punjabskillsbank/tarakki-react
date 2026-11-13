import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { SupportHistoryFilters } from "./SupportHistoryFilters";

jest.mock("./FormSelect", () => ({
  FormSelect: ({
    value,
    onChange,
    options,
  }: {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
  }) => (
    <select
      aria-label={options[0].label.split(":")[0]}
      value={value}
      onChange={onChange}>
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}));

describe("SupportHistoryFilters", () => {
  const mockSetSearchQuery = jest.fn();
  const mockSetSelectedStatus = jest.fn();
  const mockSetSelectedCategory = jest.fn();
  const mockSetSelectedDate = jest.fn();

  const defaultProps = {
    searchQuery: "",
    setSearchQuery: mockSetSearchQuery,
    selectedStatus: "ALL",
    setSelectedStatus: mockSetSelectedStatus,
    selectedCategory: "ALL",
    setSelectedCategory: mockSetSelectedCategory,
    selectedDate: "",
    setSelectedDate: mockSetSelectedDate,
  };

  // Renders the search input
  it("renders the search input", () => {
    render(<SupportHistoryFilters {...defaultProps} />);

    expect(
      screen.getByPlaceholderText("Search support requests...")
    ).toBeInTheDocument();
  });

  // Displays the existing search query
  it("displays the existing search query", () => {
    render(
      <SupportHistoryFilters
        {...defaultProps}
        searchQuery="Unable to log in"
      />
    );

    expect(screen.getByDisplayValue("Unable to log in")).toBeInTheDocument();
  });

  // Calls setSearchQuery when the user clears the search
  it("calls setSearchQuery when the user clears the search", async () => {
    const user = userEvent.setup();

    render(
      <SupportHistoryFilters
        {...defaultProps}
        searchQuery="login"
      />
    );

    await user.clear(screen.getByPlaceholderText("Search support requests..."));

    expect(mockSetSearchQuery).toHaveBeenCalledWith("");
  });

  // Renders all status options
  it("renders all status options", () => {
    render(<SupportHistoryFilters {...defaultProps} />);

    expect(screen.getByRole("combobox", { name: "Status" })).toHaveDisplayValue(
      "Status: All"
    );

    expect(
      screen.getByRole("option", { name: "Status: Open" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", { name: "Status: Pending" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", { name: "Status: In Progress" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", { name: "Status: Resolved" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", { name: "Status: Closed" })
    ).toBeInTheDocument();
  });

  // Calls setSelectedStatus when a status is selected
  it("calls setSelectedStatus when a status is selected", async () => {
    const user = userEvent.setup();

    render(<SupportHistoryFilters {...defaultProps} />);

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Status" }),
      "OPEN"
    );

    expect(mockSetSelectedStatus).toHaveBeenCalledWith("OPEN");
  });

  // Renders all category options
  it("renders all category options", () => {
    render(<SupportHistoryFilters {...defaultProps} />);

    expect(
      screen.getByRole("combobox", { name: "Category" })
    ).toHaveDisplayValue("Category: All");

    expect(
      screen.getByRole("option", { name: "Category: Account" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", { name: "Category: Boards" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", { name: "Category: Team" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", { name: "Category: General" })
    ).toBeInTheDocument();
  });

  // Calls setSelectedCategory when a category is selected
  it("calls setSelectedCategory when a category is selected", async () => {
    const user = userEvent.setup();

    render(<SupportHistoryFilters {...defaultProps} />);

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Category" }),
      "ACCOUNT"
    );

    expect(mockSetSelectedCategory).toHaveBeenCalledWith("ACCOUNT");
  });

  // Displays the existing selected status and category
  it("displays the existing selected status and category", () => {
    render(
      <SupportHistoryFilters
        {...defaultProps}
        selectedStatus="OPEN"
        selectedCategory="ACCOUNT"
      />
    );

    expect(screen.getByRole("combobox", { name: "Status" })).toHaveDisplayValue(
      "Status: Open"
    );

    expect(
      screen.getByRole("combobox", { name: "Category" })
    ).toHaveDisplayValue("Category: Account");
  });

  // Renders the date input
  it("renders the date input", () => {
    render(<SupportHistoryFilters {...defaultProps} />);

    expect(document.querySelector('input[type="date"]')).toBeInTheDocument();
  });

  // Displays the existing selected date
  it("displays the existing selected date", () => {
    render(
      <SupportHistoryFilters
        {...defaultProps}
        selectedDate="2026-10-13"
      />
    );

    expect(screen.getByDisplayValue("2026-10-13")).toBeInTheDocument();
  });

  // Calls setSelectedDate when a date is selected
  it("calls setSelectedDate when a date is selected", async () => {
    const user = userEvent.setup();

    render(<SupportHistoryFilters {...defaultProps} />);

    const dateInput = document.querySelector(
      'input[type="date"]'
    ) as HTMLInputElement;

    await user.type(dateInput, "2026-10-20");

    expect(mockSetSelectedDate).toHaveBeenCalledWith("2026-10-20");
  });
});

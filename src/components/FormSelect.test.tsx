import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormSelect } from "./FormSelect";

const options = [
  { value: "", label: "Select Role" },
  { value: "ORG_ADMIN", label: "Admin" },
  { value: "ORG_MEMBER", label: "Member" },
];

describe("FormSelect", () => {
  it("renders the label and select", () => {
    render(
      <FormSelect
        id="role-select"
        label="Role"
        options={options}
      />
    );

    expect(screen.getByLabelText("Role")).toBeInTheDocument();
  });

  it("renders all provided options", () => {
    render(
      <FormSelect
        id="role-select"
        options={options}
      />
    );

    expect(
      screen.getByRole("option", { name: "Select Role" })
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Admin" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Member" })).toBeInTheDocument();
  });

  it("displays error message when error prop is provided", () => {
    render(
      <FormSelect
        id="role-select"
        label="Role"
        error="Please select a role."
        options={options}
      />
    );

    const errorMessage = screen.getByText("Please select a role.");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage.tagName.toLowerCase()).toBe("p");
    expect(errorMessage).toHaveClass("text-[12px] text-[#E2445C]");
  });

  it("passes other props to the select element", () => {
    render(
      <FormSelect
        id="role-select"
        options={options}
        disabled
      />
    );

    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("merges custom className with default classes", () => {
    render(
      <FormSelect
        id="role-select"
        options={options}
        className="custom-test-class"
      />
    );

    const select = screen.getByRole("combobox");
    expect(select).toHaveClass("custom-test-class");
    expect(select).toHaveClass("w-full");
  });

  it("calls onChange when a different option is selected", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(
      <FormSelect
        id="role-select"
        options={options}
        onChange={handleChange}
      />
    );

    const select = screen.getByRole("combobox");

    await user.selectOptions(select, "ORG_ADMIN");

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(select).toHaveValue("ORG_ADMIN");
  });
});

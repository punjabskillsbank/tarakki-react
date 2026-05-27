import { render, screen } from "@testing-library/react";
import { FieldWrapper } from "./FieldWrapper";
import "@testing-library/jest-dom";

describe("FieldWrapper", () => {
  it("renders the label and children", () => {
    render(
      <FieldWrapper label="Organization Name">
        <input placeholder="Enter name" />
      </FieldWrapper>
    );

    expect(screen.getByText("Organization Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter name")).toBeInTheDocument();
  });

  it("renders the required asterisk", () => {
    render(
      <FieldWrapper label="Organization Name">
        <input />
      </FieldWrapper>
    );

    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("does not render an error message when error is not provided", () => {
    render(
      <FieldWrapper label="Organization Name">
        <input />
      </FieldWrapper>
    );

    expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
  });

  it("renders the error message when error is provided", () => {
    render(
      <FieldWrapper
        label="Organization Name"
        error="Name is required">
        <input />
      </FieldWrapper>
    );

    expect(screen.getByText("Name is required")).toBeInTheDocument();
  });

  it("does not render error message when error is undefined", () => {
    render(
      <FieldWrapper
        label="Organization Name"
        error={undefined}>
        <input />
      </FieldWrapper>
    );

    expect(screen.queryByText("Name is required")).not.toBeInTheDocument();
  });
});

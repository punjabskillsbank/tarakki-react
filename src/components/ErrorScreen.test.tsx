import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ErrorScreen } from "./ErrorScreen";
describe("ErrorScreen", () => {
  it("renders error message", () => {
    render(<ErrorScreen error="An error occurred" />);
    const errorMessage = screen.getByText(/An error occurred/i);
    expect(errorMessage).toBeInTheDocument();
  });
});

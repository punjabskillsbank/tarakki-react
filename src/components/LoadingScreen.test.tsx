import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LoadingScreen } from "./LoadingScreen";
describe("LoadingScreen", () => {
  it("renders loading message", () => {
    render(<LoadingScreen />);
    const loadingMessage = screen.getByText(/Loading.../i);
    expect(loadingMessage).toBeInTheDocument();
  });
});

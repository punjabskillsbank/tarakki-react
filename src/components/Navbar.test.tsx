import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Navbar } from "./Navbar";

describe("Navbar", () => {
  // Renders the navigation bar
  it("renders the navigation bar", () => {
    render(<Navbar />);

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  // Renders the Tarakki logo
  it("renders the Tarakki logo", () => {
    render(<Navbar />);

    const logo = screen.getByRole("img", {
      name: "Tarakki Logo",
    });

    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/tarakki_logo_fav.png");
  });

  // Renders the Tarakki brand name
  it("renders the Tarakki brand name", () => {
    render(<Navbar />);

    expect(screen.getByText("Tarakki")).toBeInTheDocument();
  });

  // Renders the user profile initial
  it("renders the user profile initial", () => {
    render(<Navbar />);

    expect(screen.getByText("P")).toBeInTheDocument();
  });

  // Verifies fixed navbar positioning
  it("has fixed positioning", () => {
    render(<Navbar />);

    const navbar = screen.getByRole("navigation");

    expect(navbar).toHaveClass("fixed");
    expect(navbar).toHaveClass("top-0");
    expect(navbar).toHaveClass("z-50");
  });
});

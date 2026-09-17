import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Avatar } from "./Avatar";
import { boardMemberFactory } from "../test-utils/factories";

describe("Avatar", () => {
  it("renders the member initials and name", () => {
    const member = boardMemberFactory();

    render(<Avatar member={member} />);

    expect(screen.getByText(member.initials)).toBeInTheDocument();
    expect(screen.getByTitle(member.name)).toBeInTheDocument();
  });
});

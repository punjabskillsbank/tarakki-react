import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { BoardHeader } from "./BoardHeader";
import { boardMemberFactory } from "../test-utils/factories";

describe("BoardHeader", () => {
  it("calls onAddMember when the add member button is clicked", async () => {
    const user = userEvent.setup();
    const onAddMember = jest.fn();

    render(
      <BoardHeader
        members={[boardMemberFactory()]}
        onAddMember={onAddMember}
        orgName="Acme"
        boardName="Product"
      />,
    );

    await user.click(screen.getByRole("button", { name: /add member/i }));

    expect(onAddMember).toHaveBeenCalledTimes(1);
  });

  it("shows the organization, workspace, and board names", () => {
    render(
      <BoardHeader
        members={[]}
        onAddMember={jest.fn()}
        orgName="Acme"
        boardName="Product"
      />,
    );

    expect(screen.getByText("Acme")).toBeInTheDocument();
    expect(screen.getByText("Workspace")).toBeInTheDocument();
    expect(screen.getByText("Product")).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { BoardHeader } from "./BoardHeader";
import { boardMemberFactory } from "../test-utils/factories";

describe("BoardHeader", () => {
  it("calls onAddMember when the add member button is clicked", async () => {
    const user = userEvent.setup();
    const onAddMember = jest.fn();

    render(<BoardHeader members={[boardMemberFactory()]} onAddMember={onAddMember} />);

    await user.click(screen.getByRole("button", { name: /add member/i }));

    expect(onAddMember).toHaveBeenCalledTimes(1);
  });
});
